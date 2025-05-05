"use client"

import Link from "next/link"
import { UserButton } from "@daveyplate/better-auth-ui"
import { Button } from "./ui/button"
import { AdminNavEntry } from "./AdminNavEntry"
import { UserIcon } from "lucide-react"

export function Header() {
    return (
        <header className="sticky top-0 z-50 px-4 py-3 border-b bg-background/60 backdrop-blur">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2">
                        Guessify
                    </Link>
                    <nav className="flex items-center gap-2">
                        {/* <Link href="/game">
                            <Button variant="ghost">Game</Button>
                        </Link>
                        <Link href="/leaderboard">
                            <Button variant="ghost">Leaderboard</Button>
                        </Link> */}
                        {/* <AdminNavEntry /> */}
                    </nav>
                </div>

                <UserButton
                    additionalLinks={[
                        {
                            href: "/profile",
                            label: "Profile",
                            icon: <UserIcon />,
                            signedIn: true,
                        },
                    ]}
                />
            </div>
        </header>
    )
}
