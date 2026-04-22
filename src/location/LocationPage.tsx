import React, { useState } from "react";
import GooglePlaceSearch from "./GooglePlaceSearch";
import MapComponent from "./MapComponent";

const LocationPage = () => {
  const [selectedLocation, setSelectedLocation] = useState({
     lat: 12.9654,
    lng: 77.5827 
  });

  return (
    <div>
      <GooglePlaceSearch setSelectedLocation={setSelectedLocation} />
      <MapComponent selectedLocation={selectedLocation} />
    </div>
  );
};

export default LocationPage;