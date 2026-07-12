import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "../common/Modal";
import { vehicleSchema, vehicleDefaultValues } from "../../schemas/vehicleSchema";

export default function AddVehicleModal({ open, onClose, onSubmit, submitting, vehicle }) {
  const isEdit = !!vehicle;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: vehicleDefaultValues,
  });

  useEffect(() => {
    if (open) {
      if (vehicle) {
        reset({
          regNumber: vehicle.regNumber || "",
          model: vehicle.model || "",
          type: vehicle.type || "",
          maxLoadCapacity: vehicle.maxLoadCapacity || "",
          odometer: vehicle.odometer != null ? vehicle.odometer : "",
          acquisitionCost: vehicle.acquisitionCost != null ? vehicle.acquisitionCost : "",
          region: vehicle.region || "",
        });
      } else {
        reset(vehicleDefaultValues);
      }
    }
  }, [vehicle, open, reset]);

  const submit = async (data) => {
    await onSubmit(data);
    reset(vehicleDefaultValues);
  };

  const close = () => {
    reset(vehicleDefaultValues);
    onClose();
  };

  return (
    <Modal open={open} title={isEdit ? "Edit vehicle" : "Add vehicle"} onClose={close}>
      <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
        <Field label="Registration number" error={errors.regNumber?.message}>
          <input
            {...register("regNumber")}
            type="text"
            placeholder="TN-38-AB-1234"
            className={inputClass(errors.regNumber)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Model" error={errors.model?.message}>
            <input {...register("model")} type="text" className={inputClass(errors.model)} />
          </Field>
          <Field label="Type" error={errors.type?.message}>
            <input
              {...register("type")}
              type="text"
              placeholder="Truck, Van..."
              className={inputClass(errors.type)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Max load capacity" error={errors.maxLoadCapacity?.message}>
            <input
              {...register("maxLoadCapacity")}
              type="number"
              step="any"
              className={inputClass(errors.maxLoadCapacity)}
            />
          </Field>
          <Field label="Odometer" error={errors.odometer?.message}>
            <input
              {...register("odometer")}
              type="number"
              step="any"
              className={inputClass(errors.odometer)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Acquisition cost" error={errors.acquisitionCost?.message}>
            <input
              {...register("acquisitionCost")}
              type="number"
              step="any"
              className={inputClass(errors.acquisitionCost)}
            />
          </Field>
          <Field label="Region" error={errors.region?.message}>
            <input {...register("region")} type="text" className={inputClass(errors.region)} />
          </Field>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={close}
            className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {submitting ? (isEdit ? "Saving…" : "Adding…") : (isEdit ? "Save changes" : "Add vehicle")}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-rose-600">{error}</span>}
    </label>
  );
}

function inputClass(error) {
  return `w-full rounded-md border px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 ${
    error
      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
      : "border-slate-300 focus:border-slate-500 focus:ring-slate-500"
  }`;
}