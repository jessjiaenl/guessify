import Link from "next/link";
import { db } from "@/database/db";
import { quizCategories } from "@/database/schema/questions";

export default async function Home() {
  const categories = await db.select().from(quizCategories);

  const colors = [
    "bg-red-300 hover:bg-red-400",
    "bg-green-300 hover:bg-green-400",
    "bg-blue-300 hover:bg-blue-400",
  ];

  return (
    <div className="flex flex-col items-center justify-start pt-12 p-6 bg-[#faf8f6]">
      {/* Title */}
      <div className="text-center space-y-2 mb-10">
        <h1 className="mt-6 text-[60px] font-bold text-black">
          Guessify
        </h1>
        <p className="text-lg text-gray-600">Your music guessing challenge</p>
        <p className="text-md text-gray-500 mt-2">Choose a category to start 🎧</p>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((category, idx) => (
          <Link
            key={category.id}
            href={`/game?categoryId=${category.id}`}
            className={`flex h-60 items-center justify-between rounded-2xl p-6 ${colors[idx % colors.length]} transition-all duration-300 shadow-lg cursor-pointer transform hover:scale-[1.02] hover:shadow-2xl`}
          >
            {/* Left: Text */}
            <div className="flex-1 flex flex-col justify-center mr-6">
              <span className="text-2xl font-semibold text-black">{category.name}</span>
              {category.description && (
                <p className="text-sm text-gray-700 mt-2">{category.description}</p>
              )}
            </div>

            {/* Right: Image or Placeholder */}
            {category.imageUrl ? (
              <img
                src={category.imageUrl}
                alt={category.name}
                className="h-32 w-32 object-cover rounded-lg"
              />
            ) : (
              <div className="h-32 w-32 bg-gray-300 rounded-lg"></div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}