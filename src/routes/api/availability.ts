import { createFileRoute } from "@tanstack/react-router";
import { createSupabaseAdminClient } from "@/lib/supabase-admin.server";

const RESERVED_WORKSHOP_SLOTS = 1;

function json(payload: Record<string, unknown>, status = 200) {
  return Response.json(payload, {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json",
    },
  });
}

export const Route = createFileRoute("/api/availability")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const supabase = createSupabaseAdminClient();

          // Liczymy zgłoszenia ze statusem 'scheduled' (umówione) oraz 'completed' (zrealizowane)
          const { count, error } = await supabase
            .from("contact_submissions")
            .select("*", { count: "exact", head: true })
            .in("status", ["scheduled", "completed"]);

          if (error) {
            console.error("Błąd zapytania o wolne miejsca:", error);
            return json({ error: "query_failed" }, 500);
          }

          return json({
            bookedCount: Math.max(count ?? 0, RESERVED_WORKSHOP_SLOTS),
          });
        } catch (error) {
          console.error("Błąd serwera podczas sprawdzania dostępności:", error);
          return json({ error: "server_error" }, 500);
        }
      },
    },
  },
});
