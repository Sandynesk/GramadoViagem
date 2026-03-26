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
CREATE POLICY "Usuarios podem ver seu próprio perfil"
  ON perfil FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios podem criar seu próprio perfil"
  ON perfil FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios podem atualizar seu próprio perfil"
  ON perfil FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Políticas para "favoritos"
CREATE POLICY "Usuarios podem ver seus próprios favoritos"
  ON favoritos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios podem criar seus próprios favoritos"
  ON favoritos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios podem atualizar seus próprios favoritos"
  ON favoritos FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
