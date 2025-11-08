import {
  pgTable,
  integer,
  varchar,
  text,
  timestamp,
  date,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";


export const usersTable = pgTable("users", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  full_name: varchar("full_name").notNull(),
  birth_date: date("birth_date").notNull(),
  short_description: varchar("short_description", { length: 500 }).notNull(),
  address: varchar("address").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").notNull(),
});

export const postsTable = pgTable("posts", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  user_id: integer("user_id").notNull().references(() => usersTable.id, {
    onDelete: "cascade",
  }),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").notNull(),
});

export const messagesTable = pgTable("messages", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  content: text("content").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").notNull(),
  to_user: integer("to_user").notNull().references(() => usersTable.id, {
    onDelete: "cascade",
  }),
  from_user: integer("from_user").notNull().references(() => usersTable.id, {
    onDelete: "cascade",
  }),
});

export const skillsTable = pgTable("skills", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  user_id: integer("user_id").notNull().references(() => usersTable.id, {
    onDelete: "cascade",
  }),
  content: text("content").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").notNull(),
});

export const academicTrainingsTable = pgTable("academic_trainings", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  user_id: integer("user_id").notNull().references(() => usersTable.id, {
    onDelete: "cascade",
  }),
  title: varchar("title").notNull(),
  institution: varchar("institution").notNull(),
  completed: boolean("completed").notNull(),
  start_year: date("start_year").notNull(),
  end_year: date("end_year"),
  certificate_url: varchar("certificate_url"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").notNull(),
});


export const userRelations = relations(usersTable, ({ many }) => ({
  posts: many(postsTable),
  skills: many(skillsTable),
  academicTrainings: many(academicTrainingsTable),
  sentMessages: many(messagesTable, { relationName: "from_user" }),
  receivedMessages: many(messagesTable, { relationName: "to_user" }),
}));

export const postsRelations = relations(postsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [postsTable.user_id],
    references: [usersTable.id],
  }),
}));

export const messagesRelations = relations(messagesTable, ({ one }) => ({
  toUser: one(usersTable, {
    fields: [messagesTable.to_user],
    references: [usersTable.id],
    relationName: "to_user",
  }),
  fromUser: one(usersTable, {
    fields: [messagesTable.from_user],
    references: [usersTable.id],
    relationName: "from_user",
  }),
}));

export const skillsRelations = relations(skillsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [skillsTable.user_id],
    references: [usersTable.id],
  }),
}));

export const academicTrainingsRelations = relations(academicTrainingsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [academicTrainingsTable.user_id],
    references: [usersTable.id],
  }),
}));


export const schema = {
  usersTable,
  postsTable,
  messagesTable,
  skillsTable,
  academicTrainingsTable,

  userRelations,
  postsRelations,
  messagesRelations,
  skillsRelations,
  academicTrainingsRelations,
};