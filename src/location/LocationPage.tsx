import React, { useEffect, useState } from "react";
import GooglePlaceSearch from "./GooglePlaceSearch";
import MapComponent from "./MapComponent";

interface LatLng {
  lat: number;
  lng: number;
}

// Toggle demo mode
const isDemo = false;

const DEFAULT_LOCATION: LatLng = isDemo
  ? { lat: 48.8566, lng: 2.3522 } // Paris (demo)
  : { lat: 12.9716, lng: 77.5946 }; // Bengaluru

const LocationPage = () => {
  const [selectedLocation, setSelectedLocation] =
    useState<LatLng>(DEFAULT_LOCATION);

  // Auto-detect current location (optional)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSelectedLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        setSelectedLocation(DEFAULT_LOCATION);
      }
    );
  }, []);

  return (
    <div>
      <GooglePlaceSearch setSelectedLocation={setSelectedLocation} />
      <MapComponent selectedLocation={selectedLocation} />
    </div>
  );
};

export default LocationPage;