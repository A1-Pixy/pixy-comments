import { getStore } from "@netlify/blobs";

const ALLOWED_TYPES = [
  "qr_scan",
  "optin_submit",
  "add_to_cart",
  "checkout_complete",
  "wholesale_submit",
];

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

export default async (request, context) => {
  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response("", { status: 204, headers: CORS_HEADERS });
  }

  // Only allow POST
  if (request.method !== "POST") {
    return jsonResponse({ ok: false, error: "Method Not Allowed" }, 405);
  }

  // Parse the request body
  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: "Invalid JSON body" }, 400);
  }

  const { type, data } = payload;

  // Validate event type
  if (!type || !ALLOWED_TYPES.includes(type)) {
    return jsonResponse(
      {
        ok: false,
        error: `Invalid event type. Allowed types: ${ALLOWED_TYPES.join(", ")}`,
      },
      400,
    );
  }

  const eventId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  let storageNote = undefined;

  // Attempt to store via Netlify Blobs
  try {
    const store = getStore("events");
    await store.setJSON(eventId, {
      type,
      data: data || {},
      timestamp: new Date().toISOString(),
    });
  } catch {
    storageNote = "Event accepted but storage is unavailable";
  }

  const responseBody = { ok: true, event_id: eventId };
  if (storageNote) {
    responseBody.note = storageNote;
  }

  return jsonResponse(responseBody, 200);
};
