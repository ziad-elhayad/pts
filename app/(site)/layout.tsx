import { LuxuryFooter } from "@/components/layout/LuxuryFooter";
import { LuxuryNavbar } from "@/components/layout/LuxuryNavbar";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LuxuryNavbar />
      <div className="pt-24">{children}</div>
      <LuxuryFooter />
    </>
  );
}
