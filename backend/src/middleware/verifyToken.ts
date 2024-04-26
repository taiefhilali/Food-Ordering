import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';


const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET as string, (err: jwt.VerifyErrors | null, decoded: any) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token' });
            }

            // Attach the decoded user object to the request object
            (req as any).user = decoded;
            next();
        });
    } else {
        // If no authorization header is present
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

const verifyUserType = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    verifyToken(req, res, () => {

        if ((req as any).user.UserType === "Client" || (req as any).user.UserType === "Admin" || (req as any).user.UserType === "Vendor") {
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

        if ( (req as any).user .UserType === "Admin" || (req as any).user.UserType === "Vendor") {
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

        if ( (req as any).user.UserType === "Admin") {
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