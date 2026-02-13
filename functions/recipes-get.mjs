import { createClient } from "@supabase/supabase-js";

export async function handler(event) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const recipeId = event.queryStringParameters?.recipeId || "community";
  const limit = Number(event.queryStringParameters?.limit || 50);

  const { data, error } = await supabase
    .from("community_posts")
    .select("*")
    .eq("recipe_id", recipeId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: error.message })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, rows: data })
  };
}
