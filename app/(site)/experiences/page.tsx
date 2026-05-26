import type { Metadata } from "next";
import { HomePage } from "@/components/pages/HomePage";

export const metadata: Metadata = {
  title: "Experiences",
  description:
    "A cinematic gallery of luxury hospitality, executive travel, corporate events, and premium destinations composed by GERVAE.",
};

export default function Page() {
  return <HomePage />;
}
