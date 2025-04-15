import { pgTable, text, uuid, primaryKey } from "drizzle-orm/pg-core";

import { users } from "./auth";

export const bookmarks = pgTable("bookmarks", {
    userId: uuid("user_id").references(() => users.id).notNull(),
    songTitle: text("song_title").notNull(),
    }, (table) => ({ pk: primaryKey({ columns: [table.userId, table.songTitle] }),}));