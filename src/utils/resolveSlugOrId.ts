// utils/resolveSlugOrId.ts
import { supabase } from "@/integrations/supabase/client";

export async function resolveDoctor(slugOrId: string) {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);

  let query = supabase.from("medical_professionals").select(`*, medical_professionals_user_id_fkey(*)`);

  if (isUUID) {
    query = query.eq("id", slugOrId);
  } else {
    query = query.eq("slug", slugOrId);
  }

  const { data, error } = await query.maybeSingle();
  if (error || !data) return null;
  return data;
}

export async function resolveFacility(slugOrId: string) {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);

  let query = supabase.from("facilities").select("*");
  if (isUUID) {
    query = query.eq("id", slugOrId);
  } else {
    query = query.eq("slug", slugOrId);
  }

  const { data, error } = await query.maybeSingle();
  if (error || !data) return null;
  return data;
}