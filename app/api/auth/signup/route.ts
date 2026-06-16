import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/app/lib/supabase/server";
import { createGHLContact } from "@/app/lib/ghl";

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, password } = await req.json();

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const service = createServiceClient();

  // Use admin API to create user with email pre-confirmed — no confirmation email sent
  const { data, error } = await service.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { first_name: firstName, last_name: lastName },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!data.user) return NextResponse.json({ error: "Failed to create account." }, { status: 500 });

  await service.from("nail_salon_profiles").insert({
    id: data.user.id,
    email,
    first_name: firstName,
    last_name: lastName,
    loyalty_stamps: 0,
  });

  // Sync to GHL as a CRM contact (non-fatal)
  try {
    const contact = await createGHLContact({ firstName, lastName, email });
    await service.from("nail_salon_profiles").update({ ghl_contact_id: contact.id }).eq("id", data.user.id);
  } catch {}

  // Sign them in immediately so the session cookie is set
  const supabase = await createClient();
  await supabase.auth.signInWithPassword({ email, password });

  return NextResponse.json({ ok: true, firstName, lastName, email });
}
