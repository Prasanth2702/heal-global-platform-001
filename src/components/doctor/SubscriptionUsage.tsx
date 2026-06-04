import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PhoneIcon } from "lucide-react";

interface SubscriptionUsageProps {
  professionalId: string;
  highlightType?: "clinical" | "tele"; // optional: highlight a specific bar
}

export const SubscriptionUsage = ({ professionalId, highlightType }: SubscriptionUsageProps) => {
  const [limits, setLimits] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(true);

  useEffect(() => {
    if (!professionalId) return;
    const fetchLimits = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
        
        const response = await fetch(
          "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/check-professional-limit",
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              user_auth_id: professionalId,
            })
          }
        );
        const result = await response.json();
        
        const transformedLimits = {
          clinical: result.limits?.in_person || { used: 0, max: 0, remaining: 0 },
          tele: result.limits?.teleconsultation || { used: 0, max: 0, remaining: 0 }
        };
        
        setLimits(transformedLimits);
        setHasSubscription(result.hasActiveSubscription);
      } catch (err) {
        console.error('Error fetching subscription limits:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLimits();
  }, [professionalId]);

  if (loading) return <div className="text-center py-2">Loading usage...</div>;
  
  if (!hasSubscription || (limits?.clinical?.max === 0 && limits?.tele?.max === 0)) {
    return (
      <div className="text-center py-4 border rounded-lg bg-amber-50">
        <p className="text-amber-800">⚠️ No active subscription found.</p>
        <p className="text-sm text-gray-600 mt-1">
          Please contact support or upgrade your plan to continue.
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-3"
          onClick={() => window.open('/pricing', '_blank')}
        >
          View Plans
        </Button>
      </div>
    );
  }

  if (!limits) return null;

  // Helper to get class for highlight
  const getBarClass = (type: "clinical" | "tele") => {
    let base = "w-full h-2 rounded-full ";
    if (highlightType === type) {
      base += "ring-2 ring-offset-1 ring-blue-500";
    }
    if (type === "clinical") {
      return base + (limits.clinical.remaining < 10 ? "text-red-500" : "text-green-500");
    } else {
      return base + (limits.tele.remaining < 10 ? "text-red-500" : "text-green-500");
    }
  };

  return (
    <div className="space-y-4">
      <div className={`p-3 rounded-lg transition-all ${highlightType === "clinical" ? "bg-blue-50 border border-blue-200" : ""}`}>
        <div className="flex justify-between text-sm">
          <span className="font-medium">Clinical Consultations (In-Person)</span>
          <span>{limits.clinical.used} / {limits.clinical.max}</span>
        </div>
        <progress 
          value={limits.clinical.used} 
          max={limits.clinical.max}
          className={getBarClass("clinical")}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {limits.clinical.remaining} remaining this month
        </p>
      </div>
      <div className={`p-3 rounded-lg transition-all ${highlightType === "tele" ? "bg-purple-50 border border-purple-200" : ""}`}>
        <div className="flex justify-between text-sm">
          <span className="font-medium">Tele-Consultations</span>
          <span>{limits.tele.used} / {limits.tele.max}</span>
        </div>
        <progress 
          value={limits.tele.used} 
          max={limits.tele.max}
          className={getBarClass("tele")}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {limits.tele.remaining} remaining this month
        </p>
        <p className="text-sm text-muted-foreground">Contact us to update your number</p>

<p className="flex items-center justify-center">
  <PhoneIcon size={18} className="text-primary mr-2 flex-shrink-0" />
  <span className="text-primary">{import.meta.env.VITE_SUPPORT_PHONE_NUMBER}</span>
</p>
      </div>
    </div>
  );
};

export default SubscriptionUsage;