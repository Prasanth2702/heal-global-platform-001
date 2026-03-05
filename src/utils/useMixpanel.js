
// src/hooks/useMixpanel.js
import mixpanelInstance from "./mixpanel.js";

export const useMixpanel = () => {
  // Identify user
  const identify = (userId) => {
    console.log("🔍 Mixpanel Identify Called:", userId);
    mixpanelInstance.identify(userId);
  };

  // Track events
  const track = (eventName, properties = {}) => {
    console.log("🎯 Mixpanel Event:", eventName, properties);
    mixpanelInstance.track(eventName, properties);
  };

  // Set user properties
  const setUserProps = (props = {}) => {
    console.log("👤 Mixpanel User Properties:", props);
    mixpanelInstance.people.set(props);
  };

  // Track page view
  const trackPageView = (pageName) => {
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
