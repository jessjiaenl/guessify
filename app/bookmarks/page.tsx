import { auth } from "@/lib/auth"
import { headers } from "next/headers"
// import { revalidatePath } from "next/cache"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { TrashIcon } from "@radix-ui/react-icons"

import { db } from "@/database/db"
import { eq } from "drizzle-orm"
import { bookmarks, questions, quizCategories } from "@/database/schema"
import { Bookmark } from "@/database/schema"

// import { deleteBookmark } from "@/actions/bookmarks"
// import { useActionState, useOptimistic } from "react"
import { revalidatePath } from "next/cache"

// Server action to delete bookmark
async function deleteBookmark(id: Bookmark["id"]) {   
    "use server" 
    await db.delete(bookmarks).where(eq(bookmarks.id, id))
    revalidatePath('/bookmarks')
}

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

    // const [state, deleteBookmarkAction, isDeleting] = useActionState(deleteBookmark, null);

    return (
        <main className="min-h-screen p-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8 flex items-start justify-between">
                    <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={user.image || ""} />
                            <AvatarFallback>{user.name?.[0]?.toUpperCase()}</AvatarFallback>
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

                <div className="rounded-lg border">
                    <div className="grid grid-cols-[1fr_2fr_auto] gap-4 bg-muted p-4 font-medium">
                        <div>Category</div>
                        <div>Question</div>
                        <div></div>
                    </div>
                    
                    <div className="divide-y">
                        {userBookmarks.map((bookmark) => (
                            <div key={bookmark.id} className="grid grid-cols-[1fr_2fr_auto] gap-4 p-4">
                                <div className="text-sm">{bookmark.categoryName || 'Unknown Category'}</div>
                                <div className="text-sm">{bookmark.questionText || 'Unknown Question'}</div>
                                <form action={deleteBookmark.bind(null, bookmark.id)}>
                                    <Button 
                                        variant="ghost" 
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                        // type="submit"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        ))}
                        
                        {userBookmarks.length === 0 && (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                No bookmarks yet
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}