"use server";

import { freestyle } from "@/lib/freestyle";
import { createSupabaseServerClient } from "@/libs/supabase/supabase-server-client";
import { appUsers, db } from "@/db/schema";
import { eq } from "drizzle-orm";

// Supabase-based user helper
export async function getUser(): Promise<{ userId: string; freestyleIdentity: string }> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("User not found");
  }

  // Try to reuse an existing freestyle identity from any prior app association
  const existing = (
    await db
      .select({ freestyleIdentity: appUsers.freestyleIdentity })
      .from(appUsers)
      .where(eq(appUsers.userId, user.id))
      .limit(1)
  ).at(0);

  let freestyleIdentity: string | undefined = existing?.freestyleIdentity || undefined;
  if (!freestyleIdentity) {
    const gitIdentity = await freestyle.createGitIdentity();
    freestyleIdentity = gitIdentity.id;
  }

  return { userId: user.id, freestyleIdentity: freestyleIdentity! };
}
