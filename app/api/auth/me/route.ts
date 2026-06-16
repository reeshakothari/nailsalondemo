import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ user: null });

  const { data: profile } = await supabase
    .from("nail_salon_profiles")
    .select("first_name, last_name, loyalty_stamps")
    .eq("id", user.id)
    .single();

  return NextResponse.json({
    user: {
      contactId: user.id,
      firstName: profile?.first_name ?? user.user_metadata?.first_name ?? "",
      lastName: profile?.last_name ?? user.user_metadata?.last_name ?? "",
      email: user.email ?? "",
      stamps: profile?.loyalty_stamps ?? 0,
    },
  });
}
