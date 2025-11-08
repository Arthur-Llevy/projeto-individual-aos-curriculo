import express from "express";
import { db } from "../database/connection.js";
import { usersTable } from "../database/schema.js";
import routes from "../routes/index.js";

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
    const result = await db.select().from(usersTable);
    return res.json(result)
})

app.use("/api/users", routes.userRoutes);
app.use("/api/posts", routes.postRoutes);
app.use("/api/messages", routes.messageRoutes);
app.use("/api/skills", routes.skillRoutes);

app.listen(3000, () => {
    console.log("Server on port 3000.");
})