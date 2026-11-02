"use client";

export function GoBackButton() {
  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      className="w-full sm:w-auto border-2 border-gray-200 hover:border-gray-400 text-gray-600 font-semibold px-10 py-4 rounded-full transition-all duration-300"
    >
      Go Back
    </button>
  );
}
