import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Building2, ChevronRight } from "lucide-react";

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

interface HospitalCardProps {
  facility: Facility;
  departments: Department[];
  user: any;
  expandedTimeSlotId: string | null;
  timeSlots: any[];
  bookings: any[];
  selectedSlot: any;
  selectedDay: number;
  selectedDepartmentFilter?: string; 
  onToggleExpandDepartment: (dept: Department) => void;
  onViewHospitalDetails: (facilityId: string) => void;
  onViewHospitalDepartmentDetails: (facilityId: string) => void;
  onViewDepartment: (dept: Department) => void;
  onSelectDay: (day: number) => void;
  onSelectSlot: (slot: any) => void;
  onDepartmentBookNow: (slot: any, selectedDay: number, dept: Department) => void;
  // onLogin: (id: string, type: 'doctor' | 'hospital' | 'department') => void;
  formatDayLabel: (date: Date, index: number) => string;
  formatDateNumber: (date: Date) => number;
  formatTimePretty: (timeStr: string) => string;
  
}

const HospitalCard: React.FC<HospitalCardProps> = ({
  facility,
  departments,
  user,
  expandedTimeSlotId,
  timeSlots,
  bookings,
  selectedSlot,
  selectedDay,
  selectedDepartmentFilter = "all",
  onToggleExpandDepartment,
  onViewHospitalDetails,
  onViewHospitalDepartmentDetails,
  onViewDepartment,
  onSelectDay,
  onSelectSlot,
  onDepartmentBookNow,
  // onLogin,
  formatDayLabel,
  formatDateNumber,
  formatTimePretty,
}) => {
  // const facilityDepts = departments.filter(dept => dept.facility_id === facility.id);
   const facilityDepts = departments.filter(dept => dept.facility_id === facility.id);
  
  // Apply department filter if not "all"
  const filteredDepts = selectedDepartmentFilter !== "all" 
    ? facilityDepts.filter(dept => 
        dept.name.toLowerCase() === selectedDepartmentFilter.toLowerCase() ||
        dept.name.toLowerCase().includes(selectedDepartmentFilter.toLowerCase())
      )
    : facilityDepts;

  const [showAllDepartments, setShowAllDepartments] = useState(false);
  
  // Determine which departments to show
  const displayedDepts = showAllDepartments ? filteredDepts : filteredDepts.slice(0, 3);
  const hasMoreDepartments = filteredDepts.length > 3;

  return (
<>
{facilityDepts.length > 0 && (
    <div className="col-12 col-md-8 col-lg-4 mb-3">
         <Card className="hover:shadow-medium transition h-100">
      <div className="bg-green-600 rounded-t-xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">{facility.facility_name}</h2>
            <span className="text-green-100 text-sm font-medium">{facility.facility_type}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-white">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold">{facility.rating}</span>
              <span className="text-xs text-green-100">({facility.total_reviews})</span>
            </div>
            {facility.is_verified && (
              <Badge className="bg-green-500 text-white">Verified</Badge>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-100 mt-1">
            <MapPin className="h-4 w-4" />
            <span>{facility.city}, {facility.state} - {facility.pincode}</span>
          </div>
          <div className="flex items-center gap-2">
            {/* {!user ? (
              <Button
                variant="default"
                size="sm"
                onClick={() => onLogin(facility.id, 'hospital')}
              >
                Login Hospital
              </Button>
            ) : ( */}
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewHospitalDetails(facility.id)}
                >
                  View Hospital
                </Button>
              </>
            {/* )} */}
          </div>
        </div>
      </div>
      
      <CardContent className="p-6 bg-gray-50 rounded-b-xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-gray-600" />
            <span className="font-semibold">Hospitals Departments</span>
          </div>
          {/* {!user ? (
            <Button
              variant="default"
              size="sm"
              onClick={() => onLogin(facility.id, 'hospital')}
            >
              Login Beds
            </Button>
          ) : ( */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewHospitalDepartmentDetails(facility.id)}
            >
              View Details
            </Button>
          {/* )} */}
        </div>

        {/* Departments Section */}
        <div className="mt-4 space-y-4">
          <h3 className="text-lg font-bold text-green-700">Departments</h3>
          {facilityDepts.length === 0 ? (
            <p className="text-gray-500">No departments found for this facility.</p>
          ) : (
           displayedDepts.map((dept) => (
              <div key={dept.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-md text-green-600 mb-1">
                      {dept.name}
                    </h4>
                  </div>
                  <div className="text-right">
                    {dept.price_per_day && dept.price_per_day > 0 ? (
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        ₹{dept.price_per_day}/day
                      </div>
                    ) : (
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Contact for Price
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                  <span>
                    <strong>Status:</strong>{" "}
                    {dept.is_active ? (
                      <span className="text-green-600 font-semibold">Active</span>
                    ) : (
                      <span className="text-red-500 font-semibold">Inactive</span>
                    )}
                  </span>
                </div>
                
                <div className="flex gap-2 mt-3">
                  {/* {!user ? (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onLogin(dept.id, 'department')}
                    >
                      Login Departments
                    </Button>
                  ) : ( */}
                    <>
                      {/* <Button
                        variant="default"
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => onToggleExpandDepartment(dept)}
                      >
                        View Availability
                      </Button> */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDepartment(dept)}
                      >
                        View Departments
                      </Button>
                    </>
                  {/* )} */}
                </div>

                {expandedTimeSlotId === dept.id && (
                  <div className="mt-4 p-4 rounded-xl border shadow bg-white">
                    <h3 className="font-semibold mb-3 text-lg">Available Slots</h3>

                    {timeSlots.length === 0 ? (
                      <p className="text-red-600 font-medium">
                        Department {dept.name} is not available.
                      </p>
                    ) : (
                      <>
                        <div className="flex gap-3 overflow-x-auto py-2">
                          {Array.from({ length: 14 }).map((_, index) => {
                            const date = new Date();
                            date.setDate(date.getDate() + index);

                            const label = formatDayLabel(date, index);
                            const dayNumber = formatDateNumber(date);
                            const dayOfWeek = date.toLocaleDateString("en-US", {
                              weekday: "long",
                            });

                            const slotsForDay = timeSlots.filter(
                              (s) => s.day_of_week === dayOfWeek
                            );

                            const dateISO = date.toISOString().split("T")[0];
                            const bookingsForDay = bookings.filter((b) => {
                              const bookingISO = new Date(b.appointment_date)
                                .toISOString()
                                .split("T")[0];
                              return bookingISO === dateISO;
                            });

                            const bookedSlotIds = new Set(
                              bookingsForDay.map((b) => b.time_slot_id)
                            );

                            const availableSlotsCount = slotsForDay.filter(
                              (slot) => !bookedSlotIds.has(slot.id)
                            ).length;

                            const isActiveDay = selectedDay === index;

                            return (
                              <div key={index} className="min-w-[110px]">
                                <button
                                  onClick={() => {
                                    onSelectDay(index);
                                    onSelectSlot(null);
                                  }}
                                  className={`w-full px-3 py-2 rounded-lg text-center transition
                                    ${
                                      isActiveDay
                                        ? "bg-green-600 text-white"
                                        : "bg-white text-gray-700"
                                    }
                                    border ${
                                      isActiveDay
                                        ? "border-green-600"
                                        : "border-gray-200"
                                    }`}
                                >
                                  <div className="text-xs font-medium">{label}</div>
                                  <div className="text-lg font-bold mt-1">{dayNumber}</div>
                                  <div
                                    className={`${
                                      isActiveDay
                                        ? "text-[11px] text-white mt-1"
                                        : "text-[11px] text-gray-400 mt-1"
                                    }`}
                                  >
                                    {availableSlotsCount} slot
                                    {availableSlotsCount !== 1 ? "s" : ""}
                                  </div>
                                </button>
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-4">
                          {(() => {
                            const selectedDate = new Date();
                            selectedDate.setDate(selectedDate.getDate() + selectedDay);
                            const selectedISO = selectedDate.toISOString().split("T")[0];
                            const fullDayName = selectedDate.toLocaleDateString("en-US", {
                              weekday: "long",
                            });

                            const slotsForDay = timeSlots.filter(
                              (s) => s.day_of_week === fullDayName
                            );

                            if (slotsForDay.length === 0) {
                              return (
                                <p className="text-gray-500 text-sm">
                                  No slots available for this day.
                                </p>
                              );
                            }

                            const todaysBookings = bookings.filter((b) => {
                              const bookingISO = new Date(b.appointment_date)
                                .toISOString()
                                .split("T")[0];
                              return bookingISO === selectedISO;
                            });

                            const availableSlots = slotsForDay.filter(
                              (slot) =>
                                !todaysBookings.some((b) => b.time_slot_id === slot.id)
                            );

                            return (
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {availableSlots.map((slot) => {
                                  const isSelected = selectedSlot?.id === slot.id;
                                  return (
                                    <div
                                      key={slot.id}
                                      onClick={() => onSelectSlot(slot)}
                                      className={`
                                        p-2 rounded-md cursor-pointer text-sm transition
                                        ${
                                          slot.slot_type === "clinic"
                                            ? "bg-green-50"
                                            : "bg-blue-50"
                                        }
                                        ${
                                          isSelected
                                            ? "border-2 border-green-600"
                                            : "border border-gray-300"
                                        }
                                      `}
                                    >
                                      <div className="font-medium">
                                        {formatTimePretty(slot.start_time)} -{" "}
                                        {formatTimePretty(slot.end_time)}
                                      </div>
                                      <div className="text-[11px] text-gray-600 capitalize">
                                        {slot.slot_type}
                                      </div>
                                      <div className="text-[11px] mt-1 font-semibold text-green-600">
                                        Available
                                      </div>
                                    </div>
                                  );
                                })}

                                {availableSlots.length === 0 && (
                                  <p className="text-red-500 text-sm col-span-full text-center">
                                    No available slots for this day.
                                  </p>
                                )}
                              </div>
                            );
                          })()}
                        </div>

                        {!selectedSlot && (
                          <p className="text-gray-500 text-xs mt-2">
                            Please select a slot to book an appointment.
                          </p>
                        )}

                        <Button
                          variant="default"
                          size="sm"
                          className="mt-3 w-full sm:w-auto bg-green-600 hover:bg-green-700"
                          disabled={!selectedSlot}
                          onClick={() => onDepartmentBookNow(selectedSlot!, selectedDay, dept)}
                        >
                          Book Appointment without Payment
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
    </div>
)}
</>
  );
};

export default HospitalCard;