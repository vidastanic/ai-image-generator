import { Response, NextFunction } from 'express';
import {verifyJwtToken} from "../utils";
import {AuthenticatedRequest} from "../types";

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Get token from header
    if (!token) {
        res.status(401).json({
            success: false,
            message: 'No token provided',
        }); // Can just throw error instead since this function is synchronous
        return;
    }

    const decoded = verifyJwtToken(token) as {userId: string};
    console.log('decoded', decoded);
    req.user = {id: decoded.userId};

    next();
};
