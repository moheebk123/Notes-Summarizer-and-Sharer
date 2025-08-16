import { NextRequest, NextResponse } from "next/server";
import { dbConnect, Summary } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { id, prompt, transcript, summary} = await req.json();

    await dbConnect();

    const doc = await Summary.findByIdAndUpdate(id, {
      prompt,
      transcript,
      summary,
    });

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
