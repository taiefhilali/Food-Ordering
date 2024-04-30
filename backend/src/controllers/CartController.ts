const Cart = require('../models/Cart')
import { Request, Response, response } from "express"
import { title } from "process";



const addPrductToCart = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { productId, totalPrice, quantity } = req.body;
    let count;
    try {
        const existingProduct = await Cart.findOne({ userId, productId })
        count = await Cart.countDocuments({ userId });
        if (existingProduct) {
            existingProduct.totalPrice += totalPrice;
            existingProduct.quantity += 1;
            await existingProduct.save();
        } else {
            const newCart = new Cart({
                userId: userId,
                productId: req.body.productId,
                additives: req.body.additives,
                instructions: req.body.instructions,
                totalPrice: req.body.totalPrice,
                quantity: req.body.quantity,
            });
            await newCart.save();
            count= await Cart.countDocuments({ userId });
        }
        res.status(200).json({ status: true, count: count });

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: 'Error creating Category' });

    }
};

const removePrductFromCart = async (req: Request, res: Response) => {

    const id = req.params.id;
    const { title, value, imageUrl } = req.body;

    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            id, {
            title: title,
            value: value,
            imageUrl: imageUrl
        }, { new: true }
        );

        if (!updatedCategory) {
            res.status(404).json({ status: false, message: "Category not found " });

        }

        res.status(200).json({ Category: updateCategory, status: true, message: "Category updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: 'Error updating Category' });

    }
};
const fetchUserCart = async (req: Request, res: Response) => {

    try {
        const categories = await Category.find({}, { __v: 0 });

        res.status(200).json(categories);

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: 'Error retreiving categories ' });

    }
}

const clearUserCart = async (req: Request, res: Response) => {

    const id = req.params.id;
    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ status: true, message: "Category not found " });
        }
        await Category.findByIdAndDelete(id);
        // No need to save the restaurant after deletion, as findByIdAndDelete handles it internally
        res.status(200).json({ status: true, message: "Category successfully deleted" });


    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: 'Error deleting Category ' });

    }
};

const getCartCount = async (req: Request, res: Response) => {

    const id = req.params.id;
    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ status: true, message: "Category not found " });
        }
        await Category.findByIdAndDelete(id);
        // No need to save the restaurant after deletion, as findByIdAndDelete handles it internally
        res.status(200).json({ status: true, message: "Category successfully deleted" });


    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: 'Error deleting Category ' });

    }
};


const decrementProductQty = async (req: Request, res: Response) => {
    const id = req.params.id;
    const imageUrl = req.body;
    try {
        const existingcategory = await Category.findById(id);
        const updatedCategory = new Category({

            title: existingcategory.title,
            value: existingcategory.value,
            imageUrl: imageUrl
        });

        await updatedCategory.save();
        res.status(200).json({ status: true, message: "Category image updated successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: 'Error updating category image ' });

    }
}




module.exports = {
    addPrductToCart, getCartCount, removePrductFromCart, fetchUserCart, clearUserCart, decrementProductQty
}