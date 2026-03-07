import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { mixpanelInstance } from "@/utils/mixpanel";

interface OTPLoginProps {
  userType: "patient" | "doctor" | "facility" | "admin";
  onSuccess: () => void;
}

const OTPLogin = ({ userType, onSuccess }: OTPLoginProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive"
      });
      mixpanelInstance.track('OTP Send Failed', {
        userType,
        reason: 'invalid_phone_number',
        phoneLength: phoneNumber.length
      });
      return;
    }

    setIsLoading(true);
      mixpanelInstance.track('OTP Send Attempt', {
      userType,
      phoneNumber,
      step: 'send_otp'
    });
    // Mock OTP sending - will integrate with SMS service later
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
      toast({
        title: "OTP Sent!",
        description: `Verification code sent to ${phoneNumber}. Use 123456 for demo.`,
      });
        mixpanelInstance.track('OTP Sent Success', {
        userType,
        phoneNumber,
        step: 'otp_sent'
      });
    }, 2000);
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit verification code.",
        variant: "destructive"
      });
       mixpanelInstance.track('OTP Verification Failed', {
        userType,
        phoneNumber,
        reason: 'invalid_otp_format',
        otpLength: otp.length
      });
      return;
    }

    setIsLoading(true);

      mixpanelInstance.track('OTP Verification Attempt', {
      userType,
      phoneNumber,
      step: 'verify_otp'
    });

    // Mock OTP verification - use 123456 for demo
    setTimeout(() => {
      setIsLoading(false);
      if (otp === "123456") {
        toast({
          title: "Login Successful!",
          description: "Phone number verified successfully.",
        });
         mixpanelInstance.track('OTP Login Success', {
          userType,
          phoneNumber,
          step: 'login_success'
        });
        onSuccess();
      } else {
        toast({
          title: "Invalid OTP",
          description: "The verification code you entered is incorrect.",
          variant: "destructive"
        });
           mixpanelInstance.track('OTP Verification Failed', {
          userType,
          phoneNumber,
          reason: 'incorrect_otp'
        });
      }
    }, 1500);
  };

  const resendOTP = () => {
    toast({
      title: "OTP Resent",
      description: "A new verification code has been sent to your phone.",
    });
     mixpanelInstance.track('OTP Resend', {
      userType,
      phoneNumber
    });
  };
    const handleSendOTPClick = () => {
    mixpanelInstance.track('Send OTP Button Clicked', {
      userType,
      step: 'phone_entry',
      phoneEntered: !!phoneNumber
    });
  };

  const handleVerifyOTPClick = () => {
    mixpanelInstance.track('Verify OTP Button Clicked', {
      userType,
      phoneNumber,
      step: 'otp_entry',
      otpEntered: !!otp
    });
  };

  if (step === "phone") {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your 10-digit phone number"
            maxLength={10}
          />
        </div>
        <Button 
          onClick={sendOTP} 
          disabled={isLoading}
          className="w-full"
          variant={userType}
          onMouseDown={handleSendOTPClick}
        >
          {isLoading ? "Sending OTP..." : "Send OTP"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="otp">Verification Code</Label>
        <Input
          id="otp"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit code"
          maxLength={6}
          className="text-center text-lg tracking-widest"
        />
        <p className="text-sm text-muted-foreground mt-1">
          Code sent to {phoneNumber}
        </p>
      </div>
      
      <Button 
        onClick={verifyOTP} 
        disabled={isLoading}
        className="w-full"
        variant={userType}
        onMouseDown={handleVerifyOTPClick}
      >
        {isLoading ? "Verifying..." : "Verify & Login"}
      </Button>
      
      <div className="text-center">
        <Button variant="link" onClick={resendOTP} className="text-sm">
          Didn't receive code? Resend OTP
        </Button>
      </div>
      
      <div className="text-center">
        <Button variant="ghost" onClick={() => setStep("phone")} className="text-sm">
          ← Change phone number
        </Button>
      </div>
    </div>
  );
};

export default OTPLogin;