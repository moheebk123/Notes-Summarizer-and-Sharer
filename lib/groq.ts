import Groq from "groq-sdk";

export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function summarizeWithGroq({
  transcript,
  prompt,
}: {
  transcript: string;
  prompt: string;
}) {
  const system = `You are an assistant that writes clear, concise, structured summaries of meeting transcripts.

Format your response as follows:
1. First line: A short heading/title for the summary (plain text, no markdown).
2. Second line: A short one-sentence overall summary.
3. Following lines: Key points in the format "Category: Description", each on a new line.
    - Use simple plain text.
    - No markdown symbols (#, *, -, etc.).
    - Each point should be descriptive but concise.

Example format:
Project Kickoff Meeting
This meeting covered timelines, responsibilities, and goals for the launch.
Education: Completed BCA from GGSIPU
Experience: 3 years in full-stack development
Skills: MERN stack, AI integration, and cloud deployment

Rules:
- Never use markdown syntax in the output.
- Use capitalized category names followed by a colon.
- Keep bullet points short but informative.`;

  const user = `Instruction: ${prompt}\n\nTranscript:\n${transcript}`;

  const resp = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.2,
  });
  return resp.choices?.[0]?.message?.content || "";
}
