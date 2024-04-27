const Category= require('../models/Categories')
import { Request, Response, response } from "express"



const createCategory = async (req: Request, res: Response) => {

    const newCategory = new Category(req.body);
    try {
      await newCategory.save();
      res.status(201).json({ status: true, message: "Category created successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: false, message: 'Error creating Category' });
  
    }
  };

  module.exports={
    createCategory
  }