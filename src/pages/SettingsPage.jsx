import { SettingsRow } from '../components/SettingsRow';
import { useAppStore } from '../store/useAppStore';

export function SettingsPage() {
  const settings = useAppStore((s) => s.settings); const toggle = useAppStore((s) => s.toggleSetting); const setWallpaper = useAppStore((s) => s.setWallpaper);
  return <section className="space-y-2"><h1 className="mb-2 text-base font-semibold">Settings</h1><SettingsRow label="Haptic feedback" description="Telegram haptics" right={<button onClick={() => toggle('haptics')} className="text-xs">{settings.haptics ? 'On' : 'Off'}</button>} /><SettingsRow label="Animations" description="Smooth transitions" right={<button onClick={() => toggle('animations')} className="text-xs">{settings.animations ? 'On' : 'Off'}</button>} /><SettingsRow label="Profile visibility" description="Public or private" right={<button onClick={() => toggle('visibility')} className="text-xs">{settings.visibility ? 'Public' : 'Private'}</button>} /><div className="rounded-2xl bg-white/10 p-3"><label className="mb-1 block text-sm">Wallpaper intensity</label><input type="range" min="10" max="90" value={settings.wallpaper} onChange={(e) => setWallpaper(Number(e.target.value))} className="w-full" /></div></section>;
}
