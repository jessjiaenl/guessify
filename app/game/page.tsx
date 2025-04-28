import { db } from "@/database/db";
import { questions, quizCategories, songs } from "@/database/schema/questions";
import { eq } from "drizzle-orm";
import Link from "next/link";
import GameClient from "./game-client";

export default async function GamePage({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string }>;
}) {
  const { categoryId } = await searchParams;

  // If no categoryId
  if (!categoryId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#faf8f6]">
        <div className="w-full max-w-3xl bg-gray-100 rounded-2xl p-10 shadow-md text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">No Category Selected</h2>
          <p className="mb-6 text-xl text-gray-700">Please select a category to play the game.</p>
          <Link
            href="/"
            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-lg font-medium"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  try {
    const questionData = await db
      .select()
      .from(questions)
      .where(eq(questions.categoryId, categoryId))
      .leftJoin(songs, eq(questions.songId, songs.id));

    // Transform fetched data
    const transformedQuestions = questionData.map(q => ({
      id: q.questions.id,
      categoryId: q.questions.categoryId,
      question: q.questions.question,
      options: q.questions.options,
      answer: q.questions.answer,
      songId: q.questions.songId,
      songs: {
        id: q.songs?.id || "unknown",
        title: q.songs?.title || "Unknown",
        artist: q.songs?.artist || "Unknown",
        album: q.songs?.album || null,
        coverUrl: q.songs?.coverUrl || null,
        audioUrl: q.songs?.audioUrl || null
      }
    }));

    const categoryData = await db
      .select()
      .from(quizCategories)
      .where(eq(quizCategories.id, categoryId))
      .limit(1);

    const category = categoryData[0];

    // If categoryId not found in database
    if (!category) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#faf8f6]">
          <div className="w-full max-w-3xl bg-gray-100 rounded-2xl p-10 shadow-md text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Category Not Found</h2>
            <p className="mb-6 text-xl text-gray-700">The selected category does not exist.</p>
            <Link
              href="/"
              className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-lg font-medium"
            >
              Return Home
            </Link>
          </div>
        </div>
      );
    }

    return (
      <GameClient
        questions={transformedQuestions}
        category={category}
      />
    );
  } catch (error) {
    console.error("Error fetching game data:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#faf8f6]">
        <div className="w-full max-w-3xl bg-gray-100 rounded-2xl p-10 shadow-md text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Error Loading Game</h2>
          <p className="mb-6 text-xl text-gray-700">There was an error loading the game data. Please try again.</p>
          <Link
            href="/"
            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-lg font-medium"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }
}