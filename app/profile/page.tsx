import { auth } from "@/lib/auth"
import { headers } from "next/headers"; 

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { db } from "@/database/db"
import { eq } from "drizzle-orm"
import { quizCategories } from "@/database/schema/questions"
import { rounds } from "@/database/schema/stats"

interface CategoryScore {
    id: string
    name: string
    score: number | null // null if user hasn't played any of this category's game
    maxScore: number
    imageUrl: string | null
}

export default async function ProfilePage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return null;
    }

    const user = session.user;

    // Get all categories
    const allCategories = await db.query.quizCategories.findMany();

    // Get user's game rounds
    const userRounds = await db.query.rounds.findMany({
        where: eq(rounds.userId, user.id)
    });

    // Calculate max score per category
    const categoryScores: CategoryScore[] = allCategories.map(category => {
        const categoryRounds = userRounds.filter(round => round.categoryId === category.id);
        const maxScore = categoryRounds.length > 0 
            ? Math.max(...categoryRounds.map(round => round.score))
            : null;

        return {
            id: category.id,
            name: category.name,
            score: maxScore,
            maxScore: 10, // Assuming each round has 10 questions
            imageUrl: category.imageUrl
        };
    });

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
                            <Link href="/profile" className="block border-b-2 border-primary px-4 py-2 font-medium">
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Link href="/bookmarks" className="block px-4 py-2 text-muted-foreground hover:text-foreground">
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

                <div className="space-y-6">
                    {categoryScores.map((category) => (
                        <div
                            key={category.id}
                            className="flex items-center gap-4 rounded-lg bg-card p-4 shadow-sm"
                        >
                            <div className="flex h-16 w-16 items-center justify-center rounded-md bg-white p-2">
                                {category.imageUrl ? (
                                    <img
                                        src={category.imageUrl}
                                        alt={category.name}
                                        className="h-12 w-12 object-contain"
                                    />
                                ) : (
                                    <div className="h-12 w-12 rounded-full bg-gray-200" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium">{category.name}</h3>
                                    <p className="text-sm">
                                        Score: {category.score !== null ? `${category.score}/${category.maxScore}` : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}