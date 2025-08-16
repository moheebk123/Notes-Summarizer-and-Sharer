import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";

const Body = z.object({
  summary: z.string().min(1),
  recipients: z.array(z.string().email()).min(1),
  subject: z.string().default("Meeting Summary"),
});

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
    port: Number(process.env.BREVO_SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASS,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { summary, recipients, subject } = Body.parse(await req.json());
    const transporter = createTransport();

    const info = await transporter.sendMail({
      from: `"${process.env.BREVO_SENDER_NAME}" <${process.env.BREVO_SENDER_EMAIL}>`,
      to: recipients.join(","),
      subject,
      html: `<pre style="font-family:ui-monospace, SFMono-Regular">${escapeHtml(
        summary
      )}</pre>`,
    });

    return NextResponse.json({ ok: true, id: info.messageId });
  } catch (e: unknown) {
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed" }, { status: 400 });
  }
}

function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c]!)
  );
}
