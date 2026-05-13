// src/pages/doctor/TeleconsultationPage.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PhoneIcon, Video, AlertCircle, SubscriptIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface TeleLimits {
  used: number;
  max: number;
  remaining: number;
}

export default function TeleconsultationPage() {
  const [loading, setLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [teleLimits, setTeleLimits] = useState<TeleLimits | null>(null);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch current user and tele‑consultation limits
  useEffect(() => {
    const fetchTeleLimits = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }
        setProfessionalId(user.id);

        // Call the same edge function used in the dashboard
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;

        const response = await fetch(
          "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/check-professional-limit",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ user_auth_id: user.id }),
          }
        );
        const result = await response.json();

        setHasSubscription(result.hasActiveSubscription);
        // The edge function returns teleconsultation limits under `limits.teleconsultation`
        const tele = result.limits?.teleconsultation || { used: 0, max: 0, remaining: 0 };
        setTeleLimits(tele);
      } catch (err) {
        console.error("Error fetching tele limits:", err);
        setHasSubscription(false);
        setTeleLimits({ used: 0, max: 0, remaining: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchTeleLimits();
  }, []);

  // Determine if tele‑consultation is available
  const isTeleAvailable = hasSubscription && teleLimits && teleLimits.max > 0 && teleLimits.remaining > 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Tele Subscription Card (clickable popup) */}
      {/* <Card
        className="cursor-pointer transition-all hover:shadow-md border-primary/20"
        onClick={() => setShowContactPopup(true)}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            Tele Consultation Booking Feature Status
          </CardTitle>
          <CardDescription>
            {loading
              ? "Checking your plan..."
              : hasSubscription && teleLimits && teleLimits.max > 0
              ? `${teleLimits.remaining} tele‑consultations remaining this month`
              : "No active tele‑consultation plan"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Click here to upgrade or renew your tele‑consultation plan.
          </p>
        </CardContent>
      </Card> */}

      {/* Main Tele‑Booking Section */}
      <Card>
        <CardHeader>
          <CardTitle>Tele‑Consultation Feature</CardTitle>
          <CardDescription>
            Connect with you patient and evolve remotely with HD quality video calling feature.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading subscription details...</div>
          ) : !isTeleAvailable ? (
            <div className="text-center py-8 space-y-4 border rounded-lg bg-amber-50 border-amber-200">
              <AlertCircle className="h-12 w-12 text-amber-600 mx-auto" />
              <h3 className="text-lg font-semibold text-amber-800">
                Tele‑consultation booking is not available in your current subscription.
              </h3>
              <p className="text-amber-700 max-w-md mx-auto">
                Please purchase a subscription or contact support to enable tele‑consultations.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                className="mt-2 m-4"
                onClick={() => setShowContactPopup(true)}
              >
                <PhoneIcon className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
              <Button
                variant="outline"
                className="mt-2"
               onClick={() =>
    navigate(
      hasSubscription
        ? "/dashboard/doctor/subscription"
        : "/dashboard/facility/subscription"
    )
  }
              >
                <SubscriptIcon className="mr-2 h-4 w-4" />
                Subscription
              </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  ✅ You have {teleLimits.remaining} tele‑consultation(s) remaining this month.
                </p>
              </div>
              {/* Here you would render your actual tele‑booking form */}
              <div className="text-center py-8 border rounded-lg bg-gray-50">
                <p className="text-muted-foreground">Congratulatios, the feature is enable and you would be available in tele consultations searches.</p>
                
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Popup Dialog with Contact Number */}
      <Dialog open={showContactPopup} onOpenChange={setShowContactPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Support for Tele‑Subscription</DialogTitle>
            <DialogDescription>
              Our team will help you upgrade or renew your tele‑consultation plan.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center space-x-2 py-6">
            <PhoneIcon className="h-5 w-5 text-primary" />
            <a
              href="tel:+919886499994"
              className="text-xl font-medium text-primary underline"
            >
              +91 98864 99994
            </a>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowContactPopup(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}