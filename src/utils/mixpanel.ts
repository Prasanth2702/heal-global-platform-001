// src/utils/mixpanel.ts
import mixpanel from "mixpanel-browser";

// Environment variables
const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_ID as string;
const MIXPANEL_API = import.meta.env.VITE_MIXPANEL_API_ID as string;

console.log("🔑 Mixpanel Token Loaded:", MIXPANEL_TOKEN);
console.log("🌍 Mixpanel API Host:", MIXPANEL_API);

// Initialize Mixpanel
mixpanel.init(MIXPANEL_TOKEN, {
  debug: true,
  track_pageview: false,
  persistence: "localStorage",
  ignore_dnt: true,
  api_host: MIXPANEL_API,
  record_sessions_percent: 1,
});

console.log("🚀 Mixpanel Initialized");

// -------------------------
// Custom Functions
// -------------------------

// Set session ID
export const setMixpanelSessionId = (sessionId: string) => {
  console.log("🆔 Setting Session ID:", sessionId);
  mixpanel.register({ session_id: sessionId });
};

// Track login success
export const trackLoginSuccess = (userId: string, userData: any) => {
  console.log("✅ Login Success:", userId, userData);

  mixpanel.identify(userId);
  mixpanel.track("Successful login", {
    login_method: "email_password",
  });

  mixpanel.people.set({
    $first_name: userData.first_name,
    $last_name: userData.last_name,
    $email: userData.email || "",
    $created: new Date().toISOString(),
  });

  mixpanel.people.set_once({
    "First login date": new Date().toISOString(),
  });
};

// Track login failure
export const trackLoginFailure = (error: any) => {
  console.log("❌ Login Failed:", error.message);

  mixpanel.track("Unsuccessful login", {
    error: error.message,
    timestamp: new Date().toISOString(),
  });
};

// Track sign-up
export const trackSignup = (userId: string, userData: any) => {
  console.log("📝 Signup:", userId, userData);

  mixpanel.identify(userId);
  mixpanel.track("Signup", {
    signup_method: "email_password",
  });

  mixpanel.people.set({
    $first_name: userData.first_name,
    $last_name: userData.last_name,
    $email: userData.email,
    $created: new Date().toISOString(),
  });
};

// Export
export const mixpanelInstance = mixpanel;
export default mixpanel;