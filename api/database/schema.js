import { uuid, varchar, pgTable, date, text, timestamp } from "drizzle-orm/pg-core"; 

export const usersTable = pgTable("users", {
    id: uuid().primaryKey().generatedAlwaysAs(),
    full_name: varchar().notNull(),
    birth_date: date().notNull(),
    short_description: text({ length: 500 }).notNull(),
    address: varchar().notNull(),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().notNull(),
});

export const postsTable = pgTable("posts", {
    id: uuid().primaryKey().generatedAlwaysAs(),
    user_id: uuid().notNull().references(() => usersTable.id),
    title: varchar().notNull(),
    content: text().notNull(),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().notNull()
});