import React from "react";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { useGoogleMapsApi } from "./useGoogleMapsApi";

interface LatLng {
  lat: number;
  lng: number;
}

interface MapComponentProps {
  selectedLocation: LatLng;
}

const MapComponent: React.FC<MapComponentProps> = ({ selectedLocation }) => {
  const apiKey = import.meta.env.VITE_PUBLIC_LOCATION_ANON_KEY;
  const { isLoaded, loadError } = useGoogleMapsApi(apiKey, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div style={{ marginTop: "50px" }}>
      <GoogleMap
        mapContainerStyle={{ height: "800px", width: "100%" }}
        center={selectedLocation}
        zoom={13}
      >
        <MarkerF
          position={selectedLocation}
          icon="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
        />
      </GoogleMap>
    </div>
  );
};

export default MapComponent;