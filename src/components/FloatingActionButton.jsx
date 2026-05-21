import { Plus } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export function FloatingActionButton() {
  const setTab = useAppStore((s) => s.setTab);
  return <button onClick={() => setTab('create')} className="fixed bottom-24 right-4 z-20 rounded-full bg-tg-button p-4 text-white shadow-xl"><Plus /></button>;
}
