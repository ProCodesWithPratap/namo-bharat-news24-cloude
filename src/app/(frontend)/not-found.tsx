import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl font-extrabold" style={{ color: "#C8102E" }}>404</div>
      <h1 className="font-hindi text-2xl font-bold text-gray-800 mt-4">
        यह पेज नहीं मिला
      </h1>
      <p className="font-hindi text-gray-500 mt-2 max-w-sm">
        आप जो पेज ढूंढ रहे हैं वह हटा दिया गया है, या यहाँ कभी था ही नहीं।
      </p>
      <Link
        href="/"
        className="mt-6 px-6 py-3 text-white font-semibold rounded-lg transition-opacity hover:opacity-90 font-hindi"
        style={{ backgroundColor: "#C8102E" }}
      >
        होम पर जाएं
      </Link>
    </div>
  );
}
