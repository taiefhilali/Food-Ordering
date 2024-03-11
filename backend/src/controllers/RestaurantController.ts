import { Request, Response, response } from "express"
import Restaurant from "../models/Restaurant";


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
  export default {
    searchRestaurant
};