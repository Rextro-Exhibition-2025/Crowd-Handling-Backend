import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { parkingApi } from "@/services/parkingApi";
import { ParkingInput, ParkingUpdateInput, AvailabilityUpdate } from "@/types/parking";
import { toast } from "@/hooks/use-toast";

export function useParkings() {
  return useQuery({
    queryKey: ["parkings"],
    queryFn: async () => {
      const response = await parkingApi.getAll();
      return response.data;
    },
  });
}

export function useParking(id: string) {
  return useQuery({
    queryKey: ["parking", id],
    queryFn: async () => {
      const response = await parkingApi.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateParking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ParkingInput) => parkingApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parkings"] });
      toast({ title: "Success", description: "Parking created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateParking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ParkingUpdateInput }) =>
      parkingApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parkings"] });
      toast({ title: "Success", description: "Parking updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteParking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => parkingApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parkings"] });
      toast({ title: "Success", description: "Parking deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AvailabilityUpdate }) =>
      parkingApi.updateAvailability(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parkings"] });
      toast({ title: "Success", description: "Availability updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}
