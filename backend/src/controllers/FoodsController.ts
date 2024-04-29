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
        const foods = await Foods.find({ restaurant: restaurantId });
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
    const foodId = req.params.id;
    const { tag } = req.body;


    try {

        const food = await Foods.findById(foodId);
        if (!food) {
            return res.status(404).json({ status: true, message: "food item not found " });
        }
        if (food.foodTags.includes(tag)) {
            return res.status(404).json({ status: true, message: "tag already exists " });


        }

        food.foodTags.push(tag);
        await food.save();
        res.status(200).json({ status: true, message: "tag added successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: 'Error getting food tag ' });

    }
}

const getRandomFoodByRating = async (req: Request, res: Response) => {
    try {
              // Parse the rating parameter to a number
              const rating = parseFloat(req.params.rating);
        let randomfoods = await Foods.aggregate([
            { $match: { rating: rating } },
            { $sample: { size: 5 } },
            { $project: { _id: 0 } }
        ]);


        res.status(200).json(randomfoods);
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: 'Error getting random food items by rating count ' });

    }
}

const addFoodType = async (req: Request, res: Response) => {

    const foodId = req.params.id;
    const { foodTags } = req.body;
    try {
        const food = await Foods.findById(foodId);
        if (!food) {
            return res.status(404).json({ status: true, message: "food type not found " });
        }

        if (food.foodType.includes(foodTags)) {
            return res.status(400).json({ status: true, message: "food type already exists  " });

        }
        food.foodType.push(foodTags);
        await food.save();
        res.status(200).json({ status: true, message: " Type added successfully" });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error aading  Food type ' });

    }
}

const getRandomByCategory = async (req: Request, res: Response) => {


    const { category } = req.params;
    try {
        let food = await Foods.aggregate([
            { $match: { category: category } },
            { $sample: { size: 10 } },
        ]);

        if (!food || food.length === 0) {

            food = await Foods.aggregate([
                { $sample: { size: 10 } }
            ]);
        }
        res.status(200).json(food);
    } catch (error) {
        res.status(500).json({ status: false, message: 'Error getting random foodd  by category ' });

    }
}

module.exports = {
    AddFood, getFoodById, getFoodByRestaurant, deleteFoods, foodAvailability, updateFood, addFoodTag, getRandomFoodByRating, addFoodType,getRandomByCategory
}