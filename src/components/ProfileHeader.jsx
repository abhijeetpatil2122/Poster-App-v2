import Lottie from 'lottie-react';
import avatarAnim from '../animations/avatar-sticker.json';
import { useAppStore } from '../store/useAppStore';

export function ProfileHeader() {
  const profile = useAppStore((s) => s.profile);
  return <div className="rounded-3xl bg-white/10 p-4 backdrop-blur"><div className="mx-auto h-24 w-24"><Lottie animationData={avatarAnim} loop /></div><h2 className="text-center text-lg font-semibold">@{profile.username}</h2><p className="text-center text-sm text-slate-300">{profile.bio}</p></div>;
}
