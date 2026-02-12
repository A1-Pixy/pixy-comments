const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export default async (req) => {
  if (req.method !== "POST") {
    return json(405, { ok: false, error: "Method not allowed" });
  }

  try {
    const { accessToken, displayName, kind, recipeId, title, body } = await req.json();

    if (!accessToken) return json(401, { ok: false, error: "Missing access token" });
    if (!displayName || !body) return json(400, { ok: false, error: "Missing fields" });

    const insertPayload = {
      display_name: displayName,
      kind,
      recipe_id: recipeId,
      title,
      body
    };

    const insertRes = await fetch(
      `${SUPABASE_URL}/rest/v1/recipe_posts`,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${accessToken}`,
          "content-type": "application/json",
          Prefer: "return=representation"
        },
        body: JSON.stringify(insertPayload)
      }
    );

    const text = await insertRes.text();

    if (!insertRes.ok) {
      return json(500, { ok: false, error: "Insert failed", detail: text });
    }

    return json(200, { ok: true });

  } catch (e) {
    return json(500, { ok: false, error: String(e.message || e) });
  }
};

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store"
    }
  });
}
