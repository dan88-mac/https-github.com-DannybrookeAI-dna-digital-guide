-- Community posts table (optional server-side persistence; client store works standalone)
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  post_type TEXT NOT NULL CHECK (post_type IN ('template', 'marketplace', 'design', 'discussion')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  template_slug TEXT,
  graph JSONB,
  refinement_score INTEGER DEFAULT 0,
  refinement_grade TEXT DEFAULT '—',
  capability_summary TEXT,
  price_cents INTEGER,
  tags TEXT[] DEFAULT '{}',
  likes_count INTEGER NOT NULL DEFAULT 0,
  report_count INTEGER NOT NULL DEFAULT 0,
  nsfw BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_community_posts_type ON community_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_community_posts_created ON community_posts(created_at DESC);

CREATE TABLE IF NOT EXISTS community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_community_comments_post ON community_comments(post_id);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;

-- Public read for posts; writes require auth in production
CREATE POLICY community_posts_read ON community_posts FOR SELECT USING (true);
CREATE POLICY community_comments_read ON community_comments FOR SELECT USING (true);
