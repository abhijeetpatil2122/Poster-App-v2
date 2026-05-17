import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';

export const useFilteredPosts = () => {
  const posts = useAppStore((s) => s.posts);
  const activeCategory = useAppStore((s) => s.activeCategory);
  return useMemo(() => (activeCategory === 'All' ? posts : posts.filter((p) => p.category === activeCategory)), [posts, activeCategory]);
};
