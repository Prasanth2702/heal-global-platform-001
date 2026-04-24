import React, { useEffect, useRef } from "react";
import { useGoogleMapsApi } from "./useGoogleMapsApi";

interface LatLng {
  lat: number;
  lng: number;
}

interface Props {
  setSelectedLocation: (location: LatLng) => void;
}

const GooglePlaceSearch: React.FC<Props> = ({ setSelectedLocation }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const apiKey = import.meta.env.VITE_PUBLIC_LOCATION_ANON_KEY;
  const { isLoaded, loadError } = useGoogleMapsApi(apiKey, ["places"]);

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "IN" },
    });

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace();
      if (!place?.geometry?.location) {
        alert("Please select a valid place");
        return;
      }
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setSelectedLocation({ lat, lng });
    });
  }, [isLoaded, setSelectedLocation]);

  if (loadError) return <div>Error loading Google API</div>;

  return (
       <div className="rounded-lg bg-gray-200 p-3 sm:p-5 w-full">
          <div className="flex flex-col sm:flex-row">
            <div className="flex w-full sm:w-auto items-center justify-center rounded-tl-lg rounded-tr-lg sm:rounded-tr-none sm:rounded-bl-lg border-b sm:border-b-0 sm:border-r border-gray-200 bg-white p-3 sm:p-5">
              <svg viewBox="0 0 20 20" aria-hidden="true" className="pointer-events-none w-5 h-5 fill-gray-500 transition">
                <path d="M16.72 17.78a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM9 14.5A5.5 5.5 0 0 1 3.5 9H2a7 7 0 0 0 7 7v-1.5ZM3.5 9A5.5 5.5 0 0 1 9 3.5V2a7 7 0 0 0-7 7h1.5ZM9 3.5A5.5 5.5 0 0 1 14.5 9H16a7 7 0 0 0-7-7v1.5Zm3.89 10.45 3.83 3.83 1.06-1.06-3.83-3.83-1.06 1.06ZM14.5 9a5.48 5.48 0 0 1-1.61 3.89l1.06 1.06A6.98 6.98 0 0 0 16 9h-1.5Zm-1.61 3.89A5.48 5.48 0 0 1 9 14.5V16a6.98 6.98 0 0 0 4.95-2.05l-1.06-1.06Z" />
              </svg>
            </div>
            
            <input 
              type="text" 
              className="flex-1 bg-white px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base font-semibold outline-0 w-full"
              ref={inputRef}
          placeholder="Search location..."
          disabled={!isLoaded}
            />
        {/* The button is removed because Autocomplete already handles place selection.
            If you need a manual geocoding fallback, add it separately. */}
      </div>
    </div>
  );
};

export default GooglePlaceSearch;