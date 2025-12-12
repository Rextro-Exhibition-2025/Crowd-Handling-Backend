export interface Parking {
  _id: string;
  parkingName: string;
  totalSlots: number;
  availableSlots: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ParkingInput {
  parkingName: string;
  totalSlots: number;
  availableSlots: number;
}

export interface ParkingUpdateInput {
  totalSlots: number;
  availableSlots: number;
}

export interface AvailabilityUpdate {
  availableSlots?: number;
  isAvailable?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
}
