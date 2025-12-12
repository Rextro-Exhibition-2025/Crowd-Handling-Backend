import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ParkingCard } from "@/components/parking/ParkingCard";
import { ParkingFormDialog } from "@/components/parking/ParkingFormDialog";
import { ParkingStats } from "@/components/parking/ParkingStats";
import { Parking } from "@/types/parking";
import {
  useParkings,
  useUpdateParking,
  useUpdateAvailability,
} from "@/hooks/useParkings";
import { Search, ParkingCircle, RefreshCw, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingParking, setEditingParking] = useState<Parking | null>(null);

  const { data: parkings, isLoading, refetch, isRefetching } = useParkings();
  const updateParking = useUpdateParking();
  const updateAvailability = useUpdateAvailability();

  const filteredParkings = parkings?.filter((p) =>
    p.parkingName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (parking: Parking) => {
    setEditingParking(parking);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (values: {
    parkingName: string;
    totalSlots: number;
    availableSlots: number;
    isAvailable: boolean;
  }) => {
    if (editingParking) {
      await updateParking.mutateAsync({
        id: editingParking._id,
        data: {
          totalSlots: values.totalSlots,
          availableSlots: values.availableSlots,
        },
      });
      if (values.isAvailable !== editingParking.isAvailable) {
        await updateAvailability.mutateAsync({
          id: editingParking._id,
          data: { isAvailable: values.isAvailable },
        });
      }
    }
    setIsFormOpen(false);
    setEditingParking(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl gradient-primary">
                <ParkingCircle className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Parking Manager</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Manage parking slots and availability
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => refetch()}
                disabled={isRefetching}
              >
                {isRefetching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Stats */}
        {parkings && <ParkingStats parkings={parkings} />}

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search parking locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[280px] rounded-lg" />
            ))}
          </div>
        ) : filteredParkings && filteredParkings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredParkings.map((parking, index) => (
              <ParkingCard
                key={parking._id}
                parking={parking}
                onEdit={handleEdit}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 rounded-full bg-muted mb-4">
              <ParkingCircle className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">
              {searchQuery ? "No results found" : "No parking locations"}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              {searchQuery
                ? "Try adjusting your search query"
                : "No parking locations available"}
            </p>
          </div>
        )}
      </main>

      {/* Dialogs */}
      <ParkingFormDialog
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingParking(null);
        }}
        parking={editingParking}
        onSubmit={handleFormSubmit}
        isLoading={updateParking.isPending || updateAvailability.isPending}
      />
    </div>
  );
};

export default Index;
