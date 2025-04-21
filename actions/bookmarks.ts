"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/database/db"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

import { bookmarks, Bookmark } from "@/database/schema"

export async function deleteBookmark(previousState: any, formData: FormData) {   
    // Check that the user is authenticated
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return {
            errors: {
                user: "User not authenticated"
            }
        }
    }

    const id = formData.get("id") as Bookmark["id"];
    await db.delete(bookmarks).where(eq(bookmarks.id, id));

    revalidatePath('/bookmarks')
}