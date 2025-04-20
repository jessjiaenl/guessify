import { auth } from "@/lib/auth"
import { headers } from "next/headers"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import { db } from "@/database/db"
import { eq } from "drizzle-orm"
import { answersHistory } from "@/database/schema/stats"
import { questions, songs, quizCategories } from "@/database/schema/questions"
import { rounds } from "@/database/schema/stats"

import { HistoryClient } from "./history-table"

export default async function HistoryPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return null;
    }

    const user = session.user;

    // Get all categories
    const categories = await db.query.quizCategories.findMany({
        columns: {
            id: true,
            name: true,
        },
    });

    // Join the 4 tables: categories, songs, question, answer
    const userHistory = await db
        .select({ // columns
            categoryName: quizCategories.name,
            songTitle: songs.title,
            questionText: questions.question,
            selectedAnswer: answersHistory.selectedAnswer,
        })
        .from(answersHistory)
        .leftJoin(questions, eq(answersHistory.questionId, questions.id))
        .leftJoin(quizCategories, eq(questions.categoryId, quizCategories.id))
        .leftJoin(songs, eq(questions.songId, songs.id))
        .leftJoin(rounds, eq(answersHistory.roundId, rounds.id))
        .where(eq(rounds.userId, user.id))
        .orderBy(quizCategories.name);

    return (
        <main className="min-h-screen p-8">
            <div className="mx-auto max-w-6xl">
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
                            <Link href="/bookmarks" className="block px-4 py-2 text-muted-foreground hover:text-foreground">
                                Bookmarks
                            </Link>
                        </li>
                        <li>
                            <Link href="/history" className="block border-b-2 border-primary px-4 py-2 font-medium">
                                History
                            </Link>
                        </li>
                    </ul>
                </nav>

                <HistoryClient 
                    userHistory={userHistory} 
                    categories={categories.map(c => ({ id: c.id, name: c.name }))} />
            </div>
        </main>
    );
} 