// components/facility/shared/WardCard.tsx
import React from "react";
import {
  Building,
  Clock,
  Users,
  Activity,
  ChevronRight,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";
import { Ward } from "../facility";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface WardCardProps {
  ward: Ward;
  onViewDetails?: (ward: Ward) => void;
  onEdit?: (ward: Ward) => void;
  stats?: {
    occupiedBeds: number;
    freeBeds: number;
    maintenanceBeds: number;
    occupancyRate: number;
    upcomingAdmissions: number;
    upcomingDischarges: number;
  };
}

const WardCard: React.FC<WardCardProps> = ({
  ward,
  onViewDetails,
  onEdit,
  stats = {
    occupiedBeds: 0,
    freeBeds: 0,
    maintenanceBeds: 0,
    occupancyRate: 0,
    upcomingAdmissions: 0,
    upcomingDischarges: 0,
  },
}) => {
  const getWardTypeVariant = (type: string) => {
    switch (type) {
      case "ICU":
        return "destructive";
      case "PEDIATRIC":
        return "default";
      case "MATERNITY":
        return "outline";
      case "ISOLATION":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getWardTypeColor = (type: string) => {
    switch (type) {
      case "ICU":
        return "bg-red-100 text-red-800 border-red-200";
      case "PEDIATRIC":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "MATERNITY":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "ISOLATION":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const occupancyRate = stats.occupancyRate;
  const occupiedBeds = stats.occupiedBeds;
  const freeBeds = stats.freeBeds;
  const maintenanceBeds = stats.maintenanceBeds;
  const upcomingAdmissions = stats.upcomingAdmissions;
  const upcomingDischarges = stats.upcomingDischarges;

  const getProgressColor = () => {
    if (occupancyRate > 85) return "bg-red-500";
    if (occupancyRate > 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg mb-1">{ward.name}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`${getWardTypeColor(ward.ward_type)} px-2 py-1`}
              >
                {ward.ward_type}
              </Badge>
              <Badge variant="outline" className="px-2 py-1">
                <Clock className="h-3 w-3 mr-1" />
                {ward.operatingHours?.start || "08:00"} -{" "}
                {ward.operatingHours?.end || "20:00"}
              </Badge>
            </div>
          </div>
          {onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onViewDetails(ward)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Description */}
        <p className="text-muted-foreground mb-4 text-sm">
          {ward.description || "No description available"}
        </p>

        {/* Location Info */}
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Floor {ward.floor_number} • {ward.wing || "Main Wing"}
          </span>
        </div>

        {/* Contact Info */}
        {ward.phone_extension && (
          <div className="flex items-center gap-2 mb-4">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Ext: {ward.phone_extension}
            </span>
          </div>
        )}

        {/* Occupancy Progress */}
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-muted-foreground">
              Occupancy Rate
            </span>
            <span className="text-sm font-semibold">
              {occupancyRate.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={occupancyRate}
            className="h-2"
            indicatorClassName={getProgressColor()}
          />
        </div>

        {/* Bed Statistics */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="p-3 bg-gray-50 rounded-md text-center">
            <div className="text-lg font-semibold mb-1">{ward.total_beds}</div>
            <span className="text-xs text-muted-foreground">Total</span>
          </div>
          <div className="p-3 bg-green-50 border border-green-200 rounded-md text-center">
            <div className="text-lg font-semibold text-green-700 mb-1">
              {freeBeds}
            </div>
            <span className="text-xs text-muted-foreground">Available</span>
          </div>
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-center">
            <div className="text-lg font-semibold text-red-700 mb-1">
              {occupiedBeds}
            </div>
            <span className="text-xs text-muted-foreground">Occupied</span>
          </div>
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-center">
            <div className="text-lg font-semibold text-yellow-700 mb-1">
              {maintenanceBeds}
            </div>
            <span className="text-xs text-muted-foreground">Maintenance</span>
          </div>
        </div>

        {/* Upcoming Admissions and Discharges */}
        {(upcomingAdmissions > 0 || upcomingDischarges > 0) && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                Upcoming Schedule
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-700 mb-1">
                  {upcomingAdmissions}
                </div>
                <span className="text-xs text-blue-600">Admissions Today</span>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-700 mb-1">
                  {upcomingDischarges}
                </div>
                <span className="text-xs text-green-600">Discharges Today</span>
              </div>
            </div>
          </div>
        )}

        {/* Staff Information */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs text-muted-foreground block">
                Head Nurse:
              </span>
              <span className="font-medium">
                {ward.head_nurse?.full_name || "Not assigned"}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground block">
                Status:
              </span>
              <Badge variant={ward.is_operational ? "default" : "destructive"}>
                {ward.is_operational ? "Operational" : "Non-operational"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4">
        <div className="flex gap-2 w-full">
          {onViewDetails && (
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={() => onViewDetails(ward)}
            >
              View Details
            </Button>
          )}
          {onEdit && (
            <Button variant="outline" size="sm" onClick={() => onEdit(ward)}>
              Edit
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default WardCard;
