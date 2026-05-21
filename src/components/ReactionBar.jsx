import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { haptic } from '../telegram/initTelegram';

const emojis = ['❤️', '😂', '😭', '💀', '😳', '🫂'];

export function ReactionBar({ post }) {
  const react = useAppStore((s) => s.reactToPost);
  return <div className="mt-3 flex flex-wrap gap-2">{emojis.map((e) => <motion.button whileTap={{ scale: 0.9 }} key={e} onClick={() => { haptic('selection'); react(post.id, e); }} className="rounded-full bg-white/10 px-2.5 py-1 text-xs">{e} {post.reactions[e] ?? 0}</motion.button>)}</div>;
}
