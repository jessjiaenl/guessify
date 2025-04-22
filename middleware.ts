
import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

const loggedinRoutes = [
    "/profile",
    "/leaderboard",
    "/bookmarks",
    "/history"
]

export async function middleware(request: NextRequest) {
    /* Implement a redirecting middleware YOUR CODE HERE */
    const path = request.nextUrl.pathname;
    const isLoggedinRoute = loggedinRoutes.includes(path);

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // not logged in but trying to access a page that needs to log in
    if (!session && isLoggedinRoute) {
        return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    return NextResponse.next()
}

export const config = {
    runtime: "nodejs",
    matcher: ["/profile", "/leaderboard", "/bookmarks", "/history"]
}