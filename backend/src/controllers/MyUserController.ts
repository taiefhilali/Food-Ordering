import { Request,Response } from "express";
import User from "../models/User";


const createCurrentUser = async(req:Request,res:Response) =>{

try{

    const {id}= req.body;
    const existingUser= await User.findOne({id});
    if(existingUser){
        return res.status(200).send();
    }

    const newUser= new User{ req.body}

} catch(error){console.log(error);
res.status(500).json({message:'error creating user'})};


};

export default {
    createCurrentUser,
};