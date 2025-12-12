import { Parking } from "@/types/parking";
import { Card, CardContent } from "@/components/ui/card";
import { Car, ParkingCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ParkingStatsProps {
  parkings: Parking[];
}

export function ParkingStats({ parkings }: ParkingStatsProps) {
  const totalSlots = parkings.reduce((acc, p) => acc + p.totalSlots, 0);
  const totalAvailable = parkings.reduce((acc, p) => acc + p.availableSlots, 0);
  const totalOccupied = totalSlots - totalAvailable;
  const availableLocations = parkings.filter(p => p.isAvailable && p.availableSlots > 0).length;

  const stats = [
    {
      label: "Total Locations",
      value: parkings.length,
      icon: ParkingCircle,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Total Slots",
      value: totalSlots,
      icon: Car,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
    },
    {
      label: "Available Slots",
      value: totalAvailable,
      icon: CheckCircle2,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Occupied Slots",
      value: totalOccupied,
      icon: AlertCircle,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card 
          key={stat.label} 
          className="animate-fade-in border-border/50"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <CardContent className="p-4 flex items-center gap-4">
            <div className={cn("p-3 rounded-xl", stat.bgColor)}>
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
