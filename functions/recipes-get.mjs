import { createClient } from "@supabase/supabase-js";

export async function handler(event) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ ok: false, error: "Method Not Allowed" })
    };
  }

  if (!process.env.SUPABASE_URL) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ ok: false, error: "Missing SUPABASE_URL env var. Set it in Netlify site settings." })
    };
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ ok: false, error: "Missing SUPABASE_SERVICE_ROLE_KEY env var. Set it in Netlify site settings." })
    };
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const recipeId = (event.queryStringParameters?.recipeId || "community").trim();
  const rawLimit = Number(event.queryStringParameters?.limit || 50);
  const limit = Math.max(1, Math.min(100, isFinite(rawLimit) ? rawLimit : 50));

  const { data, error } = await supabase
    .from("recipe_posts")
    .select("id, created_at, user_id, display_name, recipe_id, body")
    .eq("recipe_id", recipeId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ ok: false, error: error.message })
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ ok: true, rows: data })
  };
}
