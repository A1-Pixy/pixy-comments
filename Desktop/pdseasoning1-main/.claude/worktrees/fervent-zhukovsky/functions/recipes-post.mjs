import { createClient } from "@supabase/supabase-js";

export async function handler(event) {
  // CORS (safe defaults)
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ ok: false, error: "Method Not Allowed" })
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ ok: false, error: "Invalid JSON body" })
    };
  }

  const accessToken = payload.accessToken;
  const displayName = (payload.displayName || "").trim();
  const recipeId = (payload.recipeId || "").trim();
  const body = (payload.body || "").trim();

  if (!accessToken) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ ok: false, error: "Missing accessToken" })
    };
  }

  if (!recipeId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ ok: false, error: "Missing recipeId" })
    };
  }

  if (!body) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ ok: false, error: "Comment body is required" })
    };
  }

  if (!process.env.SUPABASE_URL) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ ok: false, error: "Missing SUPABASE_URL" })
    };
  }

  if (!process.env.SUPABASE_ANON_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ ok: false, error: "Missing SUPABASE_ANON_KEY" })
    };
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        ok: false,
        error: "Missing SUPABASE_SERVICE_ROLE_KEY"
      })
    };
  }

  // Verify the user token (RLS-friendly identity check)
  const supabaseUser = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
  );

  const { data: userData, error: authError } = await supabaseUser.auth.getUser();

  if (authError || !userData?.user) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ ok: false, error: "Unauthorized" })
    };
  }

  const user = userData.user;

  // Server-side insert using service role (bypasses RLS by design)
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const insertRow = {
    user_id: user.id,
    display_name: displayName || "Anonymous",
    recipe_id: recipeId,
    body
  };

  const { data, error } = await supabaseAdmin
    .from("recipe_posts")
    .insert(insertRow)
    .select("id, created_at, user_id, display_name, recipe_id, body")
    .single();

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
    body: JSON.stringify({ ok: true, post: data })
  };
}
