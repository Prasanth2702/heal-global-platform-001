// export default ForgotPassword;


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
import { AlertCircle, Mail, ArrowLeft, Loader2, EyeOff, Eye, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import rollbar from "@/lib/rollbar";


const NewPassword = () => {
  const { userType } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileInfo, setProfileInfo] = useState<{ role: string | null; exists: boolean }>({ role: null, exists: false });
  const [verifiedEmail, setVerifiedEmail] = useState<string>(""); // New state for verified email

  useEffect(() => {
    const handleRecovery = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));

      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const type = hashParams.get("type");

      if (accessToken && type === "recovery") {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || "",
        });

    

        // Get authenticated user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const email = user?.email?.toLowerCase();

        if (!email) {
          navigate("/login/patient");
          return;
        }

        // Get profile role
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("email", email)
          .single();

        if (profileError || !profile) {
          navigate("/login/patient");
          return;
        }

        // Store profile info
        setProfileInfo({
          role: profile.role,
          exists: true,
        });

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
            roleMatched =
              userType === "facility" ||
              userType === "facility-admin";
            break;

          case "hospital_staff":
            roleMatched =
              userType === "facility" ||
              userType === "facility-staff";
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
          
          setTimeout(() => {
            navigate(roleRouteMap[profile.role]);
          }, 1500);
          
          return;
        }

        // Correct portal - store the verified email and proceed
        setVerifiedEmail(email); 
      }
    };

    handleRecovery();
  }, [userType, navigate, toast]);

  const userTypeConfig: Record<
    string,
    {
      emailTitle: string;
      emailDescription: string;
      passwordTitle: string;
      passwordDescription: string;
      successTitle: string;
      successDescription: string;
      variant: "patient" | "doctor" | "facility" | "admin";
    }
  > = {
    patient: {
      emailTitle: "Reset Patient Password",
      emailDescription: "Enter your email to receive a password reset link for your patient account",
      passwordTitle: "Create New Patient Password",
      passwordDescription: "Choose a strong password to secure your health dashboard",
      successTitle: "Patient Password Reset requested!",
      successDescription: "",
      variant: "patient",
    },
    doctor: {
      emailTitle: "Reset Medical Professional Password",
      emailDescription: "Enter your email to receive a reset link for your medical professional account",
      passwordTitle: "Create New Medical Professional Password",
      passwordDescription: "Choose a strong password to secure your practice management dashboard",
      successTitle: "Medical Professional Password Reset requested!",
      successDescription: "",
      variant: "doctor",
    },
    facility: {
      emailTitle: "Reset Medical Facility Password",
      emailDescription: "Enter your email to receive a reset link for your facility management account",
      passwordTitle: "Create New Facility Password",
      passwordDescription: "Choose a strong password to secure your facility management dashboard",
      successTitle: "Facility Password Reset requested!",
      successDescription: "",
      variant: "facility",
    },
    "facility-admin": {
      emailTitle: "Reset Facility Admin Password",
      emailDescription: "Enter your email to receive a reset link for your facility admin account",
      passwordTitle: "Create New Admin Password",
      passwordDescription: "Choose a strong password to secure your facility administration access",
      successTitle: "Facility Admin Password Reset requested!",
      successDescription: "",
      variant: "facility",
    },
    "facility-staff": {
      emailTitle: "Reset Facility Staff Password",
      emailDescription: "Enter your email to receive a reset link for your staff account",
      passwordTitle: "Create New Staff Password",
      passwordDescription: "Choose a strong password to secure your assigned operations access",
      successTitle: "Facility Staff Password Reset requested!",
      successDescription: "",
      variant: "facility",
    },
    admin: {
      emailTitle: "Reset Admin Password",
      emailDescription: "Enter your email to receive a reset link for your administrator account",
      passwordTitle: "Create New Admin Password",
      passwordDescription: "Choose a strong password to secure your platform administration access",
      successTitle: "Admin Password Reset requested!",
      successDescription: "",
      variant: "admin",
    },
  };

  const config =
    userTypeConfig[userType as keyof typeof userTypeConfig] ||
    userTypeConfig.patient;

  const getAllowedRoles = (): string[] => {
    if (userType === "facility" || userType === "facility-admin" || userType === "facility-staff") {
      return ["hospital_admin", "hospital_staff"];
    }
    return [userType || "patient"];
  };

  useEffect(() => {
    mixpanelInstance.track("Forgot Password Page Viewed", { userType });
  }, [userType]);

  const checkEmailInProfiles = async (email: string): Promise<boolean> => {
    const lowerCaseEmail = email.toLowerCase();

    let query = supabase
      .from("profiles")
      .select("email")
      .eq("email", lowerCaseEmail);

    const { data, error } = await query.maybeSingle();
    if (error) {
      console.error("Error checking email:", error);
      return false;
    }
    return !!data;
  };

  const getProfileInfo = async (email: string): Promise<{ role: string | null; exists: boolean }> => {
    const lowerCaseEmail = email.toLowerCase();
    
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("email", lowerCaseEmail)
      .maybeSingle();
    
    if (error || !data) {
      console.error("Error getting profile info:", error);
      return { role: null, exists: false };
    }
    
    return { role: data.role, exists: true };
  };

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: `Please enter a valid email address "@".`,
        variant: "destructive",
      });
      return;
    }

    mixpanelInstance.track("Forgot Password - Send Reset Attempt", { email, userType });
    setLoading(true);

    try {
      const profileData = await getProfileInfo(email);
      setProfileInfo(profileData);
      
      const emailExists = await checkEmailInProfiles(email);
      
      const isStaff = userType === "hospital_staff";

      const redirectUrl = isStaff
        ? `${window.location.origin}/set-password?type=recovery&userType=${userType}`
        : `${window.location.origin}/forgot-password/${userType}`;

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        console.error("Supabase reset error:", error);
        toast({
          title: "Failed to send reset email",
          description: error.message || "An error occurred. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setResetSent(true);
      toast({
        title: "Reset Email Sent",
        description: "Check your email for the password reset link. The link will expire in 1 hour.",
        duration: 6000,
      });
      mixpanelInstance.track("Forgot Password - Reset Email Sent", { email, userType });
    } catch (error: any) {
      console.error("Error sending reset email:", error);
      rollbar.error("Forgot Password - Send Reset Error", error);
      toast({
        title: "Failed to send reset email",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

    mixpanelInstance.track("Forgot Password - Reset Attempt", { email: verifiedEmail, userType });
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
          description: "Security validation failed. The email in your session doesn't match the reset request.",
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

      toast({
        title: "Password Reset Successful!",
        description: `Password for ${verifiedEmail} has been updated. Please login with your new password.`,
      });

      mixpanelInstance.track("Forgot Password - Success", { email: verifiedEmail, userType });

      window.location.hash = "";

      setTimeout(() => {
        navigate(`/login/${userType}`);
      }, 2000);
    } catch (error: any) {
      console.error("Error resetting password:", error);
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

  const isRoleMismatch = (): boolean => {
    if (!profileInfo.exists || !profileInfo.role) return false;
    const allowedRoles = getAllowedRoles();
    return !allowedRoles.includes(profileInfo.role);
  };

  const getFriendlyRoleName = (role: string): string => {
    const roleMap: Record<string, string> = {
      patient: "Patient",
      doctor: "Doctor",
      hospital_admin: "Facility Admin",
      hospital_staff: "Facility Staff",
      admin: "Administrator",
    };
    return roleMap[role] || role;
  };

  const getExpectedRoleName = (): string => {
    const allowedRoles = getAllowedRoles();
    if (allowedRoles.includes("hospital_admin") || allowedRoles.includes("hospital_staff")) {
      return "Facility";
    }
    return getFriendlyRoleName(allowedRoles[0]);
  };

  const getCurrentTitle = () => {
    return config.passwordTitle;
  };

  const getCurrentDescription = () => {
    return config.passwordDescription;
  };

  return (
    <AuthLayout
      title={getCurrentTitle()}
      description={getCurrentDescription()}
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

        {!resetSent && (
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
        )}
      </div>
    </AuthLayout>
  );
};

export default NewPassword;