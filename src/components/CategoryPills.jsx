import { categories } from '../data/mockPosts';
import { useAppStore } from '../store/useAppStore';

export function CategoryPills() {
  const active = useAppStore((s) => s.activeCategory);
  const setCategory = useAppStore((s) => s.setCategory);
  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-2 no-scrollbar">
      {categories.map((cat) => (
        <button key={cat} onClick={() => setCategory(cat)} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs ${active === cat ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300'}`}>
          {cat}
        </button>
      ))}
    </div>
  );
}
