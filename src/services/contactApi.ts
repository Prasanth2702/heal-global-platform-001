// // services/contactApi.ts

// import { supabase } from "@/integrations/supabase/client"

// // Types
// export interface ContactFormData {
//   name: string
//   email: string
//   phone?: string
//   subject?: string
//   message: string
// }

// export interface ApiResponse {
//   success: boolean
//   message?: string
//   error?: string
// }

// // Supabase Edge Function URL
// const EDGE_FUNCTION_URL = "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/send-contact-email"

// /**
//  * Send contact form data to Supabase Edge Function
//  */
// export async function sendContactEnquiry(data: ContactFormData): Promise<ApiResponse> {
//   try {
//       const { data: { session } } = await supabase.auth.getSession();
//   const token = session?.access_token;

//   const headers: Record<string, string> = {
//     "Content-Type": "application/json",
//   };

//   // ✅ If user logged in
//   if (token) {
//     headers["Authorization"] = `Bearer ${token}`;
//   } 
//   // ✅ If public access (no login)
//   else {
//     headers["apikey"] = import.meta.env.VITE_SUPABASE_ANON_KEY;
//   }
//     const response = await fetch(EDGE_FUNCTION_URL, {
//       method: 'POST',
//       headers,
//       body: JSON.stringify({
//         name: data.name.trim(),
//         email: data.email.trim(),
//         phone: data.phone?.trim() || '',
//         subject: data.subject?.trim() || '',
//         message: data.message.trim()
//       })
//     })

//     const result = await response.json()

//     if (!response.ok) {
//       return {
//         success: false,
//         error: result.error || 'Failed to send enquiry. Please try again.'
//       }
//     }

//     return {
//       success: true,
//       message: result.message || 'Enquiry sent successfully'
//     }
//   } catch (error) {
//     console.error('Contact API error:', error)
//     return {
//       success: false,
//       error: 'Network error. Please check your connection and try again.'
//     }
//   }
// }

import { supabase } from "@/integrations/supabase/client"

// Types
export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

export interface ApiResponse {
  success: boolean
  message?: string
  error?: string
}
// Example of correct fetch implementation
export const sendContactEnquiry = async (formData: ContactFormData): Promise<ApiResponse> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    const anonKey = import.meta.env.VITE_SUPABASE_CONTACT_ANON_KEY;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "apikey": anonKey,                // Always send anon key
    };

    // Only add Authorization header if we have a real JWT
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/send-contact-email",
      {
        method: "POST",
        headers,
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data?.error || "Something went wrong",
      };
    }

    return {
      success: true,
      message: data?.message || "Email sent successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Network error",
    };
  }
};