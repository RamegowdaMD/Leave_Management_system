'use server'

import { cookies } from "next/headers"

export async function getUserEmail() {
    const cookieStore = await cookies()
    return cookieStore.get('user_email')?.value || null
}
