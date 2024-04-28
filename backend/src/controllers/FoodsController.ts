const Foods = require('../models/Foods')
import { Request, Response, response } from "express"
import { title } from "process";



const AddFood = async (req: Request, res: Response) => {

    const newFood = new Foods(req.body);
    try {
        await newFood.save();
        res.status(201).json({ status: true, message: "Food created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: 'Error creating Food' });

    }
};

const updateCategory = async (req: Request, res: Response) => {

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


const deleteCategory = async (req: Request, res: Response) => {

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

const getAllCategories = async (req: Request, res: Response) => {

    try {
        const categories = await Category.find({}, { __v: 0 });

        res.status(200).json(categories);

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: 'Error retreiving categories ' });

    }
}

const patchCategoryImage = async (req: Request, res: Response) => {
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

const getRandomCategories = async (req: Request, res: Response) => {

    try {
        let categories = await Category.aggregate([
            { $match: { value: { $ne: 'more' } } },
            { $sample: { size: 7 } }
        ]);

        const moreCategory = await Category.findOne({ value: "more" });
        if (!moreCategory) {
            categories.push(moreCategory);

        }
        res.status(200).json(categories);
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: 'Error getting random categories ' });

    }
}


module.exports = {
    AddFood, updateCategory, deleteCategory, getAllCategories, patchCategoryImage,getRandomCategories
}