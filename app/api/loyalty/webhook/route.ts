import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/app/lib/supabase/server";

/*
  GHL Workflow → Webhook trigger on payment complete.
  GHL: Automations → New Workflow → Trigger: Payment Received
  → Action: Webhook → POST https://yourdomain.com/api/loyalty/webhook
  Body: { "email": "{{contact.email}}", "secret": "your-webhook-secret" }
*/
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  if (process.env.WEBHOOK_SECRET && body.secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = body.email ?? body.contact_email ?? body.contactEmail;
  if (!email) return NextResponse.json({ error: "No email in payload" }, { status: 400 });

  const supabase = createServiceClient();

  const { data: profile, error } = await supabase
    .from("nail_salon_profiles")
    .select("id, loyalty_stamps")
    .eq("email", email)
    .single();

  if (error || !profile) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const newStamps = (profile.loyalty_stamps ?? 0) + 1;

  await supabase
    .from("nail_salon_profiles")
    .update({ loyalty_stamps: newStamps })
    .eq("id", profile.id);

  return NextResponse.json({ ok: true, email, stamps: newStamps });
}
