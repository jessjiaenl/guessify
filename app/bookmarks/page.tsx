import { auth } from "@/lib/auth"
import { headers } from "next/headers"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import { db } from "@/database/db"
import { eq } from "drizzle-orm"
import { bookmarks, questions, quizCategories } from "@/database/schema"
import { BookmarkTable } from "@/components/BookmarkTable"


export default async function BookmarksPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return null;
    }

    const user = session.user;

    // Get user's bookmarks with related question and category info
    const userBookmarks = await db
        .select({
            id: bookmarks.id,
            categoryName: quizCategories.name,
            questionText: questions.question,
        })
        .from(bookmarks)
        .leftJoin(questions, eq(bookmarks.questionId, questions.id))
        .leftJoin(quizCategories, eq(questions.categoryId, quizCategories.id))
        .where(eq(bookmarks.userId, user.id));

    return (
        <main className="min-h-screen p-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8 flex items-start justify-between">
                    <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={user.image || ""} />
                            <AvatarFallback className="bg-[#e8e4e0] text-gray-800">{user.name?.[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-2xl font-bold">{user.name}</h1>
                            <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <Button variant="outline" className="mt-2" asChild>
                                <Link href="/auth/sign-out">Sign out</Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <nav className="mb-8">
                    <ul className="flex gap-4 border-b">
                        <li>
                            <Link href="/profile" className="block px-4 py-2 text-muted-foreground hover:text-foreground">
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Link href="/bookmarks" className="block border-b-2 border-primary px-4 py-2 font-medium">
                                Bookmarks
                            </Link>
                        </li>
                        <li>
                            <Link href="/history" className="block px-4 py-2 text-muted-foreground hover:text-foreground">
                                History
                            </Link>
                        </li>
                    </ul>
                </nav>

                <BookmarkTable userBookmarks={userBookmarks}/>
            </div>
        </main>
    )
}