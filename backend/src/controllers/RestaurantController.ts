import { Request, Response, response } from "express"
import Restaurant from "../models/Restaurant";
import mongoose from "mongoose";




const addrestaurant = async (req: Request, res: Response) => {

  const newRestaurant = new Restaurant(req.body);
  try {
    await newRestaurant.save();
    res.status(201).json({ status: true, message: "Restaurant created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: 'Error creating restaurant' });

  }
};
const addratingtorestaurant = async (req: Request, res: Response) => {
  const { id } = req.params; // Extract the restaurant ID from the request parameters
  const { rating } = req.body; // Extract the submitted rating from the request body

  // Validate if the id parameter is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid restaurant ID' });
  }

  try {
    // Find the restaurant by ID
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Initialize rating and ratingCount if they are undefined or null
    restaurant.rating = restaurant.rating || 0;
    restaurant.ratingCount = restaurant.ratingCount || 0;

    // Calculate new rating
    restaurant.rating = (restaurant.rating * restaurant.ratingCount + rating) / (restaurant.ratingCount + 1);
    restaurant.ratingCount += 1;

    // Save the updated restaurant data
    await restaurant.save();

    return res.status(200).json({ message: 'Rating submitted successfully', restaurant });
  } catch (error) {
    console.error('Error submitting rating:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


const serviceAvailability = async (req: Request, res: Response) => {

  const restaurantId = req.params.id;
  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ status: true, message: "Restaurant not found " });

    }
    restaurant.isAvailable = !restaurant.isAvailable;
    await restaurant.save();
    res.status(200).json({ status: true, message: "Availability successfully toggeled", isAvailable: restaurant.isAvailable });

  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: 'Error toggeling restaurant availability' });

  }
}


const deleteResataurant = async (req: Request, res: Response) => {

  const restaurantId = req.params.id;
  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ status: true, message: "Restaurant not found " });
    }
    await Restaurant.findByIdAndDelete(restaurantId);
    // No need to save the restaurant after deletion, as findByIdAndDelete handles it internally
    res.status(200).json({ status: true, message: "Restaurant successfully deleted" });


  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: 'Error deleting restaurant ' });

  }
}

const getRestaurant = async (req: Request, res: Response) => {

  const restaurantId = req.params.id;
  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ status: true, message: "Restaurant not found " });

    }
    res.status(200).json(restaurant);

  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: 'Error retreiving restaurant ' });

  }
}



// const getRandomRestaurant = async (req: Request, res: Response) => {

//   try {
//     let randomRestaurants = [];

//     if(req.params.)

//   } catch (error) {

// }
// }




const searchRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurantName = req.params.restaurantName;

    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisines = (req.query.selectedCuisines as string) || "";
    const sortOption = (req.query.sortOption as string) || "lastUpdated";
    const page = parseInt(req.query.page as string) || 1;

    let query: any = {};

    query["restaurantName"] = new RegExp(restaurantName, "i");
    const restaurantNameCheck = await Restaurant.countDocuments(query);
    if (restaurantNameCheck === 0) {
      return res.status(404).json({
        data: [],
        pagination: {
          total: 0,
          page: 1,
          pages: 1,
        },
      });
    }

    if (selectedCuisines) {
      const cuisinesArray = selectedCuisines
        .split(",")
        .map((cuisine) => new RegExp(cuisine, "i"));

      query["cuisines"] = { $all: cuisinesArray };
    }

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query["$or"] = [
        { restaurantName: searchRegex },
        { cuisines: { $in: [searchRegex] } },
      ];
    }

    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    // sortOption = "lastUpdated"
    const restaurants = await Restaurant.find(query)
      .sort({ [sortOption]: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const total = await Restaurant.countDocuments(query);

    const response = {
      data: restaurants,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};





// const searchRestaurant = async (req: Request, res: Response) => {
//     try {

//         const restaurantName = req.params.restaurantName;
//         const searchQuery = (req.query.searchQuery as string) || "";
//         const selectedCuisines = (req.query.selectedCuisines as string) || "";
//         const sortOption = (req.query.sortOption as string) || "lastUpdated";
//         const page = parseInt(req.query.page as string) || 1;


//         let query: any = {};
//         query["restaurantName"] = new RegExp(restaurantName, "i");
//         const restaurantnamecheck = await Restaurant.countDocuments(query);
//         if (restaurantnamecheck === 0) {
//             return res.status(404).json([]);
//         }

//         if (selectedCuisines) {
//             const cuisinesArray = selectedCuisines.split(",").map((cuisine) => new RegExp(cuisine, "i"));
//             query["cuisines"] = { $all: cuisinesArray };
//         }



//         if (searchQuery) {
//             const searchRegex = new RegExp(searchQuery, "i");
//             query["$or"] = [
//                 { restaurantname: searchRegex },
//                 { cuisines: { $in: [searchRegex] } },
//             ];
//         }

//         const pageSize = 10;
//         const skip = (page - 1) * pageSize;

//         const restaurants = await Restaurant.find(query).sort({ [sortOption]: 1 }).skip(skip).limit(pageSize).lean();

//         const total= await Restaurant.countDocuments(query);//how many total pages
//         const rsponse ={
//             data: restaurants,
//             pagination:{
//                 total,
//                 page,
//                 pages: Math.ceil(total/pageSize),
//             }
//         };

//         res.json(response);
//     } catch (error) {
//         res.status(500).json({ message: "something went wrong" });

//     }
// }

export default {
  searchRestaurant, addrestaurant, addratingtorestaurant, serviceAvailability, deleteResataurant, getRestaurant
};