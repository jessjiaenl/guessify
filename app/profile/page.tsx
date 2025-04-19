import { auth } from "@/lib/auth"
import { headers } from "next/headers"; 

import { ProfileView } from "./view"

export default async function ProfilePage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return null;
    }

    return <ProfileView />
}