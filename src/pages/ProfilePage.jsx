import { ProfileHeader } from '../components/ProfileHeader';

export function ProfilePage() {
  return <section className="space-y-3"><ProfileHeader /><div className="grid grid-cols-3 gap-2 text-center text-xs"><div className="rounded-2xl bg-white/10 p-3"><div className="text-lg">34</div><div>Posts</div></div><div className="rounded-2xl bg-white/10 p-3"><div className="text-lg">289</div><div>Reactions</div></div><div className="rounded-2xl bg-white/10 p-3"><div className="text-lg">12</div><div>Saved</div></div></div></section>;
}
