// // import React, { useEffect, useRef } from "react";
// // import { useGoogleMapsApi } from "./useGoogleMapsApi";

// // interface LatLng {
// //   lat: number;
// //   lng: number;
// // }

// // interface Props {
// //   setSelectedLocation: (location: LatLng) => void;
// // }

// // const GooglePlaceSearchRegister: React.FC<Props> = ({ setSelectedLocation }) => {
// //   const inputRef = useRef<HTMLInputElement>(null);
// //   const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

// //   const apiKey = import.meta.env.VITE_PUBLIC_LOCATION_ANON_KEY;
// //   const { isLoaded, loadError } = useGoogleMapsApi(apiKey, ["places"]);

// //   useEffect(() => {
// //     if (!isLoaded || !inputRef.current) return;

// //     // Initialize Autocomplete
// //     autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
// //       componentRestrictions: { country: "IN" },
// //       fields: ["geometry", "formatted_address", "name"],
// //     });

// //     const listener = autocompleteRef.current.addListener("place_changed", () => {
// //       const place = autocompleteRef.current?.getPlace();

// //       if (!place || !place.geometry || !place.geometry.location) {
// //         alert("Please select a valid place from dropdown");
// //         return;
// //       }

// //       const lat = place.geometry.location.lat();
// //       const lng = place.geometry.location.lng();

// //       console.log("Selected Location:", { lat, lng });

// //       setSelectedLocation({ lat, lng });

// //       // Optional: autofill input with formatted address
// //       if (inputRef.current && place.formatted_address) {
// //         inputRef.current.value = place.formatted_address;
// //       }
// //     });

// //     // Cleanup (VERY IMPORTANT)
// //     return () => {
// //       if (listener) google.maps.event.removeListener(listener);
// //     };
// //   }, [isLoaded, setSelectedLocation]);

// //   if (loadError) return <div>Error loading Google API</div>;

// //   return (
// //     <div className="rounded-lg bg-gray-200 p-3 sm:p-5 w-full">
// //       <div className="flex flex-col sm:flex-row">
// //         <div className="flex w-full sm:w-auto items-center justify-center rounded-tl-lg rounded-tr-lg sm:rounded-tr-none sm:rounded-bl-lg border-b sm:border-b-0 sm:border-r border-gray-200 bg-white p-3 sm:p-5">
// //           <svg viewBox="0 0 20 20" className="w-5 h-5 fill-gray-500">
// //             <path d="M16.72 17.78a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM9 14.5A5.5 5.5 0 0 1 3.5 9H2a7 7 0 0 0 7 7v-1.5ZM3.5 9A5.5 5.5 0 0 1 9 3.5V2a7 7 0 0 0-7 7h1.5ZM9 3.5A5.5 5.5 0 0 1 14.5 9H16a7 7 0 0 0-7-7v1.5Z" />
// //           </svg>
// //         </div>

// //         <input
// //           type="text"
// //           ref={inputRef}
// //           placeholder="Search location..."
// //           disabled={!isLoaded}
// //           className="flex-1 bg-white px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base font-semibold outline-0 w-full"
// //         />
// //       </div>
// //     </div>
// //   );
// // };

// // export default GooglePlaceSearchRegister;

// import React, { useEffect, useRef } from "react";
// import { useGoogleMapsApi } from "./useGoogleMapsApi";

// // ✅ Full location type
// export interface LocationData {
//   lat: number;
//   lng: number;
//   city: string;
//   state: string;
//   country: string;
//   pincode: string;
//   address: string;
// }

// interface Props {
//   setSelectedLocation: (location: LocationData) => void;
// }

// const GooglePlaceSearchRegister: React.FC<Props> = ({ setSelectedLocation }) => {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

//   const apiKey = import.meta.env.VITE_PUBLIC_LOCATION_ANON_KEY;
//   const { isLoaded, loadError } = useGoogleMapsApi(apiKey, ["places"]);

//   useEffect(() => {
//     if (!isLoaded || !inputRef.current) return;

//     autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
//       componentRestrictions: { country: "IN" },
//       fields: ["geometry", "formatted_address", "address_components"],
//     });

//     const listener = autocompleteRef.current.addListener("place_changed", () => {
//       const place = autocompleteRef.current?.getPlace();

//       if (!place || !place.geometry || !place.geometry.location) {
//         alert("Please select a valid place");
//         return;
//       }

//       const lat = place.geometry.location.lat();
//       const lng = place.geometry.location.lng();

//       // 🔥 Extract address details
//       let city = "";
//       let state = "";
//       let country = "";
//       let pincode = "";
//       let address = place.formatted_address || "";

//       place.address_components?.forEach((component) => {
//         const types = component.types;

//         if (types.includes("locality")) {
//           city = component.long_name;
//         }

//         if (!city && types.includes("sublocality")) {
//           city = component.long_name; // fallback
//         }

//         if (types.includes("administrative_area_level_1")) {
//           state = component.long_name;
//         }

//         if (types.includes("country")) {
//           country = component.long_name;
//         }

//         if (types.includes("postal_code")) {
//           pincode = component.long_name;
//         }
//       });

//       console.log("📍 Location Data:", {
//         lat,
//         lng,
//         city,
//         state,
//         country,
//         pincode,
//         address,
//       });

//       // ✅ Send to parent
//       setSelectedLocation({
//         lat,
//         lng,
//         city,
//         state,
//         country,
//         pincode,
//         address,
//       });

//       // Autofill input
//       if (inputRef.current && place.formatted_address) {
//         inputRef.current.value = place.formatted_address;
//       }
//     });

//     return () => {
//       if (listener) google.maps.event.removeListener(listener);
//     };
//   }, [isLoaded, setSelectedLocation]);

//   if (loadError) return <div>Error loading Google API</div>;

//   return (
//     <div className="rounded-lg bg-gray-200 p-3 sm:p-5 w-full">
//       <div className="flex flex-col sm:flex-row">
//         <div className="flex items-center justify-center border bg-white p-3">
//           🔍
//         </div>

//         <input
//           ref={inputRef}
//           type="text"
//           placeholder="Search location..."
//           disabled={!isLoaded}
//           className="flex-1 bg-white px-4 py-3 outline-none"
//         />
//       </div>
//     </div>
//   );
// };

// export default GooglePlaceSearchRegister;

import React, { useEffect, useRef } from "react";
import { useGoogleMapsApi } from "./useGoogleMapsApi";

// ✅ Full location type
export interface LocationData {
  lat: number;
  lng: number;
  city: string;
  state: string;
  country: string;
  pincode: string;
  address: string;
}

interface Props {
  setSelectedLocation: (location: LocationData) => void;
}

const GooglePlaceSearchRegister: React.FC<Props> = ({
  setSelectedLocation,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef =
    useRef<google.maps.places.Autocomplete | null>(null);

  const apiKey = import.meta.env.VITE_PUBLIC_LOCATION_ANON_KEY;

  const { isLoaded, loadError } = useGoogleMapsApi(apiKey, ["places"]);

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    autocompleteRef.current = new google.maps.places.Autocomplete(
      inputRef.current,
      {
        componentRestrictions: { country: "IN" },
        fields: [
          "geometry",
          "formatted_address",
          "address_components",
        ],
      }
    );

    const listener = autocompleteRef.current.addListener(
      "place_changed",
      () => {
        const place = autocompleteRef.current?.getPlace();

        if (!place || !place.geometry || !place.geometry.location) {
          alert("Please select a valid place");
          return;
        }

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        // ✅ Extract address details
        let city = "";
        let state = "";
        let country = "";
        let pincode = "";
        let address = place.formatted_address || "";

        place.address_components?.forEach((component) => {
          const types = component.types;

          // ✅ City
          if (types.includes("locality")) {
            city = component.long_name;
          }

          // ✅ Fallback city
          if (!city && types.includes("sublocality")) {
            city = component.long_name;
          }

          // ✅ State
          if (types.includes("administrative_area_level_1")) {
            state = component.long_name;
          }

          // ✅ Country
          if (types.includes("country")) {
            country = component.long_name;
          }

          // ✅ Pincode
          if (types.includes("postal_code")) {
            pincode = component.long_name;
          }
        });

        // ✅ Remove city/state/country/pincode from formatted address
        if (city) {
          address = address.replace(
            new RegExp(`,\\s*${city}`, "gi"),
            ""
          );
        }

        if (state) {
          address = address.replace(
            new RegExp(`,\\s*${state}`, "gi"),
            ""
          );
        }

        if (country) {
          address = address.replace(
            new RegExp(`,\\s*${country}`, "gi"),
            ""
          );
        }

        // ✅ Remove pincode
        if (pincode) {
          address = address.replace(
            new RegExp(`\\s*${pincode}`, "gi"),
            ""
          );
        }

        // ✅ Remove duplicate commas/spaces
        address = address
          .replace(/,\s*,/g, ",")
          .replace(/^,\s*|\s*,$/g, "")
          .trim();

        console.log("📍 Location Data:", {
          lat,
          lng,
          city,
          state,
          country,
          pincode,
          address,
        });

        // ✅ Send cleaned data to parent
        setSelectedLocation({
          lat,
          lng,
          city,
          state,
          country,
          pincode,
          address,
        });

        // ✅ Autofill cleaned address in input
        if (inputRef.current) {
          inputRef.current.value = address;
        }
      }
    );

    return () => {
      if (listener) {
        google.maps.event.removeListener(listener);
      }
    };
  }, [isLoaded, setSelectedLocation]);

  if (loadError) {
    return (
      <div className="text-red-500">
        Error loading Google Maps API
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-gray-200 p-3 sm:p-5 w-full">
      <div className="flex flex-col sm:flex-row">
        {/* Search Icon */}
        <div className="flex items-center justify-center border bg-white p-3 rounded-l-lg">
          🔍
        </div>

        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Search location..."
          disabled={!isLoaded}
          className="flex-1 bg-white px-4 py-3 outline-none border rounded-r-lg"
        />
      </div>
    </div>
  );
};

export default GooglePlaceSearchRegister;