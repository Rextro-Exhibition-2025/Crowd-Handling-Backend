import { Parking } from "@/types/parking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Car, Edit2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface ParkingCardProps {
  parking: Parking;
  onEdit: (parking: Parking) => void;
  index: number;
}

export function ParkingCard({ parking, onEdit, index }: ParkingCardProps) {
  const occupancyPercent = ((parking.totalSlots - parking.availableSlots) / parking.totalSlots) * 100;
  
  const getStatusColor = () => {
    if (!parking.isAvailable || parking.availableSlots === 0) return "destructive";
    if (occupancyPercent >= 80) return "warning";
    return "success";
  };

  const getStatusText = () => {
    if (!parking.isAvailable || parking.availableSlots === 0) return "Full";
    if (occupancyPercent >= 80) return "Almost Full";
    return "Available";
  };

  const status = getStatusColor();

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
        "animate-slide-up border-border/50"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1",
        status === "success" && "gradient-success",
        status === "warning" && "gradient-warning",
        status === "destructive" && "gradient-destructive"
      )} />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className={cn(
              "flex-shrink-0 p-2.5 rounded-xl",
              status === "success" && "bg-success/10 text-success",
              status === "warning" && "bg-warning/10 text-warning",
              status === "destructive" && "bg-destructive/10 text-destructive"
            )}>
              <Car className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-lg font-semibold truncate">
                {parking.parkingName}
              </CardTitle>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                <MapPin className="h-3.5 w-3.5" />
                <span>Parking Zone</span>
              </div>
            </div>
          </div>
          <Badge 
            variant="secondary"
            className={cn(
              "flex-shrink-0 font-medium",
              status === "success" && "bg-success/10 text-success border-success/20",
              status === "warning" && "bg-warning/10 text-warning border-warning/20",
              status === "destructive" && "bg-destructive/10 text-destructive border-destructive/20"
            )}
          >
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Occupancy</span>
            <span className="font-mono font-medium">
              {parking.totalSlots - parking.availableSlots}/{parking.totalSlots}
            </span>
          </div>
          <Progress 
            value={occupancyPercent} 
            className={cn(
              "h-2.5 bg-muted",
              status === "success" && "[&>div]:gradient-success",
              status === "warning" && "[&>div]:gradient-warning",
              status === "destructive" && "[&>div]:gradient-destructive"
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <div className="text-2xl font-bold font-mono text-foreground">
              {parking.availableSlots}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">Available</div>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <div className="text-2xl font-bold font-mono text-foreground">
              {parking.totalSlots}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">Total</div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 gap-2"
            onClick={() => onEdit(parking)}
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
