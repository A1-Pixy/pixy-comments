import { getStore } from "@netlify/blobs";

const RULES = {
  qr_scan: "reorder_reminder",
  optin_submit: "welcome_sequence",
  checkout_complete: "thank_you",
  wholesale_submit: "wholesale_followup",
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
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

  // Only allow GET
  if (request.method !== "GET") {
    return jsonResponse({ ok: false, error: "Method Not Allowed" }, 405);
  }

  // Read recent events from the "events" store
  let events;
  try {
    const eventStore = getStore("events");
    const { blobs } = await eventStore.list();
    events = [];
    for (const blob of blobs) {
      const event = await eventStore.get(blob.key, { type: "json" });
      if (event) {
        events.push({ key: blob.key, ...event });
      }
    }
  } catch {
    return jsonResponse(
      {
        ok: false,
        error: "Storage is not configured. Netlify Blobs is unavailable.",
      },
      500,
    );
  }

  // Apply rules and queue dispatches
  const dispatched = [];

  try {
    const dispatchStore = getStore("dispatch_queue");

    for (const event of events) {
      const action = RULES[event.type];
      if (action) {
        const dispatchId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const entry = {
          event_key: event.key,
          event_type: event.type,
          action,
          queued_at: new Date().toISOString(),
        };
        await dispatchStore.setJSON(dispatchId, entry);
        dispatched.push({ dispatch_id: dispatchId, ...entry });
      }
    }
  } catch {
    return jsonResponse(
      {
        ok: false,
        error: "Storage is not configured. Netlify Blobs is unavailable.",
      },
      500,
    );
  }

  return jsonResponse({ ok: true, dispatched }, 200);
};
