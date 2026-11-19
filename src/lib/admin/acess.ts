import "server-only";

import { headers } from "next/headers";
import { auth } from "@/src/lib/auth";

export async function getAdminAccess() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const adminIds = (process.env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const isAdmin = !!session && adminIds.includes(session.user.id);

  console.log("[ADMIN DEBUG]", {
    hasSession: !!session,
    sessionUserId: session?.user.id ?? null,
    adminIdsConfigured: adminIds.length,
    userIdMatches: session ? adminIds.includes(session.user.id) : false,
    isAdmin,
  });

  return { session, isAdmin };
}
