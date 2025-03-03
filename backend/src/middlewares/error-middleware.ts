import {NextFunction, Request, Response} from "express";
import {z} from "zod";
import {JsonWebTokenError, TokenExpiredError} from "jsonwebtoken";

export function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof z.ZodError) {
        res.status(400).json({
            success: false,
            message: err.format()
        });
        return;
    }

    if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
        res.status(401).json({
            success: false,
            message: err.message
        });
        return;
    }

    res.status(500).json({
        success: false,
        message: err.message ?? "Internal Server Error"
    });
}
