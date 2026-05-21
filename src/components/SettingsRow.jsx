export function SettingsRow({ label, description, right }) {
  return <div className="flex items-center justify-between rounded-2xl bg-white/10 p-3"><div><div className="text-sm">{label}</div><div className="text-xs text-slate-400">{description}</div></div>{right}</div>;
}
