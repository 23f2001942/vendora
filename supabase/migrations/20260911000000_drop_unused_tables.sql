-- Drop unused tables (never queried in the app)
DROP TABLE IF EXISTS public.payment_transactions CASCADE;
DROP TABLE IF EXISTS public.locations CASCADE;
DROP TABLE IF EXISTS public.payment_methods CASCADE;

-- Merge user_roles into profiles: add role column, migrate data, drop table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'customer';
UPDATE public.profiles p SET role = ur.role FROM public.user_roles ur WHERE ur.user_id = p.id;
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- Fix has_role() to read from profiles.role instead of dropped user_roles table
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND role = _role::text
  )
$$;
