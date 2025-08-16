import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { summarizeWithGroq } from "@/lib/groq";

const Body = z.object({
  transcript: z.string().min(1),
  prompt: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = Body.parse(await req.json());
    const summary = await summarizeWithGroq(body);
    return NextResponse.json({ summary });
  } catch (e: unknown) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed" }, { status: 400 });
  }
}
