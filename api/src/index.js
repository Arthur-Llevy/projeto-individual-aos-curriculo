import express from "express";
import { drizzle } from 'drizzle-orm/neon-http';

const db = drizzle(process.env.DATABASE_URL);
const app = express();

app.use(express.json());

app.listen(3000, () => {
    console.log("Server on port 3000.");
})