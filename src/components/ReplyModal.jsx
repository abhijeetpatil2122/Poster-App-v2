import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export function ReplyModal() {
  const post = useAppStore((s) => s.replyModalPost); const close = useAppStore((s) => s.closeReplies);
  return <AnimatePresence>{post && <><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={close} /><motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 20 }} className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl border-t border-white/20 bg-slate-900 p-4"><div className="mb-3 flex items-center"><h3 className="text-sm font-medium">Replies</h3><button onClick={close} className="ml-auto"><X size={16} /></button></div><p className="text-sm text-slate-200">{post.text}</p><div className="mt-3 space-y-2 text-xs text-slate-300"><p>Anonymous: same here tbh</p><p>@nightowl: sending hugs 🫂</p></div></motion.div></>}</AnimatePresence>;
}
