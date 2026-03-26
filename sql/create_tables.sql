-- ═══════════════════════════════════════════════════════════════════════════
-- MeuGramado — Supabase Tables
-- Execute este script no SQL Editor do Supabase Dashboard
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Tabela: perfil ──────────────────────────────────────────────────────────
-- Armazena dados do perfil do usuário
CREATE TABLE IF NOT EXISTS perfil (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  display_name TEXT DEFAULT '',
  preferences  JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id)
);

-- ── Tabela: favoritos ───────────────────────────────────────────────────────
-- Armazena as seleções do usuário (itens marcados como "Vou!" e status Prime)
CREATE TABLE IF NOT EXISTS favoritos (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  selections  JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id)
);

-- ── Index para busca rápida por user_id ─────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_perfil_user_id ON perfil (user_id);
CREATE INDEX IF NOT EXISTS idx_favoritos_user_id ON favoritos (user_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- Row Level Security (RLS) — Cada usuário só acessa seus próprios dados
-- ═══════════════════════════════════════════════════════════════════════════

-- Habilitar RLS
ALTER TABLE perfil ENABLE ROW LEVEL SECURITY;
ALTER TABLE favoritos ENABLE ROW LEVEL SECURITY;

-- Políticas para "perfil"
DROP POLICY IF EXISTS "Usuarios podem ver seu próprio perfil" ON perfil;
CREATE POLICY "Usuarios podem ver seu próprio perfil"
  ON perfil FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios podem criar seu próprio perfil" ON perfil;
CREATE POLICY "Usuarios podem criar seu próprio perfil"
  ON perfil FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios podem atualizar seu próprio perfil" ON perfil;
CREATE POLICY "Usuarios podem atualizar seu próprio perfil"
  ON perfil FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Políticas para "favoritos"
DROP POLICY IF EXISTS "Usuarios podem ver seus próprios favoritos" ON favoritos;
CREATE POLICY "Usuarios podem ver seus próprios favoritos"
  ON favoritos FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios podem criar seus próprios favoritos" ON favoritos;
CREATE POLICY "Usuarios podem criar seus próprios favoritos"
  ON favoritos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios podem atualizar seus próprios favoritos" ON favoritos;
CREATE POLICY "Usuarios podem atualizar seus próprios favoritos"
  ON favoritos FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════════════
-- Trigger para criar perfil automaticamente no SignUp
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.perfil (user_id, display_name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'display_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
