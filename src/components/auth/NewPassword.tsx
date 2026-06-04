import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import AuthLayout from "./AuthLayout";
import { supabase } from "@/integrations/supabase/client";
import mixpanelInstance from "@/utils/mixpanel";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Loader2, EyeOff, Eye } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import rollbar from "@/lib/rollbar";

const NewPassword = () => {
  const { userType } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState<string>("");
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    const handleRecovery = async () => {
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const type = hashParams.get("type");

        // If we have recovery tokens in the URL, set the session
        if (accessToken && type === "recovery") {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || "",
          });

          if (sessionError) {
            console.error("Session error:", sessionError);
            toast({
              title: "Invalid or expired link",
              description: "Please request a new password reset link.",
              variant: "destructive",
            });
            navigate(`/forgot-password/${userType}`);
            return;
          }
        }

        // Get the current authenticated user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("User error:", userError);
          toast({
            title: "Session expired",
            description: "Please request a new password reset link.",
            variant: "destructive",
          });
          navigate(`/forgot-password/${userType}`);
          return;
        }

        const email = user.email?.toLowerCase();
        
        if (!email) {
          navigate(`/login/${userType}`);
          return;
        }

        // Get profile role
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("email", email)
          .single();

        if (profileError || !profile) {
          console.error("Profile error:", profileError);
          toast({
            title: "Account not found",
            description: "No account found with this email address.",
            variant: "destructive",
          });
          navigate(`/forgot-password/${userType}`);
          return;
        }

        // Validate portal against role
        let roleMatched = false;

        switch (profile.role) {
          case "patient":
            roleMatched = userType === "patient";
            break;
          case "doctor":
            roleMatched = userType === "doctor";
            break;
          case "hospital_admin":
            roleMatched = userType === "facility" || userType === "facility-admin";
            break;
          case "hospital_staff":
            roleMatched = userType === "facility" || userType === "facility-staff";
            break;
          case "admin":
            roleMatched = userType === "admin";
            break;
        }

        const roleRouteMap: Record<string, string> = {
          patient: "/new-password/patient",
          doctor: "/new-password/doctor",
          hospital_admin: "/new-password/facility-admin",
          hospital_staff: "/new-password/facility-staff",
          admin: "/new-password/admin",
        };

        if (!roleMatched) {
          toast({
            title: "Redirecting",
            description: `You are being redirected to the ${profile.role} portal.`,
            variant: "default",
          });
          
          setTimeout(() => {
            navigate(roleRouteMap[profile.role]);
          }, 1500);
          return;
        }

        // Valid session and role match
        setVerifiedEmail(email);
        setIsValidSession(true);
        
      } catch (error) {
        console.error("Recovery error:", error);
        toast({
          title: "Error",
          description: "An error occurred. Please request a new password reset link.",
          variant: "destructive",
        });
        navigate(`/forgot-password/${userType}`);
      }
    };

    handleRecovery();
  }, [userType, navigate, toast]);

  const userTypeConfig: Record<
    string,
    {
      passwordTitle: string;
      passwordDescription: string;
      variant: "patient" | "doctor" | "facility" | "admin";
    }
  > = {
    patient: {
      passwordTitle: "Create New Patient Password",
      passwordDescription: "Choose a strong password to secure your health dashboard",
      variant: "patient",
    },
    doctor: {
      passwordTitle: "Create New Medical Professional Password",
      passwordDescription: "Choose a strong password to secure your practice management dashboard",
      variant: "doctor",
    },
    facility: {
      passwordTitle: "Create New Facility Password",
      passwordDescription: "Choose a strong password to secure your facility management dashboard",
      variant: "facility",
    },
    "facility-admin": {
      passwordTitle: "Create New Admin Password",
      passwordDescription: "Choose a strong password to secure your facility administration access",
      variant: "facility",
    },
    "facility-staff": {
      passwordTitle: "Create New Staff Password",
      passwordDescription: "Choose a strong password to secure your assigned operations access",
      variant: "facility",
    },
    admin: {
      passwordTitle: "Create New Admin Password",
      passwordDescription: "Choose a strong password to secure your platform administration access",
      variant: "admin",
    },
  };

  const config =
    userTypeConfig[userType as keyof typeof userTypeConfig] ||
    userTypeConfig.patient;

  useEffect(() => {
    mixpanelInstance.track("New Password Page Viewed", { userType });
  }, [userType]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    mixpanelInstance.track("New Password - Reset Attempt", { email: verifiedEmail, userType });
    setLoading(true);

    try {
      // Get the current session user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please request a new password reset link.",
          variant: "destructive",
        });
        navigate(`/forgot-password/${userType}`);
        return;
      }
      
      // Validate that the session email matches the verified email
      if (user.email?.toLowerCase() !== verifiedEmail.toLowerCase()) {
        toast({
          title: "Email Mismatch",
          description: "Security validation failed. Please request a new password reset link.",
          variant: "destructive",
        });
        navigate(`/forgot-password/${userType}`);
        return;
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        console.error("Supabase update error:", error);
        toast({
          title: "Reset Failed",
          description: error.message || "Failed to reset password. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Sign out after password reset to ensure new password is used
      await supabase.auth.signOut();

      toast({
        title: "Password Reset Successful!",
        description: `Your password has been updated. Please login with your new password.`,
      });

      mixpanelInstance.track("New Password - Success", { email: verifiedEmail, userType });

      setTimeout(() => {
        navigate(`/login/${userType}`);
      }, 2000);
    } catch (error: any) {
      console.error("Error resetting password:", error);
      rollbar.error("New Password - Reset Error", error);
      toast({
        title: "Reset Failed",
        description: error.message || "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate(`/login/${userType}`);
  };

  if (!isValidSession && verifiedEmail === "") {
    return (
      <AuthLayout title="Loading..." description="Please wait" userType={config.variant}>
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={config.passwordTitle}
      description={config.passwordDescription}
      userType={config.variant}
    >
      <div className="space-y-6">
        <button
          onClick={handleBackToLogin}
          className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Login
        </button>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <Alert variant="default" className="border-blue-500 bg-blue-50">
            <AlertDescription className="text-blue-700">
              Please enter your new password below for account:
            </AlertDescription>
          </Alert>
          
          {/* Show the verified email */}
          <div className="p-3 bg-gray-50 rounded-md border">
            <p className="text-sm text-gray-600">
              Resetting password for: <strong className="text-gray-900">{verifiedEmail}</strong>
            </p>
          </div>

          <div>
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                disabled={loading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Password must be at least 6 characters long
            </p>
          </div>

          <div>
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                disabled={loading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant={config.variant}
            className="w-full"
            size="lg"
            disabled={loading || !newPassword || !confirmPassword}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>

        <Card className="bg-muted/50">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-start gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-muted-foreground">
                Having trouble? Contact support at{" "}
                <a href="mailto:support@pmhssmarthealth.com" className="text-primary hover:underline">
                  support@pmhssmarthealth.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
};

export default NewPassword;