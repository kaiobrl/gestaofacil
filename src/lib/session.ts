import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import type { SessionUser } from "./types";
import { NextResponse } from "next/server";

export async function getSessionUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return null;
  }
  return session.user as SessionUser;
}

export async function requireSession() {
  const user = await getSessionUser();
  if (!user) {
    return { user: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { user, error: null };
}
