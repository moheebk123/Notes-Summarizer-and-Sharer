import Link from "next/link";
import mongoose from "mongoose";
import NoteSummarizer from "@/components/NoteSummarizer";
import { dbConnect, Summary } from "@/lib/db";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold text-white mb-4">404 Page Not Found</h1>
      <Link
        href="/"
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
      >
        Go Home
      </Link>
    </div>
  );
}

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;

  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(id)) return <NotFound />;

  const doc = await Summary.findById(id);
  doc._id = doc._id.toString();

  if (!doc) return <NotFound />;

  return (
    <NoteSummarizer
      doc={{
        _id: doc.id.toString(),
        transcript: doc.transcript,
        prompt: doc.prompt,
        summary: doc.summary,
      }}
      showCreateLink={false}
    />
  );
}
