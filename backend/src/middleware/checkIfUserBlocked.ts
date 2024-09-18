import { NextFunction,Request,Response } from "express";
import User from "../models/User";

const checkIfUserBlocked = async (req:Request, res:Response, next:NextFunction) => {
    const userId = (req as any).user.id; // Assuming user ID is set by auth middleware
    
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).send('User not found');
        if (user.blocked) return res.status(403).send('User is blocked');
        next();
    } catch (error) {
        res.status(500).send('Server error');
    }
};
