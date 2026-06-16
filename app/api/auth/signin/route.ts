import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return NextResponse.json({ error: error.message }, { status: 401 });

  return NextResponse.json({
    ok: true,
    firstName: data.user.user_metadata?.first_name ?? "",
    lastName: data.user.user_metadata?.last_name ?? "",
    email: data.user.email,
  });
}
