// components/facility/shared/BedCard.tsx
import React from "react";
import {
  User,
  Info,
  Activity,
  Thermometer,
  Shield,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Bed, BedStatus } from "../facility";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface BedCardProps {
  bed: Bed;
  onViewDetails?: (bed: Bed) => void;
  onAction?: (action: string, bed: Bed) => void;
  showActions?: boolean;
}

const BedCard: React.FC<BedCardProps> = ({
  bed,
  onViewDetails,
  onAction,
  showActions = true,
}) => {
 const getStatusVariant = (status: BedStatus) => {
   switch (status) {
     case "MAINTENANCE":
     case "OUT_OF_SERVICE":
       return "secondary"; // instead of warning

     case "OCCUPIED":
       return "destructive";

     case "RESERVED":
       return "outline";

     case "CLEANING":
       return "secondary";

     case "AVAILABLE":
       return "default"; // instead of success

     default:
       return "outline";
   }
 };


  const getStatusText = (status: BedStatus) => {
    switch (status) {
      case "MAINTENANCE":
        return "Under Maintenance";
      case "OCCUPIED":
        return "Occupied";
      case "RESERVED":
        return "Reserved";
      case "AVAILABLE":
        return "Available";
      case "CLEANING":
        return "Cleaning";
      case "OUT_OF_SERVICE":
        return "Out of Service";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        {/* Header with Status */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg mb-1">
              Bed #{bed.bed_number}
              {bed.bed_label && ` (${bed.bed_label})`}
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusVariant(bed.current_status)}>
                {getStatusText(bed.current_status)}
              </Badge>
              {/* Optional: Active status badge
              <Badge variant={bed.is_active ? "default" : "destructive"}>
                {bed.is_active ? "Active" : "Inactive"}
              </Badge>
              */}
            </div>
          </div>
          <div>
            {onViewDetails && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onViewDetails(bed)}
                title="View bed details"
              >
                <Info className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Type</p>
            <p className="font-medium">{bed.bed_type}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Room</p>
            <p className="font-medium">{bed.room_number || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Floor</p>
            <p className="font-medium">{bed.floor_number || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Wing</p>
            <p className="font-medium">{bed.wing || "N/A"}</p>
          </div>
        </div>

        {/* Equipment */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">Equipment</p>
          <div className="flex flex-wrap gap-2">
            {bed.has_oxygen && (
              <Badge variant="secondary" className="px-2 py-1">
                O₂
              </Badge>
            )}
            {bed.has_suction && (
              <Badge variant="secondary" className="px-2 py-1">
                Suction
              </Badge>
            )}
            {bed.has_monitor && (
              <Badge variant="secondary" className="px-2 py-1">
                Monitor
              </Badge>
            )}
            {bed.has_ventilator && (
              <Badge variant="secondary" className="px-2 py-1">
                Ventilator
              </Badge>
            )}
          </div>
        </div>

        {/* Special Features */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">Features</p>
          <div className="flex flex-wrap gap-2">
            {bed.is_bariatric && (
              <Badge
                variant="outline"
                className="bg-yellow-50 text-yellow-700 border-yellow-200 px-2 py-1"
              >
                Bariatric
              </Badge>
            )}
            {bed.is_isolation && (
              <Badge
                variant="outline"
                className="bg-red-50 text-red-700 border-red-200 px-2 py-1"
              >
                Isolation
              </Badge>
            )}
            {bed.is_wheelchair_accessible && (
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200 px-2 py-1"
              >
                Wheelchair Accessible
              </Badge>
            )}
          </div>
        </div>

        {/* Patient Information (if occupied) */}
        {bed.patient && (
          <>
            <Separator className="my-4" />
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Current Patient
              </p>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{bed.patient.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {bed.booking?.primary_diagnosis || "Admitted"}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Maintenance Info */}
        <Separator className="my-4" />
        <div className="text-sm">
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Last Maintenance:</span>
            <span>{formatDate(bed.last_maintenance_date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Next Due:</span>
            <span className="font-medium">
              {formatDate(bed.next_maintenance_date)}
            </span>
          </div>
        </div>

        {/* Actions */}
        {showActions && onAction && (
          <>
            <Separator className="my-4" />
            <div className="flex flex-wrap gap-2">
              {bed.patient ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => onAction("transfer", bed)}
                  >
                    Transfer
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                    onClick={() => onAction("discharge", bed)}
                  >
                    Discharge
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="default"
                  className="w-full"
                  onClick={() => onAction("assign", bed)}
                >
                  Assign Patient
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => onAction("maintenance", bed)}
              >
                Maintenance
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BedCard;
