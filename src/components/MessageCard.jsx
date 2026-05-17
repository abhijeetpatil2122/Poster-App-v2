import { Bookmark, MessageCircle, Share2 } from 'lucide-react';
import { ReactionBar } from './ReactionBar';
import { useAppStore } from '../store/useAppStore';

export function MessageCard({ post }) {
  const openReplies = useAppStore((s) => s.openReplies);
  return (
    <article className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-bubble backdrop-blur-md">
      <div className="mb-2 flex items-center gap-2 text-xs text-slate-300"><span>{post.avatar}</span><span>{post.anonymous ? 'Anonymous' : post.username}</span><span className="ml-auto">{post.time}</span></div>
      <p className="text-sm leading-relaxed text-slate-100">{post.text}</p>
      <div className="mt-2 text-[11px] text-sky-200">{post.mood} {post.category}</div>
      <ReactionBar post={post} />
      <div className="mt-3 flex items-center gap-4 text-slate-300">
        <button onClick={() => openReplies(post)} className="flex items-center gap-1 text-xs"><MessageCircle size={15} /> {post.replies}</button>
        <button className="text-xs"><Bookmark size={15} /></button>
        <button className="text-xs"><Share2 size={15} /></button>
      </div>
    </article>
  );
}
