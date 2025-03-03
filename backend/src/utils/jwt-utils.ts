import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';
const ACCESS_EXPIRES: any = process.env.ACCESS_EXPIRES || '1h';

export function signJwtToken(userId: string): string {
    const token = jwt.sign({userId}, JWT_SECRET, {
        expiresIn: ACCESS_EXPIRES
    });
    console.log(decodeToken(token));
    return token;
}

export function verifyJwtToken(token: string) {
    return jwt.verify(token, JWT_SECRET); // Can change to try/catch that returns a boolean
}

function decodeToken(token: string) {
    return jwt.decode(token);
}
