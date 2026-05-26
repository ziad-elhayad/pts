"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Save the currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;
    const scrollY = window.scrollY;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    // Lock html scroll as well for extra safety
    const htmlOriginalOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    // Focus trap
    if (modalRef.current) {
      modalRef.current.focus();
    }

    return () => {
      // Restore body scroll
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;

      // Restore html scroll
      document.documentElement.style.overflow = htmlOriginalOverflow;

      // Restore scroll position
      if (originalPosition === 'fixed') {
        window.scrollTo(0, parseInt(originalTop || '0', 10) * -1);
      }

      // Restore focus
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex min-h-0 items-center justify-center overflow-y-auto overscroll-contain bg-pts-black/80 p-3 backdrop-blur-sm sm:p-4 md:p-6"
      data-lenis-prevent
      style={{ height: "100dvh", WebkitOverflowScrolling: "touch" }}
    >
      <div 
        ref={modalRef}
        className="my-4 flex w-full max-w-md flex-col overflow-hidden border border-pts-gold/30 bg-pts-deep"
        style={{ maxHeight: "calc(100dvh - 2rem)" }}
        data-lenis-prevent
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
