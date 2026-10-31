import { Metadata } from "next";

export const metadata: Metadata = { title: { absolute: "Prodeveloper_2" } };

export default function Home() {
  return (
    <h1 className="text-3xl font-bold underline">Hello, Next.js!</h1>
  );
}
