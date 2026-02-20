
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/lib/customSupabaseClient";
import { useToast } from "@/components/ui/use-toast";
import { useCallback } from "react";

export function useTrackSoftware() {
  const { user } = useAuth();
  const { toast } = useToast();

  const trackSoftware = useCallback(async (softwareId, version) => {
    if (!user) {
      toast({ variant: "destructive", title: "Not logged in", description: "You must be logged in to track software." });
      return { success: false, error: "User not authenticated" };
    }

    try {
      // Check if it's already tracked
      const { data: existing, error: checkError } = await supabase
        .from('user_software_versions')
        .select('id')
        .eq('user_id', user.id)
        .eq('software_id', softwareId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') { // Ignore "exact one row" error
        throw checkError;
      }
      
      if (existing) {
        toast({ title: "Already tracked", description: "You are already tracking this software." });
        return { success: true };
      }

      // If not tracked, insert it
      const { error: insertError } = await supabase
        .from('user_software_versions')
        .insert({
          user_id: user.id,
          software_id: softwareId,
          current_version: version,
        });

      if (insertError) throw insertError;

      toast({ title: "Software added!", description: "It is now being tracked on your dashboard." });
      return { success: true };

    } catch (error) {
      console.error("Error tracking software:", error);
      toast({ variant: "destructive", title: "An error occurred", description: error.message });
      return { success: false, error: error.message };
    }
  }, [user, toast]);
  
  const untrackSoftware = useCallback(async (recordId) => {
    if (!user) {
      toast({ variant: "destructive", title: "Not logged in" });
      return { success: false, error: "User not authenticated" };
    }
    
    try {
      const { error } = await supabase
        .from('user_software_versions')
        .delete()
        .eq('id', recordId);

      if (error) throw error;
      
      toast({ title: "Software removed", description: "It is no longer tracked." });
      return { success: true }; // Correctly return success
    
    } catch (error) {
      console.error("Error untracking software:", error);
      toast({ variant: "destructive", title: "Delete failed", description: error.message });
      return { success: false, error: error.message };
    }
  }, [user, toast]);

  return { trackSoftware, untrackSoftware };
}
