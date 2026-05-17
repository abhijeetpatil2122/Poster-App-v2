import { CategoryPills } from '../components/CategoryPills';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { MessageCard } from '../components/MessageCard';
import { useFilteredPosts } from '../hooks/useFilteredPosts';

export function HomePage() {
  const posts = useFilteredPosts();
  return <section><header className="sticky top-0 z-20 mb-2 rounded-2xl bg-slate-900/50 p-3 backdrop-blur"><h1 className="text-base font-semibold">AnonWall</h1><p className="text-xs text-slate-400">anonymous confessions & moods</p></header><CategoryPills /><div className="mt-3 space-y-3">{posts.map((post) => <MessageCard key={post.id} post={post} />)}</div><FloatingActionButton /></section>;
}
