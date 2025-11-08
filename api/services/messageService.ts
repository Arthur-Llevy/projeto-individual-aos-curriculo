import { db } from "../database/connection.js"
import { messagesTable } from "../database/schema.js"
import { eq } from "drizzle-orm";
import { NotFoundException } from "../exceptions/notFoundException.js";
import { EmptyFieldsException } from "../exceptions/emptyFieldsException.js";

export const messageService = {
    getAllMessages: async () => {
        try {
            const messages = await db.select().from(messagesTable);
            return messages;

        } catch (error: Error | any) {
            throw new Error(`Could not fetch messages from database: ${error.message}`);
        }
    },

    getMessageById: async (id: number) => {
        try {
            const message = await db.select().from(messagesTable).where(eq(messagesTable.id, id));

            if (message.length === 0) {
                throw new NotFoundException(`Message with id ${id} not found.`);
            }
            
            return message;
        } catch (error: Error | any) {
            if (error instanceof NotFoundException) throw error;
            throw new Error(`Could not fetch message with id ${id}: ${error.message}`);
        }
    },

    createNewMessage: async (
        toUser: number, 
        fromUser: number,
        content: string,
    ) => {
        try {
            if (!toUser || !fromUser || !content) {
                let emptyFields = [];
                if (!toUser) emptyFields.push("toUser");
                if (!fromUser) emptyFields.push("fromUser");
                if (!content) emptyFields.push("content");

                throw new EmptyFieldsException(`The following fields are required and cannot be empty: ${emptyFields.join(", ")}`);
            }

            const messageCreated = await db.insert(messagesTable).values({
                from_user: fromUser,
                content: content,
                to_user: toUser,
                created_at: new Date(),
                updated_at: new Date(),
            }).returning();

            return messageCreated;
        } catch (error: Error | any) {
            if (error instanceof EmptyFieldsException) throw error;
            throw new Error(`Could not create new message: ${error.message}`);
        }
    },

    updateMessageById: async (
        id: number,
        toUser: number, 
        fromUser: number,
        content: string,
    ) => {
        const message = await db.select().from(messagesTable).where(eq(messagesTable.id, id));

        if (message.length === 0) {
            throw new NotFoundException(`Message with id ${id} not found.`);
        }

        try {
            await db.update(messagesTable).set({
                from_user: fromUser,
                content: content,
                to_user: toUser,
                updated_at: new Date(),
            }).where(eq(messagesTable.id, id));

            const messageUpdated = await db.select().from(messagesTable).where(eq(messagesTable.id, id));

            return messageUpdated;
        } catch (error: Error | any) {
            if (error instanceof NotFoundException) throw error;
            throw new Error(`Could not update post with id ${id}: ${error.message}`);
        }
    },

    deleteMessageById: async (id: number) => {
        const message = await db.select().from(messagesTable).where(eq(messagesTable.id, id));

        if (message.length === 0) {
            throw new NotFoundException(`Message with id ${id} not found.`);
        }

        try {
            await db.delete(messagesTable).where(eq(messagesTable.id, id));
            return;
        } catch (error: Error | any) {
            if (error instanceof NotFoundException) throw error;
            throw new Error(`Could not delete message with id ${id}: ${error.message}`);
        }
    }
}