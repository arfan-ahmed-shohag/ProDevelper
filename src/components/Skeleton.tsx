export default function Skeleton({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <span
      aria-hidden="true"
      className={`block rounded-lg motion-safe:animate-pulse ${
        tone === "dark" ? "bg-white/10" : "bg-slate-200"
      } ${className}`}
    />
  );
}
