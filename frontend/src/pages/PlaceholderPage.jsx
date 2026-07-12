export default function PlaceholderPage({ title, description }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-start justify-center rounded-lg border border-dashed border-slate-300 bg-white/60 p-10">
      <span className="font-mono text-[11px] uppercase tracking-wide text-amber-600">
        Not wired yet
      </span>
      <h1 className="mt-2 text-xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        {description ??
          "This page is scaffolded for routing only. Build-out happens in a later phase."}
      </p>
    </div>
  );
}