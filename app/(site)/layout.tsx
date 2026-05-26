import { LuxuryFooter } from "@/components/layout/LuxuryFooter";
import { LuxuryNavbar } from "@/components/layout/LuxuryNavbar";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LuxuryNavbar />
      <div className="w-full pt-[max(5.5rem,env(safe-area-inset-top,0px)+3.5rem)] pb-[env(safe-area-inset-bottom,0px)]">
        {children}
      </div>
      <LuxuryFooter />
      <WhatsAppButton />
    </>
  );
}
