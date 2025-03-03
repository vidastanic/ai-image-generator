import {varchar, timestamp, pgSchema, uuid, text} from 'drizzle-orm/pg-core';

const appSchema = pgSchema('app');

export const users = appSchema.table('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('Email').notNull().unique(),
    passwordHash: varchar('password_hash', { length: 60 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const images = appSchema.table('images', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('userId').notNull().references(() => users.id),
    createdAt: timestamp('created_at').defaultNow(),
    imageType: text('image_type').notNull(),
});
