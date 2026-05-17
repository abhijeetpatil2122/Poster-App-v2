import { AnimatedBackground } from '../components/AnimatedBackground';
import { BottomNavbar } from '../components/BottomNavbar';
import { ReplyModal } from '../components/ReplyModal';

export function AppLayout({ children }) {
  return <main className="mx-auto min-h-screen max-w-md px-3 pt-4 text-tg-text"><AnimatedBackground />{children}<BottomNavbar /><ReplyModal /></main>;
}
