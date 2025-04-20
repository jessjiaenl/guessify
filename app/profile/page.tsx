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
    score: number
    maxScore: number
    imageUrl: string
}
const mockCategories: CategoryScore[] = [
    {
        id: "1",
        name: "Category 1",
        score: 10,
        maxScore: 10,
        imageUrl: "/category1.png"
    },
    {
        id: "2",
        name: "Category 2",
        score: 10,
        maxScore: 10,
        imageUrl: "/category2.png"
    },
    {
        id: "3",
        name: "Category 3",
        score: 10,
        maxScore: 10,
        imageUrl: "/category3.png"
    }
]

export default async function ProfilePage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return null;
    }

    const user = session.user;

    // query categories and category scores from db
    // const userRounds = await db.query.rounds.findMany({
    //     where: eq(rounds.userId, user.id)
    // })

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
                    {mockCategories.map((category) => (
                        <div
                            key={category.id}
                            className="flex items-center gap-4 rounded-lg bg-card p-4 shadow-sm"
                        >
                            <div className="flex h-16 w-16 items-center justify-center rounded-md bg-white p-2">
                                <img
                                    src={category.imageUrl}
                                    alt={category.name}
                                    className="h-12 w-12 object-contain"
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium">{category.name}</h3>
                                    <p className="text-sm">
                                        Score: {category.score}/{category.maxScore}
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