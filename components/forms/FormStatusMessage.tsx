"use client";

import { memo } from "react";
import clsx from "clsx";
import { useLocale } from "@/contexts/LocaleContext";
import { t, type DictionaryKey } from "@/lib/dictionary";

type FormStatusMessageProps = {
  status: "idle" | "sending" | "success" | "error";
  errorMessage?: string;
};

export const FormStatusMessage = memo(function FormStatusMessage({ status, errorMessage }: FormStatusMessageProps) {
  const { locale } = useLocale();

  if (status === "idle") return null;

  return (
    <p
      role="status"
      className={clsx(
        "text-center text-[0.65rem] uppercase tracking-[0.2em]",
        status === "success" && "text-pts-gold",
        status === "error" && "text-red-400",
        status === "sending" && "text-pts-muted/70"
      )}
    >
      {status === "sending" && t(locale, "form.submit.sending" as DictionaryKey)}
      {status === "success" && t(locale, "form.submit.success" as DictionaryKey)}
      {status === "error" &&
        (errorMessage || t(locale, "form.submit.error" as DictionaryKey))}
    </p>
  );
});
