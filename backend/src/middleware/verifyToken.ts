import { validateMyRestaurantRequest } from './validation';
import { NextFunction, Request, Response } from 'express';
const jwt = require('jsonwebtoken');

type UserType = {

    id: string;
    username: string;
    email: string;
};
const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const authHeader = req.headers.authorization;


    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, async (err: any, user: any) => {
            if (err) {
                return res.status(403).json({
                    message: 'Invalid token'
                });
            }
            req.body = user;
            next();
        });
    }
}


const verifyUserType = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    verifyToken(req, res, () => {

        if (req.body.UserType === "Client" || req.body.UserType === "Admin" || req.body.UserType === "Vendor") {
            next();

        } else (
            res.status(403).json({
                message: 'Invalid user type'
            })
        )
    });
}

const verifyVendor = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    verifyToken(req, res, () => {

        if ( req.body.UserType === "Admin" || req.body.UserType === "Vendor") {
            next();

        } else (
            res.status(403).json({
                message: 'Invalid user type'
            })
        )
    });
}

const verifyAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    verifyToken(req, res, () => {

        if ( req.body.UserType === "Admin") {
            next();

        } else (
            res.status(403).json({
                message: 'Invalid user type'
            })
        )
    });
}

module.exports = {
    verifyToken,
    verifyUserType,
    verifyVendor,
    verifyAdmin
}