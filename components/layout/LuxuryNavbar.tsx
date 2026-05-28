"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { navItems, serviceItems } from "@/lib/site";
import { t, type DictionaryKey } from "@/lib/dictionary";
import { useLocale } from "@/contexts/LocaleContext";
import { Magnetic } from "@/components/ui/Magnetic";
import { BrandLogo } from "@/components/ui/BrandLogo";

function ServicesDropdownLinks({
  locale,
  pathname,
  onNavigate,
}: {
  locale: ReturnType<typeof useLocale>["locale"];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      {serviceItems.map((subItem) => {
        const subActive = pathname === subItem.href;
        return (
          <Link
            key={subItem.href}
            href={subItem.href}
            onClick={onNavigate}
            className={clsx(
              "group flex w-full items-center justify-between gap-3 rounded-sm px-4 py-3 font-bold uppercase tracking-[0.2em] transition-all duration-300",
              "text-[0.7rem]",
              subActive
                ? "bg-pts-gold/12 text-pts-gold"
                : "text-pts-gold-2 hover:bg-pts-gold/6 hover:text-pts-parchment"
            )}
          >
            <span className="min-w-0 flex-1 text-start leading-snug">
              {t(locale, subItem.key as DictionaryKey)}
            </span>
            <svg
              className="h-3.5 w-3.5 shrink-0 text-pts-gold opacity-0 transition-all duration-300 group-hover:opacity-100 ltr:-translate-x-2 ltr:group-hover:translate-x-0 rtl:translate-x-2 rtl:group-hover:translate-x-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        );
      })}
    </>
  );
}

function DesktopServicesDropdown({
  locale,
  pathname,
  label,
  isOpen,
  onOpenChange,
}: {
  locale: ReturnType<typeof useLocale>["locale"];
  pathname: string;
  label: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [canHover, setCanHover] = useState(false);
  const dropdownActive = serviceItems.some((sub) => pathname === sub.href);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        onOpenChange(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onOpenChange]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => canHover && onOpenChange(true)}
      onMouseLeave={() => canHover && onOpenChange(false)}
    >
      <Magnetic strength={0.25}>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={() => onOpenChange(!isOpen)}
          className={clsx(
            "relative flex items-center gap-1.5 border-none bg-transparent py-2 font-body font-bold uppercase tracking-[0.4em] outline-none transition-colors duration-300",
            "text-[0.7rem]",
            dropdownActive ? "text-pts-parchment" : "text-pts-gold-2 hover:text-pts-parchment"
          )}
        >
          <span>{label}</span>
          <svg
            className={clsx("h-3 w-3 text-pts-gold/70 transition-transform duration-300", isOpen && "rotate-180")}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
          {dropdownActive && (
            <span className="absolute -bottom-1.5 start-0 h-px w-full bg-gradient-to-r from-pts-gold via-pts-gold-2 to-transparent" />
          )}
        </button>
      </Magnetic>

      {isOpen ? (
          <div
            role="menu"
            className="absolute start-0 top-full z-[100] min-w-[16rem] max-w-[min(20rem,calc(100vw-2rem))] origin-top pt-4 animate-navbar-dropdown"
          >
            <div className="space-y-1 rounded-sm border border-pts-gold/20 bg-pts-deep/98 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl">
              <ServicesDropdownLinks
                locale={locale}
                pathname={pathname}
                onNavigate={() => onOpenChange(false)}
              />
            </div>
          </div>
        ) : null}
    </div>
  );
}

export function LuxuryNavbar() {
  const pathname = usePathname();
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const [nav, setNav] = useState({ scrolled: false, hidden: false, progress: 0 });
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false);
  const menuOpenRef = useRef(false);

  useEffect(() => {
    menuOpenRef.current = open || mobileServicesOpen || desktopServicesOpen;
    if (menuOpenRef.current) {
      setNav((prev) => (prev.hidden ? { ...prev, hidden: false } : prev));
    }
  }, [open, mobileServicesOpen, desktopServicesOpen]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateNavbar = () => {
      const currentScrollY = window.scrollY;
      const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);
      
      // Calculate scrolled and progress
      const scrolled = currentScrollY > 60;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? currentScrollY / max : 0;
      
      // Hide navbar when scrolling down past 100px
      const shouldHide = scrollDirection === 'down' && currentScrollY > 100;
      
      // Show navbar when scrolling up or at top
      const shouldShow = scrollDirection === 'up' || currentScrollY <= 50;

      // Don't hide if any menu is open
      const isMenuOpen = menuOpenRef.current;
      
      console.log('Scroll update:', { currentScrollY, scrollDirection, shouldHide, shouldShow, isMenuOpen });
      
      if (isMenuOpen) {
        setNav((prev) => ({ ...prev, hidden: false, scrolled, progress }));
      } else if (shouldHide && scrollDelta > 5) {
        console.log('Hiding navbar');
        setNav((prev) => ({ ...prev, hidden: true, scrolled, progress }));
      } else if (shouldShow && scrollDelta > 5) {
        console.log('Showing navbar');
        setNav((prev) => ({ ...prev, hidden: false, scrolled, progress }));
      } else {
        // Update scrolled and progress even if hidden state doesn't change
        setNav((prev) => {
          if (prev.scrolled === scrolled && Math.abs(prev.progress - progress) < 0.002) {
            return prev;
          }
          return { ...prev, scrolled, progress };
        });
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateNavbar();
        });
        ticking = true;
      }
    };

    console.log('Attaching scroll listener');
    window.addEventListener('scroll', onScroll, { passive: true });
    
    return () => {
      console.log('Removing scroll listener');
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const { scrolled, hidden, progress } = nav;

  useEffect(() => {
    setOpen(false);
    setDesktopServicesOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) setMobileServicesOpen(false);
  }, [open]);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-[90] pt-[env(safe-area-inset-top,0px)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
        desktopServicesOpen && "z-[10050]",
        hidden ? "-translate-y-[120%] opacity-0" : "translate-y-0 opacity-100"
      )}
    >
      <div
        className={clsx(
          "relative overflow-visible transition-[background,border-color] duration-500",
          scrolled
            ? "border-b border-pts-gold/10 bg-pts-deep/95"
            : "border-b border-transparent bg-transparent",
          scrolled && "lg:bg-pts-deep/82 lg:backdrop-blur-xl"
        )}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 overflow-visible px-4 py-4 sm:px-8 sm:py-5 md:px-12">
          <Magnetic strength={0.3}>
            <Link href="/" className="group">
              <BrandLogo size={24} />
            </Link>
          </Magnetic>

          <nav className="hidden items-center gap-6 overflow-visible lg:flex lg:gap-8">
            {navItems.map((item) => {
              const isHomePage = pathname === "/";
              const isAnchor = "anchor" in item && item.anchor;
              const anchorId = item.href === "/" ? "hero" : item.href.replace(/^[\/#]+/, "");
              const navActive = isHomePage ? false : pathname === item.href;

              if (isAnchor && !("dropdown" in item && item.dropdown)) {
                const handleAnchorClick = () => {
                  if (isHomePage) {
                    document.getElementById(anchorId)?.scrollIntoView({ behavior: "smooth" });
                  } else {
                    window.location.href = `/#${anchorId}`;
                  }
                };

                return (
                  <Magnetic strength={0.25} key={item.href}>
                    <button
                      type="button"
                      onClick={handleAnchorClick}
                      className={clsx(
                        "relative cursor-pointer border-none bg-transparent font-bold uppercase tracking-[0.4em] outline-none transition-colors duration-300",
                        "text-[0.7rem]",
                        pathname === "/" ? "text-pts-parchment" : "text-pts-gold-2 hover:text-pts-parchment"
                      )}
                    >
                      <span suppressHydrationWarning>{t(locale, item.key as DictionaryKey)}</span>
                    </button>
                  </Magnetic>
                );
              }

              if ("dropdown" in item && item.dropdown) {
                return (
                  <DesktopServicesDropdown
                    key={item.key}
                    locale={locale}
                    pathname={pathname}
                    label={t(locale, item.key as DictionaryKey)}
                    isOpen={desktopServicesOpen}
                    onOpenChange={setDesktopServicesOpen}
                  />
                );
              }

              return (
                <Magnetic strength={0.25} key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "relative uppercase font-bold tracking-[0.2em] transition-colors duration-300",
                      "text-[0.7rem]",
                      navActive ? "text-pts-parchment" : "text-pts-gold-2 hover:text-pts-parchment"
                    )}
                  >
                    <span suppressHydrationWarning>{t(locale, item.key as DictionaryKey)}</span>
                    {navActive && (
                      <span className="absolute -bottom-1.5 start-0 h-px w-full bg-gradient-to-r from-pts-gold via-pts-gold-2 to-transparent" />
                    )}
                  </Link>
                </Magnetic>
              );
            })}
          </nav>

          <div className="hidden items-center gap-4 lg:flex lg:gap-5">
            <div className={clsx(
              "flex rounded-full border border-pts-line/30 bg-pts-black/30 p-1 font-bold uppercase tracking-[0.28em]",
              "text-[0.58rem]"
            )}>
              {(["en", "ar"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  className={clsx(
                    "rounded-full px-3 py-1 transition-colors duration-300",
                    locale === lang ? "bg-pts-gold/20 text-pts-parchment" : "text-pts-gold-2 hover:text-pts-parchment"
                  )}
                  onClick={() => setLocale(lang)}
                >
                  {lang === "en" ? "EN" : "AR"}
                </button>
              ))}
            </div>

            <Link
              href="/contact"
              className={clsx(
                "lux-heading border border-pts-gold/35 bg-pts-gold/8 px-5 py-2.5 font-bold text-pts-gold-2 tracking-[0.4em] transition-all duration-400 hover:border-pts-gold hover:bg-pts-gold/18 hover:shadow-[0_0_20px_rgba(168,143,100,0.15)]",
                "text-[0.6rem]"
              )}
            >
              <span suppressHydrationWarning>{t(locale, "cta.consult")}</span>
            </Link>
          </div>

          <button
            type="button"
            className="flex items-center justify-center text-pts-gold transition-all duration-300 hover:scale-110 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? t(locale, "nav.close") : t(locale, "nav.menu")}
          >
            {open ? (
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 8L24 24M8 24L24 8" />
              </svg>
            ) : (
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M6 12H30M6 18H30M6 24H30" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div
        className="h-[1.5px] origin-left will-change-transform"
        style={{
          transform: `scaleX(${progress})`,
          background: "linear-gradient(90deg, var(--pts-gold), var(--pts-gold-2))",
          opacity: scrolled ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />

      {open ? (
          <div
            className="max-h-[min(85vh,calc(100dvh-5rem))] overflow-y-auto overscroll-y-contain border-t border-pts-line/15 bg-pts-deep/95 px-4 py-8 sm:px-8 sm:py-10 lg:hidden pb-[max(2rem,env(safe-area-inset-bottom))] animate-mobile-menu"
          >
            <div className="mx-auto flex w-full flex-col gap-6">
              {navItems.map((item, i) => {
                if ("dropdown" in item && item.dropdown) {
                  const dropdownActive = serviceItems.some((sub) => pathname === sub.href);

                  return (
                    <div
                      key={item.key}
                      className="flex flex-col gap-3 animate-mobile-menu-item"
                      style={{ animationDelay: `${i * 45}ms` }}
                    >
                      <button
                        type="button"
                        aria-expanded={mobileServicesOpen}
                        onClick={() => setMobileServicesOpen((v) => !v)}
                        className={clsx(
                          "flex min-h-[44px] w-full items-center justify-between lux-heading text-[0.72rem] tracking-[0.4em] transition-colors",
                          dropdownActive ? "text-pts-gold" : "text-pts-parchment/80 hover:text-pts-gold-2"
                        )}
                      >
                        <span><span suppressHydrationWarning>{t(locale, item.key as DictionaryKey)}</span></span>
                        <svg
                          className={clsx("h-4 w-4 shrink-0 text-pts-gold/70 transition-transform duration-300", mobileServicesOpen && "rotate-180")}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {mobileServicesOpen ? (
                          <div
                            className="grid overflow-hidden animate-accordion-open"
                          >
                            <div className="space-y-1 border-s border-pts-gold/20 ps-4">
                              <ServicesDropdownLinks
                                locale={locale}
                                pathname={pathname}
                                onNavigate={() => {
                                  setOpen(false);
                                  setMobileServicesOpen(false);
                                }}
                              />
                            </div>
                          </div>
                        ) : null}
                    </div>
                  );
                }

                const isAnchor = "anchor" in item && item.anchor;
                const anchorId = item.href.replace(/^[\/#]+/, "");

                if (isAnchor) {
                  return (
                    <div
                      key={item.href}
                      className="animate-mobile-menu-item"
                      style={{ animationDelay: `${i * 45}ms` }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(false);
                          if (pathname === "/") {
                            document.getElementById(anchorId)?.scrollIntoView({ behavior: "smooth" });
                          } else {
                            window.location.href = `/#${anchorId}`;
                          }
                        }}
                        className="lux-heading text-[0.72rem] tracking-[0.4em] text-pts-parchment/80 transition-colors hover:text-pts-gold-2"
                      >
                        <span suppressHydrationWarning>{t(locale, item.key as DictionaryKey)}</span>
                      </button>
                    </div>
                  );
                }

                return (
                  <div
                    key={item.href}
                    className="animate-mobile-menu-item"
                    style={{ animationDelay: `${i * 45}ms` }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={clsx(
                        "lux-heading text-[0.72rem] tracking-[0.4em] transition-colors",
                        pathname === item.href ? "text-pts-gold" : "text-pts-parchment/80 hover:text-pts-gold-2"
                      )}
                    >
                      <span suppressHydrationWarning>{t(locale, item.key as DictionaryKey)}</span>
                    </Link>
                  </div>
                );
              })}

              <div className="flex gap-3 border-t border-pts-line/15 pt-4">
                {(["en", "ar"] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    className={clsx(
                      "flex-1 border py-2.5 text-[0.6rem] uppercase tracking-[0.3em] transition-colors",
                      locale === lang ? "border-pts-gold text-pts-gold" : "border-pts-line/30 text-pts-gold-2"
                    )}
                    onClick={() => setLocale(lang)}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
    </header>
  );
}
