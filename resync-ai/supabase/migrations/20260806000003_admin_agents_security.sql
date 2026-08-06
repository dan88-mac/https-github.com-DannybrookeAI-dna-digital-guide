-- Admin roles, security events, agent memory (consolidation)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS app_role TEXT NOT NULL DEFAULT 'user'
    CHECK (app_role IN ('user', 'admin'));

CREATE TABLE IF NOT EXISTS security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL,
  path TEXT,
  ip_hash TEXT,
  user_agent TEXT,
  detail JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS security_events_created_idx ON security_events (created_at DESC);
CREATE INDEX IF NOT EXISTS security_events_kind_idx ON security_events (kind);

CREATE TABLE IF NOT EXISTS agent_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  memory_kind TEXT NOT NULL CHECK (memory_kind IN ('working', 'reverse', 'future')),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS agent_memory_agent_idx ON agent_memory (agent_id, created_at DESC);

CREATE TABLE IF NOT EXISTS agent_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'applied')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  decided_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS site_analytics_daily (
  day DATE PRIMARY KEY,
  visits INTEGER NOT NULL DEFAULT 0,
  signups INTEGER NOT NULL DEFAULT 0,
  completed_flows INTEGER NOT NULL DEFAULT 0,
  pending_subscribers INTEGER NOT NULL DEFAULT 0
);
