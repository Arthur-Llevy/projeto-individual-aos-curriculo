import type { Request, Response } from "express";
import { messageService } from "../services/messageService.js"
import { NotFoundException } from "../exceptions/notFoundException.js";
import { EmptyFieldsException } from "../exceptions/emptyFieldsException.js";

export const messageController = {
    getAllMessages: async (req: Request, res: Response) => {
        try {
            const result = await messageService.getAllMessages();

            return res.status(200).json(result);
        } catch (error: Error | any) {
            throw new Error("Error fetching messages: " + error.message);
        }
    },

    getMessageById: async (req: Request, res: Response) => {
        const id = Number(req.params.id);

        try {
            const result = await messageService.getMessageById(id);
            return res.status(200).json(result);
        } catch (error: Error | any) {
            if (error instanceof NotFoundException) { 
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    },

    createNewMessage: async (req: Request, res: Response) => {
        const {
            toUser, 
            fromUser,
            content,
        } = req.body;

        try {
            const result = await messageService.createNewMessage(
                toUser, 
                fromUser,
                content
            );
            return res.status(201).json(result);
        } catch (error: Error | any) {
            if (error instanceof EmptyFieldsException) return res.status(400).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    },

    updateMessageById: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            const {
                toUser, 
                fromUser,
                content
            } = req.body;

            const result = await messageService.updateMessageById(id,  toUser, fromUser, content);
            return res.status(200).json(result);
        } catch (error: Error | any) {
            if (error instanceof NotFoundException) return res.status(404).json({ message: error.message });
            if (error instanceof EmptyFieldsException) return res.status(400).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    },

    deleteMessageById: async (req: Request, res: Response) => {
        const id = Number(req.params.id);

        try {
            await messageService.deleteMessageById(id);
            return res.status(204).send();
        } catch (error: Error | any) {
            if (error instanceof NotFoundException) return res.status(404).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }   
    }

}