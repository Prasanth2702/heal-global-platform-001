import { useEffect, useState } from "react";

let loadingPromise: Promise<void> | null = null;

export function useGoogleMapsApi(apiKey: string, libraries: string[] = ["places"]) {
  const [isLoaded, setIsLoaded] = useState(!!window.google);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    if (window.google) {
      setIsLoaded(true);
      return;
    }

    if (!loadingPromise) {
      loadingPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries.join(",")}&callback=initMap`;
        script.async = true;
        script.defer = true;

        // Global callback
        (window as any).initMap = () => {
          delete (window as any).initMap;
          resolve();
        };

        script.onerror = (err) => reject(err);
        document.head.appendChild(script);
      });
    }

    loadingPromise
      .then(() => setIsLoaded(true))
      .catch((err) => setLoadError(err));
  }, [apiKey, libraries]);

  return { isLoaded, loadError };
}