export async function sendEmail({
  to,
  subject,
  html,
  from,
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[Email] RESEND_API_KEY is not set. Skipping email sending.");
    return;
  }

  // Fallback do onboarding@resend.dev, jeśli nie ma zweryfikowanej domeny
  const sender = from || process.env.EMAIL_FROM || "Rodzynek.pl <no-reply@rodzynek.pl>";

  console.log(`[Email] Wysyłanie e-maila do ${to} z tematem "${subject}"`);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: sender,
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errPayload = await response.text();
    console.error(`[Email] Błąd wysyłania e-maila przez Resend: ${errPayload}`);
    throw new Error(`Resend API error: ${response.status} - ${errPayload}`);
  }

  const data = (await response.json()) as { id?: string };
  console.log(`[Email] E-mail wysłany pomyślnie. ID: ${data.id}`);
  return data;
}
