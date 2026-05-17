import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

export function AnimatedBackground() {
  const intensity = useAppStore((s) => s.settings.wallpaper);
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-tg bg-[radial-gradient(circle_at_top,#1e3a8a33,transparent_45%),url('https://images.unsplash.com/photo-1526401485004-2fda9f8f95f3?auto=format&fit=crop&w=900&q=60')] bg-cover bg-center" style={{ opacity: 0.2 + intensity / 120 }}>
      <motion.div className="absolute inset-0 bg-slate-900/35 backdrop-blur-[1px]" animate={{ opacity: [0.25, 0.4, 0.25] }} transition={{ duration: 8, repeat: Infinity }} />
    </div>
  );
}
