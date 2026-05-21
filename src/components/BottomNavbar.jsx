import { Home, PlusSquare, Settings, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
const tabs = [{ id: 'home', icon: Home }, { id: 'create', icon: PlusSquare }, { id: 'profile', icon: User }, { id: 'settings', icon: Settings }];
export function BottomNavbar() {
  const tab = useAppStore((s) => s.currentTab); const setTab = useAppStore((s) => s.setTab);
  return <nav className="fixed bottom-4 left-1/2 z-30 w-[92%] max-w-sm -translate-x-1/2 rounded-full border border-white/20 bg-black/35 p-2 backdrop-blur-xl"><div className="relative flex justify-around">{tabs.map(({ id, icon: Icon }) => <button key={id} onClick={() => setTab(id)} className="relative z-10 rounded-full p-2.5 text-slate-200">{tab===id && <motion.span layoutId="active-pill" className="absolute inset-0 -z-10 rounded-full bg-white/20" />}<Icon size={20} /></button>)}</div></nav>;
}
