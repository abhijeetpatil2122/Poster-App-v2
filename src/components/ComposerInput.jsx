export function ComposerInput({ value, onChange, max = 320 }) {
  return <div className="rounded-3xl bg-white/10 p-3 backdrop-blur"><textarea value={value} onChange={(e) => onChange(e.target.value)} maxLength={max} rows={8} placeholder="What are you feeling right now?" className="w-full resize-none bg-transparent text-sm text-white outline-none placeholder:text-slate-400" /><div className="text-right text-xs text-slate-400">{value.length}/{max}</div></div>;
}
