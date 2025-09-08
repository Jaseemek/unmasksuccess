import { neon } from "@neondatabase/serverless";

// IMPORTANT: Use the exact connection var name shown in Vercel → Settings → Environment Variables.
// If Vercel created DATABASE_URL instead of POSTGRES_URL, change the line below accordingly.
const sql = neon(process.env.POSTGRES_URL); // or: const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    // Parse JSON body robustly (supports string body or parsed object)
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const { service = "", price = "", fullName = "", email = "" } = body;

    // Create extension/table once; idempotent on subsequent calls
    await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto;`;
    await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        service text,
        price text,
        full_name text,
        email text,
        created_at timestamptz DEFAULT now()
      )
    `;

    // Insert the lead row
    await sql`
      INSERT INTO leads (service, price, full_name, email)
      VALUES (${service}, ${price}, ${fullName}, ${email})
    `;

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("save-lead error:", err);
    return res.status(500).json({ ok: false, error: "Save failed" });
  }
}
