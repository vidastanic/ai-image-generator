import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
    throw new Error('Set JWT_SECRET to a random secret of at least 32 characters');
}
const signingSecret: string = JWT_SECRET;
const ACCESS_EXPIRES: any = process.env.ACCESS_EXPIRES || '1h';

export function signJwtToken(userId: string): string {
    const token = jwt.sign({userId}, signingSecret, {
        expiresIn: ACCESS_EXPIRES
    });
    return token;
}

export function verifyJwtToken(token: string) {
    return jwt.verify(token, signingSecret); // Can change to try/catch that returns a boolean
}
