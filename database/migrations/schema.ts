import { pgTable, text, timestamp, unique, boolean, foreignKey, uuid, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const verifications = pgTable("verifications", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const users = pgTable("users", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").notNull(),
	image: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const accounts = pgTable("accounts", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "accounts_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const sessions = pgTable("sessions", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "sessions_user_id_users_id_fk"
		}).onDelete("cascade"),
	unique("sessions_token_unique").on(table.token),
]);

export const bookmarks = pgTable("bookmarks", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	questionId: uuid("question_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "bookmarks_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.questionId],
			foreignColumns: [questions.id],
			name: "bookmarks_question_id_questions_id_fk"
		}),
]);

export const questions = pgTable("questions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	categoryId: uuid("category_id").notNull(),
	question: text().notNull(),
	options: text().array().notNull(),
	answer: text().notNull(),
	songId: uuid("song_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [quizCategories.id],
			name: "questions_category_id_quiz_categories_id_fk"
		}),
	foreignKey({
			columns: [table.songId],
			foreignColumns: [songs.id],
			name: "questions_song_id_songs_id_fk"
		}),
]);

export const quizCategories = pgTable("quiz_categories", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	imageUrl: text("image_url"),
});

export const songs = pgTable("songs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	artist: text().notNull(),
	album: text(),
	coverUrl: text("cover_url"),
	audioUrl: text("audio_url"),
});

export const rounds = pgTable("rounds", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	categoryId: uuid("category_id").notNull(),
	score: integer().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "rounds_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [quizCategories.id],
			name: "rounds_category_id_quiz_categories_id_fk"
		}),
]);

export const answerHistory = pgTable("answer_history", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	roundId: uuid("round_id").notNull(),
	questionId: uuid("question_id").notNull(),
	selectedAnswer: text("selected_answer").notNull(),
	isCorrect: boolean("is_correct").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.roundId],
			foreignColumns: [rounds.id],
			name: "answer_history_round_id_rounds_id_fk"
		}),
	foreignKey({
			columns: [table.questionId],
			foreignColumns: [questions.id],
			name: "answer_history_question_id_questions_id_fk"
		}),
]);
