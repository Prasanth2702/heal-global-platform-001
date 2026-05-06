// // import { useState } from "react";
// // import { useParams, useNavigate } from "react-router-dom";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { useToast } from "@/hooks/use-toast";
// // import AuthLayout from "./AuthLayout";
// // import { supabase } from "@/integrations/supabase/client";
// // import mixpanelInstance from "@/utils/mixpanel";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { AlertCircle, CheckCircle2, Mail, Key, ArrowLeft } from "lucide-react";
// // import { Alert, AlertDescription } from "@/components/ui/alert";

// // type ResetStep = 'email' | 'otp' | 'newPassword';

// // const ForgotPassword = () => {
// //   const { userType } = useParams();
// //   const navigate = useNavigate();
// //   const { toast } = useToast();
  
// //   const [step, setStep] = useState<ResetStep>('email');
// //   const [email, setEmail] = useState('');
// //   const [otp, setOtp] = useState('');
// //   const [newPassword, setNewPassword] = useState('');
// //   const [confirmPassword, setConfirmPassword] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [otpSent, setOtpSent] = useState(false);
// //   const [resendTimer, setResendTimer] = useState(0);

// //   const userTypeConfig = {
// //     patient: {
// //       title: "Reset Patient Password",
// //       description: "Reset your password to access your health dashboard",
// //       variant: "patient" as const,
// //     },
// //     doctor: {
// //       title: "Reset Medical Professional Password", 
// //       description: "Reset your password to access your practice management dashboard",
// //       variant: "doctor" as const,
// //     },
// //     facility: {
// //       title: "Reset Medical Facility Password",
// //       description: "Reset your password to manage your facility",
// //       variant: "facility" as const,
// //     },
// //     admin: {
// //       title: "Reset Admin Password",
// //       description: "Reset your password for platform administration",
// //       variant: "admin" as const,
// //     }
// //   };

// //   const config = userTypeConfig[userType as keyof typeof userTypeConfig] || userTypeConfig.patient;
// //   const userRole = (userType === 'facility') ? 'hospital_admin' : userType;

// //   // Track page view
// //   useState(() => {
// //     mixpanelInstance.track('Forgot Password Page Viewed', {
// //       userType: userType
// //     });
// //   });

// //   const startResendTimer = () => {
// //     setResendTimer(30);
// //     const timer = setInterval(() => {
// //       setResendTimer((prev) => {
// //         if (prev <= 1) {
// //           clearInterval(timer);
// //           return 0;
// //         }
// //         return prev - 1;
// //       });
// //     }, 1000);
// //   };

// //   const checkEmailInProfiles = async (email: string) => {
// //     const lowerCaseEmail = email.toLowerCase();
// //     const { data, error } = await supabase
// //       .from('profiles')
// //       .select('email')
// //       .eq('email', lowerCaseEmail)
// //       .eq('role', userRole)
// //       .maybeSingle();

// //     if (error) {
// //       console.error('Error checking email:', error);
// //       return false;
// //     }
// //     return !!data;
// //   };

// //   const handleSendOTP = async (e: React.FormEvent) => {
// //     e.preventDefault();
    
// //     mixpanelInstance.track('Forgot Password - Send OTP Attempt', {
// //       email: email,
// //       userType: userType
// //     });

// //     setLoading(true);

// //     try {
// //       // First check if email exists in profiles
// //       const emailExists = await checkEmailInProfiles(email);
      
// //       if (!emailExists) {
// //         toast({
// //           title: "Email not found",
// //           description: "This email is not registered. Please check or sign up.",
// //           variant: "destructive"
// //         });
// //         mixpanelInstance.track('Forgot Password - Email Not Found', {
// //           email: email,
// //           userType: userType
// //         });
// //         setLoading(false);
// //         return;
// //       }

// //       // Generate a random 6-digit OTP
// //       const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
      
// //       // Store OTP in localStorage with expiration (5 minutes)
// //       const otpData = {
// //         otp: generatedOTP,
// //         email: email,
// //         expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
// //       };
// //       localStorage.setItem('resetOTP', JSON.stringify(otpData));

// //       // Here you would typically send the OTP via email/SMS
// //       // For demonstration, we'll show it in a toast
// //       toast({
// //         title: "OTP Sent Successfully",
// //         description: `Your OTP is: ${generatedOTP}. This is a demo - in production, this would be sent via email.`,
// //         duration: 10000,
// //       });

// //       setOtpSent(true);
// //       startResendTimer();
// //       setStep('otp');
      
// //       mixpanelInstance.track('Forgot Password - OTP Sent', {
// //         email: email,
// //         userType: userType
// //       });

// //     } catch (error) {
// //       console.error('Error sending OTP:', error);
// //       toast({
// //         title: "Failed to send OTP",
// //         description: "An error occurred. Please try again.",
// //         variant: "destructive"
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleResendOTP = async () => {
// //     if (resendTimer > 0) return;
// //     await handleSendOTP(new Event('submit') as any);
// //   };

// //   const handleVerifyOTP = async (e: React.FormEvent) => {
// //     e.preventDefault();
    
// //     mixpanelInstance.track('Forgot Password - Verify OTP Attempt', {
// //       email: email,
// //       userType: userType
// //     });

// //     setLoading(true);

// //     try {
// //       const storedOTPData = localStorage.getItem('resetOTP');
      
// //       if (!storedOTPData) {
// //         toast({
// //           title: "OTP Expired",
// //           description: "Please request a new OTP.",
// //           variant: "destructive"
// //         });
// //         setStep('email');
// //         setLoading(false);
// //         return;
// //       }

// //       const { otp: storedOTP, email: storedEmail, expiresAt } = JSON.parse(storedOTPData);

// //       if (Date.now() > expiresAt) {
// //         toast({
// //           title: "OTP Expired",
// //           description: "The OTP has expired. Please request a new one.",
// //           variant: "destructive"
// //         });
// //         localStorage.removeItem('resetOTP');
// //         setStep('email');
// //         setLoading(false);
// //         return;
// //       }

// //       if (storedOTP !== otp || storedEmail !== email) {
// //         toast({
// //           title: "Invalid OTP",
// //           description: "The OTP you entered is incorrect. Please try again.",
// //           variant: "destructive"
// //         });
// //         mixpanelInstance.track('Forgot Password - Invalid OTP', {
// //           email: email,
// //           userType: userType
// //         });
// //         setLoading(false);
// //         return;
// //       }

// //       // OTP verified successfully
// //       toast({
// //         title: "OTP Verified",
// //         description: "Please set your new password.",
// //         variant: "default"
// //       });

// //       setStep('newPassword');
      
// //       mixpanelInstance.track('Forgot Password - OTP Verified', {
// //         email: email,
// //         userType: userType
// //       });

// //     } catch (error) {
// //       console.error('Error verifying OTP:', error);
// //       toast({
// //         title: "Verification Failed",
// //         description: "An error occurred. Please try again.",
// //         variant: "destructive"
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
// //         variant: "destructive"
// //       });
// //       return;
// //     }

// //     if (newPassword.length < 6) {
// //       toast({
// //         title: "Password too short",
// //         description: "Password must be at least 6 characters long.",
// //         variant: "destructive"
// //       });
// //       return;
// //     }

// //     mixpanelInstance.track('Forgot Password - Reset Attempt', {
// //       email: email,
// //       userType: userType
// //     });

// //     setLoading(true);

// //     try {
// //       // Update password in Supabase
// //       const { error } = await supabase.auth.updateUser({
// //         password: newPassword
// //       });

// //       if (error) {
// //         throw error;
// //       }

// //       // Clear stored OTP
// //       localStorage.removeItem('resetOTP');

// //       toast({
// //         title: "Password Reset Successful!",
// //         description: "Your password has been updated. Please login with your new password.",
// //         variant: "default"
// //       });

// //       mixpanelInstance.track('Forgot Password - Success', {
// //         email: email,
// //         userType: userType
// //       });

// //       // Redirect to login page after 2 seconds
// //       setTimeout(() => {
// //         navigate(`/login/${userType}`);
// //       }, 2000);

// //     } catch (error: any) {
// //       console.error('Error resetting password:', error);
// //       toast({
// //         title: "Reset Failed",
// //         description: error.message || "Failed to reset password. Please try again.",
// //         variant: "destructive"
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleBackToLogin = () => {
// //     navigate(`/login/${userType}`);
// //   };

// //   return (
// //     <AuthLayout
// //       title={config.title}
// //       description={config.description}
// //       userType={config.variant}
// //     >
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
// //         {step === 'email' && (
// //           <form onSubmit={handleSendOTP} className="space-y-4">
// //             <Alert>
// //               <Mail className="h-4 w-4" />
// //               <AlertDescription>
// //                 Enter your email address and we'll send you a one-time password to reset your account.
// //               </AlertDescription>
// //             </Alert>

// //             <div>
// //               <Label htmlFor="reset-email">Email Address</Label>
// //               <Input
// //                 id="reset-email"
// //                 type="email"
// //                 value={email}
// //                 onChange={(e) => setEmail(e.target.value)}
// //                 placeholder="Enter your registered email"
// //                 required
// //                 disabled={loading}
// //               />
// //             </div>

// //             <Button 
// //               type="submit" 
// //               variant={config.variant} 
// //               className="w-full" 
// //               size="lg"
// //               disabled={loading}
// //             >
// //               {loading ? "Sending OTP..." : "Send Reset Code"}
// //             </Button>
// //           </form>
// //         )}

// //         {/* OTP Step */}
// //         {step === 'otp' && (
// //           <form onSubmit={handleVerifyOTP} className="space-y-4">
// //             <Alert variant="default" className="border-green-500 bg-green-50">
// //               <CheckCircle2 className="h-4 w-4 text-green-600" />
// //               <AlertDescription className="text-green-700">
// //                 A verification code has been sent to <strong>{email}</strong>
// //               </AlertDescription>
// //             </Alert>

// //             <div>
// //               <Label htmlFor="otp">Enter OTP Code</Label>
// //               <Input
// //                 id="otp"
// //                 type="text"
// //                 value={otp}
// //                 onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
// //                 placeholder="Enter 6-digit OTP"
// //                 maxLength={6}
// //                 required
// //                 disabled={loading}
// //                 className="text-center text-2xl tracking-widest"
// //               />
// //               <p className="text-xs text-muted-foreground mt-1">
// //                 Enter the 6-digit code sent to your email
// //               </p>
// //             </div>

// //             <Button 
// //               type="submit" 
// //               variant={config.variant} 
// //               className="w-full" 
// //               size="lg"
// //               disabled={loading || otp.length !== 6}
// //             >
// //               {loading ? "Verifying..." : "Verify OTP"}
// //             </Button>

// //             <div className="text-center">
// //               <button
// //                 type="button"
// //                 onClick={handleResendOTP}
// //                 disabled={resendTimer > 0 || loading}
// //                 className="text-sm text-primary hover:underline disabled:text-muted-foreground disabled:no-underline"
// //               >
// //                 {resendTimer > 0 
// //                   ? `Resend code in ${resendTimer}s` 
// //                   : "Didn't receive code? Resend"}
// //               </button>
// //             </div>
// //           </form>
// //         )}

// //         {/* New Password Step */}
// //         {step === 'newPassword' && (
// //           <form onSubmit={handleResetPassword} className="space-y-4">
// //             <Alert variant="default" className="border-green-500 bg-green-50">
// //               <CheckCircle2 className="h-4 w-4 text-green-600" />
// //               <AlertDescription className="text-green-700">
// //                 OTP verified successfully! Please set your new password.
// //               </AlertDescription>
// //             </Alert>

// //             <div>
// //               <Label htmlFor="new-password">New Password</Label>
// //               <Input
// //                 id="new-password"
// //                 type="password"
// //                 value={newPassword}
// //                 onChange={(e) => setNewPassword(e.target.value)}
// //                 placeholder="Enter new password"
// //                 required
// //                 disabled={loading}
// //               />
// //               <p className="text-xs text-muted-foreground mt-1">
// //                 Password must be at least 6 characters long
// //               </p>
// //             </div>

// //             <div>
// //               <Label htmlFor="confirm-password">Confirm New Password</Label>
// //               <Input
// //                 id="confirm-password"
// //                 type="password"
// //                 value={confirmPassword}
// //                 onChange={(e) => setConfirmPassword(e.target.value)}
// //                 placeholder="Confirm new password"
// //                 required
// //                 disabled={loading}
// //               />
// //             </div>

// //             <Button 
// //               type="submit" 
// //               variant={config.variant} 
// //               className="w-full" 
// //               size="lg"
// //               disabled={loading || !newPassword || !confirmPassword}
// //             >
// //               {loading ? "Resetting Password..." : "Reset Password"}
// //             </Button>
// //           </form>
// //         )}

// //         {/* Additional Help */}
// //         <Card className="bg-muted/50">
// //           <CardContent className="pt-4 pb-3 px-4">
// //             <div className="flex items-start gap-2 text-sm">
// //               <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
// //               <p className="text-muted-foreground">
// //                 Having trouble? Contact support at{' '}
// //                 <a href="mailto:support@example.com" className="text-primary hover:underline">
// //                   support@example.com
// //                 </a>
// //               </p>
// //             </div>
// //           </CardContent>
// //         </Card>
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
// import { AlertCircle, Mail, ArrowLeft, Loader2 } from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";

// type ResetStep = 'email' | 'newPassword';

// const ForgotPassword = () => {
//   const { userType } = useParams();
//   const navigate = useNavigate();
//   const { toast } = useToast();
  
//   const [step, setStep] = useState<ResetStep>('email');
//   const [email, setEmail] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [resetSent, setResetSent] = useState(false);

//   // Check if we have a recovery token in the URL
//   useEffect(() => {
//     const hashParams = new URLSearchParams(window.location.hash.substring(1));
//     const accessToken = hashParams.get('access_token');
//     const type = hashParams.get('type');
    
//     if (accessToken && type === 'recovery') {
//       setStep('newPassword');
//       // Set the session with the recovery token
//       supabase.auth.setSession({
//         access_token: accessToken,
//         refresh_token: hashParams.get('refresh_token') || '',
//       });
//     }
//   }, []);

//   const userTypeConfig = {
//     patient: {
//       title: "Reset Patient Password",
//       description: "Reset your password to access your health dashboard",
//       variant: "patient" as const,
//     },
//     doctor: {
//       title: "Reset Medical Professional Password", 
//       description: "Reset your password to access your practice management dashboard",
//       variant: "doctor" as const,
//     },
//     facility: {
//       title: "Reset Medical Facility Password",
//       description: "Reset your password to manage your facility",
//       variant: "facility" as const,
//     },
//     hospital_staff: {
//       title: "Reset Hospital Staff Password",
//       description: "Reset your password to manage your facility",
//       variant: "facility" as const,
//     },
//     admin: {
//       title: "Reset Admin Password",
//       description: "Reset your password for platform administration",
//       variant: "admin" as const,
//     }
//   };

//   const normalizedUserType =
//   userType === "hospital_staff" ? "facility" : userType;

// const config =
//   userTypeConfig[normalizedUserType as keyof typeof userTypeConfig] ||
//   userTypeConfig.patient;

//   // const config = userTypeConfig[userType as keyof typeof userTypeConfig] || userTypeConfig.patient;
//   // const userRole = (userType === 'facility') ? 'hospital_admin' : userType;
// const userRoles = (() => {
//   if (userType === 'facility') {
//     return ['hospital_admin', 'hospital_staff']; // ✅ BOTH roles
//   }
//   return [userType];
// })();

//   // Track page view
//   useEffect(() => {
//     mixpanelInstance.track('Forgot Password Page Viewed', {
//       userType: userType
//     });
//   }, [userType]);

//   // const checkEmailInProfiles = async (email: string) => {
//   //   const lowerCaseEmail = email.toLowerCase();
//   //   // const { data, error } = await supabase
//   //   //   .from('profiles')
//   //   //   .select('email')
//   //   //   .eq('email', lowerCaseEmail)
//   //   //   .eq('role', userRole)
//   //   //   .maybeSingle();
    
//   //   let query = supabase
//   //   .from('profiles')
//   //   .select('email')
//   //   .eq('email', lowerCaseEmail);
  
//   // if (userType === 'facility') {
//   //   // Check for either role
//   //   query = query.in('role', ['hospital_admin', 'hospital_staff']);
//   // } else {
//   //   // Check for specific role
//   //   query = query.eq('role', userRole);
//   // }
  
//   // const { data, error } = await query.maybeSingle();

//   //   if (error) {
//   //     console.error('Error checking email:', error);
//   //     return false;
//   //   }
//   //   return !!data;
//   // };
// const checkEmailInProfiles = async (email: string) => {
//   const lowerCaseEmail = email.toLowerCase();

//   let query = supabase
//     .from('profiles')
//     .select('email')
//     .eq('email', lowerCaseEmail);

//   if (userType === 'facility') {
//     // ✅ Check BOTH admin + staff
//     query = query.in('role', ['hospital_admin', 'hospital_staff']);
//   } else {
//     query = query.eq('role', userType);
//   }

//   const { data, error } = await query.maybeSingle();

//   if (error) {
//     console.error('Error checking email:', error);
//     return false;
//   }

//   return !!data;
// };

//   const handleSendResetEmail = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     mixpanelInstance.track('Forgot Password - Send Reset Attempt', {
//       email: email,
//       userType: userType
//     });

//     setLoading(true);

//     try {
//       // First check if email exists in profiles
//       const emailExists = await checkEmailInProfiles(email);
      
//       if (!emailExists) {
//         toast({
//           title: "Email not found",
//           description: "We couldn’t find an account with this email. Please check your email or contact your administrator.",
//           // description: "This email is not registered. Please check or sign up.",
//           variant: "destructive"
//         });
//         mixpanelInstance.track('Forgot Password - Email Not Found', {
//           email: email,
//           userType: userType
//         });
//         setLoading(false);
//         return;
//       }

//       // // Use Supabase's built-in password reset
//       // const { error } = await supabase.auth.resetPasswordForEmail(email, {
//       //   redirectTo: `${window.location.origin}/forgot-password/${userType}`,
//       // });

//       // Decide redirect based on user type
// const isStaff = userType === "hospital_staff";

// const redirectUrl = isStaff
//   ? `${window.location.origin}/set-password?type=recovery&userType=${userType}`
//   : `${window.location.origin}/forgot-password/${userType}`;

// // Use Supabase's built-in password reset
// const { error } = await supabase.auth.resetPasswordForEmail(email, {
//   redirectTo: redirectUrl,
// });
      

//       if (error) {
//         console.error('Supabase reset error:', error);
//         toast({
//           title: "Failed to send reset email",
//           description: error.message || "An error occurred. Please try again.",
//           variant: "destructive"
//         });
//         setLoading(false);
//         return;
//       }

//       setResetSent(true);
      
//       toast({
//         title: "Reset Email Sent",
//         description: "Check your email for the password reset link. The link will expire in 1 hour.",
//         duration: 6000,
//       });
      
//       mixpanelInstance.track('Forgot Password - Reset Email Sent', {
//         email: email,
//         userType: userType
//       });

//     } catch (error: any) {
//       console.error('Error sending reset email:', error);
//       toast({
//         title: "Failed to send reset email",
//         description: error.message || "An error occurred. Please try again.",
//         variant: "destructive"
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
//         variant: "destructive"
//       });
//       return;
//     }

//     if (newPassword.length < 6) {
//       toast({
//         title: "Password too short",
//         description: "Password must be at least 6 characters long.",
//         variant: "destructive"
//       });
//       return;
//     }

//     mixpanelInstance.track('Forgot Password - Reset Attempt', {
//       email: email,
//       userType: userType
//     });

//     setLoading(true);

//     try {
//       // Update password using Supabase
//       const { error } = await supabase.auth.updateUser({
//         password: newPassword
//       });

//       if (error) {
//         console.error('Supabase update error:', error);
//         toast({
//           title: "Reset Failed",
//           description: error.message || "Failed to reset password. Please try again.",
//           variant: "destructive"
//         });
//         setLoading(false);
//         return;
//       }

//       toast({
//         title: "Password Reset Successful!",
//         description: "Your password has been updated. Please login with your new password.",
//         variant: "default"
//       });

//       mixpanelInstance.track('Forgot Password - Success', {
//         email: email,
//         userType: userType
//       });

//       // Clear any hash from URL
//       window.location.hash = '';

//       // Redirect to login page after 2 seconds
//       setTimeout(() => {
//         navigate(`/login/${userType}`);
//       }, 2000);

//     } catch (error: any) {
//       console.error('Error resetting password:', error);
//       toast({
//         title: "Reset Failed",
//         description: error.message || "Failed to reset password. Please try again.",
//         variant: "destructive"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBackToLogin = () => {
//     navigate(`/login/${userType}`);
//   };

//   return (
//     <AuthLayout
//       title={config.title}
//       description={config.description}
//       userType={config.variant}
//     >
//       <div className="space-y-6">
//         {/* Back to Login Link */}
//         <button
//           onClick={handleBackToLogin}
//           className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
//         >
//           <ArrowLeft className="h-4 w-4 mr-1" />
//           Back to Login
//         </button>

//         {/* Email Step */}
//         {step === 'email' && (
//           <form onSubmit={handleSendResetEmail} className="space-y-4">
//             <Alert>
//               <Mail className="h-4 w-4" />
//               <AlertDescription>
//                 Enter your email address and we'll send you a password reset link.
//               </AlertDescription>
//             </Alert>

//             {resetSent ? (
//               <Alert variant="default" className="border-green-500 bg-green-50">
//                 <AlertDescription className="text-green-700">
//                   Reset link sent! Check your email at <strong>{email}</strong> and follow the instructions to reset your password.
//                 </AlertDescription>
//               </Alert>
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
//         )}

//         {/* New Password Step */}
//         {step === 'newPassword' && (
//           <form onSubmit={handleResetPassword} className="space-y-4">
//             <Alert variant="default" className="border-blue-500 bg-blue-50">
//               <AlertDescription className="text-blue-700">
//                 Please enter your new password below.
//               </AlertDescription>
//             </Alert>

//             <div>
//               <Label htmlFor="new-password">New Password</Label>
//               <Input
//                 id="new-password"
//                 type="password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 placeholder="Enter new password"
//                 required
//                 disabled={loading}
//               />
//               <p className="text-xs text-muted-foreground mt-1">
//                 Password must be at least 6 characters long
//               </p>
//             </div>

//             <div>
//               <Label htmlFor="confirm-password">Confirm New Password</Label>
//               <Input
//                 id="confirm-password"
//                 type="password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 placeholder="Confirm new password"
//                 required
//                 disabled={loading}
//               />
//             </div>

//             <Button 
//               type="submit" 
//               variant={config.variant} 
//               className="w-full" 
//               size="lg"
//               disabled={loading || !newPassword || !confirmPassword}
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Resetting...
//                 </>
//               ) : (
//                 "Reset Password"
//               )}
//             </Button>
//           </form>
//         )}

//         {/* Additional Help */}
//         <Card className="bg-muted/50">
//           <CardContent className="pt-4 pb-3 px-4">
//             <div className="flex items-start gap-2 text-sm">
//               <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
//               <p className="text-muted-foreground">
//                 Having trouble? Contact support at{' '}
//                 <a href="mailto:support@example.com" className="text-primary hover:underline">
//                   support@example.com
//                 </a>
//               </p>
//             </div>
//           </CardContent>
//         </Card>
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
import { AlertCircle, Mail, ArrowLeft, Loader2, EyeOff, Eye } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type ResetStep = "email" | "newPassword";

const ForgotPassword = () => {
  const { userType } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState<ResetStep>("email");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Check if we have a recovery token in the URL hash (Supabase puts it there)
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");
    const type = hashParams.get("type");

    if (accessToken && type === "recovery") {
      // Supabase will already have set the session, but we ensure it
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: hashParams.get("refresh_token") || "",
      });
      setStep("newPassword");
    }
  }, []);

  const userTypeConfig: Record<
    string,
    {
      title: string;
      description: string;
      variant: "patient" | "doctor" | "facility" | "admin";
    }
  > = {
    patient: {
      title: "Reset Patient Password",
      description: "Reset your password to access your health dashboard",
      variant: "patient",
    },
    doctor: {
      title: "Reset Medical Professional Password",
      description: "Reset your password to access your practice management dashboard",
      variant: "doctor",
    },
    facility: {
      title: "Reset Medical Facility Password",
      description: "Reset your password to manage your facility or staff access",
      variant: "facility",
    },
    "facility-admin": {
      title: "Reset Facility Admin Password",
      description: "Reset your password to manage your facility",
      variant: "facility",
    },
    "facility-staff": {
      title: "Reset Facility Staff Password",
      description: "Reset your password to access assigned operations",
      variant: "facility",
    },
    admin: {
      title: "Reset Admin Password",
      description: "Reset your password for platform administration",
      variant: "admin",
    },
  };

  // Normalize userType for config display (staff/admin variants share facility layout)
  // const normalizedUserType =
  //   userType === "facility-admin" || userType === "facility-staff"
  //     ? "facility"
  //     : userType || "patient";

  const config =
    userTypeConfig[userType as keyof typeof userTypeConfig] ||
    userTypeConfig.patient;

  // Determine which roles are allowed for this userType
  const getAllowedRoles = (): string[] => {
    if (userType === "facility" || userType === "facility-admin" || userType === "facility-staff") {
      return ["hospital_admin", "hospital_staff"];
    }
    // For patient, doctor, admin, the param should match the role name exactly
    return [userType || "patient"];
  };

  // Track page view
  useEffect(() => {
    mixpanelInstance.track("Forgot Password Page Viewed", { userType });
  }, [userType]);

  const checkEmailInProfiles = async (email: string): Promise<boolean> => {
    const lowerCaseEmail = email.toLowerCase();
    const allowedRoles = getAllowedRoles();

    let query = supabase
      .from("profiles")
      .select("email")
      .eq("email", lowerCaseEmail);

    if (allowedRoles.length > 1) {
      query = query.in("role", allowedRoles);
    } else {
      query = query.eq("role", allowedRoles[0]);
    }

    const { data, error } = await query.maybeSingle();
    if (error) {
      console.error("Error checking email:", error);
      return false;
    }
    return !!data;
  };

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    mixpanelInstance.track("Forgot Password - Send Reset Attempt", { email, userType });
    setLoading(true);

    try {
      const emailExists = await checkEmailInProfiles(email);
      if (!emailExists) {
        toast({
          title: "Email not found",
          description:
            "We couldn't find an account with this email. Please check or contact your administrator.",
          variant: "destructive",
        });
        mixpanelInstance.track("Forgot Password - Email Not Found", { email, userType });
        return;
      }
      const isStaff = userType === "hospital_staff";

      // Always redirect to the same ForgotPassword component.
      // The recovery token will be appended as a hash fragment by Supabase.
      // const redirectUrl = `${window.location.origin}/forgot-password/${userType}`;
      const redirectUrl = isStaff
  ? `${window.location.origin}/set-password?type=recovery&userType=${userType}`
  : `${window.location.origin}/forgot-password/${userType}`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
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
        description:
          "Check your email for the password reset link. The link will expire in 1 hour.",
        duration: 6000,
      });
      mixpanelInstance.track("Forgot Password - Reset Email Sent", { email, userType });
    } catch (error: any) {
      console.error("Error sending reset email:", error);
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

    mixpanelInstance.track("Forgot Password - Reset Attempt", { email, userType });
    setLoading(true);

    try {
      // Update the user's password (session must be active)
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
        description: "Your password has been updated. Please login with your new password.",
      });

      mixpanelInstance.track("Forgot Password - Success", { email, userType });

      // Clear the hash from URL to avoid confusion
      window.location.hash = "";

      // Redirect to login after 2 seconds
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

  return (
    <AuthLayout
      title={config.title}
      description={config.description}
      userType={config.variant}
    >
      <div className="space-y-6">
        {/* Back to Login Link */}
        <button
          onClick={handleBackToLogin}
          className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Login
        </button>

        {/* Email Step */}
        {step === "email" && (
          <form onSubmit={handleSendResetEmail} className="space-y-4">
            <Alert>
              <Mail className="h-4 w-4" />
              <AlertDescription>
                Enter your email address and we'll send you a password reset link.
              </AlertDescription>
            </Alert>

            {resetSent ? (
              <Alert variant="default" className="border-green-500 bg-green-50">
                <AlertDescription className="text-green-700">
                  Reset link sent! Check your email at <strong>{email}</strong> and follow the
                  instructions to reset your password.
                </AlertDescription>
              </Alert>
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
        )}

        {/* New Password Step */}
        {step === "newPassword" && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <Alert variant="default" className="border-blue-500 bg-blue-50">
              <AlertDescription className="text-blue-700">
                Please enter your new password below.
              </AlertDescription>
            </Alert>

            {/* <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Password must be at least 6 characters long
              </p>
            </div>

            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                disabled={loading}
              />
            </div> */}

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
        )}

        {/* Additional Help */}
        <Card className="bg-muted/50">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-start gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-muted-foreground">
                Having trouble? Contact support at{" "}
                <a href="support@pmhssmarthealth.com" className="text-primary hover:underline">
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

export default ForgotPassword;