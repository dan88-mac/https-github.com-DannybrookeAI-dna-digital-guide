#!/usr/bin/env node
/**
 * One-shot admin bootstrap. NEVER commit real passwords.
 *
 * Usage (local):
 *   ADMIN_EMAIL_1=ops1@example.com ADMIN_PASSWORD_1=... \
 *   ADMIN_EMAIL_2=ops2@example.com ADMIN_PASSWORD_2=... \
 *   node scripts/bootstrap-admin.mjs
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !service) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admins = [
  { email: process.env.ADMIN_EMAIL_1, password: process.env.ADMIN_PASSWORD_1 },
  { email: process.env.ADMIN_EMAIL_2, password: process.env.ADMIN_PASSWORD_2 },
].filter((a) => a.email && a.password);

if (admins.length === 0) {
  console.error("Set ADMIN_EMAIL_1/ADMIN_PASSWORD_1 (and optional _2) in env — not in git.");
  process.exit(1);
}

const supabase = createClient(url, service, { auth: { persistSession: false } });

for (const a of admins) {
  const email = a.email;
  const password = a.password;
  const { data: listed } = await supabase.auth.admin.listUsers({ perPage: 200 });
  let user = listed?.users?.find((u) => u.email === email);
  if (!user) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) {
      console.error("createUser", email, error.message);
      continue;
    }
    user = data.user;
  }
  if (!user) continue;
  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    display_name: "Resync Operator",
    app_role: "admin",
    updated_at: new Date().toISOString(),
  });
  if (error) console.error("profile", error.message);
  else console.log("admin ready:", email);
}

console.log("Done. Rotate any passwords that were ever pasted into chat.");
