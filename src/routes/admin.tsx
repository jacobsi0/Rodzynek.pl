import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  LogOut,
  RefreshCw,
  Download,
  Pencil,
  Plus,
  X,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Submission = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  organization: string;
  topic: string;
  message: string | null;
  status: string;
  notes: string | null;
};

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel administracyjny | Rodzynek.pl" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function StatusSelector({
  status,
  onChange,
  disabled,
}: {
  status: string;
  onChange: (newStatus: string) => void;
  disabled?: boolean;
}) {
  const statuses = [
    {
      value: "new",
      label: "Nowe",
      styles: "bg-clay-soft text-clay border-clay/15 dark:border-clay/30",
    },
    {
      value: "contacted",
      label: "W kontakcie",
      styles: "bg-honey/15 text-clay dark:text-honey border-honey/25",
    },
    {
      value: "scheduled",
      label: "Umówione",
      styles: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    },
    {
      value: "completed",
      label: "Zrealizowane",
      styles: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    {
      value: "archived",
      label: "Zarchiwizowane",
      styles: "bg-sand/40 text-ink-soft dark:bg-sand/20 border-border",
    },
  ];

  const current = statuses.find((s) => s.value === status) || statuses[0];

  return (
    <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
      <select
        value={status}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none rounded-full px-3 py-1 text-xs font-semibold border outline-none pr-7 cursor-pointer transition focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-60 ${current.styles}`}
      >
        {statuses.map((s) => (
          <option key={s.value} value={s.value} className="bg-card text-foreground">
            {s.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] opacity-65">
        ▼
      </span>
    </div>
  );
}

function EditableNotes({
  id,
  initialNotes,
  onSave,
}: {
  id: string;
  initialNotes: string | null;
  onSave: (id: string, notes: string | null) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialNotes ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValue(initialNotes ?? "");
  }, [initialNotes]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(id, value.trim() ? value : null);
      setEditing(false);
    } catch {
      // Błąd obsłużony w rodzicu
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div className="flex flex-col gap-1.5 min-w-[200px]" onClick={(e) => e.stopPropagation()}>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={saving}
          className="w-full min-h-[60px] text-xs rounded-lg border border-border bg-warm p-2 outline-none focus:border-clay focus:bg-card focus-visible:ring-1 focus-visible:ring-clay/30 text-foreground"
          placeholder="Dodaj notatkę..."
          autoFocus
        />
        <div className="flex gap-1 justify-end">
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2 text-[10px] bg-card hover:bg-clay-soft"
            disabled={saving}
            onClick={() => {
              setValue(initialNotes ?? "");
              setEditing(false);
            }}
          >
            <X className="mr-1 h-3 w-3" /> Anuluj
          </Button>
          <Button
            size="sm"
            className="h-7 px-2 text-[10px] bg-clay hover:opacity-90 text-primary-foreground"
            disabled={saving}
            onClick={handleSave}
          >
            <Check className="mr-1 h-3 w-3" /> Zapisz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => setEditing(true)}
      className="group relative cursor-pointer min-h-[36px] rounded-xl p-2 transition hover:bg-clay-soft/40 hover:ring-1 hover:ring-clay/10"
    >
      {initialNotes ? (
        <p className="text-xs text-muted-foreground whitespace-pre-wrap pr-5">{initialNotes}</p>
      ) : (
        <span className="text-xs text-muted-foreground/45 italic flex items-center gap-1">
          <Plus className="h-3 w-3" /> Dodaj notatkę
        </span>
      )}
      {initialNotes && (
        <span className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-clay">
          <Pencil className="h-3.5 w-3.5" />
        </span>
      )}
    </div>
  );
}

function exportToCSV(data: Submission[]) {
  const headers = [
    "Data",
    "Imię i nazwisko",
    "E-mail",
    "Organizacja",
    "Temat",
    "Wiadomość",
    "Status",
    "Notatki",
  ];
  const rows = data.map((s) => [
    formatDate(s.created_at),
    s.name,
    s.email,
    s.organization,
    s.topic,
    s.message ?? "",
    s.status,
    s.notes ?? "",
  ]);

  const csvContent =
    "\uFEFF" +
    [headers, ...rows]
      .map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(","))
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `zgloszenia_rodzynek_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [query, setQuery] = useState("");

  const filteredSubmissions = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return submissions;

    return submissions.filter((submission) =>
      [
        submission.name,
        submission.email,
        submission.organization,
        submission.topic,
        submission.message ?? "",
        submission.status,
        submission.notes ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [query, submissions]);

  const updateSubmission = async (
    id: string,
    updates: { status?: string; notes?: string | null },
  ) => {
    try {
      const response = await fetch("/api/admin/submissions", {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });

      if (!response.ok) throw new Error(`Aktualizacja nie powiodła się: ${response.status}`);

      setSubmissions((prev) => prev.map((sub) => (sub.id === id ? { ...sub, ...updates } : sub)));
      toast.success("Zmiany zostały zapisane");
    } catch (error) {
      console.error(error);
      toast.error("Nie udało się zapisać zmian");
      throw error;
    }
  };

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/submissions", { credentials: "same-origin" });
      if (response.status === 401) {
        setAuthenticated(false);
        setSubmissions([]);
        return;
      }
      if (!response.ok) throw new Error(`Pobieranie zgłoszeń nie powiodło się: ${response.status}`);

      const payload = (await response.json()) as { submissions?: Submission[] };
      setSubmissions(payload.submissions ?? []);
    } catch (error) {
      console.error(error);
      toast.error("Nie udało się pobrać zgłoszeń");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const response = await fetch("/api/admin/session", { credentials: "same-origin" });
        const payload = (await response.json()) as { authenticated?: boolean };
        if (cancelled) return;
        setAuthenticated(Boolean(payload.authenticated));
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) setCheckingSession(false);
      }
    }

    void checkSession();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (authenticated) void loadSubmissions();
  }, [authenticated]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoggingIn(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.status === 401) {
        toast.error("Niepoprawne hasło");
        return;
      }
      if (response.status === 500) {
        toast.error("Panel admina nie ma ustawionych sekretów");
        return;
      }
      if (!response.ok) throw new Error(`Logowanie nie powiodło się: ${response.status}`);

      setPassword("");
      setAuthenticated(true);
      toast.success("Zalogowano");
    } catch (error) {
      console.error(error);
      toast.error("Nie udało się zalogować");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" });
      setAuthenticated(false);
      setSubmissions([]);
      setQuery("");
      toast.success("Wylogowano");
    } catch (error) {
      console.error(error);
      toast.error("Nie udało się wylogować");
    } finally {
      setLoggingOut(false);
    }
  };

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-warm px-6 text-ink">
        <RefreshCw className="h-5 w-5 animate-spin text-clay" />
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-warm px-6 py-12 text-ink">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl border border-border bg-card p-7 shadow-soft"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-clay text-primary-foreground">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-black">Panel admina</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Wpisz hasło administratora, żeby zobaczyć zgłoszenia z formularza.
          </p>
          <label className="mt-6 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Hasło
          </label>
          <div className="mt-2 flex gap-2">
            <Input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              className="h-11 bg-warm"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-11 w-11"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <Button type="submit" disabled={loggingIn} className="mt-5 h-11 w-full bg-clay">
            {loggingIn ? "Logowanie..." : "Zaloguj"}
          </Button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-warm px-4 py-6 text-ink md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-clay">Rodzynek.pl</p>
            <h1 className="mt-2 font-display text-3xl font-black">Zgłoszenia z formularza</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Jesteś zalogowany jako administrator. Widzisz ostatnie {submissions.length} wpisów z
              formularza kontaktowego.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => exportToCSV(filteredSubmissions)}
              disabled={filteredSubmissions.length === 0}
              className="bg-card"
            >
              <Download className="h-4 w-4" />
              Eksportuj CSV
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={loadSubmissions}
              disabled={loading}
              className="bg-card"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Odśwież
            </Button>
            <Button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="bg-clay text-primary-foreground hover:bg-clay/90"
            >
              <LogOut className="h-4 w-4" />
              {loggingOut ? "Wylogowywanie..." : "Wyloguj"}
            </Button>
          </div>
        </header>

        <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Szukaj po nazwie, e-mailu, organizacji lub treści..."
            className="h-11 max-w-xl bg-card"
          />
          <div className="text-sm text-muted-foreground">
            Wyniki: {filteredSubmissions.length} / {submissions.length}
          </div>
        </div>

        <section className="mt-5 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left text-sm">
              <thead className="bg-clay-soft/50 text-xs uppercase tracking-wide text-ink-soft">
                <tr>
                  <th className="px-4 py-3 font-semibold w-[12%]">Data</th>
                  <th className="px-4 py-3 font-semibold w-[18%]">Osoba</th>
                  <th className="px-4 py-3 font-semibold w-[15%]">Organizacja</th>
                  <th className="px-4 py-3 font-semibold w-[15%]">Temat</th>
                  <th className="px-4 py-3 font-semibold w-[20%]">Wiadomość</th>
                  <th className="px-4 py-3 font-semibold w-[10%]">Status</th>
                  <th className="px-4 py-3 font-semibold w-[10%]">Notatki</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="border-t border-border align-top">
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {formatDate(submission.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold">{submission.name}</div>
                      <a
                        href={`mailto:${submission.email}`}
                        className="text-sm text-clay underline-offset-4 hover:underline"
                      >
                        {submission.email}
                      </a>
                    </td>
                    <td className="px-4 py-3">{submission.organization}</td>
                    <td className="px-4 py-3">{submission.topic}</td>
                    <td className="max-w-md px-4 py-3 text-muted-foreground">
                      {submission.message || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusSelector
                        status={submission.status}
                        onChange={(newStatus) =>
                          updateSubmission(submission.id, { status: newStatus })
                        }
                      />
                    </td>
                    <td className="px-4 py-3 max-w-[240px]">
                      <EditableNotes
                        id={submission.id}
                        initialNotes={submission.notes}
                        onSave={(id, nextNotes) => updateSubmission(id, { notes: nextNotes })}
                      />
                    </td>
                  </tr>
                ))}
                {loading && (
                  <tr>
                    <td className="px-4 py-10 text-center text-muted-foreground" colSpan={7}>
                      Ładowanie zgłoszeń...
                    </td>
                  </tr>
                )}
                {!loading && filteredSubmissions.length === 0 && (
                  <tr>
                    <td className="px-4 py-10 text-center text-muted-foreground" colSpan={7}>
                      Brak zgłoszeń do wyświetlenia.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
