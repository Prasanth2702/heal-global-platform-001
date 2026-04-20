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
    {/* Doctor Image - Centered */}
    <div className="flex justify-center mb-4">
      <div className="avatar-wrapper">
        {doctor.image ? (
          <img 
            src={doctor.image}
            alt={doctor.name}
            loading="lazy"
            className="rounded-circle border border-3 border-primary p-1"
            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                `https://ui-avatars.com/api/?name=${doctor.name}`;
            }}
          />
        ) : (
          <div 
            className="rounded-circle border border-3 border-primary d-flex align-items-center justify-content-center text-white fw-bold"
            style={{ width: '100px', height: '100px', backgroundColor: '#6c757d' }}
          >
            {doctor.name?.split(" ")
              .map(n => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
        )}
      </div>
    </div>

    {/* Doctor Info Section */}
    <div className="text-center">
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
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

    {/* Address Section (unchanged layout) */}
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
      <Button
        variant="outline"
        size="sm"
        className="h-9 flex items-center justify-center bg-green-500 text-white text-xs font-medium border-gray-200 hover:bg-gray-50 rounded-lg"
        onClick={() => onViewProfile(doctor.id)}
      >
        View Profile
      </Button>
    </div>

    {/* Expanded Availability Area (unchanged) */}
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
};

export default DoctorCard;