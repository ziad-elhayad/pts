"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

type PerformanceTier = "Elite" | "Standard" | "Eco";

interface PerformanceContextType {
  tier: PerformanceTier;
  isLowEnd: boolean;
  reducedMotion: boolean;
  isHydrated: boolean;
}

const PerformanceContext = createContext<PerformanceContextType>({
  tier: "Elite",
  isLowEnd: false,
  reducedMotion: false,
  isHydrated: false,
});

export const PerformanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tier, setTier] = useState<PerformanceTier>("Elite");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    if (typeof window === "undefined") return;

    // 1. Detect Reduced Motion preference
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener("change", handleMotionChange);

    // 2. Hardware Detection
    const checkPerformance = () => {
      const memory = (navigator as any).deviceMemory || 8;
      const cores = navigator.hardwareConcurrency || 4;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      if (memory <= 4 || cores <= 4 || (isMobile && memory <= 4)) {
        setTier("Eco");
      } else if (memory < 8 || cores < 8 || isMobile) {
        setTier("Standard");
      } else {
        setTier("Elite");
      }
    };

    checkPerformance();
    return () => motionQuery.removeEventListener("change", handleMotionChange);
  }, []);

  const value = useMemo(() => ({
    tier,
    isLowEnd: tier === "Eco",
    reducedMotion,
    isHydrated
  }), [tier, reducedMotion, isHydrated]);

  return (
    <PerformanceContext.Provider value={value}>
      <div className={isHydrated && tier === "Eco" ? "eco-mode" : ""}>
        {children}
      </div>
    </PerformanceContext.Provider>
  );
};

export const usePerformance = () => useContext(PerformanceContext);
