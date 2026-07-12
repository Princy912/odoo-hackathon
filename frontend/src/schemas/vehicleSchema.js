import { z } from "zod";

// Matches backend Vehicle entity (com.transitops.entity.Vehicle).
// regNumber required; maxLoadCapacity must be a positive number.
export const vehicleSchema = z.object({
  regNumber: z
    .string()
    .trim()
    .min(1, "Registration number is required"),
  model: z.string().trim().optional().or(z.literal("")),
  type: z.string().trim().optional().or(z.literal("")),
  maxLoadCapacity: z.coerce
    .number({ invalid_type_error: "Max load capacity must be a number" })
    .positive("Max load capacity must be a positive number"),
  odometer: z.coerce
    .number({ invalid_type_error: "Odometer must be a number" })
    .nonnegative("Odometer can't be negative")
    .optional()
    .or(z.literal("")),
  acquisitionCost: z.coerce
    .number({ invalid_type_error: "Acquisition cost must be a number" })
    .nonnegative("Acquisition cost can't be negative")
    .optional()
    .or(z.literal("")),
  region: z.string().trim().optional().or(z.literal("")),
});

export const vehicleDefaultValues = {
  regNumber: "",
  model: "",
  type: "",
  maxLoadCapacity: "",
  odometer: "",
  acquisitionCost: "",
  region: "",
};