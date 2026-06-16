const BASE = "https://services.leadconnectorhq.com";
const VERSION = "2021-07-28";

function headers() {
  return {
    Authorization: `Bearer ${process.env.GHL_API_KEY}`,
    "Content-Type": "application/json",
    Version: VERSION,
  };
}

export async function createGHLContact(params: {
  firstName: string;
  lastName: string;
  email: string;
}) {
  const res = await fetch(`${BASE}/contacts/`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      locationId: process.env.GHL_LOCATION_ID,
      tags: ["nail-salon-member"],
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? "Failed to create GHL contact");
  }
  const data = await res.json();
  return data.contact as { id: string };
}
