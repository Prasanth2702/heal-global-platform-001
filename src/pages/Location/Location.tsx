// // pages/location/Location.jsx
// import React, { useState, useEffect } from "react";
// import { useGeolocated } from "react-geolocated";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";

// import {
//   MapPin,
//   Navigation,
//   Home,
//   AlertCircle,
//   CheckCircle,
//   XCircle,
//   MessageSquare,
//   Map,
// } from "lucide-react";

// const Location = () => {
//   const [showLocationDialog, setShowLocationDialog] = useState(true);
//   const [locationType, setLocationType] = useState(null);
//   const [savedLocation, setSavedLocation] = useState(null);
//   const [comparisonResult, setComparisonResult] = useState(null);
//   const [distance, setDistance] = useState(null);
//   const [locationTaken, setLocationTaken] = useState(false);
//   const [manualAddress, setManualAddress] = useState("");
//   const [showManualAddressInput, setShowManualAddressInput] = useState(false);

//   const [address, setAddress] = useState({
//     city: "",
//     state: "",
//     pincode: "",
//     formatted_address: "",
//     road: "",
//     suburb: "",
//     country: ""
//   });

//   const { coords, isGeolocationAvailable, isGeolocationEnabled } =
//     useGeolocated({
//       positionOptions: { enableHighAccuracy: true },
//       userDecisionTimeout: 5000,
//     });

//   useEffect(() => {
//     const saved = localStorage.getItem("userLocation");
//     if (saved) {
//       const parsed = JSON.parse(saved);
//       setSavedLocation(parsed);
//       if (parsed.address) {
//         setAddress(parsed.address);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     if (coords) {
//       fetchAddress(coords.latitude, coords.longitude);
//     }
//   }, [coords]);

//   const fetchAddress = async (lat, lon) => {
//     try {
//       const res = await fetch(
//         `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`
//       );

//       const data = await res.json();

//       // Create formatted address in text message format
//       const formattedAddress = [
//         data.address.road || "",
//         data.address.suburb || "",
//         data.address.city || data.address.town || data.address.village || "",
//         data.address.state || "",
//         data.address.postcode || "",
//         data.address.country || ""
//       ].filter(Boolean).join(", ");

//       setAddress({
//         city: data.address.city || data.address.town || data.address.village || "",
//         state: data.address.state || "",
//         pincode: data.address.postcode || "",
//         road: data.address.road || "",
//         suburb: data.address.suburb || "",
//         country: data.address.country || "",
//         formatted_address: formattedAddress || "Address not found"
//       });
//     } catch (error) {
//       console.error("Address fetch error:", error);
//     }
//   };

//   const handleLocationClick = (type) => {
//     setLocationType(type);
//     setShowLocationDialog(false);
//   };

//   const handleTakeLocation = () => {
//     if (coords) {
//       const locationData = {
//         latitude: coords.latitude,
//         longitude: coords.longitude,
//         timestamp: new Date().toLocaleString(),
//         accuracy: coords.accuracy,
//         address: address,
//         manualAddress: manualAddress || address.formatted_address
//       };

//       localStorage.setItem("userLocation", JSON.stringify(locationData));
//       setSavedLocation(locationData);
//       setLocationTaken(true);

//       setTimeout(() => setLocationTaken(false), 3000);
//     }
//   };

//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371;
//     const dLat = ((lat2 - lat1) * Math.PI) / 180;
//     const dLon = ((lon2 - lon1) * Math.PI) / 180;

//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos((lat1 * Math.PI) / 180) *
//         Math.cos((lat2 * Math.PI) / 180) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);

//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     return R * c;
//   };

//   const handleCheckLocation = async () => {
//     if (coords && savedLocation) {
//       // Get current address for comparison
//       await fetchAddress(coords.latitude, coords.longitude);
      
//       const dist = calculateDistance(
//         coords.latitude,
//         coords.longitude,
//         savedLocation.latitude,
//         savedLocation.longitude
//       );

//       setDistance(dist);

//       // Condition: Check if city, state, and pincode match
//       const currentLocationCondition = {
//         city: address.city?.toLowerCase().trim(),
//         state: address.state?.toLowerCase().trim(),
//         pincode: address.pincode?.toLowerCase().trim()
//       };

//       const savedLocationCondition = {
//         city: savedLocation.address?.city?.toLowerCase().trim(),
//         state: savedLocation.address?.state?.toLowerCase().trim(),
//         pincode: savedLocation.address?.pincode?.toLowerCase().trim()
//       };

//       // Check if all three match
//       const isAddressMatch = 
//         currentLocationCondition.city === savedLocationCondition.city &&
//         currentLocationCondition.state === savedLocationCondition.state &&
//         currentLocationCondition.pincode === savedLocationCondition.pincode;

//       // Location matches if within 50 meters AND address details match
//       if (dist < 0.05 && isAddressMatch) {
//         setComparisonResult("match");
//       } else {
//         setComparisonResult("mismatch");
        
//         // Show which condition failed
//         if (!isAddressMatch) {
//           console.log("Address details don't match:", {
//             current: currentLocationCondition,
//             saved: savedLocationCondition
//           });
//         }
//       }
//     }
//   };

//   if (!isGeolocationAvailable) {
//     return (
//       <div className="alert alert-danger mt-5 text-center">
//         <AlertCircle className="me-2" />
//         Your browser does not support geolocation
//       </div>
//     );
//   }

//   if (!isGeolocationEnabled) {
//     return (
//       <div className="alert alert-warning mt-5 text-center">
//         <AlertCircle className="me-2" />
//         Please enable location access
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* SELECT TYPE POPUP */}
//       <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle className="text-center text-xl">
//               Select Location Type
//             </DialogTitle>
//             <DialogDescription className="text-center">
//               Choose what you want to do
//             </DialogDescription>
//           </DialogHeader>

//           <div className="grid grid-cols-1 gap-4 mt-4">
//             <button
//               onClick={() => handleLocationClick("take")}
//               className="border p-4 rounded-lg hover:bg-gray-100 transition-all"
//             >
//               <Navigation className="mx-auto mb-2" size={32} />
//               <span className="block font-medium">Take Location</span>
//               <span className="text-xs text-gray-500 mt-1 block">
//                 Save current location
//               </span>
//             </button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* TAKE LOCATION POPUP */}
//       <Dialog open={locationType === "take"} onOpenChange={() => setLocationType(null)}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Take Location</DialogTitle>
//             <DialogDescription>
//               Capture and save your current location
//             </DialogDescription>
//           </DialogHeader>

//           {coords && (
//             <div className="space-y-3">
//               {/* Text Message Format Address */}
//               <div className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded">
//                 <div className="flex items-start gap-2">
//                   <MessageSquare size={18} className="text-blue-600 mt-1" />
//                   <div>
//                     <p className="text-xs text-blue-600 font-semibold mb-1">📍 Address (Text Message Format):</p>
//                     <p className="text-sm text-gray-700">{address.formatted_address || "Fetching address..."}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Individual Address Components */}
//               <div className="border p-3 rounded text-sm bg-white">
//                 <h4 className="font-semibold mb-2 flex items-center gap-1">
//                   <Map size={16} /> Address Components:
//                 </h4>
//                 <div className="grid grid-cols-2 gap-2 text-sm">
//                   <div>
//                     <span className="text-gray-600">City:</span>
//                     <span className="ml-1 font-medium">{address.city || "Loading..."}</span>
//                   </div>
//                   <div>
//                     <span className="text-gray-600">State:</span>
//                     <span className="ml-1 font-medium">{address.state || "Loading..."}</span>
//                   </div>
//                   <div>
//                     <span className="text-gray-600">Pincode:</span>
//                     <span className="ml-1 font-medium">{address.pincode || "Loading..."}</span>
//                   </div>
//                   <div>
//                     <span className="text-gray-600">Country:</span>
//                     <span className="ml-1 font-medium">{address.country || "Loading..."}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Manual Address Input Option */}
//               <div className="mt-2">
//                 <button
//                   onClick={() => setShowManualAddressInput(!showManualAddressInput)}
//                   className="text-sm text-blue-600 hover:underline flex items-center gap-1"
//                 >
//                   <MessageSquare size={14} />
//                   {showManualAddressInput ? "Hide" : "Edit"} Address Text
//                 </button>
                
//                 {showManualAddressInput && (
//                   <div className="mt-2">
//                     <label className="text-sm text-gray-600 block mb-1">
//                       Custom Address Text:
//                     </label>
//                     <textarea
//                       value={manualAddress}
//                       onChange={(e) => setManualAddress(e.target.value)}
//                       placeholder="Enter address in text format..."
//                       className="w-full p-2 border rounded text-sm"
//                         rows={3}
//                     />
//                     <p className="text-xs text-gray-500 mt-1">
//                       This will override the auto-fetched address
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           <button
//             className="btn btn-primary mt-4 w-full"
//             onClick={handleTakeLocation}
//             disabled={!coords}
//           >
//             Take Location
//           </button>

//           {locationTaken && (
//             <div className="alert alert-success mt-3">
//               <CheckCircle className="me-2" size={18} />
//               Location saved successfully
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

      
//     </>
//   );
// };

// export default Location;

// pages/location/Location.jsx
import React, { useState, useEffect } from "react";
import { useGeolocated } from "react-geolocated";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  MapPin,
  Navigation,
  Home,
  AlertCircle,
  CheckCircle,
  XCircle,
  MessageSquare,
  Map,
  Edit,
  RefreshCw,
} from "lucide-react";

const Location = () => {
  const [showLocationDialog, setShowLocationDialog] = useState(true);
  const [locationType, setLocationType] = useState(null);
  const [savedLocation, setSavedLocation] = useState(null);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [distance, setDistance] = useState(null);
  const [locationTaken, setLocationTaken] = useState(false);
  const [manualAddress, setManualAddress] = useState("");
  const [showManualAddressInput, setShowManualAddressInput] = useState(false);
  const [useManualAddressOnly, setUseManualAddressOnly] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const [address, setAddress] = useState({
    city: "",
    state: "",
    pincode: "",
    formatted_address: "",
    road: "",
    suburb: "",
    country: ""
  });

  const [manualAddressDetails, setManualAddressDetails] = useState({
    city: "",
    state: "",
    pincode: "",
    formatted_address: "",
    road: "",
    suburb: "",
    country: ""
  });

  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: { enableHighAccuracy: true },
      userDecisionTimeout: 5000,
    });

  useEffect(() => {
    const saved = localStorage.getItem("userLocation");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSavedLocation(parsed);
      if (parsed.address) {
        setAddress(parsed.address);
      }
    }
  }, []);

  useEffect(() => {
    if (coords && !useManualAddressOnly) {
      fetchAddress(coords.latitude, coords.longitude);
    }
  }, [coords, useManualAddressOnly]);

  const fetchAddress = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`
      );

      const data = await res.json();

      // Create formatted address in text message format
      const formattedAddress = [
        data.address.road || "",
        data.address.suburb || "",
        data.address.city || data.address.town || data.address.village || "",
        data.address.state || "",
        data.address.postcode || "",
        data.address.country || ""
      ].filter(Boolean).join(", ");

      setAddress({
        city: data.address.city || data.address.town || data.address.village || "",
        state: data.address.state || "",
        pincode: data.address.postcode || "",
        road: data.address.road || "",
        suburb: data.address.suburb || "",
        country: data.address.country || "",
        formatted_address: formattedAddress || "Address not found"
      });
    } catch (error) {
      console.error("Address fetch error:", error);
    }
  };

  const handleLocationClick = (type) => {
    setLocationType(type);
    setShowLocationDialog(false);
  };

  const handleEditAddress = () => {
    setIsEditingAddress(true);
    setUseManualAddressOnly(true);
    // Pre-fill manual address with current address for editing
    setManualAddress(address.formatted_address || "");
    setManualAddressDetails({ ...address });
  };

  const handleCancelEdit = () => {
    setIsEditingAddress(false);
    setUseManualAddressOnly(false);
    setShowManualAddressInput(false);
    setManualAddress("");
    setManualAddressDetails({
      city: "",
      state: "",
      pincode: "",
      formatted_address: "",
      road: "",
      suburb: "",
      country: ""
    });
  };

  const handleSaveManualAddress = () => {
    // Parse manual address into components (simple parsing)
    const addressParts = manualAddress.split(',').map(part => part.trim());
    
    // Update manual address details (you can enhance this parsing logic)
    setManualAddressDetails({
      ...manualAddressDetails,
      formatted_address: manualAddress,
      city: addressParts[2] || manualAddressDetails.city,
      state: addressParts[3] || manualAddressDetails.state,
      pincode: addressParts[4] || manualAddressDetails.pincode,
      country: addressParts[5] || manualAddressDetails.country,
    });
    
    setIsEditingAddress(false);
    setShowManualAddressInput(false);
  };

  const handleTakeLocation = () => {
    let locationData;

    if (useManualAddressOnly && manualAddress) {
      // Use manual address only
      locationData = {
        latitude: null,
        longitude: null,
        timestamp: new Date().toLocaleString(),
        accuracy: null,
        address: manualAddressDetails,
        manualAddress: manualAddress,
        isManualOnly: true
      };
    } else if (coords) {
      // Use current location
      locationData = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        timestamp: new Date().toLocaleString(),
        accuracy: coords.accuracy,
        address: address,
        manualAddress: manualAddress || address.formatted_address
      };
    } else {
      return; // No location data available
    }

    localStorage.setItem("userLocation", JSON.stringify(locationData));
    setSavedLocation(locationData);
    setLocationTaken(true);

    setTimeout(() => setLocationTaken(false), 3000);
    
    // Reset states
    setLocationType(null);
    setIsEditingAddress(false);
    setUseManualAddressOnly(false);
    setShowManualAddressInput(false);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const handleCheckLocation = async () => {
    if (savedLocation) {
      let currentAddress = address;
      
      // If we have coordinates, fetch current address
      if (coords && !savedLocation.isManualOnly) {
        await fetchAddress(coords.latitude, coords.longitude);
      }

      // For manual-only saved locations, we compare with manual address
      if (savedLocation.isManualOnly) {
        // Just check if we're comparing manual address with something
        setComparisonResult("manual_only");
        return;
      }

      // Calculate distance if both locations have coordinates
      if (coords && savedLocation.latitude && savedLocation.longitude) {
        const dist = calculateDistance(
          coords.latitude,
          coords.longitude,
          savedLocation.latitude,
          savedLocation.longitude
        );

        setDistance(dist);

        // Condition: Check if city, state, and pincode match
        const currentLocationCondition = {
          city: address.city?.toLowerCase().trim(),
          state: address.state?.toLowerCase().trim(),
          pincode: address.pincode?.toLowerCase().trim()
        };

        const savedLocationCondition = {
          city: savedLocation.address?.city?.toLowerCase().trim(),
          state: savedLocation.address?.state?.toLowerCase().trim(),
          pincode: savedLocation.address?.pincode?.toLowerCase().trim()
        };

        // Check if all three match
        const isAddressMatch = 
          currentLocationCondition.city === savedLocationCondition.city &&
          currentLocationCondition.state === savedLocationCondition.state &&
          currentLocationCondition.pincode === savedLocationCondition.pincode;

        // Location matches if within 50 meters AND address details match
        if (dist < 0.05 && isAddressMatch) {
          setComparisonResult("match");
        } else {
          setComparisonResult("mismatch");
          
          // Show which condition failed
          if (!isAddressMatch) {
            console.log("Address details don't match:", {
              current: currentLocationCondition,
              saved: savedLocationCondition
            });
          }
        }
      }
    }
  };

  if (!isGeolocationAvailable) {
    return (
      <div className="alert alert-danger mt-5 text-center">
        <AlertCircle className="me-2" />
        Your browser does not support geolocation
      </div>
    );
  }

  if (!isGeolocationEnabled) {
    return (
      <div className="alert alert-warning mt-5 text-center">
        <AlertCircle className="me-2" />
        Please enable location access
      </div>
    );
  }

  return (
    <>
      {/* SELECT TYPE POPUP */}
      <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              Select Location Type
            </DialogTitle>
            <DialogDescription className="text-center">
              Choose what you want to do
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 mt-4">
            <button
              onClick={() => handleLocationClick("take")}
              className="border p-4 rounded-lg hover:bg-gray-100 transition-all"
            >
              <Navigation className="mx-auto mb-2" size={32} />
              <span className="block font-medium">Take Location</span>
              <span className="text-xs text-gray-500 mt-1 block">
                Save current location
              </span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* TAKE LOCATION POPUP */}
      <Dialog open={locationType === "take"} onOpenChange={() => {
        setLocationType(null);
        setIsEditingAddress(false);
        setUseManualAddressOnly(false);
        setShowManualAddressInput(false);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Take Location</DialogTitle>
            <DialogDescription>
              {useManualAddressOnly ? "Enter manual address" : "Capture and save your current location"}
            </DialogDescription>
          </DialogHeader>

          {!isEditingAddress ? (
            <>
              {/* Display current or manual address */}
              {useManualAddressOnly ? (
                // Show manual address view
                <div className="space-y-3">
                  <div className="border-l-4 border-green-500 bg-green-50 p-3 rounded">
                    <div className="flex items-start gap-2">
                      <MessageSquare size={18} className="text-green-600 mt-1" />
                      <div>
                        <p className="text-xs text-green-600 font-semibold mb-1">📝 Manual Address:</p>
                        <p className="text-sm text-gray-700">{manualAddressDetails.formatted_address || "No address entered"}</p>
                      </div>
                    </div>
                  </div>

                  {manualAddressDetails.formatted_address && (
                    <div className="border p-3 rounded text-sm bg-white">
                      <h4 className="font-semibold mb-2 flex items-center gap-1">
                        <Map size={16} /> Address Components:
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">City:</span>
                          <span className="ml-1 font-medium">{manualAddressDetails.city || "N/A"}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">State:</span>
                          <span className="ml-1 font-medium">{manualAddressDetails.state || "N/A"}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Pincode:</span>
                          <span className="ml-1 font-medium">{manualAddressDetails.pincode || "N/A"}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Country:</span>
                          <span className="ml-1 font-medium">{manualAddressDetails.country || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Show current location address
                coords && (
                  <div className="space-y-3">
                    <div className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded">
                      <div className="flex items-start gap-2">
                        <MessageSquare size={18} className="text-blue-600 mt-1" />
                        <div>
                          <p className="text-xs text-blue-600 font-semibold mb-1">📍 Current Location Address:</p>
                          <p className="text-sm text-gray-700">{address.formatted_address || "Fetching address..."}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border p-3 rounded text-sm bg-white">
                      <h4 className="font-semibold mb-2 flex items-center gap-1">
                        <Map size={16} /> Address Components:
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">City:</span>
                          <span className="ml-1 font-medium">{address.city || "Loading..."}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">State:</span>
                          <span className="ml-1 font-medium">{address.state || "Loading..."}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Pincode:</span>
                          <span className="ml-1 font-medium">{address.pincode || "Loading..."}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Country:</span>
                          <span className="ml-1 font-medium">{address.country || "Loading..."}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}

              {/* Edit Button - Always visible */}
              <div className="mt-4">
                <button
                  onClick={handleEditAddress}
                  className="w-full border-2 border-dashed border-blue-300 p-3 rounded-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                >
                  <Edit size={18} className="text-blue-600" />
                  <span className="text-blue-600 font-medium">
                    {useManualAddressOnly ? "Edit Manual Address" : "Enter Different Address"}
                  </span>
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Click to {useManualAddressOnly ? "modify" : "override"} the current address with your own
                </p>
              </div>
            </>
          ) : (
            // Edit Address Mode
            <div className="space-y-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
                <div className="flex items-start gap-2">
                  <Edit size={18} className="text-yellow-600 mt-1" />
                  <div>
                    <p className="text-sm text-yellow-700 font-medium">Editing Manual Address</p>
                    <p className="text-xs text-yellow-600">Current location address will be replaced with your manual address</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1 font-medium">
                  Enter Complete Address:
                </label>
                <textarea
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  placeholder="Enter full address (e.g., House No, Street, City, State, Pincode, Country)"
                  className="w-full p-3 border rounded text-sm"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the complete address. This will be saved as your location.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveManualAddress}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
                  disabled={!manualAddress.trim()}
                >
                  Save Address
                </button>
              </div>
            </div>
          )}

          {/* Take Location Button - Only show when not editing */}
          {!isEditingAddress && (
            <button
              className="btn btn-primary mt-4 w-full"
              onClick={handleTakeLocation}
              disabled={!coords && !useManualAddressOnly}
            >
              {useManualAddressOnly ? "Save Manual Address" : "Take Location"}
            </button>
          )}

          {locationTaken && (
            <div className="alert alert-success mt-3 flex items-center gap-2">
              <CheckCircle size={18} />
              Location saved successfully
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Location;