import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { AppLayout } from './layouts/AppLayout';
import { HomePage } from './pages/HomePage';
import { CreatePostPage } from './pages/CreatePostPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { useAppStore } from './store/useAppStore';
import { initTelegram } from './telegram/initTelegram';

const pageMap = {
  home: HomePage,
  create: CreatePostPage,
  profile: ProfilePage,
  settings: SettingsPage
};

export default function App() {
  const currentTab = useAppStore((s) => s.currentTab);

  useEffect(() => {
    initTelegram();
  }, []);

  const Page = pageMap[currentTab];

  return (
    <AppLayout>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18 }}
          className="pb-28"
        >
          <Page />
        </motion.div>
      </AnimatePresence>
    </AppLayout>
  );
}
