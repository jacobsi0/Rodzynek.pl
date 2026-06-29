-- Dodanie kolumny na preferowany termin warsztatów
ALTER TABLE public.contact_submissions ADD COLUMN timeframe text;
