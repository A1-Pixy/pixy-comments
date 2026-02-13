exports.handler = async function () {
  try {
    const url = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" }),
      };
    }

    const endpoint =
      url +
      "/rest/v1/recipe_posts" +
      "?select=id,created_at,display_name,recipe_id,title,body" +
      "&order=created_at.desc" +
      "&limit=50";

    const r = await fetch(endpoint, {
      headers: {
        apikey: serviceKey,
        Authorization: "Bearer " + serviceKey,
      },
    });

    if (!r.ok) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Supabase read failed" }),
      };
    }

    const items = await r.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      body: JSON.stringify({ items }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Server error" }),
    };
  }
};
