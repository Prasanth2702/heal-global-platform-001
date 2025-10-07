import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AuthLayout from "./AuthLayout";
import OTPLogin from "./OTPLogin";
import { supabase } from "@/integrations/supabase/client";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    

  const { email, password } = formData;
  const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
  if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Login Successful!",
      description: `Welcome back! Redirecting to your ${userType} dashboard...`,
    });
    
    setTimeout(() => {
      navigate(config.dashboardRoute);
    }, 1500);
  };

  const handleLoginSuccess = () => {
    setTimeout(() => {
      navigate(config.dashboardRoute);
    }, 1500);
  };

  const handleOTPLogin = () => {
    toast({
      title: "Login Successful!",
      description: `Welcome back! Redirecting to your ${userType} dashboard...`,
    });
    handleLoginSuccess();
  };

  return (
    <AuthLayout
      title={config.title}
      description={config.description}
      userType={config.variant}
    >
      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email">Email/Password</TabsTrigger>
          <TabsTrigger value="otp">OTP Login</TabsTrigger>
        </TabsList>
        
        <TabsContent value="email" className="space-y-4">
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
          </form>
        </TabsContent>
        
        <TabsContent value="otp" className="space-y-4">
          <OTPLogin userType={config.variant} onSuccess={handleOTPLogin} />
        </TabsContent>
      </Tabs>

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
    </AuthLayout>
  );
};

export default LoginForm;