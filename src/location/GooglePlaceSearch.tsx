import React, { useRef } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";

const libraries: any = ["places"];

const GooglePlaceSearch = () => {
  const autocompleteRef = useRef<any>(null);

  const onLoad = (autocomplete: any) => {
    autocompleteRef.current = autocomplete;
  };
  const location = import.meta.env.VITE_PUBLIC_LOCATION_ANON_KEY;

  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    console.log("Selected Place:", place);

    console.log("Address:", place.formatted_address);
    console.log("Latitude:", place.geometry.location.lat());
    console.log("Longitude:", place.geometry.location.lng());
  };

  return (
    <LoadScript
      googleMapsApiKey={location}
      libraries={libraries}
    >
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
      >
        <input
          type="text"
          placeholder="Search hospital, city, address..."
          style={{
            width: "100%",
            height: "40px",
            padding: "10px"
          }}
        />
      </Autocomplete>
    </LoadScript>
  );
};

export default GooglePlaceSearch;