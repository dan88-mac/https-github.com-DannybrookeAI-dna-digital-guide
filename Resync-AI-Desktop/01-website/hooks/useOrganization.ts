"use client";

import { useEffect, useState } from "react";
import { createClientSafe } from "@/lib/supabase/client";

export function useOrganization() {
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClientSafe();
    if (!supabase) {
      setLoading(false);
      return;
    }
    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("organization_members")
        .select("organization_id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();
      setOrganizationId(data?.organization_id ?? null);
      setLoading(false);
    })();
  }, []);

  return { organizationId, loading };
}
