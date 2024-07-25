const Category = require('../models/Category')
import { Request, Response, response } from "express"
import multer from "multer";
import { title } from "process";
import cloudinary from "cloudinary";
import mongoose from "mongoose";

// Multer setup for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Controller function to create a category with image upload
 const createCategory= async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const imageUrl = await uploadimage(req.file as Express.Multer.File);


    const newCategory = new Category({
      title: req.body.title,
      value: req.body.value,
      imageUrl: imageUrl,
      user: new mongoose.Types.ObjectId(userId), // Assign userId to the user field

    });

    await newCategory.save();
    res.status(201).json({ status: true, message: 'Category created successfully', data: newCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Error creating Category' });
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

const uploadimage = async (file: Express.Multer.File) => {
    const image = file;
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURL = `data:${image.mimetype};base64,${base64Image}`;
    const uploadResponse = await cloudinary.v2.uploader.upload(dataURL);
    return uploadResponse.url;
  }
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
const getDistinctCategories = async (req: Request, res: Response) => {
    try {
      // Fetch distinct category titles from the database
      const distinctCategories = await Category.distinct('title');
      res.json(distinctCategories); // Send distinct category titles as JSON response
    } catch (error) {
      console.error('Error fetching distinct categories:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };

  const categoriesByUserId =async (req:Request,res:Response) => {
    const userId = (req as any).user.id;
    try {
      // Fetch products from MongoDB based on userId
      const categories = await Category.find({ user: userId });
      
      res.json(categories);
      console.log('====================================',categories); 

    } catch (err) {
      console.error('Error fetching categories:', err);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  }
module.exports = {
    createCategory,getDistinctCategories, updateCategory, deleteCategory, getAllCategories, patchCategoryImage,getRandomCategories,categoriesByUserId
}