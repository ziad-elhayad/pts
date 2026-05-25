"use client";

import { useCallback, useState } from "react";
import { formDataToRecord, submitEnquiry } from "@/lib/submit-enquiry";

type Status = "idle" | "sending" | "success" | "error";

export function useEnquirySubmit(source: string) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setStatus("sending");
      setErrorMessage("");

      const form = event.currentTarget;
      const data = formDataToRecord(form);
      const result = await submitEnquiry(source, data);

      if (result.ok) {
        setStatus("success");
        if (form) form.reset();
        return true;
      }

      setStatus("error");
      setErrorMessage(result.error);
      return false;
    },
    [source]
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setErrorMessage("");
  }, []);

  return {
    status,
    errorMessage,
    isSending: status === "sending",
    isSuccess: status === "success",
    handleSubmit,
    reset,
  };
}
