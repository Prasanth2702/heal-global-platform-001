// /useMixpanel.ts
import mixpanelInstance from "./mixpanel";

export const useMixpanel = () => {

  // Identify user
  const identify = (userId: string) => {
    console.log("🔍 Mixpanel Identify Called:", userId);
    mixpanelInstance.identify(userId);
  };

  // Track events
  const track = (eventName: string, properties: Record<string, any> = {}) => {
    console.log("🎯 Mixpanel Event:", eventName, properties);
    mixpanelInstance.track(eventName, properties);
  };

  // Set user properties
  const setUserProps = (props: Record<string, any> = {}) => {
    console.log("👤 Mixpanel User Properties:", props);
    mixpanelInstance.people.set(props);
  };

  // Track page view
  const trackPageView = (pageName: string) => {
    console.log("📄 Page View:", pageName);
    track("Page View", { page: pageName });
  };

  return {
    identify,
    track,
    setUserProps,
    trackPageView,
  };
};