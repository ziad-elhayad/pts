export const ENQUIRY_TO_EMAIL =
  process.env.ENQUIRY_TO_EMAIL ?? "info@gervae.com";

export type EnquiryPayload = {
  source: string;
  data: Record<string, string>;
};

function formatEmailBody({ source, data }: EnquiryPayload): string {
  const lines = [
    "New enquiry from PTS website",
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
  return lines.join("\n");
}

export async function sendEnquiryEmail(payload: EnquiryPayload): Promise<void> {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY ?? "YOUR_WEB3FORMS_ACCESS_KEY";
  
  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `PTS Enquiry — ${payload.source}`,
      from_name: payload.data.firstName || payload.data.fullName || 'Unknown',
      reply_to: payload.data.email || undefined,
      email: ENQUIRY_TO_EMAIL,
      message: formatEmailBody(payload),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Web3Forms error: ${error}`);
  }

  const result = await response.json();
  
  if (!result.success) {
    throw new Error('Failed to send message via Web3Forms');
  }
}
