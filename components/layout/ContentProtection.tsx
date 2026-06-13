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
      // Check if the target is an input, textarea, or contenteditable element
      const target = e.target as HTMLElement;
      const isInput = 
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;

      // Allow all keyboard events on inputs and interactive elements
      if (isInput) {
        return;
      }

      // Disable specific keyboard shortcuts
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "c" || // Ctrl+C / Cmd+C (Copy)
         e.key === "x" || // Ctrl+X / Cmd+X (Cut)
         e.key === "a" || // Ctrl+A / Cmd+A (Select All)
         e.key === "s" || // Ctrl+S / Cmd+S (Save)
         e.key === "u" || // Ctrl+U / Cmd+U (View Source)
         e.key === "p" || // Ctrl+P / Cmd+P (Print)
         e.key === "f" || // Ctrl+F / Cmd+F (Find)
         e.key === "g")   // Ctrl+G / Cmd+G (Find Next)
      ) {
        e.preventDefault();
        return false;
      }

      // Disable F12 (Developer Tools)
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+Shift+I (Developer Tools)
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === "I" || e.key === "i")
      ) {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+Shift+J (Console)
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === "J" || e.key === "j")
      ) {
        e.preventDefault();
        return false;
      }

      // Disable Ctrl+Shift+C (Inspect Element)
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === "C" || e.key === "c")
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

      // Allow copy on inputs and interactive elements
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

      // Allow cut on inputs and interactive elements
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

      // Allow paste on inputs and interactive elements
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
