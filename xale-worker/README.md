# Xale CRM lead proxy (Cloudflare Worker)

Website form → this Worker (holds the secret key) → Xale webhook.
The API key is **never** in this repo. It lives only as an encrypted
secret in Cloudflare.

## Deploy (dashboard, no command line)

1. Sign up free at https://dash.cloudflare.com → **Workers & Pages**.
2. **Create** → **Create Worker** → name it `xale-lead` → **Deploy**.
3. **Edit code** → delete the sample → paste all of `worker.js` → **Deploy**.
4. **Settings → Variables and Secrets → Add**:
   - Type: **Secret** (encrypted)
   - Name: `XALE_API_KEY`
   - Value: *(the key Xale gave)* → **Save / Deploy**.
5. Copy the Worker URL, e.g. `https://xale-lead.<your-subdomain>.workers.dev`.
   Hand that URL back — it goes into the website form.

## Fields sent to Xale
`FirstName, LastName, MobileNumber, WhatsAppNumber, Email, CourseName,
Address, CampaignName`. Mandatory from the form: **name + mobile**.
`CampaignName` defaults to `"Website"` (or the specific program name) so
counsellors see the lead source.

## Test after deploy
Submit the site form once with real details → check the lead appears in
Xale under the right counsellor. Delete the test lead.
