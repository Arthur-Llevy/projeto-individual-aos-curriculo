import { integer, varchar, pgTable, date, text, timestamp, boolean } from "drizzle-orm/pg-core"; 
import { relations } from "drizzle-orm";

export const usersTable = pgTable("users", {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
    full_name: varchar().notNull(),
    birth_date: date().notNull(),
    short_description: varchar({ length: 500 }).notNull(),
    address: varchar().notNull(),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().notNull(),
});

export const postsTable = pgTable("posts", {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
    user_id: integer().notNull().references(() => usersTable.id),
    title: varchar().notNull(),
    content: text().notNull(),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().notNull()
});

export const messagesTable = pgTable("messages", {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
    content: text().notNull(),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().notNull(),
    to_user: integer().notNull().references(() => usersTable.id),
    from_user: integer().notNull().references(() => usersTable.id),
});

export const skillsTable = pgTable("skills", {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
    user_id: integer().notNull().references(() => usersTable.id),
    content: text().notNull(),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().notNull()
});

export const academicTrainingsTable = pgTable("academic_trainings", {
    id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
    user_id: integer().notNull().references(() => usersTable.id),
    title: varchar().notNull(),
    institution: varchar().notNull(),
    completed: boolean().notNull(),
    start_year: date().notNull(),
    end_year: date(),
    certificate_url: varchar(),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().notNull()
});
    

export const userRelations = relations(usersTable, ({ many }) => ({
    posts: many(postsTable), 
}));

export const postsRelations = relations(postsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [postsTable.user_id],
        references: [usersTable.id]
    })
}))

export const messagesRelations = relations(messagesTable, ({ one }) => ({
    toUser: one(usersTable, {
        fields: [messagesTable.to_user],
        references: [usersTable.id]
    }),

    fromUser: one(usersTable, {
        fields: [messagesTable.from_user],
        references: [usersTable.id]
    })
}));

export const skillsRelations = relations(skillsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [skillsTable.user_id],
        references: [usersTable.id]
    })
}))

export const academicTrainingsRelations = relations(academicTrainingsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [academicTrainingsTable.user_id],
        references: [usersTable.id]
    })
}))