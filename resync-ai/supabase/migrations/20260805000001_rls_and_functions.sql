-- RLS helpers and policies

CREATE OR REPLACE FUNCTION get_user_org_ids()
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id FROM organization_members WHERE user_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION user_org_role(org_id UUID)
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM organization_members
  WHERE organization_id = org_id AND user_id = auth.uid()
  LIMIT 1;
$$;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_select ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY profiles_update ON profiles FOR UPDATE USING (id = auth.uid());

CREATE POLICY orgs_select ON organizations FOR SELECT
  USING (id IN (SELECT get_user_org_ids()));

CREATE POLICY org_members_select ON organization_members FOR SELECT
  USING (organization_id IN (SELECT get_user_org_ids()));

CREATE POLICY subscriptions_select ON subscriptions FOR SELECT
  USING (organization_id IN (SELECT get_user_org_ids()));

CREATE POLICY usage_select ON api_usage_counters FOR SELECT
  USING (organization_id IN (SELECT get_user_org_ids()));

CREATE POLICY workflows_select ON workflows FOR SELECT
  USING (
    organization_id IN (SELECT get_user_org_ids())
    OR is_template = true
  );

CREATE POLICY workflows_mutate ON workflows FOR ALL
  USING (organization_id IN (SELECT get_user_org_ids())
    AND user_org_role(organization_id) IN ('OWNER', 'ADMIN', 'BUILDER'))
  WITH CHECK (organization_id IN (SELECT get_user_org_ids())
    AND user_org_role(organization_id) IN ('OWNER', 'ADMIN', 'BUILDER'));

CREATE POLICY workflow_versions_select ON workflow_versions FOR SELECT
  USING (
    workflow_id IN (
      SELECT id FROM workflows w
      WHERE w.organization_id IN (SELECT get_user_org_ids()) OR w.is_template = true
    )
  );

CREATE POLICY workflow_versions_insert ON workflow_versions FOR INSERT
  WITH CHECK (
    workflow_id IN (
      SELECT id FROM workflows w
      WHERE w.organization_id IN (SELECT get_user_org_ids())
    )
  );

CREATE POLICY executions_select ON workflow_executions FOR SELECT
  USING (organization_id IN (SELECT get_user_org_ids()));

CREATE POLICY telemetry_select ON workflow_telemetry FOR SELECT
  USING (
    execution_id IN (
      SELECT id FROM workflow_executions e
      WHERE e.organization_id IN (SELECT get_user_org_ids())
    )
  );

CREATE POLICY audit_select ON audit_logs FOR SELECT
  USING (organization_id IN (SELECT get_user_org_ids()));

-- Service role bypasses RLS; anon cannot read tenant data without auth.
