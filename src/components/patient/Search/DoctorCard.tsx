import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock, ChevronRight, Calendar } from "lucide-react";

export interface Doctor {
  id: string;
  user_id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  location?: string;
  distance?: string;
  consultationFee: number;
  availability: string;
  hospital?: string;
  image?: string;
  description?: string;
    city?: string;
  state?: string;
  address?: string;
  country_code?: string;
  pincode?: number;
    about_yourself?: string;
  medical_school?: string;

}

export interface BookingInfo {
  slot_id: string;
  start_time: string;
  end_time: string;
  booking_date: string;
  doctor_id: string;
  doctor_name: string;
  department_id?: string;
}

export interface TimeSlot {
  id: string;
  doctor_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  slot_type: string;
  is_available: boolean;
}

export interface Department {
  id: string;
  facility_id: string;
  name: string;
  description: string;
  head_doctor_id?: string;
  services?: any;
  equipment?: any;
  bed_capacity?: number;
  available_beds?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  price_per_day?: number;
  has_variable_pricing?: boolean;
}

export interface Facility {
  id: string;
  facility_name: string;
  facility_type: string;
  license_number: string;
  city: string;
  state: string;
  pincode: number;
  total_beds: number;
  rating: number;
  total_reviews: number;
  is_verified: boolean;
  established_year: number;
  website: string;
  insurance_partners: string;
  about_facility: string;
  contact_number?: string;
  email?: string;
}

interface DoctorCardProps {
  doctor: Doctor;
  user: any;
  expandedDoctorId: string | null;
  timeSlots: any[];
  bookings: any[];
  selectedSlot: any;
  selectedDay: number;
   selectedDate: string;
  onToggleExpand: (doctorId: string) => void;
  onViewProfile: (doctorId: string) => void;
  onSelectDay: (day: number) => void;
  onSelectSlot: (slot: any) => void;
  onBookNow: (slot: any, selectedDay: number, doctor: Doctor) => void;
  onDateChange?: (doctorId: string, date: string) => void; // Add this optional
  formatDayLabel: (date: Date, index: number) => string;
  formatDateNumber: (date: Date) => number;
  formatTimePretty: (timeStr: string) => string;
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  user,
  expandedDoctorId,
  timeSlots,
  bookings,
  selectedDate, 
  selectedSlot,
  selectedDay,
  onToggleExpand,
  onViewProfile,
  onSelectDay,
  onSelectSlot,
  onBookNow,
  onDateChange,
  formatDayLabel,
  formatDateNumber,
  formatTimePretty,
}) => {
  return (
  <div className="col-12 col-md-6 col-lg-4 mb-4">
    <Card className="hover:shadow-xl transition-all duration-300 h-full border border-gray-100 rounded-xl overflow-hidden">
      <CardContent className="p-5">
        {/* Doctor Header */}
        <div className="flex gap-4">
          <img
            src={doctor.image || "https://via.placeholder.com/150"}
            alt={doctor.name}
            className="w-20 h-20 rounded-full object-cover flex-shrink-0 border-2 border-blue-100"
          />

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0">
                <h4 className="text-lg font-semibold text-gray-900 truncate">{doctor.name}</h4>
                <p className="text-sm text-blue-600 font-medium truncate">{doctor.specialty}</p>
              </div>

              <div className="flex items-center flex-shrink-0 bg-green-50 px-2 py-1 rounded-full">
                <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                <span className="ml-1 text-sm font-semibold text-gray-700">{doctor.rating}</span>
                <span className="text-xs text-gray-500 ml-0.5">/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">Address</p>
              <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                {[
                  doctor.address,
                  doctor.city,
                  doctor.state,
                  doctor.country_code,
                  doctor.pincode
                ]
                  .filter(Boolean)
                  .join(", ")
                }
              </p>
            </div>
          </div>
        </div>

        {/* Consultation Fee */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-xs text-gray-500">Consultation</span>
          </div>
          <span className="text-green-600 font-bold text-base">
            {doctor.consultationFee && doctor.consultationFee > 0 ? (
              <>₹{doctor.consultationFee}</>
            ) : (
              <span className="text-blue-600 text-sm font-medium">Free Consult</span>
            )}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-2 mt-4 pt-2">
          {/* <Button
            variant="default"
            size="sm"
            className="flex-1 h-9 text-xs font-medium bg-blue-600 hover:bg-blue-700 rounded-lg"
            onClick={() => onToggleExpand(doctor.user_id)}
          >
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            Check Availability
          </Button> */}
          <Button
            variant="outline"
            size="sm"
            className="h-9 flex items-center justify-center bg-green-500 text-white text-xs font-medium border-gray-200 hover:bg-gray-50 rounded-lg"
            onClick={() => onViewProfile(doctor.id)}
          >
            View Profile
          </Button>
        </div>

        {/* Expanded Availability Area */}
        {expandedDoctorId === doctor.user_id && (
          <div className="mt-4 p-3 rounded-lg bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-sm">
            <h4 className="font-semibold mb-3 text-sm flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
              Available Slots
            </h4>
            
            <p className="text-xs text-gray-600 mb-3">
              Showing for: <span className="font-medium">{new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric'
              })}</span>
            </p>

            {timeSlots.length === 0 ? (
              <div className="text-center py-4">
                <Clock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-orange-600 text-xs font-medium">
                  No slots available on this date
                </p>
              </div>
            ) : (
              <>
                {/* Day selector */}
                <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1 mb-3">
                  {Array.from({ length: 7 }).map((_, index) => {
                    const date = new Date();
                    date.setDate(date.getDate() + index);
                    const dateStr = date.toISOString().split("T")[0];
                    const isSelectedDate = dateStr === selectedDate;
                    
                    return (
                      <div key={index} className="min-w-[60px]">
                        <button
                          onClick={() => {
                            onSelectDay(index);
                            onSelectSlot(null);
                          }}
                          className={`w-full px-2 py-2 rounded-lg text-center transition-all duration-200 text-xs
                            ${isSelectedDate 
                              ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                              : "bg-white text-gray-700 hover:bg-gray-50"
                            }
                            border ${isSelectedDate ? "border-blue-600" : "border-gray-200"}`}
                        >
                          <div className="text-[11px] font-medium">
                            {index === 0 ? "Today" : index === 1 ? "Tomorrow" : formatDayLabel(date, index)}
                          </div>
                          <div className="text-base font-bold mt-0.5">{formatDateNumber(date)}</div>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Slots grid */}
                <div className="mt-3">
                  {timeSlots.length === 0 ? (
                    <p className="text-gray-500 text-xs text-center py-3 bg-white rounded-lg">
                      No slots available for selected date
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((slot) => {
                        const isSelected = selectedSlot?.id === slot.id;
                        const isBooked = bookings.some(
                          (b) => b.time_slot_id === slot.id
                        );
                        
                        if (isBooked) return null;
                        
                        return (
                          <div
                            key={slot.id}
                            onClick={() => !isBooked && onSelectSlot(slot)}
                            className={`
                              p-2 rounded-lg cursor-pointer text-center transition-all duration-200
                              ${slot.slot_type === "clinic" 
                                ? "bg-gradient-to-br from-green-50 to-white hover:from-green-100" 
                                : "bg-gradient-to-br from-blue-50 to-white hover:from-blue-100"
                              }
                              ${isSelected ? "ring-2 ring-blue-500 shadow-md" : "border border-gray-200 hover:border-blue-300"}
                            `}
                          >
                            <div className="font-medium text-xs">
                              {formatTimePretty(slot.start_time)} - {formatTimePretty(slot.end_time)}
                            </div>
                            <div className="text-[10px] text-green-600 mt-1 font-medium">
                              Available
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {!selectedSlot && timeSlots.length > 0 && (
                  <p className="text-center text-gray-500 text-xs mt-3 py-1 bg-white rounded-lg">
                    Select a time slot to book your appointment
                  </p>
                )}

                <Button
                  variant="default"
                  size="sm"
                  className="mt-3 w-full text-xs h-9 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-sm"
                  disabled={!selectedSlot}
                  onClick={() => onBookNow(selectedSlot!, selectedDay, doctor)}
                >
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  Book Appointment
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  </div>
);
//   return (
//     <div className="col-12 col-md-8 col-lg-4 mb-3">
//       <Card className="hover:shadow-medium transition h-100">
//         <CardContent className="p-4">
//           <div className="flex gap-3">
//             <img
//               src={doctor.image || "https://via.placeholder.com/150"}
//               alt={doctor.name}
//               className="w-16 h-16 rounded-full object-cover flex-shrink-0"
//             />

//             <div className="flex-1 min-w-0">
//               <div className="flex justify-between items-start gap-2">
//                 <div className="min-w-0">
//                   <h4 className="text-base font-semibold truncate">{doctor.name}</h4>
//                   <p className="text-xs text-muted-foreground truncate">{doctor.specialty}</p>
//                   {/* <p className="text-xs text-muted-foreground truncate">{doctor.city}</p> */}
//                 </div>
               

//                 <div className="flex items-center flex-shrink-0">
//                   <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
//                   <span className="ml-0.5 text-xs">{doctor.rating}</span>
//                 </div>
//               </div>

//               {/* <div className="text-xs text-muted-foreground mt-1 truncate">
//                 <MapPin className="h-3 w-3 inline mr-0.5" />
//                 {doctor.location || "Location not provided"}
//               </div> */}

//                <div className="min-w-0">
//                   {/* <h4 className="text-base font-semibold truncate">Address</h4>
//                   <p className="text-xs text-muted-foreground truncate">{doctor.address}{doctor.city}{doctor.state}{doctor.country_code}{doctor.pincode}</p> */}
//                <h4 className="text-sm font-semibold">Address</h4>
// <p className="text-xs text-muted-foreground leading-relaxed">
//   {[
//     doctor.address,
//     doctor.city,
//     doctor.state,
//     doctor.country_code,
//     doctor.pincode
//   ]
//     .filter(Boolean)
//     .join(", ")
//   }
// </p>
//                 </div>

//               <div className="flex justify-between items-center mt-2">
//                 {/* <Badge variant="outline" className="text-[10px] px-1.5 py-0">
//                   <Clock className="h-2.5 w-2.5 mr-0.5" />
//                   <span className="truncate max-w-[60px]">{doctor.availability}</span>
//                 </Badge> */}

//                 <span className="text-green-600 font-medium text-xs">
//                   {doctor.consultationFee && doctor.consultationFee > 0 ? (
//                     <>₹{doctor.consultationFee}</>
//                   ) : (
//                     <span className="text-blue-600 text-[10px]">Consult</span>
//                   )}
//                 </span>
//               </div>

//               <div className="flex gap-1.5 mt-3">
//                 {/* <Button
//                   variant="default"
//                   size="sm"
//                   className="h-7 text-xs px-2"
//                   onClick={() => onToggleExpand(doctor.user_id)}
//                 >
//                   Availability
//                 </Button> */}
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="h-7 text-xs px-2"
//                   onClick={() => onViewProfile(doctor.id)}
//                 >
//                   View Profile
//                 </Button>
//               </div>
//             </div>
//           </div>

//           {/* Expanded Availability Area */}
//           {/* {expandedDoctorId === doctor.user_id && (
//             <div className="mt-4 p-3 rounded-lg border shadow-sm bg-white">
//               <h4 className="font-semibold mb-2 text-sm">Available Slots</h4>

//               {timeSlots.length === 0 ? (
//                 <p className="text-red-600 text-xs font-medium">Doctor is not available.</p>
//               ) : (
//                 <>
//                   <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
//                     {Array.from({ length: 7 }).map((_, index) => {
//                       const date = new Date();
//                       date.setDate(date.getDate() + index);

//                       const label = index === 0 ? "Today" : index === 1 ? "Tom" : date.toLocaleDateString("en-US", { weekday: "short" });
//                       const dayNumber = date.getDate();
//                       const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });

//                       const slotsForDay = timeSlots.filter((s) => s.day_of_week === dayOfWeek);
//                       const dateISO = date.toISOString().split("T")[0];
//                       // const bookingsForDay = bookings.filter((b) => {
//                       //   const bookingISO = new Date(b.appointment_date).toISOString().split("T")[0];
//                       //   return bookingISO === dateISO;
//                       // });
// const bookingsForDay = bookings.filter((b) => {
//   const bookingDate = new Date(b.appointment_date);
//   const bookingDay = bookingDate.toLocaleDateString("en-US", { weekday: "long" });
//   const currentDay = dayOfWeek;

//   return bookingDay === currentDay;
// });
//                       // const bookedSlotIds = new Set(bookingsForDay.map((b) => b.time_slot_id));
//                       const availableSlotsCount = slotsForDay.filter(
//                         (slot) => !bookedSlotIds.has(slot.id)
//                       ).length;
//                       const bookedSlotIds = new Set(
//   bookingsForDay.map((b) => b.time_slot_id)
// );
// const getDayOfWeek = (dateStr: string) => {
//   const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
//   const d = new Date(dateStr);
//   return days[d.getDay()];
// };
//                       const isActiveDay = selectedDay === index;

//                       return (
//                         <div key={index} className="min-w-[65px]">
//                           <button
//                             onClick={() => {
//                               onSelectDay(index);
//                               onSelectSlot(null);
//                             }}
//                             className={`w-full px-2 py-1.5 rounded-lg text-center transition text-xs
//                               ${isActiveDay ? "bg-blue-600 text-white" : "bg-white text-gray-700"}
//                               border ${isActiveDay ? "border-blue-600" : "border-gray-200"}`}
//                           >
//                             <div className="text-[10px] font-medium">{label}</div>
//                             <div className="text-sm font-bold mt-0.5">{dayNumber}</div>
//                             <div className={`text-[8px] ${isActiveDay ? "text-white" : "text-gray-400"}`}>
//                               {availableSlotsCount}
//                             </div>
//                           </button>
//                         </div>
//                       );
//                     })}
//                   </div>

//                   <div className="mt-3">
//                     {(() => {
//                       const selectedDate = new Date();
//                       selectedDate.setDate(selectedDate.getDate() + selectedDay);
//                       // const fullDayName = selectedDate.toLocaleDateString("en-US", { weekday: "long" });
// const getDayOfWeek = (dateStr: string) => {
//   const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
//   const d = new Date(dateStr);
//   return days[d.getDay()];
// };
//                       // const slotsForDay = timeSlots.filter((s) => s.day_of_week === fullDayName);
// const fullDayName = selectedDate.toLocaleDateString("en-US", { weekday: "long" });

// const slotsForDay = timeSlots.filter(
//   (s) => s.day_of_week?.toLowerCase() === fullDayName.toLowerCase()
// );
//                       if (slotsForDay.length === 0) {
//                         return <p className="text-gray-500 text-xs">No slots available.</p>;
//                       }

//                       const selectedDateStr = selectedDate.toISOString().split("T")[0];
//                       // const todaysBookings = bookings.filter((b) => {
//                       //   const bookingISO = new Date(b.appointment_date).toISOString().split("T")[0];
//                       //   return bookingISO === selectedDateStr;
//                       // });
// const todaysBookings = bookings.filter((b) => {
//   const bookingDate = new Date(b.appointment_date);
//   const bookingDay = bookingDate.toLocaleDateString("en-US", { weekday: "long" });
//   const selectedDayName = fullDayName;

//   return bookingDay === selectedDayName;
// });
// const formatDate = (date: Date) => {
//   return date.toISOString().split("T")[0];
// };
//                       const availableSlots = slotsForDay.filter(
//                         (slot) => !todaysBookings.some((b) => b.time_slot_id === slot.id)
//                       );

//                       return (
//                         <div className="grid grid-cols-2 gap-2">
//                           {availableSlots.slice(0, 4).map((slot) => {
//                             const isSelected = selectedSlot?.id === slot.id;
//                             return (
//                               <div
//                                 key={slot.id}
//                                 onClick={() => onSelectSlot(slot)}
//                                 className={`
//                                   p-1.5 rounded-md cursor-pointer text-xs transition text-center
//                                   ${slot.slot_type === "clinic" ? "bg-green-50" : "bg-blue-50"}
//                                   ${isSelected ? "border-2 border-green-600" : "border border-gray-200"}
//                                 `}
//                               >
//                                 <div className="font-medium text-[10px]">
//                                   {formatTimePretty(slot.start_time)}
//                                 </div>
//                                 <div className="text-[8px] text-green-600 mt-0.5">Available</div>
//                               </div>
//                             );
//                           })}
//                         </div>
//                       );
//                     })()}
//                   </div>

//                   {!selectedSlot && (
//                     <p className="text-gray-500 text-[10px] mt-2">Select a slot to book</p>
//                   )}

//                   <Button
//                     variant="default"
//                     size="sm"
//                     className="mt-2 w-full text-xs h-7 bg-blue-600 hover:bg-blue-700"
//                     disabled={!selectedSlot}
//                     onClick={() => onBookNow(selectedSlot!, selectedDay, doctor)}
//                   >
//                     Book Now
//                   </Button>
//                 </>
//               )}
//             </div>
//           )} */}
//        {expandedDoctorId === doctor.user_id && (
//   <div className="mt-4 p-3 rounded-lg border shadow-sm bg-white">
//     <h4 className="font-semibold mb-2 text-sm">Available Slots</h4>
    
//     {/* Show selected date */}
//     <p className="text-xs text-gray-500 mb-2">
//       Showing availability for: {new Date(selectedDate).toLocaleDateString('en-US', {
//         weekday: 'long',
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       })}
//     </p>

//     {timeSlots.length === 0 ? (
//       <p className="text-orange-600 text-xs font-medium">
//         No slots available on this date.
//       </p>
//     ) : (
//       <>
//         {/* Day selector */}
//         <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
//           {Array.from({ length: 7 }).map((_, index) => {
//             const date = new Date();
//             date.setDate(date.getDate() + index);
//             const dateStr = date.toISOString().split("T")[0];
//             const isSelectedDate = dateStr === selectedDate;
            
//             return (
//               <div key={index} className="min-w-[65px]">
//                 {/* <button
//                   onClick={() => {
//                     onSelectDay(index);
//                     onSelectSlot(null);
//                     // Call onDateChange if provided
//                     if (onDateChange) {
//                       onDateChange(doctor.id, dateStr);
//                     }
//                   }}
//                   className={`w-full px-2 py-1.5 rounded-lg text-center transition text-xs
//                     ${isSelectedDate ? "bg-blue-600 text-white" : "bg-white text-gray-700"}
//                     border ${isSelectedDate ? "border-blue-600" : "border-gray-200"}`}
//                 >
//                   <div className="text-[10px] font-medium">
//                     {index === 0 ? "Today" : index === 1 ? "Tomorrow" : formatDayLabel(date, index)}
//                   </div>
//                   <div className="text-sm font-bold mt-0.5">{formatDateNumber(date)}</div>
//                 </button> */}
//                 <button
//   onClick={() => {
//     onSelectDay(index);
//     onSelectSlot(null);
//     // No onDateChange call needed
//   }}
//   className={`w-full px-2 py-1.5 rounded-lg text-center transition text-xs
//     ${isSelectedDate ? "bg-blue-600 text-white" : "bg-white text-gray-700"}
//     border ${isSelectedDate ? "border-blue-600" : "border-gray-200"}`}
// >
//   <div className="text-[10px] font-medium">
//     {index === 0 ? "Today" : index === 1 ? "Tomorrow" : formatDayLabel(date, index)}
//   </div>
//   <div className="text-sm font-bold mt-0.5">{formatDateNumber(date)}</div>
// </button>
//               </div>
//             );
//           })}
//         </div>

//         {/* Slots display */}
//         <div className="mt-3">
//           {timeSlots.length === 0 ? (
//             <p className="text-gray-500 text-xs text-center py-2">
//               No slots available for selected date
//             </p>
//           ) : (
//             <div className="grid grid-cols-2 gap-2">
//               {timeSlots.map((slot) => {
//                 const isSelected = selectedSlot?.id === slot.id;
//                 // Check if this slot is already booked for this date
//                 const isBooked = bookings.some(
//                   (b) => b.time_slot_id === slot.id
//                 );
                
//                 if (isBooked) return null; // Don't show booked slots
                
//                 return (
//                   <div
//                     key={slot.id}
//                     onClick={() => !isBooked && onSelectSlot(slot)}
//                     className={`
//                       p-1.5 rounded-md cursor-pointer text-xs transition text-center
//                       ${slot.slot_type === "clinic" ? "bg-green-50" : "bg-blue-50"}
//                       ${isSelected ? "border-2 border-green-600" : "border border-gray-200"}
//                       ${isBooked ? "opacity-50 cursor-not-allowed bg-gray-100" : ""}
//                     `}
//                   >
//                     <div className="font-medium text-[10px]">
//                       {formatTimePretty(slot.start_time)} - {formatTimePretty(slot.end_time)}
//                     </div>
//                     <div className="text-[8px] text-green-600 mt-0.5">
//                       {isBooked ? "Booked" : "Available"}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         {!selectedSlot && timeSlots.length > 0 && (
//           <p className="text-gray-500 text-[10px] mt-2 text-center">
//             Select a time slot to book
//           </p>
//         )}

//         <Button
//           variant="default"
//           size="sm"
//           className="mt-2 w-full text-xs h-7 bg-blue-600 hover:bg-blue-700"
//           disabled={!selectedSlot}
//           onClick={() => onBookNow(selectedSlot!, selectedDay, doctor)}
//         >
//           Book Appointment
//         </Button>
//       </>
//     )}
//   </div>
// )}

//         </CardContent>
//       </Card>
//     </div>
//   );
};

export default DoctorCard;