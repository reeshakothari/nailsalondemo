import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/app/lib/supabase/server";

export async function GET() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("nail_salon_profiles")
    .select("id, email, first_name, last_name, loyalty_stamps, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ members: data ?? [] });
}

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, password } = await req.json();
  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { first_name: firstName, last_name: lastName },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await supabase.from("nail_salon_profiles").insert({
    id: data.user.id,
    email,
    first_name: firstName,
    last_name: lastName,
    loyalty_stamps: 0,
  });

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const { id, stamps } = await req.json();
  if (!id || stamps === undefined || stamps < 0) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("nail_salon_profiles")
    .update({ loyalty_stamps: Math.floor(stamps) })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
