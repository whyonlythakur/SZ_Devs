
-- Clean up old, unused tables from the previous attempt
DROP TABLE IF EXISTS public.access_codes CASCADE;
DROP TABLE IF EXISTS public.bots CASCADE;

-- Role enum
CREATE TYPE public.staff_role AS ENUM ('founder', 'ceo', 'coo', 'cto');

-- Staff users
CREATE TABLE public.staff_users (
  discord_id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  avatar TEXT,
  role public.staff_role NOT NULL,
  is_frozen BOOLEAN NOT NULL DEFAULT false,
  frozen_by TEXT,
  frozen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.staff_users TO service_role;
ALTER TABLE public.staff_users ENABLE ROW LEVEL SECURITY;
-- No public policies; access only via edge functions using service role.

-- Bots
CREATE TABLE public.bots (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  difficulty TEXT,
  language TEXT,
  views INTEGER NOT NULL DEFAULT 0,
  likes INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  banner_image TEXT,
  full_description TEXT,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  features TEXT[] NOT NULL DEFAULT '{}',
  access_code TEXT,
  filelink TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_by TEXT REFERENCES public.staff_users(discord_id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.bots TO anon, authenticated;
GRANT ALL ON public.bots TO service_role;
ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view visible bots"
  ON public.bots FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

-- Bot files
CREATE TABLE public.bot_files (
  id BIGSERIAL PRIMARY KEY,
  bot_id BIGINT NOT NULL REFERENCES public.bots(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  language TEXT NOT NULL,
  code TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bot_files_bot_id ON public.bot_files(bot_id);

GRANT SELECT ON public.bot_files TO anon, authenticated;
GRANT ALL ON public.bot_files TO service_role;
ALTER TABLE public.bot_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view files of visible bots"
  ON public.bot_files FOR SELECT
  TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.bots b WHERE b.id = bot_files.bot_id AND b.is_visible = true));

-- Audit log
CREATE TABLE public.audit_log (
  id BIGSERIAL PRIMARY KEY,
  actor_discord_id TEXT,
  actor_role public.staff_role,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_log_created_at ON public.audit_log(created_at DESC);

GRANT ALL ON public.audit_log TO service_role;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
-- No public policies.

-- updated_at trigger (function already exists from earlier migrations)
CREATE TRIGGER trg_staff_users_updated_at
  BEFORE UPDATE ON public.staff_users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_bots_updated_at
  BEFORE UPDATE ON public.bots
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
