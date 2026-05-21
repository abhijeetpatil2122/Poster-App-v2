import { useState } from 'react';
import { ComposerInput } from '../components/ComposerInput';
import { categories } from '../data/mockPosts';

export function CreatePostPage() {
  const [text, setText] = useState(''); const [anon, setAnon] = useState(true); const [cat, setCat] = useState('Late Night');
  return <section className="space-y-3"><h1 className="text-base font-semibold">New Post</h1><ComposerInput value={text} onChange={setText} /><div className="flex items-center justify-between rounded-2xl bg-white/10 p-3"><span className="text-sm">Post anonymously</span><button onClick={() => setAnon(!anon)} className={`h-7 w-12 rounded-full ${anon ? 'bg-sky-500' : 'bg-slate-600'}`} /></div><select value={cat} onChange={(e) => setCat(e.target.value)} className="w-full rounded-2xl bg-white/10 p-3 text-sm">{categories.slice(1).map((c) => <option key={c}>{c}</option>)}</select><button className="w-full rounded-2xl bg-tg-button py-3 text-sm font-medium text-tg-buttonText">Post to Wall</button></section>;
}
