import { relations } from "drizzle-orm/relations";
import { users, accounts, sessions, bookmarks, questions, quizCategories, songs, rounds, answerHistory } from "./schema";

export const accountsRelations = relations(accounts, ({one}) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	accounts: many(accounts),
	sessions: many(sessions),
	bookmarks: many(bookmarks),
	rounds: many(rounds),
}));

export const sessionsRelations = relations(sessions, ({one}) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
}));

export const bookmarksRelations = relations(bookmarks, ({one}) => ({
	user: one(users, {
		fields: [bookmarks.userId],
		references: [users.id]
	}),
	question: one(questions, {
		fields: [bookmarks.questionId],
		references: [questions.id]
	}),
}));

export const questionsRelations = relations(questions, ({one, many}) => ({
	bookmarks: many(bookmarks),
	quizCategory: one(quizCategories, {
		fields: [questions.categoryId],
		references: [quizCategories.id]
	}),
	song: one(songs, {
		fields: [questions.songId],
		references: [songs.id]
	}),
	answerHistories: many(answerHistory),
}));

export const quizCategoriesRelations = relations(quizCategories, ({many}) => ({
	questions: many(questions),
	rounds: many(rounds),
}));

export const songsRelations = relations(songs, ({many}) => ({
	questions: many(questions),
}));

export const roundsRelations = relations(rounds, ({one, many}) => ({
	user: one(users, {
		fields: [rounds.userId],
		references: [users.id]
	}),
	quizCategory: one(quizCategories, {
		fields: [rounds.categoryId],
		references: [quizCategories.id]
	}),
	answerHistories: many(answerHistory),
}));

export const answerHistoryRelations = relations(answerHistory, ({one}) => ({
	round: one(rounds, {
		fields: [answerHistory.roundId],
		references: [rounds.id]
	}),
	question: one(questions, {
		fields: [answerHistory.questionId],
		references: [questions.id]
	}),
}));