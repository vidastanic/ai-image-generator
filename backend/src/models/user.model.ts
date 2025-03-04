import {db} from "../config/database";
import {users} from "../db/schema";
import {eq} from "drizzle-orm";

export const fetchUsersByEmail = async (email: string) => {
    return db.select({id: users.id, email: users.email, passwordHash: users.passwordHash}).from(users).where(eq(users.email, email));
}

export const createUser = async (email: string, passwordHash: string) => {
    return db.insert(users).values({email, passwordHash}).returning({id: users.id});
}
