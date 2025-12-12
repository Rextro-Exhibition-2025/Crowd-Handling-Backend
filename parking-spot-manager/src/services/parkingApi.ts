import { Parking, ParkingInput, ParkingUpdateInput, AvailabilityUpdate, ApiResponse } from "@/types/parking";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://crowd-handling-backend.vercel.app";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export const parkingApi = {
  getAll: async (): Promise<ApiResponse<Parking[]>> => {
    const response = await fetch(`${API_BASE_URL}/api/parkings`);
    return handleResponse(response);
  },

  getById: async (id: string): Promise<ApiResponse<Parking>> => {
    const response = await fetch(`${API_BASE_URL}/api/parkings/${id}`);
    return handleResponse(response);
  },

  create: async (data: ParkingInput): Promise<ApiResponse<Parking>> => {
    const response = await fetch(`${API_BASE_URL}/api/parkings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  update: async (id: string, data: ParkingUpdateInput): Promise<ApiResponse<Parking>> => {
    const response = await fetch(`${API_BASE_URL}/api/parkings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (id: string): Promise<ApiResponse<object>> => {
    const response = await fetch(`${API_BASE_URL}/api/parkings/${id}`, {
      method: "DELETE",
    });
    return handleResponse(response);
  },

  updateAvailability: async (id: string, data: AvailabilityUpdate): Promise<ApiResponse<Parking>> => {
    const response = await fetch(`${API_BASE_URL}/api/parkings/${id}/availability`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
};
