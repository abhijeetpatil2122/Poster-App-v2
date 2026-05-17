export const categories = ['All', 'Late Night', 'Relationship', 'Gaming', 'Lonely', 'Funny', 'Deep Thoughts', 'Confession', 'Random'];

export const mockPosts = [
  {
    id: '1',
    anonymous: true,
    username: 'Anonymous',
    avatar: '🫥',
    category: 'Late Night',
    mood: '🌙',
    text: 'Anyone else overthinking messages they sent 3 hours ago?',
    time: '02:12',
    reactions: { '❤️': 12, '😂': 3, '😭': 5 },
    replies: 16,
    saved: false
  },
  {
    id: '2',
    anonymous: false,
    username: 'pixel_wisp',
    avatar: '🦊',
    category: 'Gaming',
    mood: '🎮',
    text: 'I said “one game before bed” at 10pm. It is now 3:41am.',
    time: '03:41',
    reactions: { '💀': 9, '😂': 14 },
    replies: 7,
    saved: true
  }
];
