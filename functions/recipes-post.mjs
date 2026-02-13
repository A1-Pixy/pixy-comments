import { createClient } from "@supabase/supabase-js";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405 };
  }

  const { accessToken, displayName, kind, recipeId, title, body } =
    JSON.parse(event.body || "{}");

  const supabaseUser = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
  );

  const {
    data: { user },
    error: authError
  } = await supabaseUser.auth.getUser();

  if (authError || !user) {
    return {
      statusCode: 401,
      body: JSON.stringify({ ok: false, error: "Unauthorized" })
    };
  }

  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { error } = await supabaseAdmin.from("community_posts").insert({
    user_id: user.id,
    display_name: displayName,
    kind,
    recipe_id: recipeId,
    title,
    body
  });

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: error.message })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true })
  };
}
