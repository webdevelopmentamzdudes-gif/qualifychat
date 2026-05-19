"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateAccountProfile(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const full_name = String(formData.get("full_name") ?? "");

  const { error } = await supabase.from("profiles").upsert(
    {
      user_id: user.id,
      full_name,
      email: user.email ?? "",
    },
    { onConflict: "user_id" }
  );

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/account");
}
