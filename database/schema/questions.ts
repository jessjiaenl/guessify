import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const songs = pgTable("songs", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    artist: text("artist").notNull(),
    album: text("album"),
    coverUrl: text("cover_url"),     // image or album cover
    audioUrl: text("audio_url"),     // full intro, bassline, drum loop, etc.
  });

export const quizCategories = pgTable("quiz_categories", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    imageUrl: text("image_url"),
    });

export const questions = pgTable("questions", {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id").references(() => quizCategories.id).notNull(),
    question: text("question").notNull(),  
    options: text("options").array().notNull(), // multiple choices options
    answer: text("answer").notNull(), // correct answer in text
    songId: uuid("song_id").references(() => songs.id).notNull(),

    // type: text("type").$type<"lyrics" | "audio">().notNull(),
    // audioURL: text("media_url"),
    // imageURL: text("media_url"),
    });