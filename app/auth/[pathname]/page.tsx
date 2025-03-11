import { AuthCard } from "@daveyplate/better-auth-ui"
import { authViewPaths } from "@daveyplate/better-auth-ui/server"
import Link from "next/link"

import { cn } from "@/lib/utils"

export function generateStaticParams() {
    return Object.values(authViewPaths).map((pathname) => ({ pathname }))
}

export default async function AuthPage({ params }: { params: Promise<{ pathname: string }> }) {
    const { pathname } = await params

    return (
        <main className="flex flex-col grow p-4 gap-3 items-center justify-center">
            <AuthCard pathname={pathname} />

            <p
                className={cn(
                    ["callback", "settings", "sign-out"].includes(pathname) && "hidden",
                    "text-muted-foreground text-xs"
                )}
            >
                Powered by{" "}
                <Link
                    className="underline text-warning"
                    href="https://better-auth.com"
                    target="_blank"
                >
                    better-auth.
                </Link>
            </p>
        </main>
    )
}
