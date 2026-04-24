// import React, { useEffect, useRef, useState } from "react";
// import { useGoogleMapsApi } from "./useGoogleMapsApi";

// interface LatLng {
//   lat: number;
//   lng: number;
// }

// interface SearchLocationInputProps {
//   setSelectedLocation: (location: LatLng) => void;
// }

// const GooglePlaceSearch: React.FC<SearchLocationInputProps> = ({ setSelectedLocation }) => {
//   const [query, setQuery] = useState("");
//   const inputRef = useRef<HTMLInputElement>(null);
//   const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
//   const listenerRef = useRef<google.maps.MapsEventListener | null>(null);

//   const apiKey = import.meta.env.VITE_PUBLIC_LOCATION_ANON_KEY;
//   const { isLoaded, loadError } = useGoogleMapsApi(apiKey, ["places"]);

//   // Initialize Autocomplete when API is ready
//   useEffect(() => {
//     if (!isLoaded || !inputRef.current) return;

//     autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
//       componentRestrictions: { country: "IN" },
//     });

//     listenerRef.current = autocompleteRef.current.addListener("place_changed", () => {
//       const place = autocompleteRef.current?.getPlace();
//       if (!place?.geometry?.location) {
//         alert("Please select a valid place from the list.");
//         return;
//       }

//       const formatted = place.formatted_address || "";
//       setQuery(formatted);

//       const latLng = {
//         lat: place.geometry.location.lat(),
//         lng: place.geometry.location.lng(),
//       };
//       setSelectedLocation(latLng);
//     });

//     return () => {
//       if (listenerRef.current) listenerRef.current.remove();
//     };
//   }, [isLoaded, setSelectedLocation]);

//   if (loadError) return <div>Error loading Google Places API</div>;

//   return (
//     <div className="search-location-input">
//       <label>Search Location</label>
//       <input
//         ref={inputRef}
//         className="form-control"
//         onChange={(e) => setQuery(e.target.value)}
//         placeholder="Search Places ..."
//         value={query}
//         disabled={!isLoaded}
//       />
//     </div>
//   );
// };

// export default GooglePlaceSearch;

import React, { useEffect, useRef, useState } from "react";
import { useGoogleMapsApi } from "./useGoogleMapsApi";

interface LatLng {
  lat: number;
  lng: number;
}

interface SearchLocationInputProps {
  setSelectedLocation: (location: LatLng) => void;
}

const GooglePlaceSearch: React.FC<SearchLocationInputProps> = ({ setSelectedLocation }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const listenerRef = useRef<google.maps.MapsEventListener | null>(null);

  const apiKey = import.meta.env.VITE_PUBLIC_LOCATION_ANON_KEY;
  const { isLoaded, loadError } = useGoogleMapsApi(apiKey, ["places"]);

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "IN" },
    });

    listenerRef.current = autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace();
      if (!place?.geometry?.location) {
        alert("Please select a valid place from the list.");
        return;
      }
      const formatted = place.formatted_address || "";
      setQuery(formatted);
      const latLng = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setSelectedLocation(latLng);
    });

    return () => {
      if (listenerRef.current) listenerRef.current.remove();
    };
  }, [isLoaded, setSelectedLocation]);

  if (loadError) return <div>Error loading Google Places API</div>;

  return (
    <div className="search-location-input mb-4">
      <label className="block text-sm font-medium mb-1">Search Google Map Location</label>
      <input
        ref={inputRef}
        className="w-full p-2 border rounded-md"
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Places ..."
        value={query}
        disabled={!isLoaded}
      />
    </div>
  );
};

export default GooglePlaceSearch;