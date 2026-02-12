export default async (req) => {
  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return json(500, { ok: false, error: "Missing SUPABASE_URL or SUPABASE_ANON_KEY" });
    }

    const u = new URL(req.url);
    const recipeId = (u.searchParams.get("recipeId") || "community").trim();
    const limit = clampInt(u.searchParams.get("limit") || "50", 1, 200);

    const qs = new URLSearchParams();
    qs.set("select", "id,created_at,user_id,display_name,kind,recipe_id,title,body");
    qs.set("recipe_id", `eq.${recipeId}`);
    qs.set("order", "created_at.desc");
    qs.set("limit", String(limit));

    const endpoint = stripSlash(SUPABASE_URL) + "/rest/v1/recipe_posts?" + qs.toString();

    const r = await fetch(endpoint, {
      method: "GET",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: "Bearer " + SUPABASE_ANON_KEY
      }
    });

    const text = await r.text();
    if (!r.ok) return json(500, { ok: false, error: "Supabase read failed", detail: safeJson(text) });

    const rows = safeJson(text);
    return json(200, { ok: true, rows: Array.isArray(rows) ? rows : [] });
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
function clampInt(v, min, max) {
  const n = parseInt(v, 10);
  if (!Number.isFinite(n)) return min;
  if (n < min) return min;
  if (n > max) return max;
  return n;
}
function stripSlash(s) { return s.endsWith("/") ? s.slice(0, -1) : s; }
function safeJson(s) { try { return JSON.parse(s); } catch { return s; } }
