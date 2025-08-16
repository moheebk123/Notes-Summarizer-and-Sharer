import { NextRequest, NextResponse } from "next/server";
import { dbConnect, Summary } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { prompt, transcript, summary} = await req.json();

    await dbConnect();

    const doc = await Summary.create({
      prompt,
      transcript,
      summary,
    });

    return NextResponse.json({ id: doc._id.toString() });
  } catch (e: unknown) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
