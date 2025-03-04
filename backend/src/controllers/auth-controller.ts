import {NextFunction, Request, RequestHandler, Response} from 'express';
import bcrypt from 'bcryptjs';
import {signJwtToken, verifyJwtToken} from "../utils";
import {z} from "zod";
import {createUser, fetchUsersByEmail} from "../models/user.model";

export const registerUser = async (req: Request<{}, {}, {email: string, password: string}>, res: Response, next: NextFunction) => {
    try {
        const bodySchema = z.object({
            email: z.string().email(),
            password: z.string().min(8)
        });

        const {email, password} = bodySchema.parse(req.body); // This should actually be done in a generic middleware

        const existingUser = await fetchUsersByEmail(email);
        if (existingUser.length > 0) {
            return next(Error("User already exists")); // For an async function, express won't auto catch errors by the error handler - have to pass the error using next()
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await createUser(email, passwordHash);

        const token = signJwtToken(user[0].id);

        res.status(201).json({
            success: true,
            message: 'User registered',
            token_type: 'Bearer',
            access_token: token
        });
    } catch (error) {
        next(error);
    }
}

export const loginUser = async (req: Request<{}, {}, {email: string, password: string}>, res: Response, next: NextFunction) => {
    try {
        const bodySchema = z.object({
            email: z.string().email(),
            password: z.string()
        });

        const {email, password} = bodySchema.parse(req.body);
        const user = await fetchUsersByEmail(email);
        if (user.length != 1) {
            return next(Error("Invalid email"));
        }

        const validPassword = await bcrypt.compare(password, user[0].passwordHash);
        if (!validPassword) {
            return next(Error("Invalid password"));
        }

        const token = signJwtToken(user[0].id);

        res.status(201).json({
            success: true,
            message: "User logged in",
            token_type: 'Bearer',
            access_token: token,
        });
    } catch (error) {
        next(error);
    }
}

export const validateToken: RequestHandler = (req, res, _next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Get token from header
    if (!token) {
        res.status(401).json({
            success: false,
            message: 'No token provided',
        });
        return;
    }

    verifyJwtToken(token);
    res.status(200).json({
        success: true,
        message: 'Token is valid',
    });
}
