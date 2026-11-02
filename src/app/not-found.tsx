import { GoBackButton } from "@/go-back-button";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Page not found – Prodeveloper_2" },
};

export default function NotFound() {
  return (
    <div className="not-found-page bg-white min-h-[70vh] flex items-center justify-center px-6 py-24">
      <div className="max-w-2xl w-full text-center">
        <div className="relative inline-block mb-8">
          <h1 className="text-[120px] md:text-[180px] font-black text-gray-100 leading-none select-none">
            404
          </h1>
          <h2 className="absolute inset-0 flex items-center justify-center text-3xl md:text-5xl font-bold text-gray-800 mt-8">
            Oops!
          </h2>
        </div>

        <div className="space-y-4 mb-10">
          <h3 className="text-2xl md:text-3xl font-semibold text-gray-700">
            Page Not Found
          </h3>
          <p className="text-gray-500 text-lg max-w-md mx-auto">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto bg-success hover:bg-green-700 text-white font-bold px-10 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Back to Homepage
          </Link>
          <GoBackButton />
        </div>
      </div>
    </div>
  );
}
