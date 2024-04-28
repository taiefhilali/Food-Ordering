const Foods = require('../models/Foods')
import { Request, Response, response } from "express"
import { title } from "process";



const AddFood = async (req: Request, res: Response) => {

    const newFood = new Foods(req.body);
    try {
        await newFood.save();
        res.status(201).json({ status: true, message: "Food item added successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: 'Error:! Food item coud not be saved successfully' });

    }
};



const getFoodById = async (req: Request, res: Response) => {

    const foodId = req.params.id;
    try {
        const food = await Foods.findById(foodId);
        if (!food) {
            return res.status(404).json({ status: true, message: "food item  not found " });
        }
        res.status(200).json(food);


    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: 'Error retreiving food item ' });

    }
};




const getFoodByRestaurant = async (req: Request, res: Response) => {

    const restaurantId = req.params.restaurantId;
    try {
        const foods = await Foods.find({ restauran: restaurantId });
        if (!foods || foods.length === 0) {
            return res.status(404).json({ status: true, message: " No Food items found " });
        }
        res.status(200).json(foods);


    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: 'Error retreiving food item by restaurant ' });

    }
};



const updateFood = async (req: Request, res: Response) => {

    const foodId = req.params.id;

    try {
        const updatedFoods = await Foods.findByIdAndUpdate(
            foodId, req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedFoods) {
            res.status(404).json({ status: false, message: "Food item not found " });

        }

        res.status(200).json({ Foods: updatedFoods, status: true, message: "Food item updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: 'Error updating Food item' });

    }
};


const deleteFoods = async (req: Request, res: Response) => {

    const foodId = req.params.id;
    try {
        const food = await Foods.findById(foodId);
        if (!food) {
            return res.status(404).json({ status: true, message: "food item not found " });
        }
        await Foods.findByIdAndDelete(foodId);
        // No need to save the restaurant after deletion, as findByIdAndDelete handles it internally
        res.status(200).json({ status: true, message: "Food item successfully deleted" });


    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: 'Error deleting Food item ' });

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

const foodAvailability = async (req: Request, res: Response) => {
    const foodId = req.params.id;

    try {
        const food = await Foods.findById(foodId);
        if (!food) {
            return res.status(404).json({ status: true, message: "food item not found " });
        }


        food.isAvailable = !food.isAvailable;
        await food.save();
        res.status(200).json({ status: true, message: "Food item is Available" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: 'Error of availability   ' });

    }
}

const addFoodTag = async (req: Request, res: Response) => {

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
    AddFood, getFoodById, getFoodByRestaurant, deleteFoods, foodAvailability, updateFood,getAllCategories, patchCategoryImage, getRandomCategories
}