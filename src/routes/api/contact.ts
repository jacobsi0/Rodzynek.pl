import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { sendEmail } from "@/lib/email.server";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(200),
  email: z.string().trim().email().max(320),
  organization: z.string().trim().min(2).max(200),
  topic: z.string().trim().min(1).max(200),
  timeframe: z.string().trim().min(1).max(200),
  message: z.string().trim().max(4000).nullable().optional(),
  website: z.string().max(0).optional().or(z.literal("")),
});

function json(payload: Record<string, unknown>, status = 200) {
  return Response.json(payload, {
    status,
    headers: { "cache-control": "no-store" },
  });
}

function createSupabaseContactClient() {
  const url = process.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Brakuje zmiennych środowiskowych Supabase dla formularza kontaktowego.");
  }

  return createClient<Database>(url, key, {
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      GET: async () => json({ error: "method_not_allowed" }, 405),
      POST: async ({ request }) => {
        let body: unknown;

        try {
          body = await request.json();
        } catch {
          return json({ error: "invalid_json" }, 400);
        }

        const parsed = contactSchema.safeParse(body);
        if (!parsed.success) {
          return json({ error: "validation_failed" }, 422);
        }

        if (parsed.data.website) {
          return json({ ok: true });
        }

        try {
          const supabase = createSupabaseContactClient();
          const { error } = await supabase.from("contact_submissions").insert({
            name: parsed.data.name,
            email: parsed.data.email,
            organization: parsed.data.organization,
            topic: parsed.data.topic,
            timeframe: parsed.data.timeframe,
            message: parsed.data.message?.trim() ? parsed.data.message : null,
          });

          if (error) {
            console.error("błąd zapisu formularza kontaktowego", error);
            return json({ error: "submit_failed" }, 500);
          }

          // Wysyłanie e-maili powiadomień po pomyślnym zapisie w bazie
          try {
            const adminEmail = process.env.EMAIL_TO_ADMIN || "rodzynekpl.kontakt@gmail.com";
            
            // 1. E-mail powiadomienia dla administratora
            const adminHtml = `
              <div style="font-family: sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #fcfbfa; color: #372a25;">
                <div style="text-align: center; border-bottom: 2px solid #8c736c; padding-bottom: 15px; margin-bottom: 20px;">
                  <h1 style="color: #463b37; margin: 0; font-size: 24px;">🍇 Nowe zgłoszenie na Rodzynek.pl</h1>
                </div>
                
                <p>Otrzymano nową wiadomość z formularza kontaktowego:</p>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; width: 140px; border-bottom: 1px solid #efecea;">Imię i nazwisko:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #efecea;">${parsed.data.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #efecea;">E-mail:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #efecea;"><a href="mailto:${parsed.data.email}" style="color: #8c736c;">${parsed.data.email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #efecea;">Organizacja:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #efecea;">${parsed.data.organization}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #efecea;">Temat:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #efecea;">${parsed.data.topic}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #efecea;">Preferowany termin:</td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #efecea; font-weight: bold; color: #463b37;">${parsed.data.timeframe}</td>
                  </tr>
                </table>
                
                <div style="margin-bottom: 25px;">
                  <h3 style="color: #463b37; margin-bottom: 8px;">Wiadomość:</h3>
                  <div style="background-color: #f7f5f3; padding: 15px; border-radius: 8px; font-style: italic; border-left: 4px solid #8c736c;">
                    ${parsed.data.message ? parsed.data.message.replace(/\n/g, "<br>") : "-"}
                  </div>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                  <a href="https://rodzynek.pl/admin" style="background-color: #8c736c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block;">Przejdź do panelu admina</a>
                </div>
              </div>
            `;
            
            await sendEmail({
              to: adminEmail,
              subject: `🍇 Nowe zgłoszenie: ${parsed.data.organization} - ${parsed.data.topic}`,
              html: adminHtml,
            });

            // 2. E-mail potwierdzenia dla użytkownika (szkoły)
            // Dobieramy język na podstawie wybranej opcji tematu
            const isEnglish = parsed.data.topic.toLowerCase().includes("workshop for");
            
            const userSubject = isEnglish 
              ? "🍇 Thank you for inviting Rodzynek.pl!" 
              : "🍇 Dziękujemy za zgłoszenie - Rodzynek.pl";
              
            const userHtml = isEnglish ? `
              <div style="font-family: sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #fcfbfa; color: #372a25;">
                <div style="text-align: center; border-bottom: 2px solid #8c736c; padding-bottom: 15px; margin-bottom: 20px;">
                  <h1 style="color: #463b37; margin: 0; font-size: 24px;">🍇 Thank you for inviting us!</h1>
                </div>
                
                <p>Hello <strong>${parsed.data.name}</strong>,</p>
                
                <p>Thank you for submitting a request to invite <strong>Rodzynek.pl</strong> to <strong>${parsed.data.organization}</strong>.</p>
                
                <p>We have successfully registered your request for the workshop: <strong>${parsed.data.topic}</strong> (preferred timeframe: <strong>${parsed.data.timeframe}</strong>).</p>
                
                <p>We are a peer-to-peer student initiative. We will get in touch with you at this email address within approximately <strong>24 hours</strong> to discuss dates and details.</p>
                
                <hr style="border: none; border-top: 1px solid #efecea; margin: 25px 0;" />
                
                <p style="font-size: 14px; color: #8c736c; font-style: italic; text-align: center;">"A peer-to-peer conversation can change more than any textbook."</p>
                
                <div style="text-align: center; margin-top: 25px; font-size: 14px; color: #6e5e58;">
                  <strong>Rodzynek.pl Team</strong><br />
                  University of Lodz, Poland<br />
                  Instagram: <a href="https://instagram.com/rodzynekedu" style="color: #8c736c;">@rodzynekedu</a>
                </div>
              </div>
            ` : `
              <div style="font-family: sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #fcfbfa; color: #372a25;">
                <div style="text-align: center; border-bottom: 2px solid #8c736c; padding-bottom: 15px; margin-bottom: 20px;">
                  <h1 style="color: #463b37; margin: 0; font-size: 24px;">🍇 Dziękujemy za zgłoszenie!</h1>
                </div>
                
                <p>Dzień dobry <strong>${parsed.data.name}</strong>,</p>
                
                <p>Dziękujemy za przesłanie formularza i zaproszenie projektu <strong>Rodzynek.pl</strong> do <strong>${parsed.data.organization}</strong>.</p>
                
                <p>Zarejestrowaliśmy Twoje zgłoszenie na temat: <strong>${parsed.data.topic}</strong> (preferowany termin: <strong>${parsed.data.timeframe}</strong>).</p>
                
                <p>Jako inicjatywa studencka dbamy o najwyższą jakość prowadzonych działań. Skontaktujemy się z Tobą na ten adres e-mail w ciągu ok. <strong>24 godzin</strong>, aby omówić szczegóły i potwierdzić termin warsztatów.</p>
                
                <hr style="border: none; border-top: 1px solid #efecea; margin: 25px 0;" />
                
                <p style="font-size: 14px; color: #8c736c; font-style: italic; text-align: center;">„Rozmowa rówieśnika z rówieśnikiem zmienia więcej niż jakikolwiek podręcznik.”</p>
                
                <div style="text-align: center; margin-top: 25px; font-size: 14px; color: #6e5e58;">
                  <strong>Zespół Rodzynek.pl</strong><br />
                  Uniwersytet Łódzki<br />
                  Instagram: <a href="https://instagram.com/rodzynekedu" style="color: #8c736c;">@rodzynekedu</a>
                </div>
              </div>
            `;

            await sendEmail({
              to: parsed.data.email,
              subject: userSubject,
              html: userHtml,
            });
          } catch (emailError) {
            console.error("Błąd wysyłania powiadomień e-mail:", emailError);
          }
        } catch (error) {
          console.error("błąd serwera formularza kontaktowego", error);
          return json({ error: "server_error" }, 500);
        }

        return json({ ok: true });
      },
    },
  },
});
