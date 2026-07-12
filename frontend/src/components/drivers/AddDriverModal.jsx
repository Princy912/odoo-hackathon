import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "../common/Modal";
import { driverSchema, driverDefaultValues } from "../../schemas/driverSchema";

export default function AddDriverModal({ open, onClose, onSubmit, submitting }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(driverSchema),
    defaultValues: driverDefaultValues,
  });

  const submit = async (data) => {
    await onSubmit(data);
    reset(driverDefaultValues);
  };

  const close = () => {
    reset(driverDefaultValues);
    onClose();
  };

  return (
    <Modal open={open} title="Add driver" onClose={close}>
      <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
        <Field label="Name" error={errors.name?.message}>
          <input {...register("name")} type="text" className={inputClass(errors.name)} />
        </Field>

        <Field label="License number" error={errors.licenseNumber?.message}>
          <input
            {...register("licenseNumber")}
            type="text"
            className={inputClass(errors.licenseNumber)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="License category" error={errors.licenseCategory?.message}>
            <input
              {...register("licenseCategory")}
              type="text"
              placeholder="LMV, HMV..."
              className={inputClass(errors.licenseCategory)}
            />
          </Field>
          <Field label="License expiry" error={errors.licenseExpiry?.message}>
            <input
              {...register("licenseExpiry")}
              type="date"
              className={inputClass(errors.licenseExpiry)}
            />
          </Field>
        </div>

        <Field label="Contact number" error={errors.contactNumber?.message}>
          <input
            {...register("contactNumber")}
            type="text"
            className={inputClass(errors.contactNumber)}
          />
        </Field>

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
            {submitting ? "Adding…" : "Add driver"}
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