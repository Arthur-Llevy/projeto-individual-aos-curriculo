import { Router } from "express";
import { messageController } from "../controllers/messageController.js";

const router = Router();

router.get("/", messageController.getAllMessages);
router.get("/:id", messageController.getMessageById);
router.post("/", messageController.createNewMessage);
router.patch("/:id", messageController.updateMessageById);
router.delete("/:id", messageController.deleteMessageById);

export default router;