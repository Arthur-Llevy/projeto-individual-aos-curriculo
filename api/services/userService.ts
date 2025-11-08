import { db } from "../database/connection.js"
import { usersTable } from "../database/schema.js"
import { eq } from "drizzle-orm";
import { NotFoundException } from "../exceptions/notFoundException.js";
import { EmptyFieldsException } from "../exceptions/emptyFieldsException.js";

export const userService = {
    getAllUsers: async () => {
        try {
            const users = await db.select().from(usersTable);
            return users;

        } catch (error: Error | any) {
            throw new Error(`Could not fetch users from database: ${error.message}`);
        }
    },

    getUserById: async (id: number) => {
        try {
            const user = await db.select().from(usersTable).where(eq(usersTable.id, id));

            if (user.length === 0) {
                throw new NotFoundException(`User with id ${id} not found.`);
            }
            
            return user;
        } catch (error: Error | any) {
            if (error instanceof NotFoundException) throw error;
            throw new Error(`Could not fetch user with id ${id}: ${error.message}`);
        }
    },

    createNewUser: async (
        fullName: string, 
        birthDate: string,
        shortDescription: string,
        address: string,
    ) => {
        try {
            if (!fullName || !birthDate || !shortDescription || !address) {
                let emptyFields = [];
                if (!fullName) emptyFields.push("fullName");
                if (!birthDate) emptyFields.push("birthDate");
                if (!shortDescription) emptyFields.push("shortDescription");
                if (!address) emptyFields.push("address");

                throw new EmptyFieldsException(`The following fields are required and cannot be empty: ${emptyFields.join(", ")}`);
            }

            const userCreated = await db.insert(usersTable).values({
                full_name: fullName,
                birth_date: birthDate,
                short_description: shortDescription,
                address,
                created_at: new Date(),
                updated_at: new Date(),
            }).returning();

            return userCreated;
        } catch (error: Error | any) {
            if (error instanceof EmptyFieldsException) throw error;
            throw new Error(`Could not create new user: ${error.message}`);
        }
    },

    updateUserById: async (
        id: number,
        fullName: string,
        birthDate: string,
        shortDescription: string,
        address: string,
    ) => {
        const user = await db.select().from(usersTable).where(eq(usersTable.id, id));

        if (user.length === 0) {
            throw new NotFoundException(`User with id ${id} not found.`);
        }

        try {
            await db.update(usersTable).set({
                full_name: fullName,
                birth_date: birthDate,
                short_description: shortDescription,
                address,
                updated_at: new Date(),
            }).where(eq(usersTable.id, id));

            const updatedUser = await db.select().from(usersTable).where(eq(usersTable.id, id));

            return updatedUser;
        } catch (error: Error | any) {
            if (error instanceof NotFoundException) throw error;
            throw new Error(`Could not update user with id ${id}: ${error.message}`);
        }
    },

    deleteUserById: async (id: number) => {
        const user = await db.select().from(usersTable).where(eq(usersTable.id, id));

        if (user.length === 0) {
            throw new NotFoundException(`User with id ${id} not found.`);
        }

        try {
            await db.delete(usersTable).where(eq(usersTable.id, id));
            return;
        } catch (error: Error | any) {
            if (error instanceof NotFoundException) throw error;
            throw new Error(`Could not delete user with id ${id}: ${error.message}`);
        }
    }
}