import { config } from 'dotenv';
config();

export default {
    schema: './src/db/schema.ts',
    out: './src/db/migrations',
    dialect: 'postgresql',
    schemaFilter: ["public", "app"],
    dbCredentials: { url: process.env.DATABASE_URL! }
};
