import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getBusinessForUser } from "@/lib/knowledge/get-user-business";

export const runtime = "nodejs";

/** List knowledge documents for the logged-in user's business */
export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const business = await getBusinessForUser(supabase, user.id);
  if (!business) {
    return NextResponse.json({ documents: [] });
  }

  const { data, error } = await supabase
    .from("knowledge_documents")
    .select(
      "id,file_name,mime_type,file_size_bytes,chunk_count,status,error_message,is_enabled,created_at,updated_at"
    )
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ documents: data ?? [], businessId: business.id });
}
