import type { Metadata } from "next";
import { VipConciergePage } from "@/components/pages/VipConciergePage";

export const metadata: Metadata = {
  title: "VIP Concierge",
  description:
    "Executive lifestyle management, luxury reservations, private transportation, exclusive access, and tailored experiences.",
};

export default function Page() {
  return <VipConciergePage />;
}
