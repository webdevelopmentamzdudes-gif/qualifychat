import { createAdminClient } from "@/lib/supabase/admin";

export async function fetchAdminOverview() {
  const admin = createAdminClient();

  const [
    businessesRes,
    leadsRes,
    conversationsRes,
    qualifiedRes,
    profilesRes,
    recentBusinessesRes,
    recentLeadsRes,
  ] = await Promise.all([
    admin.from("businesses").select("id", { count: "exact", head: true }),
    admin.from("leads").select("id", { count: "exact", head: true }),
    admin.from("conversations").select("id", { count: "exact", head: true }),
    admin
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("lead_status", "QUALIFIED"),
    admin.from("profiles").select("id", { count: "exact", head: true }),
    admin
      .from("businesses")
      .select("id, business_name, created_at, user_id")
      .order("created_at", { ascending: false })
      .limit(8),
    admin
      .from("leads")
      .select(
        "id, name, email, phone, lead_status, created_at, business_id, businesses(business_name)"
      )
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return {
    counts: {
      businesses: businessesRes.count ?? 0,
      leads: leadsRes.count ?? 0,
      conversations: conversationsRes.count ?? 0,
      qualifiedLeads: qualifiedRes.count ?? 0,
      users: profilesRes.count ?? 0,
    },
    recentBusinesses: recentBusinessesRes.data ?? [],
    recentLeads: recentLeadsRes.data ?? [],
  };
}

export async function fetchAdminBusinesses() {
  const admin = createAdminClient();

  const { data: businesses, error } = await admin
    .from("businesses")
    .select(
      "id, business_name, industry, contact_email, website_url, created_at, updated_at, user_id"
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  const userIds = Array.from(
    new Set((businesses ?? []).map((b) => b.user_id))
  );
  const emailByUser = new Map<string, string>();

  await Promise.all(
    userIds.map(async (userId) => {
      const { data } = await admin.auth.admin.getUserById(userId);
      if (data.user?.email) {
        emailByUser.set(userId, data.user.email);
      }
    })
  );

  const withCounts = await Promise.all(
    (businesses ?? []).map(async (b) => {
      const { count } = await admin
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("business_id", b.id);
      return {
        ...b,
        ownerEmail: emailByUser.get(b.user_id) ?? "—",
        leadCount: count ?? 0,
      };
    })
  );

  return withCounts;
}

export async function fetchAdminLeads() {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("leads")
    .select(
      "id, name, email, phone, service_required, lead_status, created_at, business_id, businesses(business_name)"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw error;
  return data ?? [];
}

export async function fetchAdminUsers() {
  const admin = createAdminClient();

  const { data: profiles, error } = await admin
    .from("profiles")
    .select("id, user_id, full_name, email, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;

  const withBusinesses = await Promise.all(
    (profiles ?? []).map(async (p) => {
      const { data: businesses } = await admin
        .from("businesses")
        .select("id, business_name")
        .eq("user_id", p.user_id);

      let email = p.email?.trim() || "";
      if (!email) {
        const { data: authData } = await admin.auth.admin.getUserById(p.user_id);
        email = authData.user?.email ?? "—";
      }

      return {
        ...p,
        email,
        businesses: businesses ?? [],
      };
    })
  );

  return withBusinesses;
}
