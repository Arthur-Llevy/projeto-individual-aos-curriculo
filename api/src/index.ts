import express from "express";
import { db } from "../database/connection.js";
import { usersTable } from "../database/schema.js";

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
    const result = await db.select().from(usersTable);
    return res.json(result)
})

app.listen(3000, () => {
    console.log("Server on port 3000.");
})