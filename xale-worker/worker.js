// ─────────────────────────────────────────────────────────────
// Broken English → Xale CRM lead proxy (Cloudflare Worker)
//
// Website form POSTs here. This Worker adds the secret X-API-Key
// (stored as an encrypted secret, NEVER in this file) and forwards
// the lead to Xale's webhook. Solves CORS + keeps the key private.
//
// Secret to set in the Cloudflare dashboard:
//   Name:  XALE_API_KEY
//   Value: (the key Xale gave you)
// ─────────────────────────────────────────────────────────────

const XALE_WEBHOOK = "https://api.xale.in/api/v1/webhooks/website/511/901";

// Origins allowed to submit the form:
const ALLOWED = [
  "https://brokenenglish.in",
  "https://www.brokenenglish.in",
  "http://localhost:8778", // local testing only
];

function cors(origin) {
  const allow = ALLOWED.includes(origin) ? origin : ALLOWED[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}
function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors(origin) },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS")
      return new Response(null, { status: 204, headers: cors(origin) });
    if (request.method !== "POST")
      return json({ ok: false, error: "Method not allowed" }, 405, origin);

    let d;
    try { d = await request.json(); }
    catch { return json({ ok: false, error: "Bad JSON" }, 400, origin); }

    // Honeypot: bots fill hidden "company" field → silently drop.
    if (d.company) return json({ ok: true }, 200, origin);

    const name = (d.name || "").trim();
    let mobile = (d.mobile || "").replace(/[^\d+]/g, "");
    if (!name || !mobile)
      return json({ ok: false, error: "Name and mobile are required" }, 422, origin);

    // Normalise Indian mobile to +91XXXXXXXXXX
    if (/^\d{10}$/.test(mobile)) mobile = "+91" + mobile;
    else if (/^91\d{10}$/.test(mobile)) mobile = "+" + mobile;
    else if (/^\+91\d{10}$/.test(mobile)) { /* already fine */ }

    const parts = name.split(/\s+/);
    const first = parts.shift();
    const last = parts.join(" ") || "-";

    const payload = {
      FirstName: first,
      LastName: last,
      MobileNumber: mobile,
      WhatsAppNumber: mobile,
      Email: d.email || "",
      CourseName: d.program || "General Enquiry",
      Address: d.city || "",
      CampaignName: d.source || "Website",
    };

    try {
      const r = await fetch(XALE_WEBHOOK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": env.XALE_API_KEY,
        },
        body: JSON.stringify(payload),
      });
      if (!r.ok) {
        const t = await r.text();
        return json({ ok: false, error: "CRM rejected", status: r.status, detail: t.slice(0, 200) }, 502, origin);
      }
      return json({ ok: true }, 200, origin);
    } catch (e) {
      return json({ ok: false, error: "Upstream failure" }, 502, origin);
    }
  },
};
