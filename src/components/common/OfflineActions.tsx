"use client";

import Link from "next/link";

export default function OfflineActions() {
  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <button onClick={() => window.location.reload()} className="font-hindi px-4 py-2 rounded-lg bg-[#C8102E] text-white">दोबारा कोशिश करें</button>
      <Link href="/" className="font-hindi px-4 py-2 rounded-lg border border-red-200 text-[#C8102E]">होम पर जाएँ</Link>
    </div>
  );
}
