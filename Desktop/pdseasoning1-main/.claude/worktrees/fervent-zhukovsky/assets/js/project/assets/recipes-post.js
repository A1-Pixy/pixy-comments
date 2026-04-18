export default async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });

  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return json(500, { ok: false, error: "Missing SUPABASE_URL or SUPABASE_ANON_KEY" });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") return json(400, { ok: false, error: "Invalid JSON body" });

    const accessToken = String(body.accessToken || "").trim();
    const displayName = String(body.displayName || "").trim();
    const kind = String(body.kind || "comment").trim();
    const recipeId = String(body.recipeId || "community").trim();
    const title = body.title === null || body.title === undefined ? "" : String(body.title).trim();
    const textBody = String(body.body || "").trim();

    if (!accessToken) return json(401, { ok: false, error: "Missing accessToken" });
    if (!displayName) return json(400, { ok: false, error: "Missing displayName" });
    if (!textBody) return json(400, { ok: false, error: "Missing body" });
    if (kind === "recipe" && !title) return json(400, { ok: false, error: "Missing title for recipe" });

    const authRes = await fetch(stripSlash(SUPABASE_URL) + "/auth/v1/user", {
      method: "GET",
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: "Bearer " + accessToken }
    });

    const authText = await authRes.text();
    if (!authRes.ok) return json(401, { ok: false, error: "Invalid or expired session", detail: safeJson(authText) });

    const user = safeJson(authText);
    const userId = user && user.id ? String(user.id) : "";
    if (!userId) return json(401, { ok: false, error: "Could not confirm user id" });

    const insertPayload = {
      user_id: userId,
      display_name: displayName,
      kind: kind === "recipe" ? "recipe" : "comment",
      recipe_id: recipeId,
      title: kind === "recipe" ? title : null,
      body: textBody
    };

    const insertRes = await fetch(stripSlash(SUPABASE_URL) + "/rest/v1/recipe_posts", {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: "Bearer " + accessToken,
        "content-type": "application/json",
        Prefer: "return=representation"
      },
      body: JSON.stringify(insertPayload)
    });

    const insertText = await insertRes.text();
    if (!insertRes.ok) return json(500, { ok: false, error: "Supabase insert failed", detail: safeJson(insertText) });

    return json(200, { ok: true, saved: safeJson(insertText) });
  } catch (e) {
    return json(500, { ok: false, error: "Unhandled error", detail: String(e?.message || e) });
  }
};

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" }
  });
}
function stripSlash(s) { return s.endsWith("/") ? s.slice(0, -1) : s; }
function safeJson(s) { try { return JSON.parse(s); } catch { return null; } }
