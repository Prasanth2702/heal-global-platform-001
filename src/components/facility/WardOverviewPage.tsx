// components/facility/WardOverviewPage.tsx
import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Clock,
  User,
  Building,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Ward } from "./facility";
import WardCard from "./shared/WardCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const WardOverviewPage: React.FC = () => {
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [wardTypeFilter, setWardTypeFilter] = useState("all");

  const fetchWards = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("User not authenticated");
        return;
      }

      const facilityId = user?.user_metadata?.facility_id;

      // Fetch wards
      const { data: wardsData, error: wardsError } = await supabase
        .from("wards")
        .select("*")
        .eq("facility_id", facilityId)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (wardsError) throw wardsError;

      // Get today's date for filtering
      const today = new Date().toISOString().split("T")[0];

      // For each ward, fetch bed statistics and upcoming schedules
      const wardsWithStats = await Promise.all(
        (wardsData || []).map(async (ward) => {
          // Fetch beds for this ward
          const { data: wardBeds, error: bedsError } = await supabase
            .from("beds")
            .select("id, current_status")
            .eq("ward_id", ward.id)
            .eq("is_active", true);

          if (bedsError) {
            console.error(
              `Error fetching beds for ward ${ward.id}:`,
              bedsError
            );
            return {
              ...ward,
              bedStats: {
                totalBeds: 0,
                occupiedBeds: 0,
                freeBeds: 0,
                maintenanceBeds: 0,
                occupancyRate: 0,
                upcomingAdmissions: 0,
                upcomingDischarges: 0,
              },
            };
          }

          // Fetch active bed bookings for this ward
          const { data: activeBookings, error: bookingsError } = await supabase
            .from("bed_bookings")
            .select(
              "assigned_bed_id, status, expected_admission_date, expected_discharge_date"
            )
            .eq("assigned_ward_id", ward.id)
            .in("status", ["OCCUPIED", "RESERVED"]);

          if (bookingsError) {
            console.error(
              `Error fetching bookings for ward ${ward.id}:`,
              bookingsError
            );
          }

          // Fetch today's admissions and discharges
          const { data: todayAdmissions, error: admissionsError } =
            await supabase
              .from("bed_bookings")
              .select("id")
              .eq("assigned_ward_id", ward.id)
              .eq("expected_admission_date", today)
              .in("status", ["RESERVED", "AVAILABLE"]);

          const { data: todayDischarges, error: dischargesError } =
            await supabase
              .from("bed_bookings")
              .select("id")
              .eq("assigned_ward_id", ward.id)
              .eq("expected_discharge_date", today)
              .eq("status", "OCCUPIED");

          // Calculate statistics
          const totalBeds = wardBeds?.length || 0;

          // Count beds by status
          const bedStatusCounts = {
            OCCUPIED: 0,
            AVAILABLE: 0,
            MAINTENANCE: 0,
            CLEANING: 0,
            RESERVED: 0,
            OUT_OF_SERVICE: 0,
          };

          wardBeds?.forEach((bed) => {
            if (bed.current_status in bedStatusCounts) {
              bedStatusCounts[
                bed.current_status as keyof typeof bedStatusCounts
              ] += 1;
            }
          });

          // Adjust occupied count with active bookings
          const occupiedFromBookings =
            activeBookings?.filter((b) => b.status === "OCCUPIED").length || 0;
          const occupiedBeds = Math.max(
            bedStatusCounts.OCCUPIED,
            occupiedFromBookings
          );

          const freeBeds = bedStatusCounts.AVAILABLE;
          const maintenanceBeds =
            bedStatusCounts.MAINTENANCE +
            bedStatusCounts.OUT_OF_SERVICE +
            bedStatusCounts.CLEANING;

          const occupancyRate =
            totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;

          // Get upcoming admissions and discharges
          const upcomingAdmissions = todayAdmissions?.length || 0;
          const upcomingDischarges = todayDischarges?.length || 0;

          return {
            ...ward,
            bedStats: {
              totalBeds,
              occupiedBeds,
              freeBeds,
              maintenanceBeds,
              occupancyRate,
              upcomingAdmissions,
              upcomingDischarges,
              bedStatusCounts,
            },
          };
        })
      );

      setWards(wardsWithStats);
    } catch (error) {
      console.error("Error fetching wards:", error);
      setError("Failed to load wards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWards();
  }, []);

  const filteredWards = wards.filter((ward) => {
    const matchesSearch =
      ward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ward.ward_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      wardTypeFilter === "all" || ward.ward_type === wardTypeFilter;
    return matchesSearch && matchesType;
  });

  // Calculate totals for all wards
  const totalUpcomingAdmissions = wards.reduce(
    (sum, ward) => sum + ((ward as any).bedStats?.upcomingAdmissions || 0),
    0
  );
  const totalUpcomingDischarges = wards.reduce(
    (sum, ward) => sum + ((ward as any).bedStats?.upcomingDischarges || 0),
    0
  );

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-3 text-muted-foreground">Loading ward data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="rounded-full bg-destructive/10 p-3">
              <div className="rounded-full bg-destructive/20 p-2">
                <span className="text-destructive font-semibold">!</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Error Loading Data</h3>
              <p className="text-muted-foreground mt-1">{error}</p>
            </div>
            <Button variant="outline" onClick={fetchWards}>
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-4">
      {/* Today's Date and Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Today's Overview</h2>
              </div>
              <p className="text-muted-foreground">{today}</p>
            </div>
            <div className="flex gap-4">
              <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">
                  {totalUpcomingAdmissions}
                </div>
                <div className="text-sm text-blue-600">Admissions</div>
              </div>
              <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-2xl font-bold text-green-700">
                  {totalUpcomingDischarges}
                </div>
                <div className="text-sm text-green-600">Discharges</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search wards by name or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Select */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={wardTypeFilter} onValueChange={setWardTypeFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="ICU">ICU</SelectItem>
                  <SelectItem value="Pediatric">Pediatric</SelectItem>
                  <SelectItem value="Maternity">Maternity</SelectItem>
                  <SelectItem value="Surgical">Surgical</SelectItem>
                  <SelectItem value="Isolation">Isolation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wards Grid */}
      {filteredWards.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <h3 className="text-lg font-semibold mb-2">No Wards Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || wardTypeFilter !== "all"
                  ? "No wards match your search criteria. Try adjusting your filters."
                  : "Create your first ward to get started."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWards.map((ward) => (
            <WardCard
              key={ward.id}
              ward={ward}
              stats={{
                occupiedBeds: (ward as any).bedStats?.occupiedBeds || 0,
                freeBeds: (ward as any).bedStats?.freeBeds || 0,
                maintenanceBeds: (ward as any).bedStats?.maintenanceBeds || 0,
                occupancyRate: (ward as any).bedStats?.occupancyRate || 0,
                upcomingAdmissions:
                  (ward as any).bedStats?.upcomingAdmissions || 0,
                upcomingDischarges:
                  (ward as any).bedStats?.upcomingDischarges || 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WardOverviewPage;
