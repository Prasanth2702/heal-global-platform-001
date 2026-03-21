// components/facility/BedManagementPage.tsx
import React, { useState, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { format, startOfDay, endOfDay } from "date-fns";
import { Button } from "@/components/ui/button";

import BedCard from "./shared/BedCard";
import { Bed } from "./facility";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const BedManagementPage: React.FC = () => {
 
  const [beds, setBeds] = useState<Bed[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const getUserFacilityId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  console.log("USER ID:", user.id);

  // ✅ Check ADMIN
  const { data: adminFacility, error: adminError } = await supabase
    .from("facilities")
    .select("id")
    .eq("admin_user_id", user.id)
    .maybeSingle();

  if (adminError) {
    console.error("Admin fetch error:", adminError);
  }

  if (adminFacility) {
    console.log("ADMIN FACILITY:", adminFacility.id);
    return adminFacility.id;
  }

  // ✅ Check STAFF
  const { data: staff, error: staffError } = await supabase
    .from("staff")
    .select("facility_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (staffError) {
    console.error("Staff fetch error:", staffError);
  }

  if (staff) {
    console.log("STAFF FACILITY:", staff.facility_id);
    return staff.facility_id;
  }

  return null;
};

  const fetchBeds = async (date: Date) => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // const facilityId = user?.user_metadata?.facility_id;

          const facilityId = await getUserFacilityId();

      // Convert selected date to start and end of day for filtering
      const startDate = startOfDay(date);
      const endDate = endOfDay(date);

      const { data: bedsData, error: bedsError } = await supabase
        .from("beds")
        .select("*")
        .eq("facility_id", facilityId)
        .gte("updated_at", startDate.toISOString())
        .lte("updated_at", endDate.toISOString())
        .eq("is_active", true)
        .order("bed_number");

      if (bedsError) throw bedsError;

      setBeds(bedsData || []);
    } catch (error) {
      console.error("Error fetching beds:", error);
      setBeds([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchBeds(selectedDate);
  }, []);

  // Fetch beds when selected date changes
  useEffect(() => {
    if (selectedDate) {
      fetchBeds(selectedDate);
    }
  }, [selectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const bedStats = {
    total: beds.length,
    occupied: beds.filter((b) => b.current_status === "OCCUPIED").length,
    available: beds.filter((b) => b.current_status === "AVAILABLE").length,
    maintenance: beds.filter(
      (b) =>
        b.current_status === "MAINTENANCE" ||
        b.current_status === "OUT_OF_SERVICE"
    ).length,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-4 gap-6">
      {/* Left Column - Calendar & Stats */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Bed Management
            </CardTitle>
            <CardDescription>
              Select date to view bed status & maintenance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-md border"
              />
            </div>

            {/* Selected Date Display */}
            <div className="mb-4">
              <h6 className="mb-2 text-sm font-medium">Selected Date:</h6>
              <div className="py-2 px-3 bg-muted rounded-md">
                <strong>
                  {selectedDate
                    ? format(selectedDate, "PPPP")
                    : "Select a date"}
                </strong>
              </div>
            </div>

            {/* Bed Statistics Summary */}
            <div className="mt-4">
              <h6 className="mb-3 text-sm font-medium">Bed Status Summary</h6>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Total Beds
                  </span>
                  <Badge variant="secondary">{bedStats.total}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Occupied
                  </span>
                  <Badge variant="destructive">{bedStats.occupied}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Available
                  </span>
                  <Badge
                    variant="default"
                    className="bg-green-500 hover:bg-green-600"
                  >
                    {bedStats.available}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Maintenance
                  </span>
                  <Badge
                    variant="outline"
                    className="text-amber-600 border-amber-600"
                  >
                    {bedStats.maintenance}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Date Navigation */}
            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  handleDateSelect(new Date());
                }}
              >
                View Today's Beds
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Bed Details */}
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Bed Details & Management</CardTitle>
                <CardDescription>
                  Showing beds updated on:{" "}
                  <strong>
                    {selectedDate ? format(selectedDate, "MMMM dd, yyyy") : ""}
                  </strong>{" "}
                  | {beds.length} bed{beds.length !== 1 ? "s" : ""} found
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                <p className="mt-3 text-muted-foreground">
                  Loading bed data...
                </p>
              </div>
            ) : beds.length === 0 ? (
              <Card className="border-2 border-dashed">
                <CardContent className="pt-6">
                  <div className="text-center py-4">
                    <h3 className="text-lg font-semibold mb-2">
                      No Beds Found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      No beds were updated on{" "}
                      <strong>
                        {selectedDate
                          ? format(selectedDate, "MMMM dd, yyyy")
                          : "this date"}
                      </strong>
                      . Try selecting a different date or view today's beds.
                    </p>
                    <Button
                      variant="default"
                      onClick={() => {
                        handleDateSelect(new Date());
                      }}
                    >
                      View Today's Beds
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> */}
                {beds.map((bed) => (
                  <BedCard key={bed.id} bed={bed} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BedManagementPage;
