import Hero from "@/components/home/Hero";
import { Metadata } from "next";

export const metadata: Metadata = { title: { absolute: "Prodeveloper_2" } };

export default function Home() {
  return (
    <Hero />
  );
}
