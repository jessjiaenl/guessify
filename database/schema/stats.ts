import {
    pgTable,
    text,
    timestamp,
    uuid,
    integer,
    boolean,
    } from "drizzle-orm/pg-core";

import { users } from "./auth";
import { quizCategories } from "./questions";
import { questions } from "./questions";

// each row corresponds to a round of N questions
export const rounds = pgTable("rounds", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").references(() => users.id).notNull(),
    categoryId: uuid("category_id").references(() => quizCategories.id).notNull(),
    score: integer("score").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    });

// each row is a question and answer pair in history, get corresponding round/game by roundId
export const answersHistory = pgTable("answer_history", {
    id: uuid("id").primaryKey().defaultRandom(),
    roundId: uuid("round_id").references(() => rounds.id).notNull(),
    questionId: uuid("question_id").references(() => questions.id).notNull(),
    selectedAnswer: text("selected_answer").notNull(),
    isCorrect: boolean("is_correct").notNull(),
    });