import mongoose from 'mongoose'; // Ensure mongoose is imported
import Invoice from '../models/Invoice'; // Adjust the path if necessary
import { Request, Response } from 'express'; // Adjust import as needed
import Restaurant from '../models/Restaurant';
import { io } from '..';
const path = require('path');
const PDFDocument = require('pdfkit');
const fs = require('fs');
import axios from 'axios';

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
// export const saveInvoice = async (req: Request, res: Response) => {
//   try {
//     const { userId, cartItems,restaurant } = req.body; // Extract userId and cartItems from request body

//     // Validate presence of userId and cartItems
//     if (!userId || !cartItems) {
//       return res.status(400).json({ error: 'Missing userId or cartItems' });
//     }

//     // Map cartItems to match the Invoice schema
//     const invoiceItems = cartItems.map((item: any) => ({
//       name: item.name,
//       price: item.price,
//       totalPrice: item.totalPrice,
//       imageUrl: item.imageUrl,
//       quantity: item.quantity,
//     }));

//     // Calculate the total amount for the invoice
//     const totalAmount = invoiceItems.reduce((sum: any, item: { totalPrice: any; }) => sum + item.totalPrice, 0);
//     const userIdd = (req as any).user.id;

//     // Create a new Invoice document
//     const newInvoice = new Invoice({
//       userId: userIdd,
//       items: invoiceItems,
//       totalAmount: totalAmount,
//       restaurant:restaurant,
//       discount: 0, // Adjust if you have a discount logic
//     });

//     // Save the Invoice to the database
//     const savedInvoice = await newInvoice.save();
//     console.log('Invoice saved successfully:', savedInvoice);
//     return res.status(201).json(savedInvoice);
//   } catch (error) {
//     console.error('Error saving invoice:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };
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
  doc.fontSize(14).text(`Date: ${new Date(invoiceData.createdAt).toLocaleDateString()}`, { align: 'right' });
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
      doc.text(item.quantity, quantityColX, positionY + 20);
      doc.text(`${item.price} dt`, priceColX, positionY + 20);

      // Draw a line under each item
      positionY += 80; // Move to the next row
      doc.moveTo(50, positionY - 15).lineTo(550, positionY - 15).strokeColor('orange').stroke();
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
// export const generateInvoicePDF = (invoiceData: { _id: any; createdAt: string | number | Date; items: any[]; totalAmount: any; }) => {
//   const doc = new PDFDocument({ margin: 50 });
//   const fileName = `invoice-${invoiceData._id}.pdf`;
//   const stream = fs.createWriteStream(`./invoices/${fileName}`);

//   doc.pipe(stream);

//   // Add the title and details
//   doc.fontSize(20).text('Invoice', { align: 'center' });
//   doc.moveDown();
//   doc.fontSize(14).text(`Date: ${new Date(invoiceData.createdAt).toLocaleDateString()}`, { align: 'right' });
//   doc.moveDown(2);

//   // Table headers
//   const tableTop = doc.y;
//   const itemColX = 150;
//   const quantityColX = 400;
//   const priceColX = 470;

//   // Draw table headers with a bold font
//   doc.fontSize(12).font('Helvetica-Bold').fillColor('black')
//     .text('Image', 50, tableTop)
//     .text('Item', itemColX, tableTop)
//     .text('Quantity', quantityColX, tableTop)
//     .text('Price', priceColX, tableTop);

//   doc.moveDown(0.5);

//   // Draw table lines
//   doc.strokeColor('orange').lineWidth(1)
//     .moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

//   // Reset font for table content
//   doc.font('Helvetica').fontSize(12);

//   let positionY = tableTop + 25;

//   if (Array.isArray(invoiceData.items)) {
//     for (const item of invoiceData.items) {
//       // Draw image
//       try {
//         // Log image URL for debugging
//         console.log('Loading image:', item.imageUrl);
        
//         doc.image(item.imageUrl, 50, positionY, { width: 80, height: 60 });
//       } catch (err) {
//         console.error(`Error loading image ${item.imageUrl}:`, err);
//         // Display a placeholder if the image fails to load
//         doc.rect(50, positionY, 80, 60).strokeColor('gray').stroke();
//         doc.text('Image not found', 55, positionY + 25, { width: 70, align: 'center' });
//       }

//       // Draw item details
//       doc.text(item.name, itemColX, positionY + 20, { width: 200 });
//       doc.text(item.quantity, quantityColX, positionY + 20);
//       doc.text(`${item.price} dt`, priceColX, positionY + 20);

//       // Draw a line under each item
//       positionY += 80; // Move to the next row
//       doc.moveTo(50, positionY - 15).lineTo(550, positionY - 15).strokeColor('orange').stroke();
//     }
//   } else {
//     doc.text('No items found.', 50, positionY);
//   }

//   // Move below the last row for the total amount
//   positionY += 20;
//   doc.fontSize(14).font('Helvetica-Bold')
//     .text(`Total Amount: ${invoiceData.totalAmount} dt`, 50, positionY, { align: 'right' });

//   doc.end();

//   return new Promise((resolve, reject) => {
//     stream.on('finish', () => {
//       resolve(fileName);
//     });

//     stream.on('error', (err: any) => {
//       reject(err);
//     });
//   });
// };


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

// export const generateInvoicePDF = (invoiceData: { _id: any;  createdAt: string | number | Date; items: any[]; totalAmount: any; }) => {
//   const doc = new PDFDocument();
//   const fileName = `invoice-${invoiceData._id}.pdf`;
//   const stream = fs.createWriteStream(`./invoices/${fileName}`);

//   doc.pipe(stream);

//   // Add the title and details
//   doc.fontSize(20).text('Invoice', { align: 'center' });
//   doc.moveDown();
//   // doc.fontSize(14).text(`Order ID: ${invoiceData._id}`);
//   // doc.text(`Customer Name: ${invoiceData.userId}`);
//   doc.text(`Date: ${new Date(invoiceData.createdAt).toLocaleDateString()}`);
//   doc.moveDown();

//   if (Array.isArray(invoiceData.items)) {
//     invoiceData.items.forEach((item) => {
//         doc.text(`${item.imageUrl}---${item.name} x ${item.quantity} - ${item.price} dt`);
//     });
// } else {
//     doc.text('No items found.');
// }


//   // Add the total
//   doc.moveDown();
//   doc.text(`Total Amount: ${invoiceData.totalAmount} dt`, { align: 'right' });

//   doc.end();

//   return new Promise((resolve, reject) => {
//     stream.on('finish', () => {
//       resolve(fileName);
//     });

//     stream.on('error', (err:any) => {
//       reject(err);
//     });
//   });
// };
// export const exportpdf = async (req: Request, res: Response) => {  const invoiceId = req.params.id;

//   try {
//       // Fetch invoice data from your database
//       const invoiceData = await Invoice.findById(invoiceId).populate('items'); // Modify according to your schema

//       if (!invoiceData) {
//           return res.status(404).json({ error: 'Invoice not found' });
//       }

//       // Generate PDF
//       const fileName = await generateInvoicePDF(invoiceData);

//       // Send PDF file as a response
//       const filePath = path.join(__dirname, '..', 'public', 'invoices', fileName);
//       res.download(filePath, (err:any) => {
//           if (err) {
//               console.error(err);
//               res.status(500).json({ error: 'Error downloading the file' });
//           }
//       });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Server error' });
//   }}

// Notify customer when order is ready
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