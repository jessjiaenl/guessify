import { NextResponse } from "next/server";
import { db } from "@/database/db";
import { bookmarks } from "@/database/schema/bookmarks";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

// Check if a question is bookmarked
export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session?.user) {
    return NextResponse.json({ isBookmarked: false });
  }

  const { searchParams } = new URL(req.url);
  const questionId = searchParams.get("questionId");

  if (!questionId) {
    return NextResponse.json({ error: "Missing questionId" }, { status: 400 });
  }

  const result = await db
    .select()
    .from(bookmarks)
    .where(
      and(
        eq(bookmarks.userId, session.user.id),
        eq(bookmarks.questionId, questionId)
      )
    );

  const isBookmarked = result.length > 0;

  return NextResponse.json({ isBookmarked });
}