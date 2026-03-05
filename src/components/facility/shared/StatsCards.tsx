// components/facility/shared/StatsCards.tsx
import React from "react";
import {
  Building,
  BedIcon,
  Users,
  Percent,
  Activity,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface StatsCardsProps {
  stats: {
    totalWards: number;
    totalBeds: number;
    availableBeds: number;
    occupiedBeds: number;
    maintenanceBeds: number;
    occupancyRate: number;
    admittedPatients: number;
    criticalPatients: number;
    averageStay: number;
    dailyAdmissions: number;
  };
  showDetails?: boolean;
  compact?: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  stats,
  showDetails = true,
  compact = false,
}) => {
  const cards = [
    {
      title: "Total Wards",
      value: stats.totalWards,
      icon: Building,
      color: "primary",
      colorClass: "bg-primary/10 text-primary",
      subtitle: `${
        new Set(["General", "ICU", "Pediatric"]).size
      } department types`,
    },
    {
      title: "Total Beds",
      value: stats.totalBeds,
      icon: BedIcon,
      color: "success",
      colorClass: "bg-green-500/10 text-green-600",
      subtitle: `${stats.availableBeds} available, ${stats.occupiedBeds} occupied`,
      progress:
        stats.totalBeds > 0 ? (stats.occupiedBeds / stats.totalBeds) * 100 : 0,
    },
    {
      title: "Occupancy Rate",
      value: `${stats.occupancyRate.toFixed(1)}%`,
      icon: Percent,
      color: "warning",
      colorClass: "bg-amber-500/10 text-amber-600",
      subtitle: stats.occupancyRate > 85 ? "High occupancy" : "Optimal",
      progress: stats.occupancyRate,
    },
    {
      title: "Admitted Patients",
      value: stats.admittedPatients,
      icon: Users,
      color: "danger",
      colorClass: "bg-red-500/10 text-red-600",
      subtitle: `${stats.criticalPatients} critical condition`,
    },
  ];

  if (compact) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((card, index) => (
          <div key={index} className="rounded-lg border bg-card p-3 shadow-sm">
            <div className="flex items-center">
              <div className={`${card.colorClass} p-2 rounded-full mr-3`}>
                <card.icon size={20} />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  {card.title}
                </div>
                <h4 className="text-xl font-semibold">{card.value}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="rounded-lg border bg-card p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`${card.colorClass} p-3 rounded-full mr-4`}>
                <card.icon size={24} />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  {card.title}
                </div>
                <h3 className="text-2xl font-bold">{card.value}</h3>
              </div>
            </div>

            {showDetails && card.subtitle && (
              <div className="mt-3">
                <p className="text-sm text-muted-foreground">{card.subtitle}</p>
              </div>
            )}

            {card.progress !== undefined && (
              <div className="mt-3">
                <Progress
                  value={card.progress}
                  className="h-2 rounded-full"
                  indicatorClassName={
                    card.progress > 85
                      ? "bg-destructive"
                      : card.progress > 70
                      ? "bg-amber-500"
                      : "bg-green-500"
                  }
                />
              </div>
            )}

            {/* Additional stats for some cards */}
            {card.title === "Total Beds" && showDetails && (
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge
                  variant="default"
                  className="bg-green-500 hover:bg-green-600"
                >
                  {stats.availableBeds} Available
                </Badge>
                <Badge variant="destructive">
                  {stats.occupiedBeds} Occupied
                </Badge>
                {stats.maintenanceBeds > 0 && (
                  <Badge
                    variant="outline"
                    className="border-amber-600 text-amber-600"
                  >
                    {stats.maintenanceBeds} Maintenance
                  </Badge>
                )}
              </div>
            )}

            {card.title === "Admitted Patients" && showDetails && (
              <div className="mt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Avg Stay Duration:
                  </span>
                  <span className="text-sm font-medium">
                    {stats.averageStay} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Today's Admissions:
                  </span>
                  <span className="text-sm font-medium">
                    {stats.dailyAdmissions}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Additional detailed stats row if showDetails is true */}
      {showDetails && (
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3">
              <div className="text-2xl font-bold text-primary">
                {stats.dailyAdmissions}
              </div>
              <div className="text-sm text-muted-foreground">
                Today's Admissions
              </div>
              <div className="mt-1">
                <TrendingUp size={16} className="text-green-500 mx-auto" />
              </div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl font-bold text-green-600">
                {stats.availableBeds}
              </div>
              <div className="text-sm text-muted-foreground">
                Available Beds
              </div>
              <div className="mt-1">
                {stats.availableBeds < 10 && (
                  <AlertCircle size={16} className="text-amber-500 mx-auto" />
                )}
              </div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl font-bold text-amber-600">
                {stats.maintenanceBeds}
              </div>
              <div className="text-sm text-muted-foreground">
                Under Maintenance
              </div>
              <div className="mt-1">
                <Clock size={16} className="text-amber-500 mx-auto" />
              </div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl font-bold text-blue-600">
                {stats.averageStay}
              </div>
              <div className="text-sm text-muted-foreground">
                Avg Stay (days)
              </div>
              <div className="mt-1">
                <TrendingDown size={16} className="text-green-500 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsCards;
