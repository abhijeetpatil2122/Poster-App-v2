import { create } from 'zustand';
import { mockPosts } from '../data/mockPosts';

export const useAppStore = create((set, get) => ({
  currentTab: 'home',
  activeCategory: 'All',
  settings: { haptics: true, animations: true, visibility: true, wallpaper: 45 },
  profile: { username: 'nightowl', bio: 'typing quietly into the void 🌙', isPrivate: false },
  posts: mockPosts,
  replyModalPost: null,
  setTab: (tab) => set({ currentTab: tab }),
  setCategory: (activeCategory) => set({ activeCategory }),
  toggleSetting: (key) => set({ settings: { ...get().settings, [key]: !get().settings[key] } }),
  setWallpaper: (wallpaper) => set({ settings: { ...get().settings, wallpaper } }),
  toggleProfilePrivate: () => set({ profile: { ...get().profile, isPrivate: !get().profile.isPrivate } }),
  openReplies: (post) => set({ replyModalPost: post }),
  closeReplies: () => set({ replyModalPost: null }),
  reactToPost: (postId, emoji) =>
    set({
      posts: get().posts.map((p) =>
        p.id === postId ? { ...p, reactions: { ...p.reactions, [emoji]: (p.reactions[emoji] ?? 0) + 1 } } : p
      )
    })
}));
