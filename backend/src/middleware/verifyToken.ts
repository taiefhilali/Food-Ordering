import { body } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
   console.log(authHeader);
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET as string, (err: jwt.VerifyErrors | null, decoded: any) => {
            if (err) {
                console.error('Error decoding token:', err);
                return res.status(403).json({ message: 'Invalid token' });
            }

            console.log('Decoded token:', decoded);

            // Attach the decoded user object to the request object
            (req as any).user = decoded;
            next();
        });
    } else {
        console.error('No authorization header present');
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
const verifyUserType = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Access decoded user object from the request
    const decodedUser = (req as any).user;
    verifyToken(req, res, () => {
    if (decodedUser && (decodedUser.userType === "Client" || decodedUser.userType === "Admin" || decodedUser.userType === "Vendor")) {
        next();
    } else {
        res.status(403).json({
            message: 'Invalid user type'
        });
    }
    });
};



export const verifyVendor = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    verifyToken(req, res, () => {

        if ( (req as any).user .userType === "Admin" || (req as any).user.userType === "Vendor") {
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

        if ( (req as any).user.userType === "Admin") {
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