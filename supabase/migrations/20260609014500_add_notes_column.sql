-- Dodanie kolumny notes (notatki administratora) do tabeli contact_submissions
ALTER TABLE public.contact_submissions ADD COLUMN notes text;
