// // // // // // // // // import { useState } from "react";
// // // // // // // // // import { useParams, useNavigate } from "react-router-dom";
// // // // // // // // // import { Button } from "@/components/ui/button";
// // // // // // // // // import { Input } from "@/components/ui/input";
// // // // // // // // // import { Label } from "@/components/ui/label";
// // // // // // // // // import { useToast } from "@/hooks/use-toast";
// // // // // // // // // import AuthLayout from "./AuthLayout";
// // // // // // // // // import { supabase } from "@/integrations/supabase/client";
// // // // // // // // // import mixpanelInstance from "@/utils/mixpanel";
// // // // // // // // // import { Card, CardContent } from "@/components/ui/card";
// // // // // // // // // import { AlertCircle, CheckCircle2, Mail, Key, ArrowLeft } from "lucide-react";
// // // // // // // // // import { Alert, AlertDescription } from "@/components/ui/alert";

// // // // // // // // // type ResetStep = 'email' | 'otp' | 'newPassword';

// // // // // // // // // const ForgotPassword = () => {
// // // // // // // // //   const { userType } = useParams();
// // // // // // // // //   const navigate = useNavigate();
// // // // // // // // //   const { toast } = useToast();
  
// // // // // // // // //   const [step, setStep] = useState<ResetStep>('email');
// // // // // // // // //   const [email, setEmail] = useState('');
// // // // // // // // //   const [otp, setOtp] = useState('');
// // // // // // // // //   const [newPassword, setNewPassword] = useState('');
// // // // // // // // //   const [confirmPassword, setConfirmPassword] = useState('');
// // // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // // //   const [otpSent, setOtpSent] = useState(false);
// // // // // // // // //   const [resendTimer, setResendTimer] = useState(0);

// // // // // // // // //   const userTypeConfig = {
// // // // // // // // //     patient: {
// // // // // // // // //       title: "Reset Patient Password",
// // // // // // // // //       description: "Reset your password to access your health dashboard",
// // // // // // // // //       variant: "patient" as const,
// // // // // // // // //     },
// // // // // // // // //     doctor: {
// // // // // // // // //       title: "Reset Medical Professional Password", 
// // // // // // // // //       description: "Reset your password to access your practice management dashboard",
// // // // // // // // //       variant: "doctor" as const,
// // // // // // // // //     },
// // // // // // // // //     facility: {
// // // // // // // // //       title: "Reset Medical Facility Password",
// // // // // // // // //       description: "Reset your password to manage your facility",
// // // // // // // // //       variant: "facility" as const,
// // // // // // // // //     },
// // // // // // // // //     admin: {
// // // // // // // // //       title: "Reset Admin Password",
// // // // // // // // //       description: "Reset your password for platform administration",
// // // // // // // // //       variant: "admin" as const,
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   const config = userTypeConfig[userType as keyof typeof userTypeConfig] || userTypeConfig.patient;
// // // // // // // // //   const userRole = (userType === 'facility') ? 'hospital_admin' : userType;

// // // // // // // // //   // Track page view
// // // // // // // // //   useState(() => {
// // // // // // // // //     mixpanelInstance.track('Forgot Password Page Viewed', {
// // // // // // // // //       userType: userType
// // // // // // // // //     });
// // // // // // // // //   });

// // // // // // // // //   const startResendTimer = () => {
// // // // // // // // //     setResendTimer(30);
// // // // // // // // //     const timer = setInterval(() => {
// // // // // // // // //       setResendTimer((prev) => {
// // // // // // // // //         if (prev <= 1) {
// // // // // // // // //           clearInterval(timer);
// // // // // // // // //           return 0;
// // // // // // // // //         }
// // // // // // // // //         return prev - 1;
// // // // // // // // //       });
// // // // // // // // //     }, 1000);
// // // // // // // // //   };

// // // // // // // // //   const checkEmailInProfiles = async (email: string) => {
// // // // // // // // //     const lowerCaseEmail = email.toLowerCase();
// // // // // // // // //     const { data, error } = await supabase
// // // // // // // // //       .from('profiles')
// // // // // // // // //       .select('email')
// // // // // // // // //       .eq('email', lowerCaseEmail)
// // // // // // // // //       .eq('role', userRole)
// // // // // // // // //       .maybeSingle();

// // // // // // // // //     if (error) {
// // // // // // // // //       console.error('Error checking email:', error);
// // // // // // // // //       return false;
// // // // // // // // //     }
// // // // // // // // //     return !!data;
// // // // // // // // //   };

// // // // // // // // //   const handleSendOTP = async (e: React.FormEvent) => {
// // // // // // // // //     e.preventDefault();
    
// // // // // // // // //     mixpanelInstance.track('Forgot Password - Send OTP Attempt', {
// // // // // // // // //       email: email,
// // // // // // // // //       userType: userType
// // // // // // // // //     });

// // // // // // // // //     setLoading(true);

// // // // // // // // //     try {
// // // // // // // // //       // First check if email exists in profiles
// // // // // // // // //       const emailExists = await checkEmailInProfiles(email);
      
// // // // // // // // //       if (!emailExists) {
// // // // // // // // //         toast({
// // // // // // // // //           title: "Email not found",
// // // // // // // // //           description: "This email is not registered. Please check or sign up.",
// // // // // // // // //           variant: "destructive"
// // // // // // // // //         });
// // // // // // // // //         mixpanelInstance.track('Forgot Password - Email Not Found', {
// // // // // // // // //           email: email,
// // // // // // // // //           userType: userType
// // // // // // // // //         });
// // // // // // // // //         setLoading(false);
// // // // // // // // //         return;
// // // // // // // // //       }

// // // // // // // // //       // Generate a random 6-digit OTP
// // // // // // // // //       const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
      
// // // // // // // // //       // Store OTP in localStorage with expiration (5 minutes)
// // // // // // // // //       const otpData = {
// // // // // // // // //         otp: generatedOTP,
// // // // // // // // //         email: email,
// // // // // // // // //         expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
// // // // // // // // //       };
// // // // // // // // //       localStorage.setItem('resetOTP', JSON.stringify(otpData));

// // // // // // // // //       // Here you would typically send the OTP via email/SMS
// // // // // // // // //       // For demonstration, we'll show it in a toast
// // // // // // // // //       toast({
// // // // // // // // //         title: "OTP Sent Successfully",
// // // // // // // // //         description: `Your OTP is: ${generatedOTP}. This is a demo - in production, this would be sent via email.`,
// // // // // // // // //         duration: 10000,
// // // // // // // // //       });

// // // // // // // // //       setOtpSent(true);
// // // // // // // // //       startResendTimer();
// // // // // // // // //       setStep('otp');
      
// // // // // // // // //       mixpanelInstance.track('Forgot Password - OTP Sent', {
// // // // // // // // //         email: email,
// // // // // // // // //         userType: userType
// // // // // // // // //       });

// // // // // // // // //     } catch (error) {
// // // // // // // // //       console.error('Error sending OTP:', error);
// // // // // // // // //       toast({
// // // // // // // // //         title: "Failed to send OTP",
// // // // // // // // //         description: "An error occurred. Please try again.",
// // // // // // // // //         variant: "destructive"
// // // // // // // // //       });
// // // // // // // // //     } finally {
// // // // // // // // //       setLoading(false);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   const handleResendOTP = async () => {
// // // // // // // // //     if (resendTimer > 0) return;
// // // // // // // // //     await handleSendOTP(new Event('submit') as any);
// // // // // // // // //   };

// // // // // // // // //   const handleVerifyOTP = async (e: React.FormEvent) => {
// // // // // // // // //     e.preventDefault();
    
// // // // // // // // //     mixpanelInstance.track('Forgot Password - Verify OTP Attempt', {
// // // // // // // // //       email: email,
// // // // // // // // //       userType: userType
// // // // // // // // //     });

// // // // // // // // //     setLoading(true);

// // // // // // // // //     try {
// // // // // // // // //       const storedOTPData = localStorage.getItem('resetOTP');
      
// // // // // // // // //       if (!storedOTPData) {
// // // // // // // // //         toast({
// // // // // // // // //           title: "OTP Expired",
// // // // // // // // //           description: "Please request a new OTP.",
// // // // // // // // //           variant: "destructive"
// // // // // // // // //         });
// // // // // // // // //         setStep('email');
// // // // // // // // //         setLoading(false);
// // // // // // // // //         return;
// // // // // // // // //       }

// // // // // // // // //       const { otp: storedOTP, email: storedEmail, expiresAt } = JSON.parse(storedOTPData);

// // // // // // // // //       if (Date.now() > expiresAt) {
// // // // // // // // //         toast({
// // // // // // // // //           title: "OTP Expired",
// // // // // // // // //           description: "The OTP has expired. Please request a new one.",
// // // // // // // // //           variant: "destructive"
// // // // // // // // //         });
// // // // // // // // //         localStorage.removeItem('resetOTP');
// // // // // // // // //         setStep('email');
// // // // // // // // //         setLoading(false);
// // // // // // // // //         return;
// // // // // // // // //       }

// // // // // // // // //       if (storedOTP !== otp || storedEmail !== email) {
// // // // // // // // //         toast({
// // // // // // // // //           title: "Invalid OTP",
// // // // // // // // //           description: "The OTP you entered is incorrect. Please try again.",
// // // // // // // // //           variant: "destructive"
// // // // // // // // //         });
// // // // // // // // //         mixpanelInstance.track('Forgot Password - Invalid OTP', {
// // // // // // // // //           email: email,
// // // // // // // // //           userType: userType
// // // // // // // // //         });
// // // // // // // // //         setLoading(false);
// // // // // // // // //         return;
// // // // // // // // //       }

// // // // // // // // //       // OTP verified successfully
// // // // // // // // //       toast({
// // // // // // // // //         title: "OTP Verified",
// // // // // // // // //         description: "Please set your new password.",
// // // // // // // // //         variant: "default"
// // // // // // // // //       });

// // // // // // // // //       setStep('newPassword');
      
// // // // // // // // //       mixpanelInstance.track('Forgot Password - OTP Verified', {
// // // // // // // // //         email: email,
// // // // // // // // //         userType: userType
// // // // // // // // //       });

// // // // // // // // //     } catch (error) {
// // // // // // // // //       console.error('Error verifying OTP:', error);
// // // // // // // // //       toast({
// // // // // // // // //         title: "Verification Failed",
// // // // // // // // //         description: "An error occurred. Please try again.",
// // // // // // // // //         variant: "destructive"
// // // // // // // // //       });
// // // // // // // // //     } finally {
// // // // // // // // //       setLoading(false);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   const handleResetPassword = async (e: React.FormEvent) => {
// // // // // // // // //     e.preventDefault();

// // // // // // // // //     if (newPassword !== confirmPassword) {
// // // // // // // // //       toast({
// // // // // // // // //         title: "Passwords don't match",
// // // // // // // // //         description: "Please make sure your passwords match.",
// // // // // // // // //         variant: "destructive"
// // // // // // // // //       });
// // // // // // // // //       return;
// // // // // // // // //     }

// // // // // // // // //     if (newPassword.length < 6) {
// // // // // // // // //       toast({
// // // // // // // // //         title: "Password too short",
// // // // // // // // //         description: "Password must be at least 6 characters long.",
// // // // // // // // //         variant: "destructive"
// // // // // // // // //       });
// // // // // // // // //       return;
// // // // // // // // //     }

// // // // // // // // //     mixpanelInstance.track('Forgot Password - Reset Attempt', {
// // // // // // // // //       email: email,
// // // // // // // // //       userType: userType
// // // // // // // // //     });

// // // // // // // // //     setLoading(true);

// // // // // // // // //     try {
// // // // // // // // //       // Update password in Supabase
// // // // // // // // //       const { error } = await supabase.auth.updateUser({
// // // // // // // // //         password: newPassword
// // // // // // // // //       });

// // // // // // // // //       if (error) {
// // // // // // // // //         throw error;
// // // // // // // // //       }

// // // // // // // // //       // Clear stored OTP
// // // // // // // // //       localStorage.removeItem('resetOTP');

// // // // // // // // //       toast({
// // // // // // // // //         title: "Password Reset Successful!",
// // // // // // // // //         description: "Your password has been updated. Please login with your new password.",
// // // // // // // // //         variant: "default"
// // // // // // // // //       });

// // // // // // // // //       mixpanelInstance.track('Forgot Password - Success', {
// // // // // // // // //         email: email,
// // // // // // // // //         userType: userType
// // // // // // // // //       });

// // // // // // // // //       // Redirect to login page after 2 seconds
// // // // // // // // //       setTimeout(() => {
// // // // // // // // //         navigate(`/login/${userType}`);
// // // // // // // // //       }, 2000);

// // // // // // // // //     } catch (error: any) {
// // // // // // // // //       console.error('Error resetting password:', error);
// // // // // // // // //       toast({
// // // // // // // // //         title: "Reset Failed",
// // // // // // // // //         description: error.message || "Failed to reset password. Please try again.",
// // // // // // // // //         variant: "destructive"
// // // // // // // // //       });
// // // // // // // // //     } finally {
// // // // // // // // //       setLoading(false);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   const handleBackToLogin = () => {
// // // // // // // // //     navigate(`/login/${userType}`);
// // // // // // // // //   };

// // // // // // // // //   return (
// // // // // // // // //     <AuthLayout
// // // // // // // // //       title={config.title}
// // // // // // // // //       description={config.description}
// // // // // // // // //       userType={config.variant}
// // // // // // // // //     >
// // // // // // // // //       <div className="space-y-6">
// // // // // // // // //         {/* Back to Login Link */}
// // // // // // // // //         <button
// // // // // // // // //           onClick={handleBackToLogin}
// // // // // // // // //           className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
// // // // // // // // //         >
// // // // // // // // //           <ArrowLeft className="h-4 w-4 mr-1" />
// // // // // // // // //           Back to Login
// // // // // // // // //         </button>

// // // // // // // // //         {/* Email Step */}
// // // // // // // // //         {step === 'email' && (
// // // // // // // // //           <form onSubmit={handleSendOTP} className="space-y-4">
// // // // // // // // //             <Alert>
// // // // // // // // //               <Mail className="h-4 w-4" />
// // // // // // // // //               <AlertDescription>
// // // // // // // // //                 Enter your email address and we'll send you a one-time password to reset your account.
// // // // // // // // //               </AlertDescription>
// // // // // // // // //             </Alert>

// // // // // // // // //             <div>
// // // // // // // // //               <Label htmlFor="reset-email">Email Address</Label>
// // // // // // // // //               <Input
// // // // // // // // //                 id="reset-email"
// // // // // // // // //                 type="email"
// // // // // // // // //                 value={email}
// // // // // // // // //                 onChange={(e) => setEmail(e.target.value)}
// // // // // // // // //                 placeholder="Enter your registered email"
// // // // // // // // //                 required
// // // // // // // // //                 disabled={loading}
// // // // // // // // //               />
// // // // // // // // //             </div>

// // // // // // // // //             <Button 
// // // // // // // // //               type="submit" 
// // // // // // // // //               variant={config.variant} 
// // // // // // // // //               className="w-full" 
// // // // // // // // //               size="lg"
// // // // // // // // //               disabled={loading}
// // // // // // // // //             >
// // // // // // // // //               {loading ? "Sending OTP..." : "Send Reset Code"}
// // // // // // // // //             </Button>
// // // // // // // // //           </form>
// // // // // // // // //         )}

// // // // // // // // //         {/* OTP Step */}
// // // // // // // // //         {step === 'otp' && (
// // // // // // // // //           <form onSubmit={handleVerifyOTP} className="space-y-4">
// // // // // // // // //             <Alert variant="default" className="border-green-500 bg-green-50">
// // // // // // // // //               <CheckCircle2 className="h-4 w-4 text-green-600" />
// // // // // // // // //               <AlertDescription className="text-green-700">
// // // // // // // // //                 A verification code has been sent to <strong>{email}</strong>
// // // // // // // // //               </AlertDescription>
// // // // // // // // //             </Alert>

// // // // // // // // //             <div>
// // // // // // // // //               <Label htmlFor="otp">Enter OTP Code</Label>
// // // // // // // // //               <Input
// // // // // // // // //                 id="otp"
// // // // // // // // //                 type="text"
// // // // // // // // //                 value={otp}
// // // // // // // // //                 onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
// // // // // // // // //                 placeholder="Enter 6-digit OTP"
// // // // // // // // //                 maxLength={6}
// // // // // // // // //                 required
// // // // // // // // //                 disabled={loading}
// // // // // // // // //                 className="text-center text-2xl tracking-widest"
// // // // // // // // //               />
// // // // // // // // //               <p className="text-xs text-muted-foreground mt-1">
// // // // // // // // //                 Enter the 6-digit code sent to your email
// // // // // // // // //               </p>
// // // // // // // // //             </div>

// // // // // // // // //             <Button 
// // // // // // // // //               type="submit" 
// // // // // // // // //               variant={config.variant} 
// // // // // // // // //               className="w-full" 
// // // // // // // // //               size="lg"
// // // // // // // // //               disabled={loading || otp.length !== 6}
// // // // // // // // //             >
// // // // // // // // //               {loading ? "Verifying..." : "Verify OTP"}
// // // // // // // // //             </Button>

// // // // // // // // //             <div className="text-center">
// // // // // // // // //               <button
// // // // // // // // //                 type="button"
// // // // // // // // //                 onClick={handleResendOTP}
// // // // // // // // //                 disabled={resendTimer > 0 || loading}
// // // // // // // // //                 className="text-sm text-primary hover:underline disabled:text-muted-foreground disabled:no-underline"
// // // // // // // // //               >
// // // // // // // // //                 {resendTimer > 0 
// // // // // // // // //                   ? `Resend code in ${resendTimer}s` 
// // // // // // // // //                   : "Didn't receive code? Resend"}
// // // // // // // // //               </button>
// // // // // // // // //             </div>
// // // // // // // // //           </form>
// // // // // // // // //         )}

// // // // // // // // //         {/* New Password Step */}
// // // // // // // // //         {step === 'newPassword' && (
// // // // // // // // //           <form onSubmit={handleResetPassword} className="space-y-4">
// // // // // // // // //             <Alert variant="default" className="border-green-500 bg-green-50">
// // // // // // // // //               <CheckCircle2 className="h-4 w-4 text-green-600" />
// // // // // // // // //               <AlertDescription className="text-green-700">
// // // // // // // // //                 OTP verified successfully! Please set your new password.
// // // // // // // // //               </AlertDescription>
// // // // // // // // //             </Alert>

// // // // // // // // //             <div>
// // // // // // // // //               <Label htmlFor="new-password">New Password</Label>
// // // // // // // // //               <Input
// // // // // // // // //                 id="new-password"
// // // // // // // // //                 type="password"
// // // // // // // // //                 value={newPassword}
// // // // // // // // //                 onChange={(e) => setNewPassword(e.target.value)}
// // // // // // // // //                 placeholder="Enter new password"
// // // // // // // // //                 required
// // // // // // // // //                 disabled={loading}
// // // // // // // // //               />
// // // // // // // // //               <p className="text-xs text-muted-foreground mt-1">
// // // // // // // // //                 Password must be at least 6 characters long
// // // // // // // // //               </p>
// // // // // // // // //             </div>

// // // // // // // // //             <div>
// // // // // // // // //               <Label htmlFor="confirm-password">Confirm New Password</Label>
// // // // // // // // //               <Input
// // // // // // // // //                 id="confirm-password"
// // // // // // // // //                 type="password"
// // // // // // // // //                 value={confirmPassword}
// // // // // // // // //                 onChange={(e) => setConfirmPassword(e.target.value)}
// // // // // // // // //                 placeholder="Confirm new password"
// // // // // // // // //                 required
// // // // // // // // //                 disabled={loading}
// // // // // // // // //               />
// // // // // // // // //             </div>

// // // // // // // // //             <Button 
// // // // // // // // //               type="submit" 
// // // // // // // // //               variant={config.variant} 
// // // // // // // // //               className="w-full" 
// // // // // // // // //               size="lg"
// // // // // // // // //               disabled={loading || !newPassword || !confirmPassword}
// // // // // // // // //             >
// // // // // // // // //               {loading ? "Resetting Password..." : "Reset Password"}
// // // // // // // // //             </Button>
// // // // // // // // //           </form>
// // // // // // // // //         )}

// // // // // // // // //         {/* Additional Help */}
// // // // // // // // //         <Card className="bg-muted/50">
// // // // // // // // //           <CardContent className="pt-4 pb-3 px-4">
// // // // // // // // //             <div className="flex items-start gap-2 text-sm">
// // // // // // // // //               <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
// // // // // // // // //               <p className="text-muted-foreground">
// // // // // // // // //                 Having trouble? Contact support at{' '}
// // // // // // // // //                 <a href="mailto:support@example.com" className="text-primary hover:underline">
// // // // // // // // //                   support@example.com
// // // // // // // // //                 </a>
// // // // // // // // //               </p>
// // // // // // // // //             </div>
// // // // // // // // //           </CardContent>
// // // // // // // // //         </Card>
// // // // // // // // //       </div>
// // // // // // // // //     </AuthLayout>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // export default ForgotPassword;


// // // // // // // // import { useState, useEffect } from "react";
// // // // // // // // import { useParams, useNavigate } from "react-router-dom";
// // // // // // // // import { Button } from "@/components/ui/button";
// // // // // // // // import { Input } from "@/components/ui/input";
// // // // // // // // import { Label } from "@/components/ui/label";
// // // // // // // // import { useToast } from "@/hooks/use-toast";
// // // // // // // // import AuthLayout from "./AuthLayout";
// // // // // // // // import { supabase } from "@/integrations/supabase/client";
// // // // // // // // import mixpanelInstance from "@/utils/mixpanel";
// // // // // // // // import { Card, CardContent } from "@/components/ui/card";
// // // // // // // // import { AlertCircle, Mail, ArrowLeft, Loader2 } from "lucide-react";
// // // // // // // // import { Alert, AlertDescription } from "@/components/ui/alert";

// // // // // // // // type ResetStep = 'email' | 'newPassword';

// // // // // // // // const ForgotPassword = () => {
// // // // // // // //   const { userType } = useParams();
// // // // // // // //   const navigate = useNavigate();
// // // // // // // //   const { toast } = useToast();
  
// // // // // // // //   const [step, setStep] = useState<ResetStep>('email');
// // // // // // // //   const [email, setEmail] = useState('');
// // // // // // // //   const [newPassword, setNewPassword] = useState('');
// // // // // // // //   const [confirmPassword, setConfirmPassword] = useState('');
// // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // //   const [resetSent, setResetSent] = useState(false);

// // // // // // // //   // Check if we have a recovery token in the URL
// // // // // // // //   useEffect(() => {
// // // // // // // //     const hashParams = new URLSearchParams(window.location.hash.substring(1));
// // // // // // // //     const accessToken = hashParams.get('access_token');
// // // // // // // //     const type = hashParams.get('type');
    
// // // // // // // //     if (accessToken && type === 'recovery') {
// // // // // // // //       setStep('newPassword');
// // // // // // // //       // Set the session with the recovery token
// // // // // // // //       supabase.auth.setSession({
// // // // // // // //         access_token: accessToken,
// // // // // // // //         refresh_token: hashParams.get('refresh_token') || '',
// // // // // // // //       });
// // // // // // // //     }
// // // // // // // //   }, []);

// // // // // // // //   const userTypeConfig = {
// // // // // // // //     patient: {
// // // // // // // //       title: "Reset Patient Password",
// // // // // // // //       description: "Reset your password to access your health dashboard",
// // // // // // // //       variant: "patient" as const,
// // // // // // // //     },
// // // // // // // //     doctor: {
// // // // // // // //       title: "Reset Medical Professional Password", 
// // // // // // // //       description: "Reset your password to access your practice management dashboard",
// // // // // // // //       variant: "doctor" as const,
// // // // // // // //     },
// // // // // // // //     facility: {
// // // // // // // //       title: "Reset Medical Facility Password",
// // // // // // // //       description: "Reset your password to manage your facility",
// // // // // // // //       variant: "facility" as const,
// // // // // // // //     },
// // // // // // // //     hospital_staff: {
// // // // // // // //       title: "Reset Hospital Staff Password",
// // // // // // // //       description: "Reset your password to manage your facility",
// // // // // // // //       variant: "facility" as const,
// // // // // // // //     },
// // // // // // // //     admin: {
// // // // // // // //       title: "Reset Admin Password",
// // // // // // // //       description: "Reset your password for platform administration",
// // // // // // // //       variant: "admin" as const,
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const normalizedUserType =
// // // // // // // //   userType === "hospital_staff" ? "facility" : userType;

// // // // // // // // const config =
// // // // // // // //   userTypeConfig[normalizedUserType as keyof typeof userTypeConfig] ||
// // // // // // // //   userTypeConfig.patient;

// // // // // // // //   // const config = userTypeConfig[userType as keyof typeof userTypeConfig] || userTypeConfig.patient;
// // // // // // // //   // const userRole = (userType === 'facility') ? 'hospital_admin' : userType;
// // // // // // // // const userRoles = (() => {
// // // // // // // //   if (userType === 'facility') {
// // // // // // // //     return ['hospital_admin', 'hospital_staff']; // ✅ BOTH roles
// // // // // // // //   }
// // // // // // // //   return [userType];
// // // // // // // // })();

// // // // // // // //   // Track page view
// // // // // // // //   useEffect(() => {
// // // // // // // //     mixpanelInstance.track('Forgot Password Page Viewed', {
// // // // // // // //       userType: userType
// // // // // // // //     });
// // // // // // // //   }, [userType]);

// // // // // // // //   // const checkEmailInProfiles = async (email: string) => {
// // // // // // // //   //   const lowerCaseEmail = email.toLowerCase();
// // // // // // // //   //   // const { data, error } = await supabase
// // // // // // // //   //   //   .from('profiles')
// // // // // // // //   //   //   .select('email')
// // // // // // // //   //   //   .eq('email', lowerCaseEmail)
// // // // // // // //   //   //   .eq('role', userRole)
// // // // // // // //   //   //   .maybeSingle();
    
// // // // // // // //   //   let query = supabase
// // // // // // // //   //   .from('profiles')
// // // // // // // //   //   .select('email')
// // // // // // // //   //   .eq('email', lowerCaseEmail);
  
// // // // // // // //   // if (userType === 'facility') {
// // // // // // // //   //   // Check for either role
// // // // // // // //   //   query = query.in('role', ['hospital_admin', 'hospital_staff']);
// // // // // // // //   // } else {
// // // // // // // //   //   // Check for specific role
// // // // // // // //   //   query = query.eq('role', userRole);
// // // // // // // //   // }
  
// // // // // // // //   // const { data, error } = await query.maybeSingle();

// // // // // // // //   //   if (error) {
// // // // // // // //   //     console.error('Error checking email:', error);
// // // // // // // //   //     return false;
// // // // // // // //   //   }
// // // // // // // //   //   return !!data;
// // // // // // // //   // };
// // // // // // // // const checkEmailInProfiles = async (email: string) => {
// // // // // // // //   const lowerCaseEmail = email.toLowerCase();

// // // // // // // //   let query = supabase
// // // // // // // //     .from('profiles')
// // // // // // // //     .select('email')
// // // // // // // //     .eq('email', lowerCaseEmail);

// // // // // // // //   if (userType === 'facility') {
// // // // // // // //     // ✅ Check BOTH admin + staff
// // // // // // // //     query = query.in('role', ['hospital_admin', 'hospital_staff']);
// // // // // // // //   } else {
// // // // // // // //     query = query.eq('role', userType);
// // // // // // // //   }

// // // // // // // //   const { data, error } = await query.maybeSingle();

// // // // // // // //   if (error) {
// // // // // // // //     console.error('Error checking email:', error);
// // // // // // // //     return false;
// // // // // // // //   }

// // // // // // // //   return !!data;
// // // // // // // // };

// // // // // // // //   const handleSendResetEmail = async (e: React.FormEvent) => {
// // // // // // // //     e.preventDefault();
    
// // // // // // // //     mixpanelInstance.track('Forgot Password - Send Reset Attempt', {
// // // // // // // //       email: email,
// // // // // // // //       userType: userType
// // // // // // // //     });

// // // // // // // //     setLoading(true);

// // // // // // // //     try {
// // // // // // // //       // First check if email exists in profiles
// // // // // // // //       const emailExists = await checkEmailInProfiles(email);
      
// // // // // // // //       if (!emailExists) {
// // // // // // // //         toast({
// // // // // // // //           title: "Email not found",
// // // // // // // //           description: "We couldn’t find an account with this email. Please check your email or contact your administrator.",
// // // // // // // //           // description: "This email is not registered. Please check or sign up.",
// // // // // // // //           variant: "destructive"
// // // // // // // //         });
// // // // // // // //         mixpanelInstance.track('Forgot Password - Email Not Found', {
// // // // // // // //           email: email,
// // // // // // // //           userType: userType
// // // // // // // //         });
// // // // // // // //         setLoading(false);
// // // // // // // //         return;
// // // // // // // //       }

// // // // // // // //       // // Use Supabase's built-in password reset
// // // // // // // //       // const { error } = await supabase.auth.resetPasswordForEmail(email, {
// // // // // // // //       //   redirectTo: `${window.location.origin}/forgot-password/${userType}`,
// // // // // // // //       // });

// // // // // // // //       // Decide redirect based on user type
// // // // // // // // const isStaff = userType === "hospital_staff";

// // // // // // // // const redirectUrl = isStaff
// // // // // // // //   ? `${window.location.origin}/set-password?type=recovery&userType=${userType}`
// // // // // // // //   : `${window.location.origin}/forgot-password/${userType}`;

// // // // // // // // // Use Supabase's built-in password reset
// // // // // // // // const { error } = await supabase.auth.resetPasswordForEmail(email, {
// // // // // // // //   redirectTo: redirectUrl,
// // // // // // // // });
      

// // // // // // // //       if (error) {
// // // // // // // //         console.error('Supabase reset error:', error);
// // // // // // // //         toast({
// // // // // // // //           title: "Failed to send reset email",
// // // // // // // //           description: error.message || "An error occurred. Please try again.",
// // // // // // // //           variant: "destructive"
// // // // // // // //         });
// // // // // // // //         setLoading(false);
// // // // // // // //         return;
// // // // // // // //       }

// // // // // // // //       setResetSent(true);
      
// // // // // // // //       toast({
// // // // // // // //         title: "Reset Email Sent",
// // // // // // // //         description: "Check your email for the password reset link. The link will expire in 1 hour.",
// // // // // // // //         duration: 6000,
// // // // // // // //       });
      
// // // // // // // //       mixpanelInstance.track('Forgot Password - Reset Email Sent', {
// // // // // // // //         email: email,
// // // // // // // //         userType: userType
// // // // // // // //       });

// // // // // // // //     } catch (error: any) {
// // // // // // // //       console.error('Error sending reset email:', error);
// // // // // // // //       toast({
// // // // // // // //         title: "Failed to send reset email",
// // // // // // // //         description: error.message || "An error occurred. Please try again.",
// // // // // // // //         variant: "destructive"
// // // // // // // //       });
// // // // // // // //     } finally {
// // // // // // // //       setLoading(false);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const handleResetPassword = async (e: React.FormEvent) => {
// // // // // // // //     e.preventDefault();

// // // // // // // //     if (newPassword !== confirmPassword) {
// // // // // // // //       toast({
// // // // // // // //         title: "Passwords don't match",
// // // // // // // //         description: "Please make sure your passwords match.",
// // // // // // // //         variant: "destructive"
// // // // // // // //       });
// // // // // // // //       return;
// // // // // // // //     }

// // // // // // // //     if (newPassword.length < 6) {
// // // // // // // //       toast({
// // // // // // // //         title: "Password too short",
// // // // // // // //         description: "Password must be at least 6 characters long.",
// // // // // // // //         variant: "destructive"
// // // // // // // //       });
// // // // // // // //       return;
// // // // // // // //     }

// // // // // // // //     mixpanelInstance.track('Forgot Password - Reset Attempt', {
// // // // // // // //       email: email,
// // // // // // // //       userType: userType
// // // // // // // //     });

// // // // // // // //     setLoading(true);

// // // // // // // //     try {
// // // // // // // //       // Update password using Supabase
// // // // // // // //       const { error } = await supabase.auth.updateUser({
// // // // // // // //         password: newPassword
// // // // // // // //       });

// // // // // // // //       if (error) {
// // // // // // // //         console.error('Supabase update error:', error);
// // // // // // // //         toast({
// // // // // // // //           title: "Reset Failed",
// // // // // // // //           description: error.message || "Failed to reset password. Please try again.",
// // // // // // // //           variant: "destructive"
// // // // // // // //         });
// // // // // // // //         setLoading(false);
// // // // // // // //         return;
// // // // // // // //       }

// // // // // // // //       toast({
// // // // // // // //         title: "Password Reset Successful!",
// // // // // // // //         description: "Your password has been updated. Please login with your new password.",
// // // // // // // //         variant: "default"
// // // // // // // //       });

// // // // // // // //       mixpanelInstance.track('Forgot Password - Success', {
// // // // // // // //         email: email,
// // // // // // // //         userType: userType
// // // // // // // //       });

// // // // // // // //       // Clear any hash from URL
// // // // // // // //       window.location.hash = '';

// // // // // // // //       // Redirect to login page after 2 seconds
// // // // // // // //       setTimeout(() => {
// // // // // // // //         navigate(`/login/${userType}`);
// // // // // // // //       }, 2000);

// // // // // // // //     } catch (error: any) {
// // // // // // // //       console.error('Error resetting password:', error);
// // // // // // // //       toast({
// // // // // // // //         title: "Reset Failed",
// // // // // // // //         description: error.message || "Failed to reset password. Please try again.",
// // // // // // // //         variant: "destructive"
// // // // // // // //       });
// // // // // // // //     } finally {
// // // // // // // //       setLoading(false);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const handleBackToLogin = () => {
// // // // // // // //     navigate(`/login/${userType}`);
// // // // // // // //   };

// // // // // // // //   return (
// // // // // // // //     <AuthLayout
// // // // // // // //       title={config.title}
// // // // // // // //       description={config.description}
// // // // // // // //       userType={config.variant}
// // // // // // // //     >
// // // // // // // //       <div className="space-y-6">
// // // // // // // //         {/* Back to Login Link */}
// // // // // // // //         <button
// // // // // // // //           onClick={handleBackToLogin}
// // // // // // // //           className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
// // // // // // // //         >
// // // // // // // //           <ArrowLeft className="h-4 w-4 mr-1" />
// // // // // // // //           Back to Login
// // // // // // // //         </button>

// // // // // // // //         {/* Email Step */}
// // // // // // // //         {step === 'email' && (
// // // // // // // //           <form onSubmit={handleSendResetEmail} className="space-y-4">
// // // // // // // //             <Alert>
// // // // // // // //               <Mail className="h-4 w-4" />
// // // // // // // //               <AlertDescription>
// // // // // // // //                 Enter your email address and we'll send you a password reset link.
// // // // // // // //               </AlertDescription>
// // // // // // // //             </Alert>

// // // // // // // //             {resetSent ? (
// // // // // // // //               <Alert variant="default" className="border-green-500 bg-green-50">
// // // // // // // //                 <AlertDescription className="text-green-700">
// // // // // // // //                   Reset link sent! Check your email at <strong>{email}</strong> and follow the instructions to reset your password.
// // // // // // // //                 </AlertDescription>
// // // // // // // //               </Alert>
// // // // // // // //             ) : (
// // // // // // // //               <>
// // // // // // // //                 <div>
// // // // // // // //                   <Label htmlFor="reset-email">Email Address</Label>
// // // // // // // //                   <Input
// // // // // // // //                     id="reset-email"
// // // // // // // //                     type="email"
// // // // // // // //                     value={email}
// // // // // // // //                     onChange={(e) => setEmail(e.target.value)}
// // // // // // // //                     placeholder="Enter your registered email"
// // // // // // // //                     required
// // // // // // // //                     disabled={loading}
// // // // // // // //                   />
// // // // // // // //                 </div>

// // // // // // // //                 <Button 
// // // // // // // //                   type="submit" 
// // // // // // // //                   variant={config.variant} 
// // // // // // // //                   className="w-full" 
// // // // // // // //                   size="lg"
// // // // // // // //                   disabled={loading}
// // // // // // // //                 >
// // // // // // // //                   {loading ? (
// // // // // // // //                     <>
// // // // // // // //                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// // // // // // // //                       Sending...
// // // // // // // //                     </>
// // // // // // // //                   ) : (
// // // // // // // //                     "Send Reset Link"
// // // // // // // //                   )}
// // // // // // // //                 </Button>
// // // // // // // //               </>
// // // // // // // //             )}
// // // // // // // //           </form>
// // // // // // // //         )}

// // // // // // // //         {/* New Password Step */}
// // // // // // // //         {step === 'newPassword' && (
// // // // // // // //           <form onSubmit={handleResetPassword} className="space-y-4">
// // // // // // // //             <Alert variant="default" className="border-blue-500 bg-blue-50">
// // // // // // // //               <AlertDescription className="text-blue-700">
// // // // // // // //                 Please enter your new password below.
// // // // // // // //               </AlertDescription>
// // // // // // // //             </Alert>

// // // // // // // //             <div>
// // // // // // // //               <Label htmlFor="new-password">New Password</Label>
// // // // // // // //               <Input
// // // // // // // //                 id="new-password"
// // // // // // // //                 type="password"
// // // // // // // //                 value={newPassword}
// // // // // // // //                 onChange={(e) => setNewPassword(e.target.value)}
// // // // // // // //                 placeholder="Enter new password"
// // // // // // // //                 required
// // // // // // // //                 disabled={loading}
// // // // // // // //               />
// // // // // // // //               <p className="text-xs text-muted-foreground mt-1">
// // // // // // // //                 Password must be at least 6 characters long
// // // // // // // //               </p>
// // // // // // // //             </div>

// // // // // // // //             <div>
// // // // // // // //               <Label htmlFor="confirm-password">Confirm New Password</Label>
// // // // // // // //               <Input
// // // // // // // //                 id="confirm-password"
// // // // // // // //                 type="password"
// // // // // // // //                 value={confirmPassword}
// // // // // // // //                 onChange={(e) => setConfirmPassword(e.target.value)}
// // // // // // // //                 placeholder="Confirm new password"
// // // // // // // //                 required
// // // // // // // //                 disabled={loading}
// // // // // // // //               />
// // // // // // // //             </div>

// // // // // // // //             <Button 
// // // // // // // //               type="submit" 
// // // // // // // //               variant={config.variant} 
// // // // // // // //               className="w-full" 
// // // // // // // //               size="lg"
// // // // // // // //               disabled={loading || !newPassword || !confirmPassword}
// // // // // // // //             >
// // // // // // // //               {loading ? (
// // // // // // // //                 <>
// // // // // // // //                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// // // // // // // //                   Resetting...
// // // // // // // //                 </>
// // // // // // // //               ) : (
// // // // // // // //                 "Reset Password"
// // // // // // // //               )}
// // // // // // // //             </Button>
// // // // // // // //           </form>
// // // // // // // //         )}

// // // // // // // //         {/* Additional Help */}
// // // // // // // //         <Card className="bg-muted/50">
// // // // // // // //           <CardContent className="pt-4 pb-3 px-4">
// // // // // // // //             <div className="flex items-start gap-2 text-sm">
// // // // // // // //               <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
// // // // // // // //               <p className="text-muted-foreground">
// // // // // // // //                 Having trouble? Contact support at{' '}
// // // // // // // //                 <a href="mailto:support@example.com" className="text-primary hover:underline">
// // // // // // // //                   support@example.com
// // // // // // // //                 </a>
// // // // // // // //               </p>
// // // // // // // //             </div>
// // // // // // // //           </CardContent>
// // // // // // // //         </Card>
// // // // // // // //       </div>
// // // // // // // //     </AuthLayout>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // export default ForgotPassword;

// // // // // // // import { useState, useEffect } from "react";
// // // // // // // import { useParams, useNavigate } from "react-router-dom";
// // // // // // // import { Button } from "@/components/ui/button";
// // // // // // // import { Input } from "@/components/ui/input";
// // // // // // // import { Label } from "@/components/ui/label";
// // // // // // // import { useToast } from "@/hooks/use-toast";
// // // // // // // import AuthLayout from "./AuthLayout";
// // // // // // // import { supabase } from "@/integrations/supabase/client";
// // // // // // // import mixpanelInstance from "@/utils/mixpanel";
// // // // // // // import { Card, CardContent } from "@/components/ui/card";
// // // // // // // import { AlertCircle, Mail, ArrowLeft, Loader2, EyeOff, Eye } from "lucide-react";
// // // // // // // import { Alert, AlertDescription } from "@/components/ui/alert";
// // // // // // // import rollbar from "@/lib/rollbar";

// // // // // // // type ResetStep = "email" | "newPassword";

// // // // // // // const ForgotPassword = () => {
// // // // // // //   const { userType } = useParams();
// // // // // // //   const navigate = useNavigate();
// // // // // // //   const { toast } = useToast();

// // // // // // //   const [step, setStep] = useState<ResetStep>("email");
// // // // // // //   const [email, setEmail] = useState("");
// // // // // // //   const [newPassword, setNewPassword] = useState("");
// // // // // // //   const [confirmPassword, setConfirmPassword] = useState("");
// // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // //   const [resetSent, setResetSent] = useState(false);
// // // // // // // const [showNewPassword, setShowNewPassword] = useState(false);
// // // // // // // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
// // // // // // // const [errorMessage, setErrorMessage] = useState("");
// // // // // // // const [successMessage, setSuccessMessage] = useState("");
// // // // // // //   // Check if we have a recovery token in the URL hash (Supabase puts it there)
// // // // // // //   // useEffect(() => {
// // // // // // //   //   const hashParams = new URLSearchParams(window.location.hash.substring(1));
// // // // // // //   //   const accessToken = hashParams.get("access_token");
// // // // // // //   //   const type = hashParams.get("type");

// // // // // // //   //   if (accessToken && type === "recovery") {
// // // // // // //   //     // Supabase will already have set the session, but we ensure it
// // // // // // //   //     supabase.auth.setSession({
// // // // // // //   //       access_token: accessToken,
// // // // // // //   //       refresh_token: hashParams.get("refresh_token") || "",
// // // // // // //   //     });
// // // // // // //   //     setStep("newPassword");
// // // // // // //   //   }
// // // // // // //   // }, []);

// // // // // // //   useEffect(() => {
// // // // // // //   const hashParams = new URLSearchParams(window.location.hash.substring(1));
// // // // // // //   const accessToken = hashParams.get("access_token");
// // // // // // //   const refreshToken = hashParams.get("refresh_token");
// // // // // // //   const type = hashParams.get("type");

// // // // // // //   if (accessToken && type === "recovery") {
// // // // // // //     // Set session explicitly
// // // // // // //     supabase.auth.setSession({
// // // // // // //       access_token: accessToken,
// // // // // // //       refresh_token: refreshToken || "",
// // // // // // //     }).then(({ error }) => {
// // // // // // //       if (error) {
// // // // // // //         console.error("Session error:", error);
// // // // // // //         toast({
// // // // // // //           title: "Invalid or expired link",
// // // // // // //           description: "Please request a new password reset link.",
// // // // // // //           variant: "destructive",
// // // // // // //         });
// // // // // // //         navigate(`/login/${userType}`);
// // // // // // //       } else {
// // // // // // //         setStep("newPassword");
// // // // // // //       }
// // // // // // //     });
// // // // // // //   }
// // // // // // // }, [userType, navigate, toast]);

// // // // // // //   const userTypeConfig: Record<
// // // // // // //     string,
// // // // // // //     {
// // // // // // //       title: string;
// // // // // // //       description: string;
// // // // // // //       variant: "patient" | "doctor" | "facility" | "admin";
// // // // // // //     }
// // // // // // //   > = {
// // // // // // //     patient: {
// // // // // // //       title: "Reset Patient Password",
// // // // // // //       description: "Reset your password to access your health dashboard",
// // // // // // //       variant: "patient",
// // // // // // //     },
// // // // // // //     doctor: {
// // // // // // //       title: "Reset Medical Professional Password",
// // // // // // //       description: "Reset your password to access your practice management dashboard",
// // // // // // //       variant: "doctor",
// // // // // // //     },
// // // // // // //     facility: {
// // // // // // //       title: "Reset Medical Facility Password",
// // // // // // //       description: "Reset your password to manage your facility or staff access",
// // // // // // //       variant: "facility",
// // // // // // //     },
// // // // // // //     "facility-admin": {
// // // // // // //       title: "Reset Facility Admin Password",
// // // // // // //       description: "Reset your password to manage your facility",
// // // // // // //       variant: "facility",
// // // // // // //     },
// // // // // // //     "facility-staff": {
// // // // // // //       title: "Reset Facility Staff Password",
// // // // // // //       description: "Reset your password to access assigned operations",
// // // // // // //       variant: "facility",
// // // // // // //     },
// // // // // // //     admin: {
// // // // // // //       title: "Reset Admin Password",
// // // // // // //       description: "Reset your password for platform administration",
// // // // // // //       variant: "admin",
// // // // // // //     },
// // // // // // //   };

// // // // // // //   // Normalize userType for config display (staff/admin variants share facility layout)
// // // // // // //   // const normalizedUserType =
// // // // // // //   //   userType === "facility-admin" || userType === "facility-staff"
// // // // // // //   //     ? "facility"
// // // // // // //   //     : userType || "patient";

// // // // // // //   const config =
// // // // // // //     userTypeConfig[userType as keyof typeof userTypeConfig] ||
// // // // // // //     userTypeConfig.patient;
    

// // // // // // //   // Determine which roles are allowed for this userType
// // // // // // //   const getAllowedRoles = (): string[] => {
// // // // // // //     if (userType === "facility" || userType === "facility-admin" || userType === "facility-staff") {
// // // // // // //       return ["hospital_admin", "hospital_staff"];
// // // // // // //     }
// // // // // // //     // For patient, doctor, admin, the param should match the role name exactly
// // // // // // //     return [userType || "patient"];
// // // // // // //   };

// // // // // // //   // Track page view
// // // // // // //   useEffect(() => {
// // // // // // //     mixpanelInstance.track("Forgot Password Page Viewed", { userType });
// // // // // // //   }, [userType]);

// // // // // // //   const checkEmailInProfiles = async (email: string): Promise<boolean> => {
// // // // // // //     const lowerCaseEmail = email.toLowerCase();
// // // // // // //     const allowedRoles = getAllowedRoles();

// // // // // // //     let query = supabase
// // // // // // //       .from("profiles")
// // // // // // //       .select("email")
// // // // // // //       .eq("email", lowerCaseEmail);

// // // // // // //     if (allowedRoles.length > 1) {
// // // // // // //       query = query.in("role", allowedRoles);
// // // // // // //     } else {
// // // // // // //       query = query.eq("role", allowedRoles[0]);
// // // // // // //     }

// // // // // // //     const { data, error } = await query.maybeSingle();
// // // // // // //     if (error) {
// // // // // // //       console.error("Error checking email:", error);
// // // // // // //       return false;
// // // // // // //     }
// // // // // // //     return !!data;
// // // // // // //   };

// // // // // // //   const handleSendResetEmail = async (e: React.FormEvent) => {
// // // // // // //     e.preventDefault();

// // // // // // //     mixpanelInstance.track("Forgot Password - Send Reset Attempt", { email, userType });
// // // // // // //     setLoading(true);

// // // // // // //     try {
// // // // // // //       const emailExists = await checkEmailInProfiles(email);

// // // // // // //       setErrorMessage(emailExists ? " " : "We couldn't find an account with this email. Please check or contact your administrator.");
// // // // // // //       if (!emailExists) {
// // // // // // //         toast({
// // // // // // //           title: "Email not found",
// // // // // // //           description:
// // // // // // //             "We couldn't find an account with this email. Please check or contact your administrator.",
// // // // // // //           variant: "destructive",
// // // // // // //         });
// // // // // // //         mixpanelInstance.track("Forgot Password - Email Not Found", { email, userType });
// // // // // // //         return;
// // // // // // //       }
// // // // // // //       const isStaff = userType === "hospital_staff";

// // // // // // //       // Always redirect to the same ForgotPassword component.
// // // // // // //       // The recovery token will be appended as a hash fragment by Supabase.
// // // // // // //       // const redirectUrl = `${window.location.origin}/forgot-password/${userType}`;
// // // // // // //       const redirectUrl = isStaff
// // // // // // //   ? `${window.location.origin}/set-password?type=recovery&userType=${userType}`
// // // // // // //   : `${window.location.origin}/forgot-password/${userType}`;

// // // // // // //       const { error } = await supabase.auth.resetPasswordForEmail(email, {
// // // // // // //         redirectTo: redirectUrl,
// // // // // // //       });

// // // // // // //       if (error) {
// // // // // // //         console.error("Supabase reset error:", error);
// // // // // // //         toast({
// // // // // // //           title: "Failed to send reset email",
// // // // // // //           description: error.message || "An error occurred. Please try again.",
// // // // // // //           variant: "destructive",
// // // // // // //         });
// // // // // // //         return;
// // // // // // //       }

// // // // // // //       setResetSent(true);
// // // // // // //       toast({
// // // // // // //         title: "Reset Email Sent",
// // // // // // //         description:
// // // // // // //           "Check your email for the password reset link. The link will expire in 1 hour.",
// // // // // // //         duration: 6000,
// // // // // // //       });
// // // // // // //       mixpanelInstance.track("Forgot Password - Reset Email Sent", { email, userType });
// // // // // // //     } catch (error: any) {
// // // // // // //       console.error("Error sending reset email:", error);
// // // // // // //       rollbar.error("Forgot Password - Send Reset Error", error);
// // // // // // //       toast({
// // // // // // //         title: "Failed to send reset email",
// // // // // // //         description: error.message || "An error occurred. Please try again.",
// // // // // // //         variant: "destructive",
// // // // // // //       });
// // // // // // //     } finally {
// // // // // // //       setLoading(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleResetPassword = async (e: React.FormEvent) => {
// // // // // // //     e.preventDefault();

// // // // // // //     if (newPassword !== confirmPassword) {
// // // // // // //       toast({
// // // // // // //         title: "Passwords don't match",
// // // // // // //         description: "Please make sure your passwords match.",
// // // // // // //         variant: "destructive",
// // // // // // //       });
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     if (newPassword.length < 6) {
// // // // // // //       toast({
// // // // // // //         title: "Password too short",
// // // // // // //         description: "Password must be at least 6 characters long.",
// // // // // // //         variant: "destructive",
// // // // // // //       });
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     mixpanelInstance.track("Forgot Password - Reset Attempt", { email, userType });
// // // // // // //     setLoading(true);

// // // // // // //     try {
// // // // // // //       // Update the user's password (session must be active)
// // // // // // //       const { error } = await supabase.auth.updateUser({ password: newPassword });

// // // // // // //       if (error) {
// // // // // // //         console.error("Supabase update error:", error);
// // // // // // //         toast({
// // // // // // //           title: "Reset Failed",
// // // // // // //           description: error.message || "Failed to reset password. Please try again.",
// // // // // // //           variant: "destructive",
// // // // // // //         });
// // // // // // //         return;
// // // // // // //       }

// // // // // // //       toast({
// // // // // // //         title: "Password Reset Successful!",
// // // // // // //         description: "Your password has been updated. Please login with your new password.",
// // // // // // //       });

// // // // // // //       mixpanelInstance.track("Forgot Password - Success", { email, userType });

// // // // // // //       // Clear the hash from URL to avoid confusion
// // // // // // //       window.location.hash = "";

// // // // // // //       // Redirect to login after 2 seconds
// // // // // // //       setTimeout(() => {
// // // // // // //         navigate(`/login/${userType}`);
// // // // // // //       }, 2000);
// // // // // // //     } catch (error: any) {
// // // // // // //       console.error("Error resetting password:", error);
// // // // // // //       toast({
// // // // // // //         title: "Reset Failed",
// // // // // // //         description: error.message || "Failed to reset password. Please try again.",
// // // // // // //         variant: "destructive",
// // // // // // //       });
// // // // // // //     } finally {
// // // // // // //       setLoading(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleBackToLogin = () => {
// // // // // // //     navigate(`/login/${userType}`);
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <AuthLayout
// // // // // // //       title={config.title}
// // // // // // //       description={config.description}
// // // // // // //       userType={config.variant}
// // // // // // //     >
// // // // // // //       <div className="space-y-6">
// // // // // // //         {/* Back to Login Link */}
// // // // // // //         <button
// // // // // // //           onClick={handleBackToLogin}
// // // // // // //           className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
// // // // // // //         >
// // // // // // //           <ArrowLeft className="h-4 w-4 mr-1" />
// // // // // // //           Back to Login
// // // // // // //         </button>

// // // // // // //         {/* Email Step */}
// // // // // // //         {step === "email" && (
// // // // // // //           <form onSubmit={handleSendResetEmail} className="space-y-4">
// // // // // // //             <Alert>
// // // // // // //               <Mail className="h-4 w-4" />
// // // // // // //               <AlertDescription>
// // // // // // //                 Enter your email address and we'll send you a password reset link.
// // // // // // //               </AlertDescription>
// // // // // // //             </Alert>

// // // // // // //             {/* {resetSent ? (
// // // // // // //               <Alert variant="default" className="border-green-500 bg-green-50">
// // // // // // //                 <AlertDescription className="text-green-700">
// // // // // // //                   Reset link sent! Check your email at <strong>{email}</strong> and follow the
// // // // // // //                   instructions to reset your password.
// // // // // // //                 </AlertDescription>
// // // // // // //               </Alert>
// // // // // // //             ) error : (
// // // // // // //               <Alert variant="default" className="border-green-500 bg-green-50">
// // // // // // //                 <AlertDescription className="text-green-700">
// // // // // // //                  {error.message}
// // // // // // //                 </AlertDescription>
// // // // // // //               </Alert>
// // // // // // //             ) : (
// // // // // // //               <>
// // // // // // //                 <div>
// // // // // // //                   <Label htmlFor="reset-email">Email Address</Label>
// // // // // // //                   <Input
// // // // // // //                     id="reset-email"
// // // // // // //                     type="email"
// // // // // // //                     value={email}
// // // // // // //                     onChange={(e) => setEmail(e.target.value)}
// // // // // // //                     placeholder="Enter your registered email"
// // // // // // //                     required
// // // // // // //                     disabled={loading}
// // // // // // //                   />
// // // // // // //                 </div>

// // // // // // //                 <Button
// // // // // // //                   type="submit"
// // // // // // //                   variant={config.variant}
// // // // // // //                   className="w-full"
// // // // // // //                   size="lg"
// // // // // // //                   disabled={loading}
// // // // // // //                 >
// // // // // // //                   {loading ? (
// // // // // // //                     <>
// // // // // // //                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// // // // // // //                       Sending...
// // // // // // //                     </>
// // // // // // //                   ) : (
// // // // // // //                     "Send Reset Link"
// // // // // // //                   )}
// // // // // // //                 </Button>
// // // // // // //               </>
// // // // // // //             )} */}

// // // // // // //             {successMessage && (
// // // // // // //   <Alert className="border-green-500 bg-green-50">
// // // // // // //     <AlertDescription className="text-green-700">
// // // // // // //       {successMessage}
// // // // // // //     </AlertDescription>
// // // // // // //   </Alert>
// // // // // // // )}

// // // // // // // {errorMessage && (
// // // // // // //   <Alert variant="destructive">
// // // // // // //     <AlertDescription>
// // // // // // //       {errorMessage}
// // // // // // //     </AlertDescription>
// // // // // // //   </Alert>
// // // // // // // )}

// // // // // // // {!resetSent && (
// // // // // // //   <>
// // // // // // //     <div>
// // // // // // //       <Label htmlFor="reset-email">Email Address</Label>
// // // // // // //       <Input
// // // // // // //         id="reset-email"
// // // // // // //         type="email"
// // // // // // //         value={email}
// // // // // // //         onChange={(e) => setEmail(e.target.value)}
// // // // // // //         placeholder="Enter your registered email"
// // // // // // //         required
// // // // // // //         disabled={loading}
// // // // // // //       />
// // // // // // //     </div>

// // // // // // //     <Button
// // // // // // //       type="submit"
// // // // // // //       variant={config.variant}
// // // // // // //       className="w-full"
// // // // // // //       size="lg"
// // // // // // //       disabled={loading}
// // // // // // //     >
// // // // // // //       {loading ? (
// // // // // // //         <>
// // // // // // //           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// // // // // // //           Sending...
// // // // // // //         </>
// // // // // // //       ) : (
// // // // // // //         "Send Reset Link"
// // // // // // //       )}
// // // // // // //     </Button>
// // // // // // //   </>
// // // // // // // )}
// // // // // // //           </form>
// // // // // // //         )}

// // // // // // //         {/* New Password Step */}
// // // // // // //         {step === "newPassword" && (
// // // // // // //           <form onSubmit={handleResetPassword} className="space-y-4">
// // // // // // //             <Alert variant="default" className="border-blue-500 bg-blue-50">
// // // // // // //               <AlertDescription className="text-blue-700">
// // // // // // //                 Please enter your new password below.
// // // // // // //               </AlertDescription>
// // // // // // //             </Alert>

// // // // // // //             {/* <div>
// // // // // // //               <Label htmlFor="new-password">New Password</Label>
// // // // // // //               <Input
// // // // // // //                 id="new-password"
// // // // // // //                 type="password"
// // // // // // //                 value={newPassword}
// // // // // // //                 onChange={(e) => setNewPassword(e.target.value)}
// // // // // // //                 placeholder="Enter new password"
// // // // // // //                 required
// // // // // // //                 disabled={loading}
// // // // // // //               />
// // // // // // //               <p className="text-xs text-muted-foreground mt-1">
// // // // // // //                 Password must be at least 6 characters long
// // // // // // //               </p>
// // // // // // //             </div>

// // // // // // //             <div>
// // // // // // //               <Label htmlFor="confirm-password">Confirm New Password</Label>
// // // // // // //               <Input
// // // // // // //                 id="confirm-password"
// // // // // // //                 type="password"
// // // // // // //                 value={confirmPassword}
// // // // // // //                 onChange={(e) => setConfirmPassword(e.target.value)}
// // // // // // //                 placeholder="Confirm new password"
// // // // // // //                 required
// // // // // // //                 disabled={loading}
// // // // // // //               />
// // // // // // //             </div> */}

// // // // // // //             <div>
// // // // // // //   <Label htmlFor="new-password">New Password</Label>
// // // // // // //   <div className="relative">
// // // // // // //     <Input
// // // // // // //       id="new-password"
// // // // // // //       type={showNewPassword ? "text" : "password"}
// // // // // // //       value={newPassword}
// // // // // // //       onChange={(e) => setNewPassword(e.target.value)}
// // // // // // //       placeholder="Enter new password"
// // // // // // //       required
// // // // // // //       disabled={loading}
// // // // // // //       className="pr-10"
// // // // // // //     />
// // // // // // //     <button
// // // // // // //       type="button"
// // // // // // //       onClick={() => setShowNewPassword(!showNewPassword)}
// // // // // // //       className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
// // // // // // //     >
// // // // // // //       {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
// // // // // // //     </button>
// // // // // // //   </div>
// // // // // // //   <p className="text-xs text-muted-foreground mt-1">
// // // // // // //     Password must be at least 6 characters long
// // // // // // //   </p>
// // // // // // // </div>

// // // // // // // <div>
// // // // // // //   <Label htmlFor="confirm-password">Confirm New Password</Label>
// // // // // // //   <div className="relative">
// // // // // // //     <Input
// // // // // // //       id="confirm-password"
// // // // // // //       type={showConfirmPassword ? "text" : "password"}
// // // // // // //       value={confirmPassword}
// // // // // // //       onChange={(e) => setConfirmPassword(e.target.value)}
// // // // // // //       placeholder="Confirm new password"
// // // // // // //       required
// // // // // // //       disabled={loading}
// // // // // // //       className="pr-10"
// // // // // // //     />
// // // // // // //     <button
// // // // // // //       type="button"
// // // // // // //       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
// // // // // // //       className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
// // // // // // //     >
// // // // // // //       {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
// // // // // // //     </button>
// // // // // // //   </div>
// // // // // // // </div>

// // // // // // //             <Button
// // // // // // //               type="submit"
// // // // // // //               variant={config.variant}
// // // // // // //               className="w-full"
// // // // // // //               size="lg"
// // // // // // //               disabled={loading || !newPassword || !confirmPassword}
// // // // // // //             >
// // // // // // //               {loading ? (
// // // // // // //                 <>
// // // // // // //                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// // // // // // //                   Resetting...
// // // // // // //                 </>
// // // // // // //               ) : (
// // // // // // //                 "Reset Password"
// // // // // // //               )}
// // // // // // //             </Button>
// // // // // // //           </form>
// // // // // // //         )}

// // // // // // //         {/* Additional Help */}
// // // // // // //         <Card className="bg-muted/50">
// // // // // // //           <CardContent className="pt-4 pb-3 px-4">
// // // // // // //             <div className="flex items-start gap-2 text-sm">
// // // // // // //               <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
// // // // // // //               <p className="text-muted-foreground">
// // // // // // //                 Having trouble? Contact support at{" "}
// // // // // // //                 <a href="support@pmhssmarthealth.com" className="text-primary hover:underline">
// // // // // // //                   support@pmhssmarthealth.com
// // // // // // //                 </a>
// // // // // // //               </p>
// // // // // // //             </div>
// // // // // // //           </CardContent>
// // // // // // //         </Card>
// // // // // // //       </div>
// // // // // // //     </AuthLayout>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default ForgotPassword;

// // // // // import { useState, useEffect } from "react";
// // // // // import { useParams, useNavigate } from "react-router-dom";
// // // // // import { Button } from "@/components/ui/button";
// // // // // import { Input } from "@/components/ui/input";
// // // // // import { Label } from "@/components/ui/label";
// // // // // import { useToast } from "@/hooks/use-toast";
// // // // // import AuthLayout from "./AuthLayout";
// // // // // import { supabase } from "@/integrations/supabase/client";
// // // // // import mixpanelInstance from "@/utils/mixpanel";
// // // // // import { Card, CardContent } from "@/components/ui/card";
// // // // // import { AlertCircle, Mail, ArrowLeft, Loader2, EyeOff, Eye, CheckCircle } from "lucide-react";
// // // // // import { Alert, AlertDescription } from "@/components/ui/alert";
// // // // // import rollbar from "@/lib/rollbar";

// // // // // type ResetStep = "email" | "newPassword" | "success" | "error";

// // // // // const ForgotPassword = () => {
// // // // //   const { userType } = useParams();
// // // // //   const navigate = useNavigate();
// // // // //   const { toast } = useToast();

// // // // //   const [step, setStep] = useState<ResetStep>("email");
// // // // //   const [email, setEmail] = useState("");
// // // // //   const [newPassword, setNewPassword] = useState("");
// // // // //   const [confirmPassword, setConfirmPassword] = useState("");
// // // // //   const [loading, setLoading] = useState(false);
// // // // //   const [resetSent, setResetSent] = useState(false);
// // // // //   const [showNewPassword, setShowNewPassword] = useState(false);
// // // // //   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
// // // // //   const [errorMessage, setErrorMessage] = useState("");
// // // // //   const [successMessage, setSuccessMessage] = useState("");
// // // // //   const [passwordError, setPasswordError] = useState("");
// // // // //   const [confirmPasswordError, setConfirmPasswordError] = useState("");

// // // // //   // Check if we have a recovery token in the URL hash (Supabase puts it there)
// // // // //   useEffect(() => {
// // // // //     const hashParams = new URLSearchParams(window.location.hash.substring(1));
// // // // //     const accessToken = hashParams.get("access_token");
// // // // //     const refreshToken = hashParams.get("refresh_token");
// // // // //     const type = hashParams.get("type");

// // // // //     if (accessToken && type === "recovery") {
// // // // //       // Set session explicitly
// // // // //       supabase.auth.setSession({
// // // // //         access_token: accessToken,
// // // // //         refresh_token: refreshToken || "",
// // // // //       }).then(({ error }) => {
// // // // //         if (error) {
// // // // //           console.error("Session error:", error);
// // // // //           toast({
// // // // //             title: "Invalid or expired link",
// // // // //             description: "Please request a new password reset link.",
// // // // //             variant: "destructive",
// // // // //           });
// // // // //           navigate(`/login/${userType}`);
// // // // //         } else {
// // // // //           setStep("newPassword");
// // // // //           setSuccessMessage("Link verified! Please enter your new password.");
// // // // //           setTimeout(() => setSuccessMessage(""), 3000);
// // // // //         }
// // // // //       });
// // // // //     }
// // // // //   }, [userType, navigate, toast]);

// // // // //   const userTypeConfig: Record<
// // // // //     string,
// // // // //     {
// // // // //       title: string;
// // // // //       description: string;
// // // // //       variant: "patient" | "doctor" | "facility" | "admin";
// // // // //     }
// // // // //   > = {
// // // // //     patient: {
// // // // //       title: "Reset Patient Password",
// // // // //       description: "Reset your password to access your health dashboard",
// // // // //       variant: "patient",
// // // // //     },
// // // // //     doctor: {
// // // // //       title: "Reset Medical Professional Password",
// // // // //       description: "Reset your password to access your practice management dashboard",
// // // // //       variant: "doctor",
// // // // //     },
// // // // //     facility: {
// // // // //       title: "Reset Medical Facility Password",
// // // // //       description: "Reset your password to manage your facility or staff access",
// // // // //       variant: "facility",
// // // // //     },
// // // // //     "facility-admin": {
// // // // //       title: "Reset Facility Admin Password",
// // // // //       description: "Reset your password to manage your facility",
// // // // //       variant: "facility",
// // // // //     },
// // // // //     "facility-staff": {
// // // // //       title: "Reset Facility Staff Password",
// // // // //       description: "Reset your password to access assigned operations",
// // // // //       variant: "facility",
// // // // //     },
// // // // //     admin: {
// // // // //       title: "Reset Admin Password",
// // // // //       description: "Reset your password for platform administration",
// // // // //       variant: "admin",
// // // // //     },
// // // // //   };

// // // // //   const config =
// // // // //     userTypeConfig[userType as keyof typeof userTypeConfig] ||
// // // // //     userTypeConfig.patient;

// // // // //   // Determine which roles are allowed for this userType
// // // // //   const getAllowedRoles = (): string[] => {
// // // // //     if (userType === "facility" || userType === "facility-admin" || userType === "facility-staff") {
// // // // //       return ["hospital_admin", "hospital_staff"];
// // // // //     }
// // // // //     return [userType || "patient"];
// // // // //   };

// // // // //   // Track page view
// // // // //   useEffect(() => {
// // // // //     mixpanelInstance.track("Forgot Password Page Viewed", { userType });
// // // // //   }, [userType]);

// // // // //   const checkEmailInProfiles = async (email: string): Promise<boolean> => {
// // // // //     const lowerCaseEmail = email.toLowerCase();
// // // // //     const allowedRoles = getAllowedRoles();

// // // // //     let query = supabase
// // // // //       .from("profiles")
// // // // //       .select("email")
// // // // //       .eq("email", lowerCaseEmail);

// // // // //     if (allowedRoles.length > 1) {
// // // // //       query = query.in("role", allowedRoles);
// // // // //     } else {
// // // // //       query = query.eq("role", allowedRoles[0]);
// // // // //     }

// // // // //     const { data, error } = await query.maybeSingle();
// // // // //     if (error) {
// // // // //       console.error("Error checking email:", error);
// // // // //       return false;
// // // // //     }
// // // // //     return !!data;
// // // // //   };

// // // // //   const handleSendResetEmail = async (e: React.FormEvent) => {
// // // // //     e.preventDefault();
    
// // // // //     // Reset messages
// // // // //     setErrorMessage("");
// // // // //     setSuccessMessage("");

// // // // //     if (!email.trim()) {
// // // // //       setErrorMessage("Please enter your email address.");
// // // // //       return;
// // // // //     }

// // // // //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// // // // //     if (!emailRegex.test(email)) {
// // // // //       setErrorMessage("Please enter a valid email address.");
// // // // //       return;
// // // // //     }

// // // // //     mixpanelInstance.track("Forgot Password - Send Reset Attempt", { email, userType });
// // // // //     setLoading(true);

// // // // //     try {
// // // // //       const emailExists = await checkEmailInProfiles(email);
      
// // // // //       if (!emailExists) {
// // // // //         setErrorMessage("We couldn't find an account with this email. Please check or contact your administrator.");
// // // // //         toast({
// // // // //           title: "Email not found",
// // // // //           description: "We couldn't find an account with this email. Please check or contact your administrator.",
// // // // //           variant: "destructive",
// // // // //         });
// // // // //         mixpanelInstance.track("Forgot Password - Email Not Found", { email, userType });
// // // // //         setLoading(false);
// // // // //         return;
// // // // //       }

// // // // //       const isStaff = userType === "hospital_staff";

// // // // //       const redirectUrl = isStaff
// // // // //         ? `${window.location.origin}/set-password?type=recovery&userType=${userType}`
// // // // //         : `${window.location.origin}/forgot-password/${userType}`;

// // // // //       const { error } = await supabase.auth.resetPasswordForEmail(email, {
// // // // //         redirectTo: redirectUrl,
// // // // //       });

// // // // //       if (error) {
// // // // //         console.error("Supabase reset error:", error);
// // // // //         setErrorMessage(error.message || "Failed to send reset email. Please try again.");
// // // // //         toast({
// // // // //           title: "Failed to send reset email",
// // // // //           description: error.message || "An error occurred. Please try again.",
// // // // //           variant: "destructive",
// // // // //         });
// // // // //         setLoading(false);
// // // // //         return;
// // // // //       }

// // // // //       setResetSent(true);
// // // // //       setSuccessMessage(`Reset link sent! Check your email at ${email} and follow the instructions to reset your password.`);
// // // // //       toast({
// // // // //         title: "Reset Email Sent",
// // // // //         description: "Check your email for the password reset link. The link will expire in 1 hour.",
// // // // //         duration: 6000,
// // // // //       });
// // // // //       mixpanelInstance.track("Forgot Password - Reset Email Sent", { email, userType });
// // // // //     } catch (error: any) {
// // // // //       console.error("Error sending reset email:", error);
// // // // //       rollbar.error("Forgot Password - Send Reset Error", error);
// // // // //       setErrorMessage(error.message || "An error occurred. Please try again.");
// // // // //       toast({
// // // // //         title: "Failed to send reset email",
// // // // //         description: error.message || "An error occurred. Please try again.",
// // // // //         variant: "destructive",
// // // // //       });
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   const validatePasswords = () => {
// // // // //     setPasswordError("");
// // // // //     setConfirmPasswordError("");

// // // // //     if (newPassword.length < 6) {
// // // // //       setPasswordError("Password must be at least 6 characters long");
// // // // //       return false;
// // // // //     }

// // // // //     if (newPassword !== confirmPassword) {
// // // // //       setConfirmPasswordError("Passwords do not match");
// // // // //       return false;
// // // // //     }

// // // // //     return true;
// // // // //   };

// // // // //   const handleResetPassword = async (e: React.FormEvent) => {
// // // // //     e.preventDefault();
    
// // // // //     // Reset messages
// // // // //     setErrorMessage("");
// // // // //     setSuccessMessage("");

// // // // //     if (!validatePasswords()) {
// // // // //       toast({
// // // // //         title: "Validation Error",
// // // // //         description: passwordError || confirmPasswordError || "Please check your passwords.",
// // // // //         variant: "destructive",
// // // // //       });
// // // // //       return;
// // // // //     }

// // // // //     mixpanelInstance.track("Forgot Password - Reset Attempt", { email, userType });
// // // // //     setLoading(true);

// // // // //     try {
// // // // //       // Update the user's password (session must be active)
// // // // //       const { error } = await supabase.auth.updateUser({ password: newPassword });

// // // // //       if (error) {
// // // // //         console.error("Supabase update error:", error);

// // // // //   setErrorMessage(error.message || "Failed to reset password.");
// // // // //   setStep("error");
// // // // //   setLoading(false);
// // // // //         // Handle specific error cases
// // // // //         if (error.message.includes("session") || error.message.includes("token")) {
// // // // //           setErrorMessage("Your reset link has expired. Please request a new password reset.");
// // // // //           toast({
// // // // //             title: "Session Expired",
// // // // //             description: "Your reset link has expired. Please request a new password reset.",
// // // // //             variant: "destructive",
// // // // //           });
// // // // //           setStep("email");
// // // // //           setResetSent(false);
// // // // //         } else {
// // // // //           setErrorMessage(error.message || "Failed to reset password. Please try again.");
// // // // //           toast({
// // // // //             title: "Reset Failed",
// // // // //             description: error.message || "Failed to reset password. Please try again.",
// // // // //             variant: "destructive",
// // // // //           });
// // // // //         }
        
// // // // //         mixpanelInstance.track("Forgot Password - Reset Failed", { 
// // // // //           email, 
// // // // //           userType, 
// // // // //           error: error.message 
// // // // //         });
// // // // //         setLoading(false);
// // // // //         return;
// // // // //       }

// // // // //       // Show success message and redirect
// // // // //       setStep("success");
// // // // //       setSuccessMessage("Password reset successful! Redirecting to login...");
      
// // // // //       toast({
// // // // //         title: "Password Reset Successful!",
// // // // //         description: "Your password has been updated. Redirecting to login...",
// // // // //         variant: "default",
// // // // //       });

// // // // //       mixpanelInstance.track("Forgot Password - Success", { email, userType });

// // // // //       // Clear the hash from URL to avoid confusion
// // // // //       window.location.hash = "";

// // // // //       // Redirect to login after 3 seconds
// // // // //       setTimeout(() => {
// // // // //         navigate(`/login/${userType}`);
// // // // //       }, 3000);
      
// // // // //     } catch (error: any) {
// // // // //       console.error("Error resetting password:", error);
// // // // //       setErrorMessage(error.message || "Failed to reset password. Please try again.");
// // // // //       setStep("error");
// // // // //       toast({
// // // // //         title: "Reset Failed",
// // // // //         description: error.message || "Failed to reset password. Please try again.",
// // // // //         variant: "destructive",
// // // // //       });
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   const handleBackToLogin = () => {
// // // // //     navigate(`/login/${userType}`);
// // // // //   };

// // // // //   const handleResendLink = () => {
// // // // //     setResetSent(false);
// // // // //     setEmail("");
// // // // //     setErrorMessage("");
// // // // //     setSuccessMessage("");
// // // // //   };

// // // // //   return (
// // // // //     <AuthLayout
// // // // //       title={config.title}
// // // // //       description={config.description}
// // // // //       userType={config.variant}
// // // // //     >
// // // // //       <div className="space-y-6">
// // // // //         {/* Back to Login Link - Hide on success */}
// // // // //         {step !== "success" && (
// // // // //           <button
// // // // //             onClick={handleBackToLogin}
// // // // //             className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
// // // // //           >
// // // // //             <ArrowLeft className="h-4 w-4 mr-1" />
// // // // //             Back to Login
// // // // //           </button>
// // // // //         )}

// // // // //         {/* Success Step */}
// // // // //         {step === "success" && (
// // // // //           <div className="space-y-4">
// // // // //             <Alert className="border-green-500 bg-green-50">
// // // // //               <CheckCircle className="h-5 w-5 text-green-600" />
// // // // //               <AlertDescription className="text-green-700 font-medium">
// // // // //                 Password Reset Successful!
// // // // //               </AlertDescription>
// // // // //             </Alert>
            
// // // // //             <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
// // // // //               <CardContent className="pt-6 pb-6 text-center">
// // // // //                 <div className="flex flex-col items-center gap-4">
// // // // //                   <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
// // // // //                     <CheckCircle className="h-8 w-8 text-green-600" />
// // // // //                   </div>
// // // // //                   <div className="space-y-2">
// // // // //                     <h3 className="text-lg font-semibold text-green-800">Your password has been updated</h3>
// // // // //                     <p className="text-sm text-green-700">
// // // // //                       You can now login with your new password.
// // // // //                     </p>
// // // // //                   </div>
// // // // //                   <Button
// // // // //                     onClick={handleBackToLogin}
// // // // //                     variant={config.variant}
// // // // //                     className="mt-2"
// // // // //                   >
// // // // //                     Go to Login
// // // // //                   </Button>
// // // // //                 </div>
// // // // //               </CardContent>
// // // // //             </Card>
// // // // //           </div>
// // // // //         )}

// // // // //         {/* Email Step */}
// // // // //         {step === "email" && (
// // // // //           <form onSubmit={handleSendResetEmail} className="space-y-4">
// // // // //             <Alert>
// // // // //               <Mail className="h-4 w-4" />
// // // // //               <AlertDescription>
// // // // //                 Enter your email address and we'll send you a password reset link.
// // // // //               </AlertDescription>
// // // // //             </Alert>

// // // // //             {/* Success Message */}
// // // // //             {successMessage && !resetSent && (
// // // // //               <Alert className="border-green-500 bg-green-50">
// // // // //                 <CheckCircle className="h-4 w-4 text-green-600" />
// // // // //                 <AlertDescription className="text-green-700">
// // // // //                   {successMessage}
// // // // //                 </AlertDescription>
// // // // //               </Alert>
// // // // //             )}

// // // // //             Error Message
// // // // //             {errorMessage && !resetSent && (
// // // // //               <Alert variant="destructive">
// // // // //                 <AlertCircle className="h-4 w-4" />
// // // // //                 <AlertDescription>
// // // // //                   {errorMessage}
// // // // //                 </AlertDescription>
// // // // //               </Alert>
// // // // //             )}

// // // // //             {/* Reset Sent Success */}
// // // // //             {resetSent && (
// // // // //               <Alert className="border-green-500 bg-green-50">
// // // // //                 <CheckCircle className="h-4 w-4 text-green-600" />
// // // // //                 <AlertDescription className="text-green-700">
// // // // //                   {successMessage || `Reset link sent! Check your email at ${email} and follow the instructions to reset your password.`}
// // // // //                   <div className="mt-3">
// // // // //                     <Button
// // // // //                       type="button"
// // // // //                       variant="outline"
// // // // //                       size="sm"
// // // // //                       onClick={handleResendLink}
// // // // //                     >
// // // // //                       Didn't receive the email? Try again
// // // // //                     </Button>
// // // // //                   </div>
// // // // //                 </AlertDescription>
// // // // //               </Alert>
// // // // //             )}

// // // // //             {/* Email Input Form */}
// // // // //             {!resetSent && (
// // // // //               <>
// // // // //                 <div>
// // // // //                   <Label htmlFor="reset-email">Email Address</Label>
// // // // //                   <Input
// // // // //                     id="reset-email"
// // // // //                     type="email"
// // // // //                     value={email}
// // // // //                     onChange={(e) => {
// // // // //                       setEmail(e.target.value);
// // // // //                       setErrorMessage("");
// // // // //                     }}
// // // // //                     placeholder="Enter your registered email"
// // // // //                     required
// // // // //                     disabled={loading}
// // // // //                     className={errorMessage ? "border-red-500 focus:ring-red-500" : ""}
// // // // //                   />
// // // // //                 </div>

// // // // //                 <Button
// // // // //                   type="submit"
// // // // //                   variant={config.variant}
// // // // //                   className="w-full"
// // // // //                   size="lg"
// // // // //                   disabled={loading || !email.trim()}
// // // // //                 >
// // // // //                   {loading ? (
// // // // //                     <>
// // // // //                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// // // // //                       Sending...
// // // // //                     </>
// // // // //                   ) : (
// // // // //                     "Send Reset Link"
// // // // //                   )}
// // // // //                 </Button>
// // // // //               </>
// // // // //             )}
// // // // //           </form>
// // // // //         )}

// // // // //         {/* New Password Step */}
// // // // //         {step === "newPassword" && (
// // // // //           <form onSubmit={handleResetPassword} className="space-y-4">
// // // // //             <Alert className="border-blue-500 bg-blue-50">
// // // // //               <AlertDescription className="text-blue-700">
// // // // //                 Please enter your new password below.
// // // // //               </AlertDescription>
// // // // //             </Alert>

// // // // //             {/* Success Message */}
// // // // //             {successMessage && (
// // // // //               <Alert className="border-green-500 bg-green-50">
// // // // //                 <CheckCircle className="h-4 w-4 text-green-600" />
// // // // //                 <AlertDescription className="text-green-700">
// // // // //                   {successMessage}
// // // // //                 </AlertDescription>
// // // // //               </Alert>
// // // // //             )}

// // // // //             {/* Error Message */}
// // // // //             {errorMessage && (
// // // // //               <Alert variant="destructive">
// // // // //                 <AlertCircle className="h-4 w-4" />
// // // // //                 <AlertDescription>
// // // // //                   {errorMessage}
// // // // //                 </AlertDescription>
// // // // //               </Alert>
// // // // //             )}

// // // // //             <div>
// // // // //               <Label htmlFor="new-password">New Password</Label>
// // // // //               <div className="relative">
// // // // //                 <Input
// // // // //                   id="new-password"
// // // // //                   type={showNewPassword ? "text" : "password"}
// // // // //                   value={newPassword}
// // // // //                   onChange={(e) => {
// // // // //                     setNewPassword(e.target.value);
// // // // //                     setPasswordError("");
// // // // //                     setErrorMessage("");
// // // // //                   }}
// // // // //                   placeholder="Enter new password"
// // // // //                   required
// // // // //                   disabled={loading}
// // // // //                   className={`pr-10 ${passwordError ? "border-red-500 focus:ring-red-500" : ""}`}
// // // // //                 />
// // // // //                 <button
// // // // //                   type="button"
// // // // //                   onClick={() => setShowNewPassword(!showNewPassword)}
// // // // //                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
// // // // //                 >
// // // // //                   {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
// // // // //                 </button>
// // // // //               </div>
// // // // //               {passwordError && (
// // // // //                 <p className="text-xs text-red-500 mt-1">{passwordError}</p>
// // // // //               )}
// // // // //               {!passwordError && newPassword && newPassword.length >= 6 && (
// // // // //                 <p className="text-xs text-green-500 mt-1">✓ Password strength: Good</p>
// // // // //               )}
// // // // //               <p className="text-xs text-muted-foreground mt-1">
// // // // //                 Password must be at least 6 characters long
// // // // //               </p>
// // // // //             </div>

// // // // //             <div>
// // // // //               <Label htmlFor="confirm-password">Confirm New Password</Label>
// // // // //               <div className="relative">
// // // // //                 <Input
// // // // //                   id="confirm-password"
// // // // //                   type={showConfirmPassword ? "text" : "password"}
// // // // //                   value={confirmPassword}
// // // // //                   onChange={(e) => {
// // // // //                     setConfirmPassword(e.target.value);
// // // // //                     setConfirmPasswordError("");
// // // // //                     setErrorMessage("");
// // // // //                   }}
// // // // //                   placeholder="Confirm new password"
// // // // //                   required
// // // // //                   disabled={loading}
// // // // //                   className={`pr-10 ${
// // // // //                     confirmPasswordError 
// // // // //                       ? "border-red-500 focus:ring-red-500" 
// // // // //                       : confirmPassword && newPassword === confirmPassword && newPassword.length >= 6
// // // // //                       ? "border-green-500 focus:ring-green-500"
// // // // //                       : ""
// // // // //                   }`}
// // // // //                 />
// // // // //                 <button
// // // // //                   type="button"
// // // // //                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
// // // // //                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
// // // // //                 >
// // // // //                   {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
// // // // //                 </button>
// // // // //               </div>
// // // // //               {confirmPasswordError && (
// // // // //                 <p className="text-xs text-red-500 mt-1">{confirmPasswordError}</p>
// // // // //               )}
// // // // //               {!confirmPasswordError && confirmPassword && newPassword === confirmPassword && newPassword.length >= 6 && (
// // // // //                 <p className="text-xs text-green-500 mt-1">✓ Passwords match</p>
// // // // //               )}
// // // // //             </div>

// // // // //             <Button
// // // // //               type="submit"
// // // // //               variant={config.variant}
// // // // //               className="w-full"
// // // // //               size="lg"
// // // // //               disabled={
// // // // //                 loading || 
// // // // //                 !newPassword || 
// // // // //                 !confirmPassword || 
// // // // //                 newPassword !== confirmPassword ||
// // // // //                 newPassword.length < 6 ||
// // // // //                 !!passwordError ||
// // // // //                 !!confirmPasswordError
// // // // //               }
// // // // //             >
// // // // //               {loading ? (
// // // // //                 <>
// // // // //                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// // // // //                   Resetting Password...
// // // // //                 </>
// // // // //               ) : (
// // // // //                 "Reset Password"
// // // // //               )}
// // // // //             </Button>
// // // // //           </form>
// // // // //         )}
// // // // //         {/* New Password Step */}
// // // // //         {/* Error Step */}
// // // // // {step === "error" && (
// // // // //   <div className="space-y-4">
// // // // //     <Alert variant="destructive">
// // // // //       <AlertCircle className="h-5 w-5" />
// // // // //       <AlertDescription>
// // // // //         {errorMessage || "Something went wrong while resetting your password."}
// // // // //       </AlertDescription>
// // // // //     </Alert>

// // // // //     <Card className="border-red-200 bg-gradient-to-r from-red-50 to-rose-50">
// // // // //       <CardContent className="pt-6 pb-6 text-center">
// // // // //         <div className="flex flex-col items-center gap-4">
// // // // //           <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
// // // // //             <AlertCircle className="h-8 w-8 text-red-600" />
// // // // //           </div>

// // // // //           <div className="space-y-2">
// // // // //             <h3 className="text-lg font-semibold text-red-800">
// // // // //               Password Reset Failed
// // // // //             </h3>

// // // // //             <p className="text-sm text-red-700">
// // // // //               {errorMessage ||
// // // // //                 "We were unable to reset your password. Please try again or request a new reset link."}
// // // // //             </p>
// // // // //           </div>

// // // // //           <div className="flex flex-col sm:flex-row gap-2 mt-2">
// // // // //             <Button
// // // // //               onClick={() => {
// // // // //                 setStep("email");
// // // // //                 setErrorMessage("");
// // // // //                 setSuccessMessage("");
// // // // //                 setResetSent(false);
// // // // //               }}
// // // // //               variant={config.variant}
// // // // //             >
// // // // //               Try Again
// // // // //             </Button>

// // // // //             <Button
// // // // //               onClick={handleBackToLogin}
// // // // //               variant="outline"
// // // // //             >
// // // // //               Back to Login
// // // // //             </Button>
// // // // //           </div>
// // // // //         </div>
// // // // //       </CardContent>
// // // // //     </Card>
// // // // //   </div>
// // // // // )}

// // // // //         {/* Additional Help - Hide on success */}
// // // // //         {step !== "success" && (
// // // // //           <Card className="bg-muted/50">
// // // // //             <CardContent className="pt-4 pb-3 px-4">
// // // // //               <div className="flex items-start gap-2 text-sm">
// // // // //                 <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
// // // // //                 <p className="text-muted-foreground">
// // // // //                   Having trouble? Contact support at{" "}
// // // // //                   <a href="mailto:support@pmhssmarthealth.com" className="text-primary hover:underline">
// // // // //                     support@pmhssmarthealth.com
// // // // //                   </a>
// // // // //                 </p>
// // // // //               </div>
// // // // //             </CardContent>
// // // // //           </Card>
// // // // //         )}
// // // // //       </div>
// // // // //     </AuthLayout>
// // // // //   );
// // // // // };

// // // // // export default ForgotPassword;


// // // // import { useState, useEffect } from "react";
// // // // import { useParams, useNavigate } from "react-router-dom";
// // // // import { Button } from "@/components/ui/button";
// // // // import { Input } from "@/components/ui/input";
// // // // import { Label } from "@/components/ui/label";
// // // // import { useToast } from "@/hooks/use-toast";
// // // // import AuthLayout from "./AuthLayout";
// // // // import { supabase } from "@/integrations/supabase/client";
// // // // import mixpanelInstance from "@/utils/mixpanel";
// // // // import { Card, CardContent } from "@/components/ui/card";
// // // // import { AlertCircle, Mail, ArrowLeft, Loader2, EyeOff, Eye, CheckCircle } from "lucide-react";
// // // // import { Alert, AlertDescription } from "@/components/ui/alert";
// // // // import rollbar from "@/lib/rollbar";

// // // // type ResetStep = "email" | "newPassword" | "success" | "error";

// // // // const ForgotPassword = () => {
// // // //   const { userType } = useParams();
// // // //   const navigate = useNavigate();
// // // //   const { toast } = useToast();

// // // //   const [step, setStep] = useState<ResetStep>("email");
// // // //   const [email, setEmail] = useState("");
// // // //   const [newPassword, setNewPassword] = useState("");
// // // //   const [confirmPassword, setConfirmPassword] = useState("");
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [resetSent, setResetSent] = useState(false);
// // // //   const [showNewPassword, setShowNewPassword] = useState(false);
// // // //   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
// // // //   const [errorMessage, setErrorMessage] = useState("");
// // // //   const [successMessage, setSuccessMessage] = useState("");
// // // //   const [passwordError, setPasswordError] = useState("");
// // // //   const [confirmPasswordError, setConfirmPasswordError] = useState("");
// // // //   const [emailCheckResult, setEmailCheckResult] = useState<{
// // // //     exists: boolean;
// // // //     role?: string;
// // // //     message?: string;
// // // //   } | null>(null);

// // // //   // Check if we have a recovery token in the URL hash (Supabase puts it there)
// // // //   useEffect(() => {
// // // //     const hashParams = new URLSearchParams(window.location.hash.substring(1));
// // // //     const accessToken = hashParams.get("access_token");
// // // //     const refreshToken = hashParams.get("refresh_token");
// // // //     const type = hashParams.get("type");

// // // //     if (accessToken && type === "recovery") {
// // // //       // Set session explicitly
// // // //       supabase.auth.setSession({
// // // //         access_token: accessToken,
// // // //         refresh_token: refreshToken || "",
// // // //       }).then(({ error }) => {
// // // //         if (error) {
// // // //           console.error("Session error:", error);
// // // //           toast({
// // // //             title: "Invalid or expired link",
// // // //             description: "Please request a new password reset link.",
// // // //             variant: "destructive",
// // // //           });
// // // //           navigate(`/login/${userType}`);
// // // //         } else {
// // // //           setStep("newPassword");
// // // //           setSuccessMessage("Link verified! Please enter your new password.");
// // // //           setTimeout(() => setSuccessMessage(""), 3000);
// // // //         }
// // // //       });
// // // //     }
// // // //   }, [userType, navigate, toast]);

// // // //   const userTypeConfig: Record<
// // // //     string,
// // // //     {
// // // //       title: string;
// // // //       description: string;
// // // //       variant: "patient" | "doctor" | "facility" | "admin";
// // // //     }
// // // //   > = {
// // // //     patient: {
// // // //       title: "Reset Patient Password",
// // // //       description: "Reset your password to access your health dashboard",
// // // //       variant: "patient",
// // // //     },
// // // //     doctor: {
// // // //       title: "Reset Medical Professional Password",
// // // //       description: "Reset your password to access your practice management dashboard",
// // // //       variant: "doctor",
// // // //     },
// // // //     facility: {
// // // //       title: "Reset Medical Facility Password",
// // // //       description: "Reset your password to manage your facility or staff access",
// // // //       variant: "facility",
// // // //     },
// // // //     "facility-admin": {
// // // //       title: "Reset Facility Admin Password",
// // // //       description: "Reset your password to manage your facility",
// // // //       variant: "facility",
// // // //     },
// // // //     "facility-staff": {
// // // //       title: "Reset Facility Staff Password",
// // // //       description: "Reset your password to access assigned operations",
// // // //       variant: "facility",
// // // //     },
// // // //     admin: {
// // // //       title: "Reset Admin Password",
// // // //       description: "Reset your password for platform administration",
// // // //       variant: "admin",
// // // //     },
// // // //   };

// // // //   const config =
// // // //     userTypeConfig[userType as keyof typeof userTypeConfig] ||
// // // //     userTypeConfig.patient;

// // // //   // Determine which roles are allowed for this userType
// // // //   const getAllowedRoles = (): string[] => {
// // // //     if (userType === "facility" || userType === "facility-admin" || userType === "facility-staff") {
// // // //       return ["hospital_admin", "hospital_staff"];
// // // //     }
// // // //     return [userType || "patient"];
// // // //   };

// // // //   // Track page view
// // // //   useEffect(() => {
// // // //     mixpanelInstance.track("Forgot Password Page Viewed", { userType });
// // // //   }, [userType]);

// // // //   const checkEmailInProfiles = async (email: string): Promise<{
// // // //     exists: boolean;
// // // //     role?: string;
// // // //     message?: string;
// // // //   }> => {
// // // //     const lowerCaseEmail = email.toLowerCase();
// // // //     const allowedRoles = getAllowedRoles();

// // // //     // First check if email exists in profiles with ANY role (for better error messaging)
// // // //     const { data: anyRoleData, error: anyRoleError } = await supabase
// // // //       .from("profiles")
// // // //       .select("email, role")
// // // //       .eq("email", lowerCaseEmail)
// // // //       .maybeSingle();

// // // //     if (anyRoleError) {
// // // //       console.error("Error checking email:", anyRoleError);
// // // //       return { exists: false, message: "Database error occurred" };
// // // //     }

// // // //     // Email doesn't exist at all in profiles
// // // //     if (!anyRoleData) {
// // // //       return { 
// // // //         exists: false, 
// // // //         message: "No account found with this email address. Please check your email or contact support." 
// // // //       };
// // // //     }

// // // //     // Email exists but has wrong role for this userType
// // // //     if (!allowedRoles.includes(anyRoleData.role)) {
// // // //       const roleMessages: Record<string, string> = {
// // // //         patient: "This email is registered as a patient. Please use the patient login page.",
// // // //         doctor: "This email is registered as a doctor. Please use the doctor login page.",
// // // //         hospital_admin: "This email is registered as a facility admin. Please use the facility login page.",
// // // //         hospital_staff: "This email is registered as facility staff. Please use the facility login page.",
// // // //         admin: "This email is registered as an admin. Please use the admin login page.",
// // // //       };
      
// // // //       const expectedRole = allowedRoles[0];
// // // //       const expectedRoleMessage = expectedRole === "hospital_admin" || expectedRole === "hospital_staff" 
// // // //         ? "facility" 
// // // //         : expectedRole;
      
// // // //       return {
// // // //         exists: true,
// // // //         role: anyRoleData.role,
// // // //         message: `⚠️ Important: Your email (${email}) is registered but with a different account type.\n\n` +
// // // //                  `• Current role: ${anyRoleData.role}\n` +
// // // //                  `• Expected role for this page: ${expectedRoleMessage}\n\n` +
// // // //                  `Please go to the correct login page for your account type. The password reset link has been sent to your email, but you'll need to use the correct portal to complete the process.`
// // // //       };
// // // //     }

// // // //     // Email exists with correct role
// // // //     return { 
// // // //       exists: true, 
// // // //       role: anyRoleData.role,
// // // //       message: "Email verified successfully!" 
// // // //     };
// // // //   };

// // // //   const handleSendResetEmail = async (e: React.FormEvent) => {
// // // //     e.preventDefault();
    
// // // //     // Reset messages
// // // //     setErrorMessage("");
// // // //     setSuccessMessage("");
// // // //     setEmailCheckResult(null);

// // // //     if (!email.trim()) {
// // // //       setErrorMessage("Please enter your email address.");
// // // //       return;
// // // //     }

// // // //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// // // //     if (!emailRegex.test(email)) {
// // // //       setErrorMessage("Please enter a valid email address.");
// // // //       return;
// // // //     }

// // // //     mixpanelInstance.track("Forgot Password - Send Reset Attempt", { email, userType });
// // // //     setLoading(true);

// // // //     try {
// // // //       // Check email in profiles
// // // //       const emailCheck = await checkEmailInProfiles(email);
// // // //       setEmailCheckResult(emailCheck);
      
// // // //       // ALWAYS send the email regardless of role mismatch for security
// // // //       // This prevents email enumeration attacks
// // // //       const isStaff = userType === "hospital_staff";

// // // //       const redirectUrl = isStaff
// // // //         ? `${window.location.origin}/set-password?type=recovery&userType=${userType}`
// // // //         : `${window.location.origin}/forgot-password/${userType}`;

// // // //       const { error } = await supabase.auth.resetPasswordForEmail(email, {
// // // //         redirectTo: redirectUrl,
// // // //       });

// // // //       if (error) {
// // // //         console.error("Supabase reset error:", error);
// // // //         setErrorMessage(error.message || "Failed to send reset email. Please try again.");
// // // //         toast({
// // // //           title: "Failed to send reset email",
// // // //           description: error.message || "An error occurred. Please try again.",
// // // //           variant: "destructive",
// // // //         });
// // // //         setLoading(false);
// // // //         return;
// // // //       }

// // // //       // Email sent successfully
// // // //       setResetSent(true);
      
// // // //       // Customize success message based on email check
// // // //       let customSuccessMessage = "";
// // // //       if (!emailCheck.exists) {
// // // //         customSuccessMessage = `📧 A password reset link has been sent to ${email}. If you don't see it, please check your spam folder.\n\nNote: No account found with this email. If you believe this is an error, please contact support.`;
// // // //       } else if (emailCheck.exists && emailCheck.role && !getAllowedRoles().includes(emailCheck.role)) {
// // // //         customSuccessMessage = `📧 A password reset link has been sent to ${email}.\n\n${emailCheck.message}\n\n⚠️ Important: Use the correct portal for your account type to reset your password.`;
// // // //       } else {
// // // //         customSuccessMessage = `✅ Password reset link sent! Check your email at ${email} and follow the instructions to reset your password. The link will expire in 1 hour.`;
// // // //       }
      
// // // //       setSuccessMessage(customSuccessMessage);
      
// // // //       // toast({
// // // //       //   title: emailCheck.exists && getAllowedRoles().includes(emailCheck.role || "") 
// // // //       //     ? "Reset Email Sent" 
// // // //       //     : "Reset Email Sent (Account Notice)",
// // // //       //   description: emailCheck.exists && !getAllowedRoles().includes(emailCheck.role || "")
// // // //       //     ? "Email sent, but the account is registered with a different role. Please check the message above."
// // // //       //     : "Check your email for the password reset link. The link will expire in 1 hour.",
// // // //       //   duration: 8000,
// // // //       // });
      
// // // //       toast({
// // // //         title: "Reset Email Sent",
// // // //         description: "Check your email for the password reset link. The link will expire in 1 hour.",
// // // //         duration: 9000,
// // // //       });
      
// // // //       mixpanelInstance.track("Forgot Password - Reset Email Sent", { 
// // // //         email, 
// // // //         userType,
// // // //         emailExists: emailCheck.exists,
// // // //         roleMatch: emailCheck.exists && emailCheck.role ? getAllowedRoles().includes(emailCheck.role) : false
// // // //       });
      
// // // //     } catch (error: any) {
// // // //       console.error("Error sending reset email:", error);
// // // //       rollbar.error("Forgot Password - Send Reset Error", error);
// // // //       setErrorMessage(error.message || "An error occurred. Please try again.");
// // // //       toast({
// // // //         title: "Failed to send reset email",
// // // //         description: error.message || "An error occurred. Please try again.",
// // // //         variant: "destructive",
// // // //       });
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const validatePasswords = () => {
// // // //     setPasswordError("");
// // // //     setConfirmPasswordError("");

// // // //     if (newPassword.length < 6) {
// // // //       setPasswordError("Password must be at least 6 characters long");
// // // //       return false;
// // // //     }

// // // //     if (newPassword !== confirmPassword) {
// // // //       setConfirmPasswordError("Passwords do not match");
// // // //       return false;
// // // //     }

// // // //     return true;
// // // //   };

// // // //   const handleResetPassword = async (e: React.FormEvent) => {
// // // //     e.preventDefault();
    
// // // //     // Reset messages
// // // //     setErrorMessage("");
// // // //     setSuccessMessage("");

// // // //     if (!validatePasswords()) {
// // // //       toast({
// // // //         title: "Validation Error",
// // // //         description: passwordError || confirmPasswordError || "Please check your passwords.",
// // // //         variant: "destructive",
// // // //       });
// // // //       return;
// // // //     }

// // // //     mixpanelInstance.track("Forgot Password - Reset Attempt", { email, userType });
// // // //     setLoading(true);

// // // //     try {
// // // //       // Update the user's password (session must be active)
// // // //       const { error } = await supabase.auth.updateUser({ password: newPassword });

// // // //       // if (error) {
// // // //       //   console.error("Supabase update error:", error);

// // // //       //   setErrorMessage(error.message || "Failed to reset password.");
// // // //       //   setStep("error");
// // // //       //   setLoading(false);
        
// // // //       //   // Handle specific error cases
// // // //       //   if (error.message.includes("session") || error.message.includes("token")) {
// // // //       //     setErrorMessage("Your reset link has expired. Please request a new password reset.");
// // // //       //     toast({
// // // //       //       title: "Session Expired",
// // // //       //       description: "Your reset link has expired. Please request a new password reset.",
// // // //       //       variant: "destructive",
// // // //       //     });
// // // //       //     setStep("email");
// // // //       //     setResetSent(false);
// // // //       //   } else {
// // // //       //     setErrorMessage(error.message || "Failed to reset password. Please try again.");
// // // //       //     toast({
// // // //       //       title: "Reset Failed",
// // // //       //       description: error.message || "Failed to reset password. Please try again.",
// // // //       //       variant: "destructive",
// // // //       //     });
// // // //       //   }
        
// // // //       //   mixpanelInstance.track("Forgot Password - Reset Failed", { 
// // // //       //     email, 
// // // //       //     userType, 
// // // //       //     error: error.message 
// // // //       //   });
// // // //       //   setLoading(false);
// // // //       //   return;
// // // //       // }

// // // //       // Show success message and redirect
// // // //       setStep("success");
// // // //       setSuccessMessage("Password reset successful! Redirecting to login...");
      
// // // //       toast({
// // // //         title: "Password Reset Successful!",
// // // //         description: "Your password has been updated. Redirecting to login...",
// // // //         variant: "default",
// // // //       });

// // // //       mixpanelInstance.track("Forgot Password - Success", { email, userType });

// // // //       // Clear the hash from URL to avoid confusion
// // // //       window.location.hash = "";

// // // //       // Redirect to login after 3 seconds
// // // //       setTimeout(() => {
// // // //         navigate(`/login/${userType}`);
// // // //       }, 3000);
      
// // // //     } catch (error: any) {
// // // //       console.error("Error resetting password:", error);
// // // //       setErrorMessage(error.message || "Failed to reset password. Please try again.");
// // // //       setStep("error");
// // // //       toast({
// // // //         title: "Reset Failed",
// // // //         description: error.message || "Failed to reset password. Please try again.",
// // // //         variant: "destructive",
// // // //       });
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const handleBackToLogin = () => {
// // // //     navigate(`/login/${userType}`);
// // // //   };

// // // //   const handleResendLink = () => {
// // // //     setResetSent(false);
// // // //     setEmail("");
// // // //     setErrorMessage("");
// // // //     setSuccessMessage("");
// // // //     setEmailCheckResult(null);
// // // //   };

// // // //   return (
// // // //     <AuthLayout
// // // //       title={config.title}
// // // //       description={config.description}
// // // //       userType={config.variant}
// // // //     >
// // // //       <div className="space-y-6">
// // // //         {/* Back to Login Link - Hide on success */}
// // // //         {step !== "success" && (
// // // //           <button
// // // //             onClick={handleBackToLogin}
// // // //             className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
// // // //           >
// // // //             <ArrowLeft className="h-4 w-4 mr-1" />
// // // //             Back to Login
// // // //           </button>
// // // //         )}

// // // //         {/* Success Step */}
// // // //         {step === "success" && (
// // // //           <div className="space-y-4">
// // // //             <Alert className="border-green-500 bg-green-50">
// // // //               <CheckCircle className="h-5 w-5 text-green-600" />
// // // //               <AlertDescription className="text-green-700 font-medium">
// // // //                 Password Reset Successful!
// // // //               </AlertDescription>
// // // //             </Alert>
            
// // // //             <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
// // // //               <CardContent className="pt-6 pb-6 text-center">
// // // //                 <div className="flex flex-col items-center gap-4">
// // // //                   <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
// // // //                     <CheckCircle className="h-8 w-8 text-green-600" />
// // // //                   </div>
// // // //                   <div className="space-y-2">
// // // //                     <h3 className="text-lg font-semibold text-green-800">Your password has been updated</h3>
// // // //                     <p className="text-sm text-green-700">
// // // //                       You can now login with your new password.
// // // //                     </p>
// // // //                   </div>
// // // //                   <Button
// // // //                     onClick={handleBackToLogin}
// // // //                     variant={config.variant}
// // // //                     className="mt-2"
// // // //                   >
// // // //                     Go to Login
// // // //                   </Button>
// // // //                 </div>
// // // //               </CardContent>
// // // //             </Card>
// // // //           </div>
// // // //         )}

// // // //         {/* Email Step */}
// // // //         {step === "email" && (
// // // //           <form onSubmit={handleSendResetEmail} className="space-y-4">
// // // //             <Alert>
// // // //               <Mail className="h-4 w-4" />
// // // //               <AlertDescription>
// // // //                 Enter your email address and we'll send you a password reset link.
// // // //               </AlertDescription>
// // // //             </Alert>

        
// // // //             {/* Success Message */}
// // // //             {successMessage && !resetSent && (
// // // //               <Alert className="border-green-500 bg-green-50">
// // // //                 <CheckCircle className="h-4 w-4 text-green-600" />
// // // //                 <AlertDescription className="text-green-700 whitespace-pre-line">
// // // //                   {successMessage}
// // // //                 </AlertDescription>
// // // //               </Alert>
// // // //             )}

// // // //             {/* Error Message */}
// // // //             {errorMessage && !resetSent && (
// // // //               <Alert variant="destructive">
// // // //                 <AlertCircle className="h-4 w-4" />
// // // //                 <AlertDescription>
// // // //                   {errorMessage}
// // // //                 </AlertDescription>
// // // //               </Alert>
// // // //             )}

// // // //             {/* Reset Sent Success with Role Info */}
// // // //             {resetSent && (
// // // //               <Alert className={`border ${emailCheckResult?.exists && emailCheckResult.role && !getAllowedRoles().includes(emailCheckResult.role) ? 'border-yellow-500 bg-yellow-50' : 'border-green-500 bg-green-50'}`}>
// // // //                 <CheckCircle className={`h-4 w-4 ${emailCheckResult?.exists && emailCheckResult.role && !getAllowedRoles().includes(emailCheckResult.role) ? 'text-yellow-600' : 'text-green-600'}`} />
// // // //                 <AlertDescription className={`whitespace-pre-line ${emailCheckResult?.exists && emailCheckResult.role && !getAllowedRoles().includes(emailCheckResult.role) ? 'text-yellow-700' : 'text-green-700'}`}>
// // // //                   {successMessage}
// // // //                   <div className="mt-3 flex flex-col sm:flex-row gap-2">
// // // //                     <Button
// // // //                       type="button"
// // // //                       variant="outline"
// // // //                       size="sm"
// // // //                       onClick={handleResendLink}
// // // //                     >
// // // //                       Send to different email
// // // //                     </Button>
// // // //                     <Button
// // // //                       type="button"
// // // //                       variant="ghost"
// // // //                       size="sm"
// // // //                       onClick={handleBackToLogin}
// // // //                     >
// // // //                       Back to Login
// // // //                     </Button>
// // // //                   </div>
// // // //                 </AlertDescription>
// // // //               </Alert>
// // // //             )}

// // // //             {/* Email Input Form */}
// // // //             {!resetSent && (
// // // //               <>
// // // //                 <div>
// // // //                   <Label htmlFor="reset-email">Email Address</Label>
// // // //                   <Input
// // // //                     id="reset-email"
// // // //                     type="email"
// // // //                     value={email}
// // // //                     onChange={(e) => {
// // // //                       setEmail(e.target.value);
// // // //                       setErrorMessage("");
// // // //                       setEmailCheckResult(null);
// // // //                     }}
// // // //                     placeholder="Enter your registered email"
// // // //                     required
// // // //                     disabled={loading}
// // // //                     className={errorMessage ? "border-red-500 focus:ring-red-500" : ""}
// // // //                   />
// // // //                 </div>

// // // //                 <Button
// // // //                   type="submit"
// // // //                   variant={config.variant}
// // // //                   className="w-full"
// // // //                   size="lg"
// // // //                   disabled={loading || !email.trim()}
// // // //                 >
// // // //                   {loading ? (
// // // //                     <>
// // // //                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// // // //                       Sending...
// // // //                     </>
// // // //                   ) : (
// // // //                     "Send Reset Link"
// // // //                   )}
// // // //                 </Button>
// // // //               </>
// // // //             )}
// // // //           </form>
// // // //         )}

// // // //         {/* New Password Step */}
// // // //         {step === "newPassword" && (
// // // //           <form onSubmit={handleResetPassword} className="space-y-4">
// // // //             <Alert className="border-blue-500 bg-blue-50">
// // // //               <AlertDescription className="text-blue-700">
// // // //                 Please enter your new password below.
// // // //               </AlertDescription>
// // // //             </Alert>

// // // //             {/* Success Message */}
// // // //             {successMessage && (
// // // //               <Alert className="border-green-500 bg-green-50">
// // // //                 <CheckCircle className="h-4 w-4 text-green-600" />
// // // //                 <AlertDescription className="text-green-700">
// // // //                   {successMessage}
// // // //                 </AlertDescription>
// // // //               </Alert>
// // // //             )}

// // // //             {/* Error Message */}
// // // //             {errorMessage && (
// // // //               <Alert variant="destructive">
// // // //                 <AlertCircle className="h-4 w-4" />
// // // //                 <AlertDescription>
// // // //                   {errorMessage}
// // // //                 </AlertDescription>
// // // //               </Alert>
// // // //             )}

// // // //             <div>
// // // //               <Label htmlFor="new-password">New Password</Label>
// // // //               <div className="relative">
// // // //                 <Input
// // // //                   id="new-password"
// // // //                   type={showNewPassword ? "text" : "password"}
// // // //                   value={newPassword}
// // // //                   onChange={(e) => {
// // // //                     setNewPassword(e.target.value);
// // // //                     setPasswordError("");
// // // //                     setErrorMessage("");
// // // //                   }}
// // // //                   placeholder="Enter new password"
// // // //                   required
// // // //                   disabled={loading}
// // // //                   className={`pr-10 ${passwordError ? "border-red-500 focus:ring-red-500" : ""}`}
// // // //                 />
// // // //                 <button
// // // //                   type="button"
// // // //                   onClick={() => setShowNewPassword(!showNewPassword)}
// // // //                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
// // // //                 >
// // // //                   {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
// // // //                 </button>
// // // //               </div>
// // // //               {passwordError && (
// // // //                 <p className="text-xs text-red-500 mt-1">{passwordError}</p>
// // // //               )}
// // // //               {!passwordError && newPassword && newPassword.length >= 6 && (
// // // //                 <p className="text-xs text-green-500 mt-1">✓ Password strength: Good</p>
// // // //               )}
// // // //               <p className="text-xs text-muted-foreground mt-1">
// // // //                 Password must be at least 6 characters long
// // // //               </p>
// // // //             </div>

// // // //             <div>
// // // //               <Label htmlFor="confirm-password">Confirm New Password</Label>
// // // //               <div className="relative">
// // // //                 <Input
// // // //                   id="confirm-password"
// // // //                   type={showConfirmPassword ? "text" : "password"}
// // // //                   value={confirmPassword}
// // // //                   onChange={(e) => {
// // // //                     setConfirmPassword(e.target.value);
// // // //                     setConfirmPasswordError("");
// // // //                     setErrorMessage("");
// // // //                   }}
// // // //                   placeholder="Confirm new password"
// // // //                   required
// // // //                   disabled={loading}
// // // //                   className={`pr-10 ${
// // // //                     confirmPasswordError 
// // // //                       ? "border-red-500 focus:ring-red-500" 
// // // //                       : confirmPassword && newPassword === confirmPassword && newPassword.length >= 6
// // // //                       ? "border-green-500 focus:ring-green-500"
// // // //                       : ""
// // // //                   }`}
// // // //                 />
// // // //                 <button
// // // //                   type="button"
// // // //                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
// // // //                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
// // // //                 >
// // // //                   {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
// // // //                 </button>
// // // //               </div>
// // // //               {confirmPasswordError && (
// // // //                 <p className="text-xs text-red-500 mt-1">{confirmPasswordError}</p>
// // // //               )}
// // // //               {!confirmPasswordError && confirmPassword && newPassword === confirmPassword && newPassword.length >= 6 && (
// // // //                 <p className="text-xs text-green-500 mt-1">✓ Passwords match</p>
// // // //               )}
// // // //             </div>

// // // //             <Button
// // // //               type="submit"
// // // //               variant={config.variant}
// // // //               className="w-full"
// // // //               size="lg"
// // // //               disabled={
// // // //                 loading || 
// // // //                 !newPassword || 
// // // //                 !confirmPassword || 
// // // //                 newPassword !== confirmPassword ||
// // // //                 newPassword.length < 6 ||
// // // //                 !!passwordError ||
// // // //                 !!confirmPasswordError
// // // //               }
// // // //             >
// // // //               {loading ? (
// // // //                 <>
// // // //                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// // // //                   Resetting Password...
// // // //                 </>
// // // //               ) : (
// // // //                 "Reset Password"
// // // //               )}
// // // //             </Button>
// // // //           </form>
// // // //         )}

// // // //         {/* Error Step */}
// // // //         {step === "error" && (
// // // //           <div className="space-y-4">
// // // //             <Alert variant="destructive">
// // // //               <AlertCircle className="h-5 w-5" />
// // // //               <AlertDescription>
// // // //                 {errorMessage || "Something went wrong while resetting your password."}
// // // //               </AlertDescription>
// // // //             </Alert>

// // // //             <Card className="border-red-200 bg-gradient-to-r from-red-50 to-rose-50">
// // // //               <CardContent className="pt-6 pb-6 text-center">
// // // //                 <div className="flex flex-col items-center gap-4">
// // // //                   <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
// // // //                     <AlertCircle className="h-8 w-8 text-red-600" />
// // // //                   </div>

// // // //                   <div className="space-y-2">
// // // //                     <h3 className="text-lg font-semibold text-red-800">
// // // //                       Password Reset Failed
// // // //                     </h3>

// // // //                     <p className="text-sm text-red-700">
// // // //                       {errorMessage ||
// // // //                         "We were unable to reset your password. Please try again or request a new reset link."}
// // // //                     </p>
// // // //                   </div>

// // // //                   <div className="flex flex-col sm:flex-row gap-2 mt-2">
// // // //                     <Button
// // // //                       onClick={() => {
// // // //                         setStep("email");
// // // //                         setErrorMessage("");
// // // //                         setSuccessMessage("");
// // // //                         setResetSent(false);
// // // //                       }}
// // // //                       variant={config.variant}
// // // //                     >
// // // //                       Try Again
// // // //                     </Button>

// // // //                     <Button
// // // //                       onClick={handleBackToLogin}
// // // //                       variant="outline"
// // // //                     >
// // // //                       Back to Login
// // // //                     </Button>
// // // //                   </div>
// // // //                 </div>
// // // //               </CardContent>
// // // //             </Card>
// // // //           </div>
// // // //         )}

// // // //         {/* Additional Help - Hide on success */}
// // // //         {step !== "success" && (
// // // //           <Card className="bg-muted/50">
// // // //             <CardContent className="pt-4 pb-3 px-4">
// // // //               <div className="flex items-start gap-2 text-sm">
// // // //                 <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
// // // //                 <p className="text-muted-foreground">
// // // //                   Having trouble? Contact support at{" "}
// // // //                   <a href="mailto:support@pmhssmarthealth.com" className="text-primary hover:underline">
// // // //                     support@pmhssmarthealth.com
// // // //                   </a>
// // // //                 </p>
// // // //               </div>
// // // //             </CardContent>
// // // //           </Card>
// // // //         )}
// // // //       </div>
// // // //     </AuthLayout>
// // // //   );
// // // // };

// // // // export default ForgotPassword;



// // // import { useState, useEffect } from "react";
// // // import { useParams, useNavigate } from "react-router-dom";
// // // import { Button } from "@/components/ui/button";
// // // import { Input } from "@/components/ui/input";
// // // import { Label } from "@/components/ui/label";
// // // import { useToast } from "@/hooks/use-toast";
// // // import AuthLayout from "./AuthLayout";
// // // import { supabase } from "@/integrations/supabase/client";
// // // import mixpanelInstance from "@/utils/mixpanel";
// // // import { Card, CardContent } from "@/components/ui/card";
// // // import { AlertCircle, Mail, ArrowLeft, Loader2, EyeOff, Eye } from "lucide-react";
// // // import { Alert, AlertDescription } from "@/components/ui/alert";
// // // import rollbar from "@/lib/rollbar";

// // // type ResetStep = "email" | "newPassword";

// // // const ForgotPassword = () => {
// // //   const { userType } = useParams();
// // //   const navigate = useNavigate();
// // //   const { toast } = useToast();

// // //   const [step, setStep] = useState<ResetStep>("email");
// // //   const [email, setEmail] = useState("");
// // //   const [newPassword, setNewPassword] = useState("");
// // //   const [confirmPassword, setConfirmPassword] = useState("");
// // //   const [loading, setLoading] = useState(false);
// // //   const [resetSent, setResetSent] = useState(false);
// // // const [showNewPassword, setShowNewPassword] = useState(false);
// // // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
// // //   // Check if we have a recovery token in the URL hash (Supabase puts it there)
// // //   // useEffect(() => {
// // //   //   const hashParams = new URLSearchParams(window.location.hash.substring(1));
// // //   //   const accessToken = hashParams.get("access_token");
// // //   //   const type = hashParams.get("type");

// // //   //   if (accessToken && type === "recovery") {
// // //   //     // Supabase will already have set the session, but we ensure it
// // //   //     supabase.auth.setSession({
// // //   //       access_token: accessToken,
// // //   //       refresh_token: hashParams.get("refresh_token") || "",
// // //   //     });
// // //   //     setStep("newPassword");
// // //   //   }
// // //   // }, []);

// // //   useEffect(() => {
// // //   const hashParams = new URLSearchParams(window.location.hash.substring(1));
// // //   const accessToken = hashParams.get("access_token");
// // //   const refreshToken = hashParams.get("refresh_token");
// // //   const type = hashParams.get("type");

// // //   if (accessToken && type === "recovery") {
// // //     // Set session explicitly
// // //     supabase.auth.setSession({
// // //       access_token: accessToken,
// // //       refresh_token: refreshToken || "",
// // //     }).then(({ error }) => {
// // //       if (error) {
// // //         console.error("Session error:", error);
// // //         toast({
// // //           title: "Invalid or expired link",
// // //           description: "Please request a new password reset link.",
// // //           variant: "destructive",
// // //         });
// // //         navigate(`/login/${userType}`);
// // //       } else {
// // //         setStep("newPassword");
// // //       }
// // //     });
// // //   }
// // // }, [userType, navigate, toast]);

// // //   const userTypeConfig: Record<
// // //     string,
// // //     {
// // //       title: string;
// // //       description: string;
// // //       variant: "patient" | "doctor" | "facility" | "admin";
// // //     }
// // //   > = {
// // //     patient: {
// // //       title: "Reset Patient Password",
// // //       description: "Reset your password to access your health dashboard",
// // //       variant: "patient",
// // //     },
// // //     doctor: {
// // //       title: "Reset Medical Professional Password",
// // //       description: "Reset your password to access your practice management dashboard",
// // //       variant: "doctor",
// // //     },
// // //     facility: {
// // //       title: "Reset Medical Facility Password",
// // //       description: "Reset your password to manage your facility or staff access",
// // //       variant: "facility",
// // //     },
// // //     "facility-admin": {
// // //       title: "Reset Facility Admin Password",
// // //       description: "Reset your password to manage your facility",
// // //       variant: "facility",
// // //     },
// // //     "facility-staff": {
// // //       title: "Reset Facility Staff Password",
// // //       description: "Reset your password to access assigned operations",
// // //       variant: "facility",
// // //     },
// // //     admin: {
// // //       title: "Reset Admin Password",
// // //       description: "Reset your password for platform administration",
// // //       variant: "admin",
// // //     },
// // //   };

// // //   // Normalize userType for config display (staff/admin variants share facility layout)
// // //   // const normalizedUserType =
// // //   //   userType === "facility-admin" || userType === "facility-staff"
// // //   //     ? "facility"
// // //   //     : userType || "patient";

// // //   const config =
// // //     userTypeConfig[userType as keyof typeof userTypeConfig] ||
// // //     userTypeConfig.patient;
    

// // //   // Determine which roles are allowed for this userType
// // //   const getAllowedRoles = (): string[] => {
// // //     if (userType === "facility" || userType === "facility-admin" || userType === "facility-staff") {
// // //       return ["hospital_admin", "hospital_staff"];
// // //     }
// // //     // For patient, doctor, admin, the param should match the role name exactly
// // //     return [userType || "patient"];
// // //   };

// // //   // Track page view
// // //   useEffect(() => {
// // //     mixpanelInstance.track("Forgot Password Page Viewed", { userType });
// // //   }, [userType]);

// // //   const checkEmailInProfiles = async (email: string): Promise<boolean> => {
// // //     const lowerCaseEmail = email.toLowerCase();
// // //     const allowedRoles = getAllowedRoles();

// // //     let query = supabase
// // //       .from("profiles")
// // //       .select("email")
// // //       .eq("email", lowerCaseEmail);

// // //     // if (allowedRoles.length > 1) {
// // //     //   query = query.in("role", allowedRoles);
// // //     // } else {
// // //     //   query = query.eq("role", allowedRoles[0]);
// // //     // }

// // //     const { data, error } = await query.maybeSingle();
// // //     if (error) {
// // //       console.error("Error checking email:", error);
// // //       return false;
// // //     }
// // //     return !!data;
// // //   };

// // //   const handleSendResetEmail = async (e: React.FormEvent) => {
// // //     e.preventDefault();

// // //     mixpanelInstance.track("Forgot Password - Send Reset Attempt", { email, userType });
// // //     setLoading(true);

// // //     try {
// // //       const emailExists = await checkEmailInProfiles(email);
// // //       // if (!emailExists) {
// // //       //   toast({
// // //       //     title: "Email not found",
// // //       //     description:
// // //       //       "We couldn't find an account with this email. Please check or contact your administrator.",
// // //       //     variant: "destructive",
// // //       //   });
// // //       //   mixpanelInstance.track("Forgot Password - Email Not Found", { email, userType });
// // //       //   return;
// // //       // }
// // //       const isStaff = userType === "hospital_staff";

// // //       // Always redirect to the same ForgotPassword component.
// // //       // The recovery token will be appended as a hash fragment by Supabase.
// // //       // const redirectUrl = `${window.location.origin}/forgot-password/${userType}`;
// // //       const redirectUrl = isStaff
// // //   ? `${window.location.origin}/set-password?type=recovery&userType=${userType}`
// // //   : `${window.location.origin}/forgot-password/${userType}`;

// // //       const { error } = await supabase.auth.resetPasswordForEmail(email, {
// // //         redirectTo: redirectUrl,
// // //       });

// // //       if (error) {
// // //         console.error("Supabase reset error:", error);
// // //         toast({
// // //           title: "Failed to send reset email",
// // //           description: error.message || "An error occurred. Please try again.",
// // //           variant: "destructive",
// // //         });
// // //         return;
// // //       }

// // //       setResetSent(true);
// // //       toast({
// // //         title: "Reset Email Sent",
// // //         description:
// // //           "Check your email for the password reset link. The link will expire in 1 hour.",
// // //         duration: 6000,
// // //       });
// // //       mixpanelInstance.track("Forgot Password - Reset Email Sent", { email, userType });
// // //     } catch (error: any) {
// // //       console.error("Error sending reset email:", error);
// // //       rollbar.error("Forgot Password - Send Reset Error", error);
// // //       toast({
// // //         title: "Failed to send reset email",
// // //         description: error.message || "An error occurred. Please try again.",
// // //         variant: "destructive",
// // //       });
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleResetPassword = async (e: React.FormEvent) => {
// // //     e.preventDefault();

// // //     if (newPassword !== confirmPassword) {
// // //       toast({
// // //         title: "Passwords don't match",
// // //         description: "Please make sure your passwords match.",
// // //         variant: "destructive",
// // //       });
// // //       return;
// // //     }

// // //     if (newPassword.length < 6) {
// // //       toast({
// // //         title: "Password too short",
// // //         description: "Password must be at least 6 characters long.",
// // //         variant: "destructive",
// // //       });
// // //       return;
// // //     }

// // //     mixpanelInstance.track("Forgot Password - Reset Attempt", { email, userType });
// // //     setLoading(true);

// // //     try {
// // //       // Update the user's password (session must be active)
// // //       const { error } = await supabase.auth.updateUser({ password: newPassword });

// // //       if (error) {
// // //         console.error("Supabase update error:", error);
// // //         toast({
// // //           title: "Reset Failed",
// // //           description: error.message || "Failed to reset password. Please try again.",
// // //           variant: "destructive",
// // //         });
// // //         return;
// // //       }

// // //       toast({
// // //         title: "Password Reset Successful!",
// // //         description: "Your password has been updated. Please login with your new password.",
// // //       });

// // //       mixpanelInstance.track("Forgot Password - Success", { email, userType });

// // //       // Clear the hash from URL to avoid confusion
// // //       window.location.hash = "";

// // //       // Redirect to login after 2 seconds
// // //       setTimeout(() => {
// // //         navigate(`/login/${userType}`);
// // //       }, 2000);
// // //     } catch (error: any) {
// // //       console.error("Error resetting password:", error);
// // //       toast({
// // //         title: "Reset Failed",
// // //         description: error.message || "Failed to reset password. Please try again.",
// // //         variant: "destructive",
// // //       });
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleBackToLogin = () => {
// // //     navigate(`/login/${userType}`);
// // //   };

// // //   return (
// // //     <AuthLayout
// // //       title={config.title}
// // //       description={config.description}
// // //       userType={config.variant}
// // //     >
// // //       <div className="space-y-6">
// // //         {/* Back to Login Link */}
// // //         <button
// // //           onClick={handleBackToLogin}
// // //           className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
// // //         >
// // //           <ArrowLeft className="h-4 w-4 mr-1" />
// // //           Back to Login
// // //         </button>

// // //         {/* Email Step */}
// // //         {step === "email" && (
// // //           <form onSubmit={handleSendResetEmail} className="space-y-4">
// // //             <Alert>
// // //               <Mail className="h-4 w-4" />
// // //               <AlertDescription>
// // //                 Enter your email address and we'll send you a password reset link.
// // //               </AlertDescription>
// // //             </Alert>

// // //             {resetSent ? (
// // //               <Alert variant="default" className="border-green-500 bg-green-50">
// // //                 <AlertDescription className="text-green-700">
// // //                   Reset link sent! Check your email at <strong>{email}</strong> and follow the
// // //                   instructions to reset your password.
// // //                 </AlertDescription>
// // //               </Alert>
// // //             ) : (
// // //               <>
// // //                 <div>
// // //                   <Label htmlFor="reset-email">Email Address</Label>
// // //                   <Input
// // //                     id="reset-email"
// // //                     type="email"
// // //                     value={email}
// // //                     onChange={(e) => setEmail(e.target.value)}
// // //                     placeholder="Enter your registered email"
// // //                     required
// // //                     disabled={loading}
// // //                   />
// // //                 </div>

// // //                 <Button
// // //                   type="submit"
// // //                   variant={config.variant}
// // //                   className="w-full"
// // //                   size="lg"
// // //                   disabled={loading}
// // //                 >
// // //                   {loading ? (
// // //                     <>
// // //                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// // //                       Sending...
// // //                     </>
// // //                   ) : (
// // //                     "Send Reset Link"
// // //                   )}
// // //                 </Button>
// // //               </>
// // //             )}
// // //           </form>
// // //         )}

// // //         {/* New Password Step */}
// // //         {step === "newPassword" && (
// // //           <form onSubmit={handleResetPassword} className="space-y-4">
// // //             <Alert variant="default" className="border-blue-500 bg-blue-50">
// // //               <AlertDescription className="text-blue-700">
// // //                 Please enter your new password below.
// // //               </AlertDescription>
// // //             </Alert>

// // //             {/* <div>
// // //               <Label htmlFor="new-password">New Password</Label>
// // //               <Input
// // //                 id="new-password"
// // //                 type="password"
// // //                 value={newPassword}
// // //                 onChange={(e) => setNewPassword(e.target.value)}
// // //                 placeholder="Enter new password"
// // //                 required
// // //                 disabled={loading}
// // //               />
// // //               <p className="text-xs text-muted-foreground mt-1">
// // //                 Password must be at least 6 characters long
// // //               </p>
// // //             </div>

// // //             <div>
// // //               <Label htmlFor="confirm-password">Confirm New Password</Label>
// // //               <Input
// // //                 id="confirm-password"
// // //                 type="password"
// // //                 value={confirmPassword}
// // //                 onChange={(e) => setConfirmPassword(e.target.value)}
// // //                 placeholder="Confirm new password"
// // //                 required
// // //                 disabled={loading}
// // //               />
// // //             </div> */}

// // //             <div>
// // //   <Label htmlFor="new-password">New Password</Label>
// // //   <div className="relative">
// // //     <Input
// // //       id="new-password"
// // //       type={showNewPassword ? "text" : "password"}
// // //       value={newPassword}
// // //       onChange={(e) => setNewPassword(e.target.value)}
// // //       placeholder="Enter new password"
// // //       required
// // //       disabled={loading}
// // //       className="pr-10"
// // //     />
// // //     <button
// // //       type="button"
// // //       onClick={() => setShowNewPassword(!showNewPassword)}
// // //       className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
// // //     >
// // //       {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
// // //     </button>
// // //   </div>
// // //   <p className="text-xs text-muted-foreground mt-1">
// // //     Password must be at least 6 characters long
// // //   </p>
// // // </div>

// // // <div>
// // //   <Label htmlFor="confirm-password">Confirm New Password</Label>
// // //   <div className="relative">
// // //     <Input
// // //       id="confirm-password"
// // //       type={showConfirmPassword ? "text" : "password"}
// // //       value={confirmPassword}
// // //       onChange={(e) => setConfirmPassword(e.target.value)}
// // //       placeholder="Confirm new password"
// // //       required
// // //       disabled={loading}
// // //       className="pr-10"
// // //     />
// // //     <button
// // //       type="button"
// // //       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
// // //       className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
// // //     >
// // //       {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
// // //     </button>
// // //   </div>
// // // </div>

// // //             <Button
// // //               type="submit"
// // //               variant={config.variant}
// // //               className="w-full"
// // //               size="lg"
// // //               disabled={loading || !newPassword || !confirmPassword}
// // //             >
// // //               {loading ? (
// // //                 <>
// // //                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// // //                   Resetting...
// // //                 </>
// // //               ) : (
// // //                 "Reset Password"
// // //               )}
// // //             </Button>
// // //           </form>
// // //         )}

// // //         {/* Additional Help */}
// // //         <Card className="bg-muted/50">
// // //           <CardContent className="pt-4 pb-3 px-4">
// // //             <div className="flex items-start gap-2 text-sm">
// // //               <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
// // //               <p className="text-muted-foreground">
// // //                 Having trouble? Contact support at{" "}
// // //                 <a href="support@pmhssmarthealth.com" className="text-primary hover:underline">
// // //                   support@pmhssmarthealth.com
// // //                 </a>
// // //               </p>
// // //             </div>
// // //           </CardContent>
// // //         </Card>
// // //       </div>
// // //     </AuthLayout>
// // //   );
// // // };

// // // export default ForgotPassword;


// // import { useState, useEffect } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { useToast } from "@/hooks/use-toast";
// // import AuthLayout from "./AuthLayout";
// // import { supabase } from "@/integrations/supabase/client";
// // import mixpanelInstance from "@/utils/mixpanel";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { AlertCircle, Mail, ArrowLeft, Loader2, EyeOff, Eye, AlertTriangle } from "lucide-react";
// // import { Alert, AlertDescription } from "@/components/ui/alert";
// // import rollbar from "@/lib/rollbar";

// // type ResetStep = "email" | "newPassword";

// // const ForgotPassword = () => {
// //   const { userType } = useParams();
// //   const navigate = useNavigate();
// //   const { toast } = useToast();

// //   const [step, setStep] = useState<ResetStep>("email");
// //   const [email, setEmail] = useState("");
// //   const [newPassword, setNewPassword] = useState("");
// //   const [confirmPassword, setConfirmPassword] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [resetSent, setResetSent] = useState(false);
// //   const [showNewPassword, setShowNewPassword] = useState(false);
// //   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
// //   const [profileInfo, setProfileInfo] = useState<{ role: string | null; exists: boolean }>({ role: null, exists: false });

// //   // Check if we have a recovery token in the URL hash (Supabase puts it there)
// // //   useEffect(() => {
// // //     const hashParams = new URLSearchParams(window.location.hash.substring(1));
// // //     const accessToken = hashParams.get("access_token");
// // //     const refreshToken = hashParams.get("refresh_token");
// // //     const type = hashParams.get("type");

// // //     // if (accessToken && type === "recovery") {
// // //     //   // Set session explicitly
// // //     //   supabase.auth.setSession({
// // //     //     access_token: accessToken,
// // //     //     refresh_token: refreshToken || "",
// // //     //   }).then(({ error }) => {
// // //     //     if (error) {
// // //     //       console.error("Session error:", error);
// // //     //       toast({
// // //     //         title: "Invalid or expired link",
// // //     //         description: "Please request a new password reset link.",
// // //     //         variant: "destructive",
// // //     //       });
// // //     //       navigate(`/login/${userType}`);
// // //     //     } else {
// // //     //       setStep("newPassword");
// // //     //     }
// // //     //   });
// // //     // }

// // //     if (accessToken && type === "recovery") {
// // //   supabase.auth.setSession({
// // //     access_token: accessToken,
// // //     refresh_token: refreshToken || "",
// // //   }).then(async ({ error }) => {
// // //     if (error) {
// // //       toast({
// // //         title: "Invalid or expired link",
// // //         description: "Please request a new password reset link.",
// // //         variant: "destructive",
// // //       });

// // //       navigate(`/login/${userType}`);
// // //       return;
// // //     }

// // //     try {
// // //       // Get authenticated user
// // //       const {
// // //         data: { user },
// // //       } = await supabase.auth.getUser();

// // //       const userEmail = user?.email?.toLowerCase();

// // //       if (!userEmail) {
// // //         throw new Error("User email not found");
// // //       }

// // //       // Fetch role from profiles
// // //       const { data: profile, error: profileError } = await supabase
// // //         .from("profiles")
// // //         .select("role")
// // //         .eq("email", userEmail)
// // //         .single();

// // //       if (profileError || !profile) {
// // //         throw new Error("Profile not found");
// // //       }

// // //       const allowedRoles = getAllowedRoles();

// // //       if (!allowedRoles.includes(profile.role)) {
// // //         toast({
// // //           title: "Portal Mismatch",
// // //           description: `This account belongs to ${getFriendlyRoleName(
// // //             profile.role
// // //           )}. Please use the correct portal.`,
// // //           variant: "destructive",
// // //         });

// // //         navigate(`/login/${userType}`);
// // //         return;
// // //       }

// // //       // Role matched
// // //       setStep("newPassword");
// // //     } catch (err) {
// // //       console.error(err);

// // //       toast({
// // //         title: "Verification Failed",
// // //         description: "Unable to verify account information.",
// // //         variant: "destructive",
// // //       });

// // //       navigate(`/login/${userType}`);
// // //     }
// // //   });
// // // }

// // //   }, [userType, navigate, toast]);

// // useEffect(() => {
// //   const handleRecovery = async () => {
// //     const hashParams = new URLSearchParams(window.location.hash.substring(1));

// //     const accessToken = hashParams.get("access_token");
// //     const refreshToken = hashParams.get("refresh_token");
// //     const type = hashParams.get("type");

// //     if (accessToken && type === "recovery") {
// //       const { error } = await supabase.auth.setSession({
// //         access_token: accessToken,
// //         refresh_token: refreshToken || "",
// //       });

// //       if (error) {
// //         toast({
// //           title: "Invalid or expired link",
// //           description: "Please request a new password reset link.",
// //           variant: "destructive",
// //         });

// //         navigate(`/login/${userType}`);
// //         return;
// //       }

// //       // Get authenticated user
// //       const {
// //         data: { user },
// //       } = await supabase.auth.getUser();

// //       const email = user?.email?.toLowerCase();

// //       if (!email) {
// //         navigate("/login/patient");
// //         return;
// //       }

// //       // Get profile role
// //       const { data: profile, error: profileError } = await supabase
// //         .from("profiles")
// //         .select("role")
// //         .eq("email", email)
// //         .single();

// //       if (profileError || !profile) {
// //         navigate("/login/patient");
// //         return;
// //       }

// //       // Store profile info
// //       setProfileInfo({
// //         role: profile.role,
// //         exists: true,
// //       });

// //       // Validate portal against role
// //       let roleMatched = false;

// //       switch (profile.role) {
// //         case "patient":
// //           roleMatched = userType === "patient";
// //           break;

// //         case "doctor":
// //           roleMatched = userType === "doctor";
// //           break;

// //         case "hospital_admin":
// //           roleMatched =
// //             userType === "facility" ||
// //             userType === "facility-admin";
// //           break;

// //         case "hospital_staff":
// //           roleMatched =
// //             userType === "facility" ||
// //             userType === "facility-staff";
// //           break;

// //         case "admin":
// //           roleMatched = userType === "admin";
// //           break;
// //       }

// //       const roleRouteMap: Record<string, string> = {
// //         patient: "/forgot-password/patient",
// //         doctor: "/forgot-password/doctor",
// //         hospital_admin: "/forgot-password/facility-admin",
// //         hospital_staff: "/forgot-password/facility-staff",
// //         admin: "/forgot-password/admin",
// //       };

// //       if (!roleMatched) {
// //         toast({
// //           title: "Incorrect Portal",
// //           description: `This account belongs to ${profile.role.replace(
// //             "_",
// //             " "
// //           )}. Redirecting to the correct password reset page.`,
// //           variant: "destructive",
// //         });

// //         setTimeout(() => {
// //           navigate(roleRouteMap[profile.role]);
// //         }, 1500);
        
// //         return; // ✅ Stop execution here - don't proceed to setStep
// //       }

// //       // ✅ Correct portal - only reach this line if role matches
// //       setStep("newPassword");
// //     }
// //   };

// //   handleRecovery();
// // }, [userType, navigate, toast]);

// //   // const userTypeConfig: Record<
// //   //   string,
// //   //   {
// //   //     title: string;
// //   //     description: string;
// //   //     variant: "patient" | "doctor" | "facility" | "admin";
// //   //   }
// //   // > = {
// //   //   patient: {
// //   //     title: "Reset Patient Password",
// //   //     description: "Reset your password to access your health dashboard",
// //   //     variant: "patient",
// //   //   },
// //   //   doctor: {
// //   //     title: "Reset Medical Professional Password",
// //   //     description: "Reset your password to access your practice management dashboard",
// //   //     variant: "doctor",
// //   //   },
// //   //   facility: {
// //   //     title: "Reset Medical Facility Password",
// //   //     description: "Reset your password to manage your facility or staff access",
// //   //     variant: "facility",
// //   //   },
// //   //   "facility-admin": {
// //   //     title: "Reset Facility Admin Password",
// //   //     description: "Reset your password to manage your facility",
// //   //     variant: "facility",
// //   //   },
// //   //   "facility-staff": {
// //   //     title: "Reset Facility Staff Password",
// //   //     description: "Reset your password to access assigned operations",
// //   //     variant: "facility",
// //   //   },
// //   //   admin: {
// //   //     title: "Reset Admin Password",
// //   //     description: "Reset your password for platform administration",
// //   //     variant: "admin",
// //   //   },
// //   // };
// // const userTypeConfig: Record<
// //   string,
// //   {
// //     // Email Step
// //     emailTitle: string;
// //     emailDescription: string;
// //     // New Password Step
// //     passwordTitle: string;
// //     passwordDescription: string;
// //     // Success Step
// //     successTitle: string;
// //     successDescription: string;
// //     variant: "patient" | "doctor" | "facility" | "admin";
// //   }
// // > = {
// //   patient: {
// //     emailTitle: "Reset Patient Password",
// //     emailDescription: "Enter your email to receive a password reset link for your patient account",
// //     passwordTitle: "Create New Patient Password",
// //     passwordDescription: "Choose a strong password to secure your health dashboard",
// //     successTitle: "Patient Password Reset requested!",
// //     successDescription: "",
// //     variant: "patient",
// //   },
// //   doctor: {
// //     emailTitle: "Reset Medical Professional Password",
// //     emailDescription: "Enter your email to receive a reset link for your medical professional account",
// //     passwordTitle: "Create New Medical Professional Password",
// //     passwordDescription: "Choose a strong password to secure your practice management dashboard",
// //     successTitle: "Medical Professional Password Reset requested!",
// //     successDescription: "",
// //     variant: "doctor",
// //   },
// //   facility: {
// //     emailTitle: "Reset Medical Facility Password",
// //     emailDescription: "Enter your email to receive a reset link for your facility management account",
// //     passwordTitle: "Create New Facility Password",
// //     passwordDescription: "Choose a strong password to secure your facility management dashboard",
// //     successTitle: "Facility Password Reset requested!",
// //     successDescription: "",
// //     variant: "facility",
// //   },
// //   "facility-admin": {
// //     emailTitle: "Reset Facility Admin Password",
// //     emailDescription: "Enter your email to receive a reset link for your facility admin account",
// //     passwordTitle: "Create New Admin Password",
// //     passwordDescription: "Choose a strong password to secure your facility administration access",
// //     successTitle: "Facility Admin Password Reset requested!",
// //     successDescription: "",
// //     variant: "facility",
// //   },
// //   "facility-staff": {
// //     emailTitle: "Reset Facility Staff Password",
// //     emailDescription: "Enter your email to receive a reset link for your staff account",
// //     passwordTitle: "Create New Staff Password",
// //     passwordDescription: "Choose a strong password to secure your assigned operations access",
// //     successTitle: "Facility Staff Password Reset requested!",
// //     successDescription: "",
// //     variant: "facility",
// //   },
// //   admin: {
// //     emailTitle: "Reset Admin Password",
// //     emailDescription: "Enter your email to receive a reset link for your administrator account",
// //     passwordTitle: "Create New Admin Password",
// //     passwordDescription: "Choose a strong password to secure your platform administration access",
// //     successTitle: "Admin Password Reset requested!",
// //     successDescription: "",
// //     variant: "admin",
// //   },
// // };
// //   const config =
// //     userTypeConfig[userType as keyof typeof userTypeConfig] ||
// //     userTypeConfig.patient;

// //   // Determine which roles are allowed for this userType
// //   const getAllowedRoles = (): string[] => {
// //     if (userType === "facility" || userType === "facility-admin" || userType === "facility-staff") {
// //       return ["hospital_admin", "hospital_staff"];
// //     }
// //     // For patient, doctor, admin, the param should match the role name exactly
// //     return [userType || "patient"];
// //   };

// //   // Track page view
// //   useEffect(() => {
// //     mixpanelInstance.track("Forgot Password Page Viewed", { userType });
// //   }, [userType]);

// //   const checkEmailInProfiles = async (email: string): Promise<boolean> => {
// //     const lowerCaseEmail = email.toLowerCase();
// //     const allowedRoles = getAllowedRoles();

// //     let query = supabase
// //       .from("profiles")
// //       .select("email")
// //       .eq("email", lowerCaseEmail);

// //     const { data, error } = await query.maybeSingle();
// //     if (error) {
// //       console.error("Error checking email:", error);
// //       return false;
// //     }
// //     return !!data;
// //   };

// //   // New function to get full profile info including role
// //   const getProfileInfo = async (email: string): Promise<{ role: string | null; exists: boolean }> => {
// //     const lowerCaseEmail = email.toLowerCase();
    
// //     const { data, error } = await supabase
// //       .from("profiles")
// //       .select("role")
// //       .eq("email", lowerCaseEmail)
// //       .maybeSingle();
    
// //     if (error || !data) {
// //       console.error("Error getting profile info:", error);
// //       return { role: null, exists: false };
// //     }
    
// //     return { role: data.role, exists: true };
// //   };

// //   const handleSendResetEmail = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //  if (!email || !email.includes('@')) {
// //     toast({
// //       title: "Invalid email",
// //       description: `Please enter a valid email address "@".`,
// //       variant: "destructive",
// //     });
// //     return;
// //   }

// //     mixpanelInstance.track("Forgot Password - Send Reset Attempt", { email, userType });
// //     setLoading(true);

// //     try {
// //       // Get profile info including role
// //       const profileData = await getProfileInfo(email);
// //       setProfileInfo(profileData);
      
// //       const emailExists = await checkEmailInProfiles(email);
      
// //       const isStaff = userType === "hospital_staff";

// //       const redirectUrl = isStaff
// //         ? `${window.location.origin}/set-password?type=recovery&userType=${userType}`
// //         : `${window.location.origin}/forgot-password/${userType}`;

// //       const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
// //         redirectTo: redirectUrl,
// //       });

// //       if (error) {
// //         console.error("Supabase reset error:", error);
// //         toast({
// //           title: "Failed to send reset email",
// //           description: error.message || "An error occurred. Please try again.",
// //           variant: "destructive",
// //         });
// //         return;
// //       }

// //       setResetSent(true);
// //       toast({
// //         title: "Reset Email Sent",
// //         description: "Check your email for the password reset link. The link will expire in 1 hour.",
// //         duration: 6000,
// //       });
// //       mixpanelInstance.track("Forgot Password - Reset Email Sent", { email, userType });
// //     } catch (error: any) {
// //       console.error("Error sending reset email:", error);
// //       rollbar.error("Forgot Password - Send Reset Error", error);
// //       toast({
// //         title: "Failed to send reset email",
// //         description: error.message || "An error occurred. Please try again.",
// //         variant: "destructive",
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleResetPassword = async (e: React.FormEvent) => {
// //     e.preventDefault();

// //     if (newPassword !== confirmPassword) {
// //       toast({
// //         title: "Passwords don't match",
// //         description: "Please make sure your passwords match.",
// //         variant: "destructive",
// //       });
// //       return;
// //     }

// //     if (newPassword.length < 6) {
// //       toast({
// //         title: "Password too short",
// //         description: "Password must be at least 6 characters long.",
// //         variant: "destructive",
// //       });
// //       return;
// //     }

// //     mixpanelInstance.track("Forgot Password - Reset Attempt", { email, userType });
// //     setLoading(true);

// //     try {
// //       // Update the user's password (session must be active)
// //       const { error } = await supabase.auth.updateUser({ password: newPassword });

// //       if (error) {
// //         console.error("Supabase update error:", error);
// //         toast({
// //           title: "Reset Failed",
// //           description: error.message || "Failed to reset password. Please try again.",
// //           variant: "destructive",
// //         });
// //         return;
// //       }

// //       toast({
// //         title: "Password Reset Successful!",
// //         description: "Your password has been updated. Please login with your new password.",
// //       });

// //       mixpanelInstance.track("Forgot Password - Success", { email, userType });

// //       // Clear the hash from URL to avoid confusion
// //       window.location.hash = "";

// //       // Redirect to login after 2 seconds
// //       setTimeout(() => {
// //         navigate(`/login/${userType}`);
// //       }, 2000);
// //     } catch (error: any) {
// //       console.error("Error resetting password:", error);
// //       toast({
// //         title: "Reset Failed",
// //         description: error.message || "Failed to reset password. Please try again.",
// //         variant: "destructive",
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleBackToLogin = () => {
// //     navigate(`/login/${userType}`);
// //   };

// //   // Helper function to check if role matches
// //   const isRoleMismatch = (): boolean => {
// //     if (!profileInfo.exists || !profileInfo.role) return false;
// //     const allowedRoles = getAllowedRoles();
// //     return !allowedRoles.includes(profileInfo.role);
// //   };

// //   // Helper function to get friendly role name
// //   const getFriendlyRoleName = (role: string): string => {
// //     const roleMap: Record<string, string> = {
// //       patient: "Patient",
// //       doctor: "Doctor",
// //       hospital_admin: "Facility Admin",
// //       hospital_staff: "Facility Staff",
// //       admin: "Administrator",
// //     };
// //     return roleMap[role] || role;
// //   };

// //   // Helper function to get expected role name
// //   const getExpectedRoleName = (): string => {
// //     const allowedRoles = getAllowedRoles();
// //     if (allowedRoles.includes("hospital_admin") || allowedRoles.includes("hospital_staff")) {
// //       return "Facility";
// //     }
// //     return getFriendlyRoleName(allowedRoles[0]);
// //   };

// //   // Get role mismatch message
// //   const getRoleMismatchMessage = (): string | null => {
// //     if (!isRoleMismatch()) return null;
    
// //     const currentRole = getFriendlyRoleName(profileInfo.role!);
// //     const expectedRole = getExpectedRoleName();
    
// //     return `⚠️ Important Notice: The email address "${email}" is registered as a ${currentRole} account, but you are trying to reset password for ${expectedRole} portal. Please use the correct login portal for your account type. If you need to access a different account, please use the appropriate email address.`;
// //   };

// //   // Determine which title/description to show based on current step
// // const getCurrentTitle = () => {
// //   if (step === "email") {
// //     if (resetSent) return config.successTitle;
// //     return config.emailTitle;
// //   }
// //   return config.passwordTitle;
// // };

// // const getCurrentDescription = () => {
// //   if (step === "email") {
// //     if (resetSent) return config.successDescription;
// //     return config.emailDescription;
// //   }
// //   return config.passwordDescription;
// // };



// //   return (
// //     // <AuthLayout
// //     //   title={config.title}
// //     //   description={config.description}
// //     //   userType={config.variant}
// //     // >
// //     <AuthLayout
// //   title={getCurrentTitle()}
// //   description={getCurrentDescription()}
// //   userType={config.variant}
// // >
// //       <div className="space-y-6">
// //         {/* Back to Login Link */}
// //         <button
// //           onClick={handleBackToLogin}
// //           className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
// //         >
// //           <ArrowLeft className="h-4 w-4 mr-1" />
// //           Back to Login
// //         </button>

// //         {/* Email Step */}
// //         {step === "email" && (
// //           <form onSubmit={handleSendResetEmail} className="space-y-4">
// //             {!resetSent && (
// //             <Alert>
// //               <Mail className="h-4 w-4" />
// //               <AlertDescription>
// //                 Enter your email address and we'll send you a password reset link.
// //               </AlertDescription>
// //             </Alert>)}

// //             {resetSent ? (
// //               <>
// //                 <Alert variant="default" className="border-green-500 bg-green-50">
// //                   <AlertDescription className="text-green-700">
// //                     If your email address is registered in our system, you will receive an email containing instructions to reset your password. 
// //                   </AlertDescription>
// //                 </Alert>
                
// //                 {/* Role Mismatch Warning - Shown at the bottom of success message */}
// //                 {profileInfo.exists && profileInfo.role && (
// //                <Alert
// //   variant="default"
// //   className={`border-yellow-500 ${
// //     isRoleMismatch() ? "bg-yellow-50" : "bg-blue-50"
// //   }`}
// // >
// //   <AlertTriangle
// //     className={`h-4 w-4 ${
// //       isRoleMismatch() ? "text-yellow-600" : "text-blue-600"
// //     }`}
// //   />

// //   <AlertDescription
// //     className={"text-yellow-700" }
// //     // className={isRoleMismatch() ? "text-yellow-700" : "text-blue-700"}
// //   >
// //     {/* {isRoleMismatch() ? ( */}
// //       <div className="space-y-2">
// //         <p className="font-semibold">Note :</p>

// //         <p>
// //          Please check your inbox and follow the steps provided in the email to create a new password. If you do not see the email, kindly check your spam or junk folder as well.
// //         </p>

// //         <p>
// //          Please note that we maintain separate portals for Patients and Doctors. The password reset email will direct you to the portal associated with your registered account. After successfully resetting your password, please ensure that you log in through the appropriate Patient or Doctor portal using your updated credentials.
// //         </p>

// //         <p>
// //          If you continue to experience any issues accessing your account, please contact our support team for further assistance.
// //         </p>
// //       </div>
// //     {/* ) : null } */}
// //   </AlertDescription>
// // </Alert>
// //                 )}
// //               </>
// //             ) : (
// //               <>
// //                 <div>
// //                   <Label htmlFor="reset-email">Email Address</Label>
// //                   <Input
// //                     id="reset-email"
// //                     type="email"
// //                     value={email}
// //                     onChange={(e) => setEmail(e.target.value)}
// //                     placeholder="Enter your registered email"
// //                     required
// //                     disabled={loading}
// //                   />
// //                 </div>

// //                 <Button
// //                   type="submit"
// //                   variant={config.variant}
// //                   className="w-full"
// //                   size="lg"
// //                   disabled={loading}
// //                 >
// //                   {loading ? (
// //                     <>
// //                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// //                       Sending...
// //                     </>
// //                   ) : (
// //                     "Send Reset Link"
// //                   )}
// //                 </Button>
// //               </>
// //             )}
// //           </form>
// //         )}

// //         {/* New Password Step */}
// //         {step === "newPassword" && (
// //           <form onSubmit={handleResetPassword} className="space-y-4">
// //             <Alert variant="default" className="border-blue-500 bg-blue-50">
// //               <AlertDescription className="text-blue-700">
// //                 Please enter your new password below.
// //               </AlertDescription>
// //             </Alert>

// //             <div>
// //               <Label htmlFor="new-password">New Password</Label>
// //               <div className="relative">
// //                 <Input
// //                   id="new-password"
// //                   type={showNewPassword ? "text" : "password"}
// //                   value={newPassword}
// //                   onChange={(e) => setNewPassword(e.target.value)}
// //                   placeholder="Enter new password"
// //                   required
// //                   disabled={loading}
// //                   className="pr-10"
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowNewPassword(!showNewPassword)}
// //                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
// //                 >
// //                   {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
// //                 </button>
// //               </div>
// //               <p className="text-xs text-muted-foreground mt-1">
// //                 Password must be at least 6 characters long
// //               </p>
// //             </div>

// //             <div>
// //               <Label htmlFor="confirm-password">Confirm New Password</Label>
// //               <div className="relative">
// //                 <Input
// //                   id="confirm-password"
// //                   type={showConfirmPassword ? "text" : "password"}
// //                   value={confirmPassword}
// //                   onChange={(e) => setConfirmPassword(e.target.value)}
// //                   placeholder="Confirm new password"
// //                   required
// //                   disabled={loading}
// //                   className="pr-10"
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
// //                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
// //                 >
// //                   {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
// //                 </button>
// //               </div>
// //             </div>

// //             <Button
// //               type="submit"
// //               variant={config.variant}
// //               className="w-full"
// //               size="lg"
// //               disabled={loading || !newPassword || !confirmPassword}
// //             >
// //               {loading ? (
// //                 <>
// //                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// //                   Resetting...
// //                 </>
// //               ) : (
// //                 "Reset Password"
// //               )}
// //             </Button>
// //           </form>
// //         )}

// //         {/* Additional Help */}
// //         {!resetSent &&(
// //         <Card className="bg-muted/50">
// //           <CardContent className="pt-4 pb-3 px-4">
// //             <div className="flex items-start gap-2 text-sm">
// //               <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
// //               <p className="text-muted-foreground">
// //                 Having trouble? Contact support at{" "}
// //                 <a href="mailto:support@pmhssmarthealth.com" className="text-primary hover:underline">
// //                   support@pmhssmarthealth.com
// //                 </a>
// //               </p>
// //             </div>
// //           </CardContent>
// //         </Card>
// //         )}
// //       </div>
// //     </AuthLayout>
// //   );
// // };

// // export default ForgotPassword;


// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast";
// import AuthLayout from "./AuthLayout";
// import { supabase } from "@/integrations/supabase/client";
// import mixpanelInstance from "@/utils/mixpanel";
// import { Card, CardContent } from "@/components/ui/card";
// import { AlertCircle, Mail, ArrowLeft, Loader2, EyeOff, Eye, AlertTriangle } from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import rollbar from "@/lib/rollbar";


// const ForgotPassword = () => {
//   const { userType } = useParams();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const [email, setEmail] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [resetSent, setResetSent] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [profileInfo, setProfileInfo] = useState<{ role: string | null; exists: boolean }>({ role: null, exists: false });
//   const [verifiedEmail, setVerifiedEmail] = useState<string>(""); // ✅ New state for verified email

//   useEffect(() => {
//     const handleRecovery = async () => {
//       const hashParams = new URLSearchParams(window.location.hash.substring(1));

//       const accessToken = hashParams.get("access_token");
//       const refreshToken = hashParams.get("refresh_token");
//       const type = hashParams.get("type");

//       if (accessToken && type === "recovery") {
//         const { error } = await supabase.auth.setSession({
//           access_token: accessToken,
//           refresh_token: refreshToken || "",
//         });

//         if (error) {
//           toast({
//             title: "Invalid or expired link",
//             description: "Please request a new password reset link.",
//             variant: "destructive",
//           });

//           navigate(`/login/${userType}`);
//           return;
//         }

//         // Get authenticated user
//         const {
//           data: { user },
//         } = await supabase.auth.getUser();

//         const email = user?.email?.toLowerCase();

//         if (!email) {
//           navigate("/login/patient");
//           return;
//         }

//         // Get profile role
//         const { data: profile, error: profileError } = await supabase
//           .from("profiles")
//           .select("role")
//           .eq("email", email)
//           .single();

//         if (profileError || !profile) {
//           navigate("/login/patient");
//           return;
//         }

//         // Store profile info
//         setProfileInfo({
//           role: profile.role,
//           exists: true,
//         });

//         // Validate portal against role
//         let roleMatched = false;

//         switch (profile.role) {
//           case "patient":
//             roleMatched = userType === "patient";
//             break;

//           case "doctor":
//             roleMatched = userType === "doctor";
//             break;

//           case "hospital_admin":
//             roleMatched =
//               userType === "facility" ||
//               userType === "facility-admin";
//             break;

//           case "hospital_staff":
//             roleMatched =
//               userType === "facility" ||
//               userType === "facility-staff";
//             break;

//           case "admin":
//             roleMatched = userType === "admin";
//             break;
//         }

//         const roleRouteMap: Record<string, string> = {
//           patient: "/new-password/patient",
//           doctor: "/new-password/doctor",
//           hospital_admin: "/new-password/facility-admin",
//           hospital_staff: "/new-password/facility-staff",
//           admin: "/new-password/admin",
//         };

//         if (!roleMatched) {
//           toast({
//             title: "Incorrect Portal",
//             description: `This account belongs to ${profile.role.replace(
//               "_",
//               " "
//             )}. Redirecting to the correct password reset page.`,
//             variant: "destructive",
//           });

//           setTimeout(() => {
//             navigate(roleRouteMap[profile.role]);
//           }, 1500);
          
//           return;
//         }

//         // ✅ Correct portal - store the verified email and proceed
//         setVerifiedEmail(email); 
//       }
//     };

//     handleRecovery();
//   }, [userType, navigate, toast]);

//   const userTypeConfig: Record<
//     string,
//     {
//       emailTitle: string;
//       emailDescription: string;
//       passwordTitle: string;
//       passwordDescription: string;
//       successTitle: string;
//       successDescription: string;
//       variant: "patient" | "doctor" | "facility" | "admin";
//     }
//   > = {
//     patient: {
//       emailTitle: "Reset Patient Password",
//       emailDescription: "Enter your email to receive a password reset link for your patient account",
//       passwordTitle: "Create New Patient Password",
//       passwordDescription: "Choose a strong password to secure your health dashboard",
//       successTitle: "Patient Password Reset requested!",
//       successDescription: "",
//       variant: "patient",
//     },
//     doctor: {
//       emailTitle: "Reset Medical Professional Password",
//       emailDescription: "Enter your email to receive a reset link for your medical professional account",
//       passwordTitle: "Create New Medical Professional Password",
//       passwordDescription: "Choose a strong password to secure your practice management dashboard",
//       successTitle: "Medical Professional Password Reset requested!",
//       successDescription: "",
//       variant: "doctor",
//     },
//     facility: {
//       emailTitle: "Reset Medical Facility Password",
//       emailDescription: "Enter your email to receive a reset link for your facility management account",
//       passwordTitle: "Create New Facility Password",
//       passwordDescription: "Choose a strong password to secure your facility management dashboard",
//       successTitle: "Facility Password Reset requested!",
//       successDescription: "",
//       variant: "facility",
//     },
//     "facility-admin": {
//       emailTitle: "Reset Facility Admin Password",
//       emailDescription: "Enter your email to receive a reset link for your facility admin account",
//       passwordTitle: "Create New Admin Password",
//       passwordDescription: "Choose a strong password to secure your facility administration access",
//       successTitle: "Facility Admin Password Reset requested!",
//       successDescription: "",
//       variant: "facility",
//     },
//     "facility-staff": {
//       emailTitle: "Reset Facility Staff Password",
//       emailDescription: "Enter your email to receive a reset link for your staff account",
//       passwordTitle: "Create New Staff Password",
//       passwordDescription: "Choose a strong password to secure your assigned operations access",
//       successTitle: "Facility Staff Password Reset requested!",
//       successDescription: "",
//       variant: "facility",
//     },
//     admin: {
//       emailTitle: "Reset Admin Password",
//       emailDescription: "Enter your email to receive a reset link for your administrator account",
//       passwordTitle: "Create New Admin Password",
//       passwordDescription: "Choose a strong password to secure your platform administration access",
//       successTitle: "Admin Password Reset requested!",
//       successDescription: "",
//       variant: "admin",
//     },
//   };

//   const config =
//     userTypeConfig[userType as keyof typeof userTypeConfig] ||
//     userTypeConfig.patient;

//   const getAllowedRoles = (): string[] => {
//     if (userType === "facility" || userType === "facility-admin" || userType === "facility-staff") {
//       return ["hospital_admin", "hospital_staff"];
//     }
//     return [userType || "patient"];
//   };

//   useEffect(() => {
//     mixpanelInstance.track("Forgot Password Page Viewed", { userType });
//   }, [userType]);

//   const checkEmailInProfiles = async (email: string): Promise<boolean> => {
//     const lowerCaseEmail = email.toLowerCase();

//     let query = supabase
//       .from("profiles")
//       .select("email")
//       .eq("email", lowerCaseEmail);

//     const { data, error } = await query.maybeSingle();
//     if (error) {
//       console.error("Error checking email:", error);
//       return false;
//     }
//     return !!data;
//   };

//   const getProfileInfo = async (email: string): Promise<{ role: string | null; exists: boolean }> => {
//     const lowerCaseEmail = email.toLowerCase();
    
//     const { data, error } = await supabase
//       .from("profiles")
//       .select("role")
//       .eq("email", lowerCaseEmail)
//       .maybeSingle();
    
//     if (error || !data) {
//       console.error("Error getting profile info:", error);
//       return { role: null, exists: false };
//     }
    
//     return { role: data.role, exists: true };
//   };

//   const handleSendResetEmail = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!email || !email.includes('@')) {
//       toast({
//         title: "Invalid email",
//         description: `Please enter a valid email address "@".`,
//         variant: "destructive",
//       });
//       return;
//     }

//     mixpanelInstance.track("Forgot Password - Send Reset Attempt", { email, userType });
//     setLoading(true);

//     try {
//       const profileData = await getProfileInfo(email);
//       setProfileInfo(profileData);
      
//       const emailExists = await checkEmailInProfiles(email);
      
//       const isStaff = userType === "hospital_staff";

//       const redirectUrl = isStaff
//         ? `${window.location.origin}/set-password?type=recovery&userType=${userType}`
//         : `${window.location.origin}/forgot-password/${userType}`;

//       const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
//         redirectTo: redirectUrl,
//       });

//       if (error) {
//         console.error("Supabase reset error:", error);
//         toast({
//           title: "Failed to send reset email",
//           description: error.message || "An error occurred. Please try again.",
//           variant: "destructive",
//         });
//         return;
//       }

//       setResetSent(true);
//       toast({
//         title: "Reset Email Sent",
//         description: "Check your email for the password reset link. The link will expire in 1 hour.",
//         duration: 6000,
//       });
//       mixpanelInstance.track("Forgot Password - Reset Email Sent", { email, userType });
//     } catch (error: any) {
//       console.error("Error sending reset email:", error);
//       rollbar.error("Forgot Password - Send Reset Error", error);
//       toast({
//         title: "Failed to send reset email",
//         description: error.message || "An error occurred. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResetPassword = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (newPassword !== confirmPassword) {
//       toast({
//         title: "Passwords don't match",
//         description: "Please make sure your passwords match.",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (newPassword.length < 6) {
//       toast({
//         title: "Password too short",
//         description: "Password must be at least 6 characters long.",
//         variant: "destructive",
//       });
//       return;
//     }

//     mixpanelInstance.track("Forgot Password - Reset Attempt", { email: verifiedEmail, userType });
//     setLoading(true);

//     try {
//       // Get the current session user
//       const { data: { user }, error: userError } = await supabase.auth.getUser();
      
//       if (userError || !user) {
//         toast({
//           title: "Session Expired",
//           description: "Your session has expired. Please request a new password reset link.",
//           variant: "destructive",
//         });
//         navigate(`/forgot-password/${userType}`);
//         return;
//       }
      
//       // ✅ Validate that the session email matches the verified email
//       if (user.email?.toLowerCase() !== verifiedEmail.toLowerCase()) {
//         toast({
//           title: "Email Mismatch",
//           description: "Security validation failed. The email in your session doesn't match the reset request.",
//           variant: "destructive",
//         });
//         navigate(`/forgot-password/${userType}`);
//         return;
//       }

//       const { error } = await supabase.auth.updateUser({ password: newPassword });

//       if (error) {
//         console.error("Supabase update error:", error);
//         toast({
//           title: "Reset Failed",
//           description: error.message || "Failed to reset password. Please try again.",
//           variant: "destructive",
//         });
//         return;
//       }

//       toast({
//         title: "Password Reset Successful!",
//         description: `Password for ${verifiedEmail} has been updated. Please login with your new password.`,
//       });

//       mixpanelInstance.track("Forgot Password - Success", { email: verifiedEmail, userType });

//       window.location.hash = "";

//       setTimeout(() => {
//         navigate(`/login/${userType}`);
//       }, 2000);
//     } catch (error: any) {
//       console.error("Error resetting password:", error);
//       toast({
//         title: "Reset Failed",
//         description: error.message || "Failed to reset password. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBackToLogin = () => {
//     navigate(`/login/${userType}`);
//   };

//   const isRoleMismatch = (): boolean => {
//     if (!profileInfo.exists || !profileInfo.role) return false;
//     const allowedRoles = getAllowedRoles();
//     return !allowedRoles.includes(profileInfo.role);
//   };

//   const getFriendlyRoleName = (role: string): string => {
//     const roleMap: Record<string, string> = {
//       patient: "Patient",
//       doctor: "Doctor",
//       hospital_admin: "Facility Admin",
//       hospital_staff: "Facility Staff",
//       admin: "Administrator",
//     };
//     return roleMap[role] || role;
//   };

//   const getExpectedRoleName = (): string => {
//     const allowedRoles = getAllowedRoles();
//     if (allowedRoles.includes("hospital_admin") || allowedRoles.includes("hospital_staff")) {
//       return "Facility";
//     }
//     return getFriendlyRoleName(allowedRoles[0]);
//   };

//   const getCurrentTitle = () => {
//       if (resetSent) return config.successTitle;
//       return config.emailTitle;
    
//   };

//   const getCurrentDescription = () => {
  
//       if (resetSent) return config.successDescription;
//       return config.emailDescription;
    
//   };

//   return (
//     <AuthLayout
//       title={getCurrentTitle()}
//       description={getCurrentDescription()}
//       userType={config.variant}
//     >
//       <div className="space-y-6">
//         <button
//           onClick={handleBackToLogin}
//           className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
//         >
//           <ArrowLeft className="h-4 w-4 mr-1" />
//           Back to Login
//         </button>

//           <form onSubmit={handleSendResetEmail} className="space-y-4">
//             {!resetSent && (
//               <Alert>
//                 <Mail className="h-4 w-4" />
//                 <AlertDescription>
//                   Enter your email address and we'll send you a password reset link.
//                 </AlertDescription>
//               </Alert>
//             )}

//             {resetSent ? (
//               <>
//                 <Alert variant="default" className="border-green-500 bg-green-50">
//                   <AlertDescription className="text-green-700">
//                     If your email address is registered in our system, you will receive an email containing instructions to reset your password. 
//                   </AlertDescription>
//                 </Alert>
                
//                 {profileInfo.exists && profileInfo.role && (
//                   <Alert
//                     variant="default"
//                     className={`border-yellow-500 ${
//                       isRoleMismatch() ? "bg-yellow-50" : "bg-blue-50"
//                     }`}
//                   >
//                     <AlertTriangle
//                       className={`h-4 w-4 ${
//                         isRoleMismatch() ? "text-yellow-600" : "text-blue-600"
//                       }`}
//                     />
//                     <AlertDescription className="text-yellow-700">
//                       <div className="space-y-2">
//                         <p className="font-semibold">Note :</p>
//                         <p>
//                           Please check your inbox and follow the steps provided in the email to create a new password. If you do not see the email, kindly check your spam or junk folder as well.
//                         </p>
//                         <p>
//                           Please note that we maintain separate portals for Patients and Doctors. The password reset email will direct you to the portal associated with your registered account. After successfully resetting your password, please ensure that you log in through the appropriate Patient or Doctor portal using your updated credentials.
//                         </p>
//                         <p>
//                           If you continue to experience any issues accessing your account, please contact our support team for further assistance.
//                         </p>
//                       </div>
//                     </AlertDescription>
//                   </Alert>
//                 )}
//               </>
//             ) : (
//               <>
//                 <div>
//                   <Label htmlFor="reset-email">Email Address</Label>
//                   <Input
//                     id="reset-email"
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="Enter your registered email"
//                     required
//                     disabled={loading}
//                   />
//                 </div>

//                 <Button
//                   type="submit"
//                   variant={config.variant}
//                   className="w-full"
//                   size="lg"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Sending...
//                     </>
//                   ) : (
//                     "Send Reset Link"
//                   )}
//                 </Button>
//               </>
//             )}
//           </form>
        

        

//         {!resetSent && (
//           <Card className="bg-muted/50">
//             <CardContent className="pt-4 pb-3 px-4">
//               <div className="flex items-start gap-2 text-sm">
//                 <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
//                 <p className="text-muted-foreground">
//                   Having trouble? Contact support at{" "}
//                   <a href="mailto:support@pmhssmarthealth.com" className="text-primary hover:underline">
//                     support@pmhssmarthealth.com
//                   </a>
//                 </p>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </AuthLayout>
//   );
// };

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


const ForgotPassword = () => {
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

        if (error) {
          toast({
            title: "Invalid or expired link",
            description: "Please request a new password reset link.",
            variant: "destructive",
          });

          navigate(`/login/${userType}`);
          return;
        }

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
      if (resetSent) return config.successTitle;
      return config.emailTitle;
    
  };

  const getCurrentDescription = () => {
  
      if (resetSent) return config.successDescription;
      return config.emailDescription;
    
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

          <form onSubmit={handleSendResetEmail} className="space-y-4">
            {!resetSent && (
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  Enter your email address and we'll send you a password reset link.
                </AlertDescription>
              </Alert>
            )}

            {resetSent ? (
              <>
                <Alert variant="default" className="border-green-500 bg-green-50">
                  <AlertDescription className="text-green-700">
                    If your email address is registered in our system, you will receive an email containing instructions to reset your password. 
                  </AlertDescription>
                </Alert>
                
                {profileInfo.exists && profileInfo.role && (
                  <Alert
                    variant="default"
                    className={`border-yellow-500 ${
                      isRoleMismatch() ? "bg-yellow-50" : "bg-blue-50"
                    }`}
                  >
                    <AlertTriangle
                      className={`h-4 w-4 ${
                        isRoleMismatch() ? "text-yellow-600" : "text-blue-600"
                      }`}
                    />
                    <AlertDescription className="text-yellow-700">
                      <div className="space-y-2">
                        <p className="font-semibold">Note :</p>
                        <p>
                          Please check your inbox and follow the steps provided in the email to create a new password. If you do not see the email, kindly check your spam or junk folder as well.
                        </p>
                        <p>
                          Please note that we maintain separate portals for Patients and Doctors. The password reset email will direct you to the portal associated with your registered account. After successfully resetting your password, please ensure that you log in through the appropriate Patient or Doctor portal using your updated credentials.
                        </p>
                        <p>
                          If you continue to experience any issues accessing your account, please contact our support team for further assistance.
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="reset-email">Email Address</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    required
                    disabled={loading}
                  />
                </div>

                <Button
                  type="submit"
                  variant={config.variant}
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </>
            )}
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

export default ForgotPassword;