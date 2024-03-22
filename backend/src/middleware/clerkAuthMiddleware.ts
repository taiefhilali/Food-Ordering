// Import necessary modules
import { Request, Response, NextFunction } from "express";
const jwt = require('jsonwebtoken');


// Middleware function for clerk token validation
const clerkAuthMiddleware = (req:Request, res:Response, next:NextFunction) => {
    // Get the token from the request headers, query parameters, or cookies
    const token = req.headers.authorization;

    // Check if token exists
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Verify and decode the token
        const decoded = jwt.verify(token, 'your_secret_key');

        // Check if the decoded token contains the necessary clerk role or permissions
        if (decoded.role !== 'clerk') {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        // Attach the decoded token payload to the request object for further use
        req.clerk = decoded;

        // Call next middleware or route handler
        next();
    } catch (error) {
        // Token verification failed
        return res.status(401).json({ message: 'Invalid token' });
    }
};


// Export the middleware function for reusability
module.exports = clerkAuthMiddleware;
