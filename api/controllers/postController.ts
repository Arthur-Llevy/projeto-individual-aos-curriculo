import type { Request, Response } from "express";
import { postService } from "../services/postService.js"
import { NotFoundException } from "../exceptions/notFoundException.js";
import { EmptyFieldsException } from "../exceptions/emptyFieldsException.js";

export const postController = {
    getAllPosts: async (req: Request, res: Response) => {
        try {
            const result = await postService.getAllPosts();

            return res.status(200).json(result);
        } catch (error: Error | any) {
            throw new Error("Error fetching posts: " + error.message);
        }
    },

    getPostById: async (req: Request, res: Response) => {
        const id = Number(req.params.id);

        try {
            const result = await postService.getPostById(id);
            return res.status(200).json(result);
        } catch (error: Error | any) {
            if (error instanceof NotFoundException) { 
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    },

    createNewPost: async (req: Request, res: Response) => {
        const {
            userId, 
            title,
            content,
        } = req.body;

        try {
            const result = await postService.createNewPost(
                userId,
                title,
                content,
            );
            return res.status(201).json(result);
        } catch (error: Error | any) {
            if (error instanceof EmptyFieldsException) return res.status(400).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    },

    updatePostById: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            const {
                userId, 
                title,
                content,
            } = req.body;

            const result = await postService.updatePostBydId(id, userId, title, content);
            return res.status(200).json(result);
        } catch (error: Error | any) {
            if (error instanceof NotFoundException) return res.status(404).json({ message: error.message });
            if (error instanceof EmptyFieldsException) return res.status(400).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    },

    deletePostById: async (req: Request, res: Response) => {
        const id = Number(req.params.id);

        try {
            await postService.deletePostById(id);
            return res.status(204).send();
        } catch (error: Error | any) {
            if (error instanceof NotFoundException) return res.status(404).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }   
    }

}