export function formDataToRecord(form: HTMLFormElement): Record<string, string> {
  const data: Record<string, string> = {};
  const formData = new FormData(form);

  formData.forEach((value, key) => {
    if (typeof value === "string") {
      data[key] = value;
    }
  });

  return data;
}

export async function submitEnquiry(
  source: string,
  data: Record<string, string>
): Promise<{ ok: true } | { ok: false; error: string }> {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "00000000-0000-0000-0000-000000000000";
  const toEmail = process.env.NEXT_PUBLIC_ENQUIRY_TO_EMAIL ?? "info@gervae.com";

  // Format email body
  const lines = [
    "New enquiry from GERVAE website",
    "----------------------------------------",
    `Form: ${source}`,
    `Submitted: ${new Date().toISOString()}`,
    "",
    ...Object.entries(data).map(([key, value]) => {
      const label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (c) => c.toUpperCase())
        .trim();
      return `${label}: ${value || "—"}`;
    }),
  ];
  const message = lines.join("\n");

  // Mock mode for testing without real Web3Forms access key
  if (accessKey === "00000000-0000-0000-0000-000000000000") {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { ok: true };
  }

  // Submit directly to Web3Forms from client-side
  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `GERVAE Enquiry — ${source}`,
      from_name: data.firstName || data.fullName || 'Unknown',
      reply_to: data.email || undefined,
      email: toEmail,
      message: message,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return { ok: false, error: `Failed to send message: ${errorText}` };
  }

  const result = await response.json();

  if (!result.success) {
    return { ok: false, error: "Failed to send message via Web3Forms" };
  }

  return { ok: true };
}
