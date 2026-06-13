"use client";

import { useEffect } from "react";

export function ContentProtection() {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = 
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;

      // Allow default input handling (like select all, copy, cut, paste, save) on interactive input elements
      if (isInput) {
        return;
      }

      const key = e.key.toLowerCase();
      const ctrlOrMeta = e.ctrlKey || e.metaKey;

      // Disable specific keyboard shortcuts globally
      if (
        ctrlOrMeta &&
        (key === "c" || // Copy
         key === "x" || // Cut
         key === "a" || // Select All
         key === "s" || // Save Page
         key === "u" || // View Source
         key === "p" || // Print Page
         key === "f" || // Find
         key === "g")   // Find Next
      ) {
        e.preventDefault();
        return false;
      }

      // Disable F12 (Developer Tools)
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C (Inspect Element and DevTools)
      if (
        ctrlOrMeta &&
        e.shiftKey &&
        (key === "i" || key === "j" || key === "c")
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Disable copy, cut, and paste events
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = 
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;

      if (isInput) {
        return;
      }

      e.preventDefault();
      return false;
    };

    const handleCut = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = 
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;

      if (isInput) {
        return;
      }

      e.preventDefault();
      return false;
    };

    const handlePaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = 
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;

      if (isInput) {
        return;
      }

      e.preventDefault();
      return false;
    };

    // Add event listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCut);
    document.addEventListener("paste", handlePaste);

    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  return null;
}
