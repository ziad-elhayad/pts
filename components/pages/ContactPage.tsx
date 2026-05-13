"use client";

import { InquiryForm } from "@/components/InquiryForm";
import { PageTransition } from "@/components/animations/PageTransition";
import { site } from "@/lib/site";

export function ContactPage() {
  return (
    <PageTransition>
      <section className="border-b border-pts-line px-6 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl">
            <p className="lux-heading text-[0.62rem] text-pts-gold">Contact</p>
            <h1 className="mt-6 font-heading text-3xl tracking-[0.12em] text-pts-parchment sm:text-4xl">
              Begin quietly. Move decisively.
            </h1>
            <p className="mt-6 text-sm leading-relaxed text-pts-muted sm:text-base">
              For proposals, retainers, and same-day executive support, reach our desk directly. WhatsApp is
              monitored for active itineraries.
            </p>
            <div className="mt-10 space-y-4 text-sm text-pts-muted">
              <p>
                <span className="lux-heading text-[0.58rem] text-pts-gold">Email</span>
                <br />
                <a className="text-pts-parchment transition hover:text-pts-gold-2" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </p>
              <p>
                <span className="lux-heading text-[0.58rem] text-pts-gold">Desk</span>
                <br />
                {site.phone}
              </p>
              <p>
                <span className="lux-heading text-[0.58rem] text-pts-gold">City</span>
                <br />
                {site.city}
              </p>
            </div>
          </div>
          <InquiryForm />
        </div>
      </section>
    </PageTransition>
  );
}
