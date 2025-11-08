import type { Request, Response } from "express";
import { NotFoundException } from "../exceptions/notFoundException.js";
import { EmptyFieldsException } from "../exceptions/emptyFieldsException.js";
import { academicTrainingService } from "../services/academicTrainingService.js";

export const academicTrainingController = {
    getAllAcademicTraining: async (req: Request, res: Response) => {
        try {
            const result = await academicTrainingService.getAllAcademicTraining();

            return res.status(200).json(result);
        } catch (error: Error | any) {
            throw new Error("Error fetching academic training: " + error.message);
        }
    },

    getAcademicTrainingById: async (req: Request, res: Response) => {
        const id = Number(req.params.id);

        try {
            const result = await academicTrainingService.getAcademicTrainingById(id);
            return res.status(200).json(result);
        } catch (error: Error | any) {
            if (error instanceof NotFoundException) { 
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    },

    createNewAcademicTraining: async (req: Request, res: Response) => {
        const {
            userId,
            title,
            institution,
            completed,
            startYear,
            endYear,
            certificateUrl
        } = req.body;

        try {
            const result = await academicTrainingService.createNewAcademicTraining(
                 userId,
                title,
                institution,
                completed,
                startYear,
                endYear,
                certificateUrl
            );
            return res.status(201).json(result);
        } catch (error: Error | any) {
            if (error instanceof EmptyFieldsException) return res.status(400).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    },

    updateAcademicTrainingById: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            const {
                userId,
                title,
                institution,
                completed,
                startYear,
                endYear,
                certificateUrl
            } = req.body;

            const result = await academicTrainingService.updateAcademicTrainingById(id, userId, title, institution, completed, startYear, endYear, certificateUrl);
            return res.status(200).json(result);
        } catch (error: Error | any) {
            if (error instanceof NotFoundException) return res.status(404).json({ message: error.message });
            if (error instanceof EmptyFieldsException) return res.status(400).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }
    },

    deleteAcademicTrainingById: async (req: Request, res: Response) => {
        const id = Number(req.params.id);

        try {
            await academicTrainingService.deleteAcademicTrainingById(id);
            return res.status(204).send();
        } catch (error: Error | any) {
            if (error instanceof NotFoundException) return res.status(404).json({ message: error.message });
            return res.status(500).json({ message: error.message });
        }   
    }

}