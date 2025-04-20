import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@/database/db"
import { eq } from "drizzle-orm"
import { answersHistory } from "@/database/schema/stats"
import { questions, songs, quizCategories } from "@/database/schema/questions"
import { rounds } from "@/database/schema/stats"

import { HistoryClient } from "./history-client"

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

    // Get user's answer history with related information
    const userHistory = await db
        .select({
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

    return <HistoryClient 
        userHistory={userHistory} 
        categories={categories.map(c => ({ id: c.id, name: c.name }))} 
    />;
} 