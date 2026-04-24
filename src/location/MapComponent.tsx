// import React from "react";
// import { GoogleMap, MarkerF } from "@react-google-maps/api";
// import { useGoogleMapsApi } from "./useGoogleMapsApi";

// interface LatLng {
//   lat: number;
//   lng: number;
// }

// interface MapComponentProps {
//   selectedLocation: LatLng;
// }

// const MapComponent: React.FC<MapComponentProps> = ({ selectedLocation }) => {
//   const apiKey = import.meta.env.VITE_PUBLIC_LOCATION_ANON_KEY;
//   const { isLoaded, loadError } = useGoogleMapsApi(apiKey, []);

//   if (loadError) return <div>Error loading maps</div>;
//   if (!isLoaded) return <div>Loading Maps...</div>;

//   return (
//     <div style={{ marginTop: "50px" }}>
//       <GoogleMap
//         mapContainerStyle={{ height: "800px", width: "100%" }}
//         center={selectedLocation}
//         zoom={13}
//       >
//         <MarkerF
//           position={selectedLocation}
//           icon="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
//         />
//       </GoogleMap>
//     </div>
//   );
// };

// export default MapComponent;

import React from "react";
import { GoogleMap, MarkerF, InfoWindowF } from "@react-google-maps/api";
import { useGoogleMapsApi } from "./useGoogleMapsApi";

interface LatLng {
  lat: number;
  lng: number;
}

interface MapComponentProps {
  selectedLocation: LatLng;
  doctors?: any[];
  facilities?: any[];
  activeTab: "doctors" | "hospitals" | "all";
}

const MapComponent: React.FC<MapComponentProps> = ({ selectedLocation, doctors = [], facilities = [], activeTab }) => {
  const apiKey = import.meta.env.VITE_PUBLIC_LOCATION_ANON_KEY;
  const { isLoaded, loadError } = useGoogleMapsApi(apiKey, ["places"]);
  const [selectedMarker, setSelectedMarker] = React.useState<any>(null);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  // Prepare markers
  const doctorMarkers = (activeTab === "doctors" || activeTab === "all")
    ? doctors.filter(d => d.latitude && d.longitude).map(d => ({
        id: d.id,
        name: d.name,
        address: d.address || d.location,
        lat: d.latitude,
        lng: d.longitude,
        type: "doctor",
        specialty: d.specialty,
      }))
    : [];

  const facilityMarkers = (activeTab === "hospitals" || activeTab === "all")
    ? facilities.filter(f => f.latitude && f.longitude).map(f => ({
        id: f.id,
        name: f.facility_name,
        address: `${f.city || ''} ${f.state || ''}`.trim(),
        lat: f.latitude,
        lng: f.longitude,
        type: "facility",
        facilityType: f.facility_type,
      }))
    : [];

  const markers = [...doctorMarkers, ...facilityMarkers];

  return (
    <GoogleMap
      mapContainerStyle={{ height: "500px", width: "100%" }}
      center={selectedLocation}
      zoom={13}
    >
      {/* User location marker */}
      <MarkerF
        position={selectedLocation}
        icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        title="Your Location"
      />

      {/* Result markers */}
      {markers.map((marker) => (
        <MarkerF
          key={marker.id}
          position={{ lat: marker.lat, lng: marker.lng }}
          icon={
            marker.type === "doctor"
              ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
              : "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
          }
          onClick={() => setSelectedMarker(marker)}
        />
      ))}

      {/* InfoWindow */}
      {selectedMarker && (
        <InfoWindowF
          position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
          onCloseClick={() => setSelectedMarker(null)}
        >
          <div>
            <strong>{selectedMarker.name}</strong>
            <br />
            {selectedMarker.address}
            {selectedMarker.specialty && <><br />Specialty: {selectedMarker.specialty}</>}
            {selectedMarker.facilityType && <><br />Type: {selectedMarker.facilityType}</>}
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
};

export default MapComponent;