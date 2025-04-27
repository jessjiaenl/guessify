import { NextResponse } from "next/server";
import { db } from "@/database/db";
import { rounds, answersHistory } from "@/database/schema/stats";
import { auth } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { categoryId, score, answers } = body;

    if (!categoryId || typeof score !== "number" || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Insert the score into rounds
    const [newRound] = await db
      .insert(rounds)
      .values({
        id: uuidv4(), // generate a new UUID
        userId: session.user.id,
        categoryId: categoryId,
        score: score,
      })
      .returning();

    // Insert each answer into answersHistory
    const answerRecords = answers.map((answer: any) => ({
      id: uuidv4(),
      roundId: newRound.id,
      questionId: answer.questionId,
      selectedAnswer: answer.selectedAnswer,
      isCorrect: answer.isCorrect,
    }));

    await db.insert(answersHistory).values(answerRecords);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving round:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}