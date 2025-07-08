import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AuthLayout from "./AuthLayout";

const LoginForm = () => {
  const navigate = useNavigate();
  const { userType } = useParams();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const userTypeConfig = {
    patient: {
      title: "Patient Login",
      description: "Access your health dashboard and appointments",
      variant: "patient" as const,
      dashboardRoute: "/dashboard/patient"
    },
    doctor: {
      title: "Medical Professional Login", 
      description: "Access your practice management dashboard",
      variant: "doctor" as const,
      dashboardRoute: "/dashboard/doctor"
    },
    facility: {
      title: "Medical Facility Login",
      description: "Manage your facility and staff",
      variant: "facility" as const,
      dashboardRoute: "/dashboard/facility"
    },
    admin: {
      title: "Admin Login",
      description: "Platform administration and oversight",
      variant: "admin" as const,
      dashboardRoute: "/dashboard/admin"
    }
  };

  const config = userTypeConfig[userType as keyof typeof userTypeConfig] || userTypeConfig.patient;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login - will connect to Supabase later
    toast({
      title: "Login Successful!",
      description: `Welcome back! Redirecting to your ${userType} dashboard...`,
    });
    
    setTimeout(() => {
      navigate(config.dashboardRoute);
    }, 1500);
  };

  const handleOTPLogin = () => {
    toast({
      title: "OTP Sent!",
      description: "Please check your phone for the verification code.",
    });
    // Will implement OTP flow with Supabase later
  };

  return (
    <AuthLayout
      title={config.title}
      description={config.description}
      userType={config.variant}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email or Phone</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="Enter your email or phone number"
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="text-right">
          <Button variant="link" className="p-0 h-auto text-sm">
            Forgot password?
          </Button>
        </div>

        <Button type="submit" variant={config.variant} className="w-full" size="lg">
          Sign In
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleOTPLogin}
        >
          Login with OTP
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Button 
            variant="link" 
            className="p-0 h-auto" 
            onClick={() => navigate(`/register/${userType}`)}
          >
            Register here
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginForm;