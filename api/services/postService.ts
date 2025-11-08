import { db } from "../database/connection.js"
import { postsTable } from "../database/schema.js"
import { eq } from "drizzle-orm";
import { NotFoundException } from "../exceptions/notFoundException.js";
import { EmptyFieldsException } from "../exceptions/emptyFieldsException.js";

export const postService = {
    getAllPosts: async () => {
        try {
            const posts = await db.select().from(postsTable);
            return posts;

        } catch (error: Error | any) {
            throw new Error(`Could not fetch posts from database: ${error.message}`);
        }
    },

    getPostById: async (id: number) => {
        try {
            const post = await db.select().from(postsTable).where(eq(postsTable.id, id));

            if (post.length === 0) {
                throw new NotFoundException(`Post with id ${id} not found.`);
            }
            
            return post;
        } catch (error: Error | any) {
            if (error instanceof NotFoundException) throw error;
            throw new Error(`Could not fetch post with id ${id}: ${error.message}`);
        }
    },

    createNewPost: async (
        userId: number, 
        title: string,
        content: string,
    ) => {
        try {
            if (!userId || !title || !content) {
                let emptyFields = [];
                if (!userId) emptyFields.push("userId");
                if (!title) emptyFields.push("title");
                if (!content) emptyFields.push("content");

                throw new EmptyFieldsException(`The following fields are required and cannot be empty: ${emptyFields.join(", ")}`);
            }

            const psotCreated = await db.insert(postsTable).values({
                user_id: userId,
                title: title,
                content: content,
                created_at: new Date(),
                updated_at: new Date(),
            }).returning();

            return psotCreated;
        } catch (error: Error | any) {
            if (error instanceof EmptyFieldsException) throw error;
            throw new Error(`Could not create new post: ${error.message}`);
        }
    },

    updatePostBydId: async (
        id: number,
        userId: number, 
        title: string,
        content: string,
    ) => {
        const post = await db.select().from(postsTable).where(eq(postsTable.id, id));

        if (post.length === 0) {
            throw new NotFoundException(`Post with id ${id} not found.`);
        }

        try {
            await db.update(postsTable).set({
                user_id: userId,
                title: title,
                content: content,
                updated_at: new Date(),
            }).where(eq(postsTable.id, id));

            const postUpdated = await db.select().from(postsTable).where(eq(postsTable.id, id));

            return postUpdated;
        } catch (error: Error | any) {
            if (error instanceof NotFoundException) throw error;
            throw new Error(`Could not update post with id ${id}: ${error.message}`);
        }
    },

    deletePostById: async (id: number) => {
        const post = await db.select().from(postsTable).where(eq(postsTable.id, id));

        if (post.length === 0) {
            throw new NotFoundException(`Post with id ${id} not found.`);
        }

        try {
            await db.delete(postsTable).where(eq(postsTable.id, id));
            return;
        } catch (error: Error | any) {
            if (error instanceof NotFoundException) throw error;
            throw new Error(`Could not delete post with id ${id}: ${error.message}`);
        }
    }
}