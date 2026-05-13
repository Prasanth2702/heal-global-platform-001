// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// // import { ArrowLeft } from "lucide-react";
// // import { useNavigate } from "react-router-dom";
// // import heroImage from "@/assets/medical-hero.jpg";

// // interface AuthLayoutProps {
// //   children: React.ReactNode;
// //   title: string;
// //   description: string;
// //   userType?: "patient" | "doctor" | "facility" | "admin";
// // }

// // const AuthLayout = ({ children, title, description, userType = "patient" }: AuthLayoutProps) => {
// //   const navigate = useNavigate();

// //   return (
// //     <div className="min-h-screen grid lg:grid-cols-2">
// //       {/* Left side - Form */}
// //       <div className="flex items-center justify-center p-8">
// //         <div className="w-full max-w-md space-y-6">
// //           <Button
// //             variant="ghost"
// //             onClick={() => navigate("/")}
// //             className="mb-4"
// //           >
// //             <ArrowLeft className="mr-2 h-4 w-4" />
// //             Back to Home
// //           </Button>
          
// //           <Card variant={userType}>
// //             <CardHeader className="text-center">
// //               <CardTitle className="text-2xl">{title}</CardTitle>
// //               <CardDescription>{description}</CardDescription>
// //             </CardHeader>
// //             <CardContent>
// //               {children}
// //             </CardContent>
// //           </Card>
// //         </div>
// //       </div>

// //       {/* Right side - Image */}
// //       <div className="hidden lg:block relative">
// //         <div 
// //           className="absolute inset-0 bg-cover bg-center"
// //           style={{ backgroundImage: `url(${heroImage})` }}
// //         >
// //           <div className={`absolute inset-0 bg-gradient-${userType} opacity-80`}></div>
// //           <div className="absolute inset-0 flex items-center justify-center p-8">
// //             <div className="text-center text-white">
// //               <h2 className="text-4xl font-bold mb-4">
// //                 Join Gen Z era Medical Platform
// //               </h2>
// //               <p className="text-xl text-white/90">
// //                 Connecting healthcare professionals and patients through technology
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AuthLayout;
// // AuthLayout.tsx
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { ArrowLeft, CheckCircle, Building2, Stethoscope } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import heroImage from "@/assets/medical-hero.jpg";

// interface AuthLayoutProps {
//   children: React.ReactNode;
//   title: string;
//   description: string;
//   userType?: "patient" | "doctor" | "facility" | "admin";
// }

// // Subscription plans data for doctors/facilities
// const subscriptionPlans = {
//   doctor: {
//     name: "Clinic Free Professional",
//     for: "Individual practitioners / small clinics",
//     features: [
//       "Clinical Consultations: 100 / month",
//       "Tele Consultations: 10 / month",
//       "Billing: No",
//       "Welcome Offer: Monthly"
//     ],
//     icon: <Stethoscope className="h-8 w-8" />,
//     price: "Free Pake",
//     bgClass: "from-blue-500 to-teal-500"
//   },
//   facility: {
//     name: "Hospitals Facility",
//     for: "Multi‑department hospitals & large facilities",
//     features: [
//       "Clinical Consultations: 100 / month",
//       "Tele Consultations: 10 / month",
//       "Tele Max Minutes: 0 / session",
//       "Staff: 0",
//       "Departments: 5",
//       "Beds: 0",
//       "Bed Bookings: 0 / month",
//       "Billing: No",
//       "Welcome Offer: Monthly"
//     ],
//     icon: <Building2 className="h-8 w-8" />,
//     price: "Free Pake",
//     bgClass: "from-teal-600 to-blue-600"
//   }
// };

// const AuthLayout = ({ children, title, description, userType = "patient" }: AuthLayoutProps) => {
//   const navigate = useNavigate();

//   // Right side content (hero image or subscription cards)
//   const renderRightContent = () => {
//     // For doctor or facility, show only the relevant plan card (single card, centered)
//     if (userType === "doctor" || userType === "facility") {
//       const plan = subscriptionPlans[userType];
//       return (
//         <div className="absolute inset-0 overflow-y-auto p-8 flex items-start justify-center">
//           <div className="max-w-md w-full space-y-6">
//             {/* Welcome header */}
//             <div className="text-center text-white mb-4">
//               <h2 className="text-3xl font-bold mb-2">🎁 Welcome Offer</h2>
//               <p className="text-white/80">Your exclusive plan</p>
//             </div>

//             {/* Single plan card */}
//             <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all">
//               <CardHeader className="text-center">
//                 <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-br ${plan.bgClass} flex items-center justify-center text-white mb-3`}>
//                   {plan.icon}
//                 </div>
//                 <CardTitle className="text-xl text-gray-800">{plan.name}</CardTitle>
//                 <CardDescription>{plan.for}</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ul className="space-y-2 mb-4">
//                   {plan.features.map((feature, idx) => (
//                     <li key={idx} className="flex items-start text-sm text-gray-700">
//                       <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
//                       <span>{feature}</span>
//                     </li>
//                   ))}
//                 </ul>
//                 <div className="text-center font-bold text-xl text-blue-600">{plan.price}</div>
//               </CardContent>
//             </Card>

//             {/* Extra note */}
//             <div className="bg-white/80 rounded-lg p-4 text-center text-sm text-gray-700">
//               <p>✅ Zero upfront cost – start using immediately</p>
//               <p className="text-xs text-gray-500 mt-1">*Includes basic support and secure data handling</p>
//             </div>
//           </div>
//         </div>
//       );
//     }

//     // Default patient/admin view: hero image with gradient
//     return (
//       <div
//         className="absolute inset-0 bg-cover bg-center"
//         style={{ backgroundImage: `url(${heroImage})` }}
//       >
//         <div className={`absolute inset-0 bg-gradient-${userType} opacity-80`}></div>
//         <div className="absolute inset-0 flex items-center justify-center p-8">
//           <div className="text-center text-white">
//             <h2 className="text-4xl font-bold mb-4">
//               Join Gen Z era Medical Platform
//             </h2>
//             <p className="text-xl text-white/90">
//               Connecting healthcare professionals and patients through technology
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen grid lg:grid-cols-2">
//       {/* Left side - Form */}
//       <div className="flex items-center justify-center p-8">
//         <div className="w-full max-w-md space-y-6">
//           <Button
//             variant="ghost"
//             onClick={() => navigate("/")}
//             className="mb-4"
//           >
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to Home
//           </Button>

//           <Card variant={userType}>
//             <CardHeader className="text-center">
//               <CardTitle className="text-2xl">{title}</CardTitle>
//               <CardDescription>{description}</CardDescription>
//             </CardHeader>
//             <CardContent>{children}</CardContent>
//           </Card>
//         </div>
//       </div>

//       {/* Right side - Dynamic content */}
//       <div className="hidden lg:block relative bg-gradient-to-br from-blue-900 to-teal-800">
//         <div
//         className="absolute inset-0 bg-cover bg-center"
//         style={{ backgroundImage: `url(${heroImage})` }}
//       >
//         <div className={`absolute inset-0 bg-gradient-${userType} opacity-80`}></div>
//         <div className="absolute inset-0 flex items-center justify-center p-8">
//         {renderRightContent()}
//           <div className="text-center text-white">
//             <h2 className="text-4xl font-bold mb-4">
//               Join Gen Z era Medical Platform
//             </h2>
//             <p className="text-xl text-white/90">
//               Connecting healthcare professionals and patients through technology
//             </p>
//           </div>
//         </div>
//       </div>
//       </div>
//     </div>
//   );
// };

// export default AuthLayout;

// AuthLayout.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Building2, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/medical-hero.jpg";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  userType?: "patient" | "doctor" | "facility" | "admin";
}

// Subscription plans data for doctors/facilities
const subscriptionPlans = {
  doctor: {
    name: "Doctor's Trial Subscription",
    for: "Individual practitioners only",
    features: [
       "Up to 25 Clinical Consultation Bookings per Month",
       "Tele Consultation Bookings not Included",
       "Monthly Welcome Benefits"
    ],
    icon: <Stethoscope className="h-8 w-8" />,
    price: "Free",
    bgClass: "from-blue-500 to-teal-500"
  },
  facility: {
    name: "Facility Trial Subscription",
    for: "Clinics, Multi‑department hospitals & large facilities",
    features: [
      "Up to 100 Clinical Consultation Bookings per Month",
      "Tele Consultation Bookings not Included",
      "Access for 2 Departments",
      "Bed Bookings not Included",
      "Billing Management not Included",
      "Monthly Welcome Benefits "
    ],
    icon: <Building2 className="h-8 w-8" />,
    price: "Free",
    bgClass: "from-teal-600 to-blue-600"
  }
};

const AuthLayout = ({ children, title, description, userType = "patient" }: AuthLayoutProps) => {
  const navigate = useNavigate();

  // Render subscription card (used both on desktop overlay and mobile)
  const SubscriptionCard = () => {
    if (userType !== "doctor" && userType !== "facility") return null;
    const plan = subscriptionPlans[userType];
    return (
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all">
        <CardHeader className="text-center">
          <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-br ${plan.bgClass} flex items-center justify-center text-white mb-3`}>
            {plan.icon}
          </div>
          <CardTitle className="text-xl text-gray-800">{plan.name}</CardTitle>
          <CardDescription>{plan.for}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 mb-4">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <div className="text-center font-bold text-xl text-blue-600">{plan.price}</div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Mobile layout (visible below lg) */}
      <div className="lg:hidden">
        {/* Show subscription card above form for doctor/facility */}
        {(userType === "doctor" || userType === "facility") && (
          <div className="p-4 pb-0">
            <SubscriptionCard />
          </div>
        )}
        {/* Form on mobile */}
        <div className="flex items-center justify-center p-6">
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
              <CardContent>{children}</CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Desktop layout (lg and above) */}
      <div className="hidden lg:grid lg:grid-cols-2 min-h-screen">
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
              <CardContent>{children}</CardContent>
            </Card>
          </div>
        </div>

        {/* Right side - Hero image with overlay content */}
        <div className="relative bg-gradient-to-br from-blue-900 to-teal-800 ">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className={`absolute inset-0 bg-gradient-${userType} opacity-80`}></div>
          </div>

          {/* Overlay content: Subscription card for doctor/facility, default text for patient */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            {(userType === "doctor" || userType === "facility") ? (
              <div className="max-w-md w-full">
                <div className="text-center text-white mb-6">
                  <h1 className="text-4xl font-bold mb-2"> {(userType === "doctor" ? "Doctor's Signup":"Facility Signup" )}</h1>
                  <h2 className="text-3xl font-bold mb-2"> 🎁 Welcome Offer</h2>
                  <p className="text-white/80">Create your account now.</p>
                </div>
                <SubscriptionCard />
                <div className="bg-white/80 rounded-lg p-7 text-center text-lg text-gray-700 mt-6  text-[10px]">
                   <p>✅ Zero upfront cost — get started instantly</p>
  
  <p className="mt-2">
    📣 Free profile promotion across social media channels and our internal healthcare platform
  </p>

  <p className="text-sm text-gray-500 mt-2">
    *Includes basic support and visibility across the platform.
  </p>

  <p className="text-sm text-blue-600 mt-2">
    For customized promotional campaigns, contact support@pmhssmarthealth.com to connect with the right patients.
  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-white">
                <h2 className="text-4xl font-bold mb-4">
                  Join Gen Z era Medical Platform
                </h2>
                <p className="text-xl text-white/90">
                  Connecting healthcare professionals and patients through technology
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;