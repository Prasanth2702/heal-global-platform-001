import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock, ChevronRight } from "lucide-react";

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
  address?:string;
  city?:string;
  state?:string;
  country_code?:string;
  pincode?:string;
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
  onToggleExpand: (doctorId: string) => void;
  onViewProfile: (doctorId: string) => void;
  onSelectDay: (day: number) => void;
  onSelectSlot: (slot: any) => void;
  onBookNow: (slot: any, selectedDay: number, doctor: Doctor) => void;
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
  selectedSlot,
  selectedDay,
  onToggleExpand,
  onViewProfile,
  onSelectDay,
  onSelectSlot,
  onBookNow,
  formatDayLabel,
  formatDateNumber,
  formatTimePretty,
}) => {
  return (
    <div className="col-12 col-md-8 col-lg-4 mb-3">
      <Card className="hover:shadow-medium transition h-100">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <img
              src={doctor.image || "https://via.placeholder.com/150"}
              alt={doctor.name}
              className="w-16 h-16 rounded-full object-cover flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <h4 className="text-base font-semibold truncate">{doctor.name}</h4>
                  <p className="text-xs text-muted-foreground truncate">{doctor.specialty}</p>
                  <p className="text-xs text-muted-foreground truncate">{doctor.city}</p>

                </div>

                <div className="flex items-center flex-shrink-0">
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  <span className="ml-0.5 text-xs">{doctor.rating}</span>
                </div>
              </div>

             <div className="text-xs text-muted-foreground mt-1 truncate">
  <MapPin className="h-3 w-3 inline mr-0.5" />
  {doctor.address || 
    `${doctor.city || 'NA'} ${doctor.state || 'Na'} ${doctor.country_code || 'Na'}`}
</div>

              <div className="flex justify-between items-center mt-2">
                {/* <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  <Clock className="h-2.5 w-2.5 mr-0.5" />
                  <span className="truncate max-w-[60px]">{doctor.availability}</span>
                </Badge> */}

                <span className="text-green-600 font-medium text-xs">
                  {doctor.consultationFee && doctor.consultationFee > 0 ? (
                    <>₹{doctor.consultationFee}</>
                  ) : (
                    <span className="text-blue-600 text-[10px]">Consult</span>
                  )}
                </span>
              </div>

              <div className="flex gap-1.5 mt-3">
                {/* <Button
                  variant="default"
                  size="sm"
                  className="h-7 text-xs px-2"
                  onClick={() => onToggleExpand(doctor.user_id)}
                >
                  Availability
                </Button> */}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs px-2"
                  onClick={() => onViewProfile(doctor.id)}
                >
                  View Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Expanded Availability Area */}
          {expandedDoctorId === doctor.user_id && (
            <div className="mt-4 p-3 rounded-lg border shadow-sm bg-white">
              <h4 className="font-semibold mb-2 text-sm">Available Slots</h4>

              {timeSlots.length === 0 ? (
                <p className="text-red-600 text-xs font-medium">Doctor is not available.</p>
              ) : (
                <>
                  <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                    {Array.from({ length: 7 }).map((_, index) => {
                      const date = new Date();
                      date.setDate(date.getDate() + index);

                      const label = index === 0 ? "Today" : index === 1 ? "Tom" : date.toLocaleDateString("en-US", { weekday: "short" });
                      const dayNumber = date.getDate();
                      const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });

                      const slotsForDay = timeSlots.filter((s) => s.day_of_week === dayOfWeek);
                      const dateISO = date.toISOString().split("T")[0];
                      const bookingsForDay = bookings.filter((b) => {
                        const bookingISO = new Date(b.appointment_date).toISOString().split("T")[0];
                        return bookingISO === dateISO;
                      });

                      const bookedSlotIds = new Set(bookingsForDay.map((b) => b.time_slot_id));
                      const availableSlotsCount = slotsForDay.filter(
                        (slot) => !bookedSlotIds.has(slot.id)
                      ).length;

                      const isActiveDay = selectedDay === index;

                      return (
                        <div key={index} className="min-w-[65px]">
                          <button
                            onClick={() => {
                              onSelectDay(index);
                              onSelectSlot(null);
                            }}
                            className={`w-full px-2 py-1.5 rounded-lg text-center transition text-xs
                              ${isActiveDay ? "bg-blue-600 text-white" : "bg-white text-gray-700"}
                              border ${isActiveDay ? "border-blue-600" : "border-gray-200"}`}
                          >
                            <div className="text-[10px] font-medium">{label}</div>
                            <div className="text-sm font-bold mt-0.5">{dayNumber}</div>
                            <div className={`text-[8px] ${isActiveDay ? "text-white" : "text-gray-400"}`}>
                              {availableSlotsCount}
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-3">
                    {(() => {
                      const selectedDate = new Date();
                      selectedDate.setDate(selectedDate.getDate() + selectedDay);
                      const fullDayName = selectedDate.toLocaleDateString("en-US", { weekday: "long" });

                      const slotsForDay = timeSlots.filter((s) => s.day_of_week === fullDayName);

                      if (slotsForDay.length === 0) {
                        return <p className="text-gray-500 text-xs">No slots available.</p>;
                      }

                      const selectedDateStr = selectedDate.toISOString().split("T")[0];
                      const todaysBookings = bookings.filter((b) => {
                        const bookingISO = new Date(b.appointment_date).toISOString().split("T")[0];
                        return bookingISO === selectedDateStr;
                      });

                      const availableSlots = slotsForDay.filter(
                        (slot) => !todaysBookings.some((b) => b.time_slot_id === slot.id)
                      );

                      return (
                        <div className="grid grid-cols-2 gap-2">
                          {availableSlots.slice(0, 4).map((slot) => {
                            const isSelected = selectedSlot?.id === slot.id;
                            return (
                              <div
                                key={slot.id}
                                onClick={() => onSelectSlot(slot)}
                                className={`
                                  p-1.5 rounded-md cursor-pointer text-xs transition text-center
                                  ${slot.slot_type === "clinic" ? "bg-green-50" : "bg-blue-50"}
                                  ${isSelected ? "border-2 border-green-600" : "border border-gray-200"}
                                `}
                              >
                                <div className="font-medium text-[10px]">
                                  {formatTimePretty(slot.start_time)}
                                </div>
                                <div className="text-[8px] text-green-600 mt-0.5">Available</div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>

                  {!selectedSlot && (
                    <p className="text-gray-500 text-[10px] mt-2">Select a slot to book</p>
                  )}

                  <Button
                    variant="default"
                    size="sm"
                    className="mt-2 w-full text-xs h-7 bg-blue-600 hover:bg-blue-700"
                    disabled={!selectedSlot}
                    onClick={() => onBookNow(selectedSlot!, selectedDay, doctor)}
                  >
                    Book Now
                  </Button>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorCard;