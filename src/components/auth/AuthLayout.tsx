import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/medical-hero.jpg";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  userType?: "patient" | "doctor" | "facility" | "admin";
}

const AuthLayout = ({ children, title, description, userType = "patient" }: AuthLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <Card variant={userType}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              {children}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className={`absolute inset-0 bg-gradient-${userType} opacity-80`}></div>
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold mb-4">
                Join NextGen Medical Platform
              </h2>
              <p className="text-xl text-white/90">
                Connecting healthcare professionals and patients through technology
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;