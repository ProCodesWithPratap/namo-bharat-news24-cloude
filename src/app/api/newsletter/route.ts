import { NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const name = typeof body?.name === "string" ? body.name.trim() : "";

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ success: false, message: "Invalid email address" }, { status: 400 });
    }

    // TODO: Integrate with Mailchimp/ConvertKit subscription provider.
    console.log("Newsletter subscription", { email, name });

    return NextResponse.json({ success: true, message: "Successfully subscribed to newsletter" });
  } catch {
    return NextResponse.json({ success: false, message: "Unable to process subscription" }, { status: 500 });
  }
}
