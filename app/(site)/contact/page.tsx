import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Request a private consultation for MICE programs or VIP concierge services. PTS responds with a composed proposal.",
};

export default function Page() {
  return <ContactPage />;
}
