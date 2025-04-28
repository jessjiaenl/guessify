import { NextResponse } from "next/server";
import { db } from "@/database/db";
import { bookmarks } from "@/database/schema/bookmarks";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// Add a bookmark
export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { questionId } = await req.json();

  if (!questionId) {
    return NextResponse.json({ error: "Missing questionId" }, { status: 400 });
  }

  await db.insert(bookmarks).values({
    id: uuidv4(),
    userId: session.user.id,
    questionId: questionId,
  });

  return NextResponse.json({ success: true });
}

// Remove a bookmark
export async function DELETE(req: Request) {
    const session = await auth.api.getSession({ headers: req.headers });
  
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const { questionId } = await req.json();
  
    if (!questionId) {
      return NextResponse.json({ error: "Missing questionId" }, { status: 400 });
    }
  
    await db.delete(bookmarks).where(
      and(
        eq(bookmarks.userId, session.user.id),
        eq(bookmarks.questionId, questionId)
      )
    );
  
    return NextResponse.json({ success: true });
  }