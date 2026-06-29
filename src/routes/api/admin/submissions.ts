import { createFileRoute } from "@tanstack/react-router";
import { isAdminRequest } from "@/lib/admin-auth.server";
import { createSupabaseAdminClient } from "@/lib/supabase-admin.server";

function json(payload: Record<string, unknown>, status = 200) {
  return Response.json(payload, {
    status,
    headers: { "cache-control": "no-store" },
  });
}

export const Route = createFileRoute("/api/admin/submissions")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!(await isAdminRequest(request))) {
          return json({ error: "unauthorized" }, 401);
        }

        try {
          const supabase = createSupabaseAdminClient();
          const { data, error } = await supabase
            .from("contact_submissions")
            .select(
              "id, created_at, name, email, organization, topic, timeframe, message, status, notes",
            )
            .order("created_at", { ascending: false })
            .limit(200);

          if (error) {
            console.error("błąd zapytania o zgłoszenia w panelu administracyjnym", error);
            return json({ error: "query_failed" }, 500);
          }

          return json({ submissions: data ?? [] });
        } catch (error) {
          console.error("błąd serwera zgłoszeń w panelu administracyjnym", error);
          return json({ error: "server_error" }, 500);
        }
      },
      PATCH: async ({ request }) => {
        if (!(await isAdminRequest(request))) {
          return json({ error: "unauthorized" }, 401);
        }

        try {
          const body = (await request.json()) as {
            id: string;
            status?: string;
            notes?: string | null;
          };

          const { id, status, notes } = body;
          if (!id) {
            return json({ error: "missing_id" }, 400);
          }

          const updateData: { status?: string; notes?: string | null } = {};
          if (status !== undefined) updateData.status = status;
          if (notes !== undefined) updateData.notes = notes;

          const supabase = createSupabaseAdminClient();
          const { error } = await supabase
            .from("contact_submissions")
            .update(updateData)
            .eq("id", id);

          if (error) {
            console.error("błąd aktualizacji zgłoszenia w panelu administracyjnym", error);
            return json({ error: "update_failed" }, 500);
          }

          return json({ ok: true });
        } catch (error) {
          console.error("błąd serwera podczas aktualizacji w panelu administracyjnym", error);
          return json({ error: "server_error" }, 500);
        }
      },
      DELETE: async ({ request }) => {
        if (!(await isAdminRequest(request))) {
          return json({ error: "unauthorized" }, 401);
        }

        try {
          const body = (await request.json()) as { id?: string };

          if (!body.id) {
            return json({ error: "missing_id" }, 400);
          }

          const supabase = createSupabaseAdminClient();
          const { error } = await supabase.from("contact_submissions").delete().eq("id", body.id);

          if (error) {
            console.error("błąd usuwania zgłoszenia w panelu administracyjnym", error);
            return json({ error: "delete_failed" }, 500);
          }

          return json({ ok: true });
        } catch (error) {
          console.error("błąd serwera podczas usuwania w panelu administracyjnym", error);
          return json({ error: "server_error" }, 500);
        }
      },
    },
  },
});
