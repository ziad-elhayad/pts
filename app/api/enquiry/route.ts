import { NextResponse } from "next/server";
import { sendEnquiryEmail, type EnquiryPayload } from "@/lib/enquiry-email";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EnquiryPayload;

    if (!body?.source || typeof body.source !== "string") {
      return NextResponse.json({ error: "Invalid form source." }, { status: 400 });
    }

    if (!body.data || typeof body.data !== "object") {
      return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
    }

    const data: Record<string, string> = {};
    for (const [key, value] of Object.entries(body.data)) {
      if (typeof value === "string") {
        data[key] = value.trim();
      }
    }

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    await sendEnquiryEmail({ source: body.source, data });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[enquiry]", error);
    const message =
      error instanceof Error ? error.message : "Failed to send enquiry.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
