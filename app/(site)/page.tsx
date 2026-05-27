import type { Metadata } from "next";
import { HomePage } from "@/components/pages/HomePage";

export const metadata: Metadata = {
  title: "GERVAE",
  description:
    "Luxury corporate hospitality, elite MICE solutions, and VIP concierge for executives worldwide—with a strategic presence in Saudi Arabia.",
};

export default function Page() {
  return <HomePage />;
}
