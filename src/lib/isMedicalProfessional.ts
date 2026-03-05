// Utility to check if a user is a medical professional
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if the given userId exists in the medical_professionals table.
 * @param {string} userId - The user id to check.
 * @returns {Promise<boolean>} - True if user exists as a medical professional, false otherwise.
 */
export async function isMedicalProfessional(userId: string): Promise<boolean> {
  if (!userId) return false;
  const { data, error } = await supabase
    .from("medical_professionals")
    .select("id")
    .eq("id", userId)
    .single();
  return !!data && !error;
}
