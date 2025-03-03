import { eq } from 'drizzle-orm';
import { users } from '../db/schema';
import { db } from '../config/database';
import {NextFunction, Request, RequestHandler, Response} from 'express';
import bcrypt from 'bcryptjs';
import {signJwtToken, verifyJwtToken} from "../utils";
import {z} from "zod";
import {AuthenticatedRequest} from "../types";

import { IncomingHttpHeaders } from 'http';

interface CustomHeaders extends IncomingHttpHeaders {
    'Authorization'?: string;
}

interface CustomRequest extends Request {
    headers: CustomHeaders;
}

export const registerUser = async (req: Request<{}, {}, {email: string, password: string}>, res: Response, next: NextFunction) => {
    try {
        const bodySchema = z.object({
            email: z.string().email(),
            password: z.string().min(8)
        });

        const {email, password} = bodySchema.parse(req.body);

        const existingUser = await db.select().from(users).where(eq(users.email, email)); // .select() returns an array
        if (existingUser.length > 0) {
            return next(Error("User already exists")); // For an async function, express won't auto catch errors by the error handler - have to pass the error using next()
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await db.insert(users).values({email, passwordHash}).returning({id: users.id});

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
        console.log(password);
        const user = await db.select().from(users).where(eq(users.email, email));
        if (user.length != 1) {
            return next(Error("Invalid credentials"));
        }

        const validPassword = await bcrypt.compare(password, user[0].passwordHash);
        if (!validPassword) {
            return next(Error("Invalid credentials"));
        }

        const token = signJwtToken(user[0].id);

        res.json({
            success: true,
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
