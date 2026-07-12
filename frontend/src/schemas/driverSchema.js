import { z } from "zod";

// Matches backend Driver entity (com.transitops.entity.Driver).
// licenseNumber required; licenseExpiry must be a valid date (past or future
// are both valid data — an expired license is still a real record, the
// business rule that blocks assignment lives in TripService, not here).
export const driverSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  licenseNumber: z.string().trim().min(1, "License number is required"),
  licenseCategory: z.string().trim().optional().or(z.literal("")),
  licenseExpiry: z
    .string()
    .min(1, "License expiry date is required")
    .refine((val) => !Number.isNaN(Date.parse(val)), {
      message: "Enter a valid date",
    }),
  contactNumber: z.string().trim().optional().or(z.literal("")),
});

export const driverDefaultValues = {
  name: "",
  licenseNumber: "",
  licenseCategory: "",
  licenseExpiry: "",
  contactNumber: "",
};