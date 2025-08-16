"use client";
import Image from "next/image";
import { useState } from "react";
import { FiZap } from "react-icons/fi";

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [prompt, setPrompt] = useState(
    "Summarize in bullet points for executives."
  );
  const [summary, setSummary] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [recipients, setRecipients] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleFile = async (f: File) => {
    const text: string = await f.text();
    setTranscript(text);
  };

  const generate = async () => {
    setIsGenerating(true);
    setSummary("");
    const res = await fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript, prompt }),
    });
    const data = await res.json();
    if (data.summary) {
      setSummary(data.summary || "");
    } else {
      setSummary("Summarize in bullet points for executives.");
      alert(`Failed: ${data.error}`);
    }
    setIsGenerating(false);
  };

  const share = async () => {
    setIsSending(true);
    const recs = recipients
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);
    const res = await fetch("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        summary,
        recipients: recs,
        subject: subject || "Meeting Summary",
      }),
    });
    const data = await res.json();
    alert(data.ok ? "Sent!" : `Failed: ${data.error}`);
    setIsSending(false);
  };

  return (
    <div
      style={{
        maxWidth: 820,
        margin: "40px auto",
        padding: 16,
        fontFamily: "system-ui",
      }}
    >
      <div className="flex gap-4 items-center justify-center flex-col md:flex-row mb-5 border-b pb-2">
        <Image src="/logo.svg" alt="AI Notes Logo" width={50} height={50} />
        <h1 className="text-3xl sm:text-2xl text-center font-semibold mb-3">
          AI Notes Summarizer and Sharer
        </h1>
      </div>

      <div className="flex gap-3 flex-col border w-fit p-3">
        <label className="font-semibold text-xl flex gap-3 items-center">
          <Image src="/file.png" alt="Text File Logo" width={30} height={30} />{" "}
          Upload .txt transcript
        </label>
        <input
          type="file"
          accept=".txt"
          className="border rounded-lg border-gray-400 px-2 cursor-pointer bg-gray-400 hover:bg-gray-500 transition"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>

      <div className="mt-8 border p-3">
        <label className="font-semibold text-xl flex gap-3 items-center">
          <Image
            src="/transcript.png"
            alt="Transcript Logo"
            width={30}
            height={30}
          />
          Paste Transcript
        </label>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Type your transcript..."
          rows={8}
          className="w-full p-2 mt-3 border border-gray-400 outline-none rounded-lg"
        />
      </div>

      <div className="mt-8 border p-3">
        <label className="font-semibold text-xl flex gap-3 items-center">
          <Image
            src="/instruction.png"
            alt="Instruction Logo"
            width={30}
            height={30}
          />
          Custom instruction
        </label>
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your instructions..."
          className="w-full p-2 mt-3 border border-gray-400 outline-none rounded-lg"
        />
      </div>

      <button
        onClick={generate}
        disabled={!transcript || !prompt || isGenerating}
        className={`mt-5 bg-purple-700 hover:bg-purple-800 transition px-5 py-2 font-semibold rounded-full ${
          !transcript || !prompt || isGenerating
            ? "cursor-not-allowed"
            : "cursor-pointer"
        }`}
      >
        {isGenerating ? "Generating…" : "Generate Summary"}
      </button>

      <div className="mt-8 border p-3">
        <label className="font-semibold text-xl flex gap-3 items-center">
          <Image src="/edit.png" alt="Edit Logo" width={40} height={40} />
          Editable summary (Markdown/plain)
        </label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={12}
          className="w-full p-2 mt-3 border border-gray-400 outline-none rounded-lg"
        />
      </div>

      <div className="mt-8 border p-3 flex flex-col gap-3">
        <label className="font-semibold text-xl flex gap-3 items-center">
          <Image src="/email.png" alt="Email Logo" width={30} height={30} />
          Email Subject
        </label>
        <input
          placeholder="Eg. Meeting summary"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-2 border border-gray-400 outline-none rounded-lg"
        />
        <label className="font-semibold text-xl mt-3 flex gap-3 items-center">
          <Image src="/share.png" alt="Share Logo" width={30} height={30} />
          Share via email (comma-separated)
        </label>
        <input
          placeholder="a@x.com, b@y.com"
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
          className="w-full p-2 border border-gray-400 outline-none rounded-lg"
        />
        <button
          onClick={share}
          disabled={!summary || !recipients || isSending}
          className={`mt-5 bg-purple-700 hover:bg-purple-800 transition px-5 py-2 font-semibold rounded-full flex gap-3 items-center justify-center ${
            !summary || !recipients || isSending
              ? "cursor-not-allowed"
              : "cursor-pointer"
          }`}
        >
          {isSending ? "Sending…" : "Send Email"}
          <Image src="/send.png" alt="Send Logo" width={30} height={30} />
        </button>
      </div>
    </div>
  );
}

// Hello My name is moheeb khan. I am a full stack developer with a strong foundation in MERN stack and modern web development technologies. I completed my Bachelors of Computer Applications from Guru Gobind Singh Indraprastha University.
