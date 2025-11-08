import { Router } from "express";
import { postController } from "../controllers/postController.js";

const router = Router();

router.get("/", postController.getAllPosts);
router.get("/:id", postController.getPostById);
router.post("/", postController.createNewPost);
router.patch("/:id", postController.updatePostById);
router.delete("/:id", postController.deletePostById);

export default router;