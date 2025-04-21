// import { pgTable, text, uuid, primaryKey } from "drizzle-orm/pg-core";

// import { users } from "./auth";

// export const bookmarks = pgTable("bookmarks", {
//     userId: text("user_id").references(() => users.id).notNull(),
//     songTitle: text("song_title").notNull(),
//     }, (table) => ({ pk: primaryKey({ columns: [table.userId, table.songTitle] }),}));



import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod"
import { z } from "zod"

import { users } from "./auth";
import { questions } from "./questions";

export const bookmarks = pgTable("bookmarks", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").references(() => users.id).notNull(),
    questionId: uuid("question_id").references(() => questions.id).notNull(),
});

export const selectBookmarkSchema = createSelectSchema(bookmarks);
export type Bookmark = z.infer<typeof selectBookmarkSchema>;