import { db } from "../database/connection.js"
import { academicTrainingsTable } from "../database/schema.js"
import { eq } from "drizzle-orm";
import { NotFoundException } from "../exceptions/notFoundException.js";
import { EmptyFieldsException } from "../exceptions/emptyFieldsException.js";

export const academicTrainingService = {
    getAllAcademicTraining: async () => {
        try {
            const academicTraining = await db.select().from(academicTrainingsTable);
            return academicTraining;

        } catch (error: Error | any) {
            throw new Error(`Could not fetch academic trainings from database: ${error.message}`);
        }
    },

    getAcademicTrainingById: async (id: number) => {
        try {
            const academicTraining = await db.select().from(academicTrainingsTable).where(eq(academicTrainingsTable.id, id));

            if (academicTraining.length === 0) {
                throw new NotFoundException(`Academic training with id ${id} not found.`);
            }
            
            return academicTraining;
        } catch (error: Error | any) {
            if (error instanceof NotFoundException) throw error;
            throw new Error(`Could not fetch message with id ${id}: ${error.message}`);
        }
    },

    createNewAcademicTraining: async (
        userId: number, 
        title: string,
        institution: string,
        completed: boolean,
        startYear: string,
        endYear: string,
        certificateUrl: string
    ) => {
        try {
            if (!userId || !title || !institution || completed === undefined || !startYear || !endYear) {
                let missingFields = [];
                if (!userId) missingFields.push("userId");
                if (!title) missingFields.push("title");
                if (!institution) missingFields.push("institution");
                if (completed === undefined) missingFields.push("completed");
                if (!startYear) missingFields.push("startYear");
                if (!endYear) missingFields.push("yearOfCompletion");

                throw new EmptyFieldsException(`The following fields are required: ${missingFields.join(", ")}`);
            }

            const academicTrainingCreated = await db.insert(academicTrainingsTable).values({
                user_id: userId,
                title: title,
                institution: institution,
                completed: completed,
                start_year: startYear,
                end_year: endYear,
                certificate_url: certificateUrl,
                created_at: new Date(),
                updated_at: new Date(),
            }).returning();

            return academicTrainingCreated;
        } catch (error: Error | any) {
            if (error instanceof EmptyFieldsException) throw error;
            throw new Error(`Could not create new academic training: ${error.message}`);
        }
    },

    updateAcademicTrainingById: async (
        id: number,
        userId: number, 
        title: string,
        institution: string,
        completed: boolean,
        startYear: string,
        endYear: string,
        certificateUrl: string
    ) => {
        const academicTraining = await db.select().from(academicTrainingsTable).where(eq(academicTrainingsTable.id, id));

        if (academicTraining.length === 0) {
            throw new NotFoundException(`Academic training with id ${id} not found.`);
        }

        try {
            await db.update(academicTrainingsTable).set({
                user_id: userId,
                title: title,
                institution: institution,
                completed: completed,
                start_year: startYear,
                end_year: endYear,
                certificate_url: certificateUrl,
                updated_at: new Date(),
            }).where(eq(academicTrainingsTable.id, id));

            const messageUpdated = await db.select().from(academicTrainingsTable).where(eq(academicTrainingsTable.id, id));

            return messageUpdated;
        } catch (error: Error | any) {
            if (error instanceof NotFoundException) throw error;
            throw new Error(`Could not update academic training with id ${id}: ${error.message}`);
        }
    },

    deleteAcademicTrainingById: async (id: number) => {
        const message = await db.select().from(academicTrainingsTable).where(eq(academicTrainingsTable.id, id));

        if (message.length === 0) {
            throw new NotFoundException(`Academic training with id ${id} not found.`);
        }

        try {
            await db.delete(academicTrainingsTable).where(eq(academicTrainingsTable.id, id));
            return;
        } catch (error: Error | any) {
            if (error instanceof NotFoundException) throw error;
            throw new Error(`Could not delete academic training with id ${id}: ${error.message}`);
        }
    }
}