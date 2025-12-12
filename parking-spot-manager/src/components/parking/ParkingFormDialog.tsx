import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Parking } from "@/types/parking";
import { Loader2, Save, Plus, Minus } from "lucide-react";

const parkingSchema = z.object({
  parkingName: z.string().min(1, "Parking name is required").max(100),
  totalSlots: z.coerce.number().min(1, "Must have at least 1 slot"),
  availableSlots: z.coerce.number().min(0, "Cannot be negative"),
  isAvailable: z.boolean().default(true),
}).refine((data) => data.availableSlots <= data.totalSlots, {
  message: "Available slots cannot exceed total slots",
  path: ["availableSlots"],
});

type ParkingFormValues = z.infer<typeof parkingSchema>;

interface ParkingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parking?: Parking | null;
  onSubmit: (values: ParkingFormValues) => void;
  isLoading?: boolean;
}

export function ParkingFormDialog({
  open,
  onOpenChange,
  parking,
  onSubmit,
  isLoading,
}: ParkingFormDialogProps) {
  const isEditing = !!parking;

  const form = useForm<ParkingFormValues>({
    resolver: zodResolver(parkingSchema),
    defaultValues: {
      parkingName: "",
      totalSlots: 100,
      availableSlots: 100,
      isAvailable: true,
    },
  });

  useEffect(() => {
    if (parking) {
      form.reset({
        parkingName: parking.parkingName,
        totalSlots: parking.totalSlots,
        availableSlots: parking.availableSlots,
        isAvailable: parking.isAvailable,
      });
    } else {
      form.reset({
        parkingName: "",
        totalSlots: 100,
        availableSlots: 100,
        isAvailable: true,
      });
    }
  }, [parking, form]);

  const handleSubmit = (values: ParkingFormValues) => {
    onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Save className="h-5 w-5 text-primary" />
                Edit Parking
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 text-primary" />
                Add New Parking
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the parking details below."
              : "Fill in the details to create a new parking location."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="parkingName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parking Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Main Street Parking"
                      {...field}
                      disabled={isEditing}
                      className={isEditing ? "bg-muted" : ""}
                    />
                  </FormControl>
                  {isEditing && (
                    <p className="text-xs text-muted-foreground">
                      Parking name cannot be changed
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="totalSlots"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Slots</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 shrink-0"
                          onClick={() => field.onChange(Math.max(1, Number(field.value) - 1))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input type="number" min={1} {...field} className="text-center" />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 shrink-0"
                          onClick={() => field.onChange(Number(field.value) + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availableSlots"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Slots</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 shrink-0"
                          onClick={() => field.onChange(Math.max(0, Number(field.value) - 1))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input type="number" min={0} {...field} className="text-center" />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 shrink-0"
                          onClick={() => field.onChange(Number(field.value) + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isAvailable"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Availability Status</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Toggle parking availability
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 gap-2" disabled={isLoading}>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isEditing ? "Save Changes" : "Create Parking"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
