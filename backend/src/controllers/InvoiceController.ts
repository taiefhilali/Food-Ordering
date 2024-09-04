import mongoose from 'mongoose'; // Ensure mongoose is imported
import Invoice from '../models/Invoice'; // Adjust the path if necessary
import { Request, Response } from 'express'; // Adjust import as needed
import { io } from '..';
const path = require('path');
const PDFDocument = require('pdfkit');
const fs = require('fs');
import axios from 'axios';
import Product from '../models/Product'; // Adjust the path as needed

export const saveInvoice = async (req: Request, res: Response) => {
  try {
    const { userId, cartItems, restaurant } = req.body;

    if (!userId || !cartItems) {
      return res.status(400).json({ error: 'Missing userId or cartItems' });
    }

    const invoiceItems = cartItems.map((item: any) => ({
      name: item.name,
      price: item.price,
      totalPrice: item.totalPrice,
      imageUrl: item.imageUrl,
      quantity: item.quantity,
    }));

    const totalAmount = invoiceItems.reduce((sum: any, item: { totalPrice: any; }) => sum + item.totalPrice, 0);
    const userIdd = (req as any).user.id;

    const newInvoice = new Invoice({
      userId: userIdd,
      items: invoiceItems,
      totalAmount: totalAmount,
      restaurant: restaurant,
      discount: 0,
    });

    const savedInvoice = await newInvoice.save();
    console.log('Invoice saved successfully:', savedInvoice);

    // Emit real-time notification
    io.emit('invoiceSaved', {
      userId: userIdd,
      invoiceId: savedInvoice._id,
      totalAmount: savedInvoice.totalAmount,
      restaurant: savedInvoice.restaurant,
      timestamp: new Date(),
    });

    return res.status(201).json(savedInvoice);
  } catch (error) {
    console.error('Error saving invoice:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getInvoicesByRestaurant = async (req: Request, res: Response) => {
  const { restaurantName } = req.params;

  try {
    // Assuming 'restaurant' is a reference to the Restaurant model in the Invoice schema
    const invoices = await Invoice.find()
      .populate({
        path: 'restaurant',
        match: { restaurant: restaurantName }, // Match the restaurant name
      });

    // Filter out any invoices that don't have a populated restaurant matching the name
    const filteredInvoices = invoices.filter(invoice => invoice.restaurant);

    if (filteredInvoices.length === 0) {
      return res.status(404).json({ message: 'No invoices found for this restaurant' });
    }

    return res.status(200).json(filteredInvoices);
  } catch (error) {
    console.error('Error retrieving invoices:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
export const getAllInvoices = async (req: Request, res: Response) => {
  try {
    const invoices = await Invoice.find().populate('restaurant'); // Optionally populate the restaurant details
    if (invoices.length === 0) {
      return res.status(404).json({ message: 'No invoices found' });
    }
    return res.status(200).json(invoices);
  } catch (error) {
    console.error('Error retrieving invoices:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
export const getInvoicesByRestaurantid =async  (req:Request,res: Response)  => {
  try {
    const { restaurantId } = req.params;

    // Validate restaurantId
    if (!restaurantId) {
      return res.status(400).json({ error: 'Restaurant ID is required' });
    }

    // Fetch invoices by restaurant ID
    const invoices = await Invoice.find({ restaurant: restaurantId }).populate('userId').exec();

    if (!invoices) {
      return res.status(404).json({ error: 'No invoices found for this restaurant' });
    }

    res.status(200).json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getInvoicesByUser = async (req: Request, res: Response) => {
  const userIdd = (req as any).user.id;

  try {
    const invoices = await Invoice.find({ userId: userIdd }).populate('restaurant'); // Populate restaurant details if needed
    if (invoices.length === 0) {
      return res.status(404).json({ message: 'No invoices found for this user' });
    } 
    
    return res.status(200).json(invoices);

  } catch (error) {
    console.error('Error retrieving invoices:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
export const generateInvoicePDF = async (invoiceData: { _id: any; createdAt: string | number | Date; items: any[]; totalAmount: any; }) => {
  const doc = new PDFDocument({ margin: 50 });
  const fileName = `invoice-${invoiceData._id}.pdf`;
  const stream = fs.createWriteStream(`./invoices/${fileName}`);

  doc.pipe(stream);

  // Add the title and details
  doc.fontSize(20).text('Invoice', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`At ${new Date(invoiceData.createdAt).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // Use 24-hour time format; set to true for 12-hour format
})}`, { align: 'right' });
  doc.moveDown(2);

  // Table headers
  const tableTop = doc.y;
  const itemColX = 150;
  const quantityColX = 400;
  const priceColX = 470;

  // Draw table headers with a bold font
  doc.fontSize(12).font('Helvetica-Bold').fillColor('black')
    .text('Image', 50, tableTop)
    .text('Item', itemColX, tableTop)
    .text('Quantity', quantityColX, tableTop)
    .text('Price', priceColX, tableTop);

  doc.moveDown(0.5);

  // Draw table lines
  doc.strokeColor('orange').lineWidth(1)
    .moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

  // Reset font for table content
  doc.font('Helvetica').fontSize(12);

  let positionY = tableTop + 25;

  if (Array.isArray(invoiceData.items)) {
    for (const item of invoiceData.items) {
      try {
        // Fetch the image from the URL
        const response = await axios.get(item.imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data, 'binary');

        // Add the image to the PDF
        doc.image(imageBuffer, 50, positionY, { width: 80, height: 60 });
      } catch (err) {
        console.error(`Error loading image ${item.imageUrl}:`, err);
        // Display a placeholder if the image fails to load
        doc.rect(50, positionY, 80, 60).strokeColor('gray').stroke();
        doc.text('Image not found', 55, positionY + 25, { width: 70, align: 'center' });
      }

      // Draw item details
      doc.text(item.name, itemColX, positionY + 20, { width: 200 });
      doc.text(`x ${item.quantity} `, quantityColX, positionY + 20);
      doc.text(`${item.price} dt`, priceColX, positionY + 20);

      // Draw a line under each item
      positionY += 80; // Move to the next row
      doc.moveTo(50, positionY - 15).lineTo(550, positionY - 15).strokeColor('black').stroke();
    }
  } else {
    doc.text('No items found.', 50, positionY);
  }

  // Move below the last row for the total amount
  positionY += 20;
  doc.fontSize(14).font('Helvetica-Bold')
    .text(`Total Amount: ${invoiceData.totalAmount} dt`, 50, positionY, { align: 'right' });

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => {
      resolve(fileName);
    });

    stream.on('error', (err: any) => {
      reject(err);
    });
  });
};



export const exportpdf = async (req: Request, res: Response) => {
  const invoiceId = req.params.id;

  try {
    const invoiceData = await Invoice.findById(invoiceId).populate('items'); // Modify according to your schema

    if (!invoiceData) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const fileName = await generateInvoicePDF(invoiceData);

    const filePath = path.join(__dirname, '..', 'invoices', fileName);
    res.download(filePath, (err: any) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error downloading the file' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

//notify when order is ready
export const notifyOrderReady = async (req: Request, res: Response) => {
  const { invoiceId } = req.params;
  const { message } = req.body;

  try {
    const invoice = await Invoice.findById(invoiceId).populate('userId').populate('restaurant');
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Emit a socket event to the specific user
    io.to(invoice.userId.toString()).emit('orderReady', {
      invoiceId: invoice._id,
      message: message || 'Your order is ready!',
      restaurant: invoice.restaurant, // Assuming restaurant model has a name field
      totalAmount: invoice.totalAmount,
    });

    return res.status(200).json({ message: 'Notification sent successfully!' });
  } catch (error) {
    console.error('Error notifying customer:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getinfosid = async (req: Request, res: Response) => {
  try {
    const { invoiceId } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
      return res.status(400).json({ error: 'Invalid invoice ID' });
    }

    // Find invoice by ID
    const invoice = await Invoice.findById(invoiceId)
      .populate('userId') // Populate user details, adjust fields as needed
      .populate('restaurant') // Populate restaurant details, adjust fields as needed
      .exec();

    // If no invoice is found
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Return invoice details
    res.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
async function getRecommendations(userId: string) {
  // Fetch all invoices for the user
  const userInvoices = await Invoice.find({ userId }).populate('items.productId');

  // Count the frequency of each dish type the user has ordered
  const dishTypeCounts: Record<string, number> = {};
  userInvoices.forEach((invoice) => {
    invoice.items.forEach((item: any) => {
      if (item.dishType in dishTypeCounts) {
        dishTypeCounts[item.dishType]++;
      } else {
        dishTypeCounts[item.dishType] = 1;
      }
    });
  });

  // Sort dish types by frequency
  const sortedDishTypes = Object.entries(dishTypeCounts).sort(([, a], [, b]) => b - a);

  // Get the most frequently ordered dish type
  const [mostFrequentDishType] = sortedDishTypes;

  // Fetch other popular products in this category
  const recommendations = await Product.find({ dishType: mostFrequentDishType });

  return recommendations;
}

// Example usage (can be removed or kept for testing purposes)
// getRecommendations('userId')
//   .then((recommendations) => console.log(recommendations))
//   .catch((err) => console.error(err));


  export const getUserRecommendations = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id; // Assuming you have the user ID in the request object
  
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
  
      const recommendations = await getRecommendations(userId);
  
      if (!recommendations || recommendations.length === 0) {
        return res.status(404).json({ message: 'No recommendations found' });
      }
  
      return res.status(200).json(recommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  