'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X, Plus, Github, ExternalLink, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import ImageUploader from '@/components/admin/ImageUploader';

const EMPTY_FORM = {
  title: '',
  slug: '',
  description: '',
  technologies: [],
  cover_image: '',
  github_url: '',
  live_url: '',
  featured: false,
  published: true,
  order: 0,
  duration: '',
  tags: [],
  date: '',
  problem_statement: '',
  solution: '',
  architecture_plan: '',
  code_structure: '',
  performance_notes: '',
  trade_offs: '',
  lessons_learned: '',
  future_improvements: '',
  security_notes: '',
  strategies: [],
  challenges: [],
};

export default function NewProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [strategyInput, setStrategyInput] = useState({ title: '', description: '' });
  const [challengeInput, setChallengeInput] = useState({ problem: '', fix: '' });
  const [formData, setFormData] = useState(EMPTY_FORM);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const next = { ...formData, [name]: type === 'checkbox' ? checked : value };
    if (name === 'title') {
      next.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    setFormData(next);
  };

  // Technologies
  const addTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData(p => ({ ...p, technologies: [...p.technologies, techInput.trim()] }));
      setTechInput('');
    }
  };
  const removeTech = (t) => setFormData(p => ({ ...p, technologies: p.technologies.filter(x => x !== t) }));

  // Tags
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(p => ({ ...p, tags: [...p.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };
  const removeTag = (t) => setFormData(p => ({ ...p, tags: p.tags.filter(x => x !== t) }));

  // Strategies
  const addStrategy = () => {
    if (strategyInput.title.trim()) {
      setFormData(p => ({ ...p, strategies: [...p.strategies, { ...strategyInput }] }));
      setStrategyInput({ title: '', description: '' });
    }
  };
  const removeStrategy = (i) => setFormData(p => ({ ...p, strategies: p.strategies.filter((_, idx) => idx !== i) }));

  // Challenges
  const addChallenge = () => {
    if (challengeInput.problem.trim()) {
      setFormData(p => ({ ...p, challenges: [...p.challenges, { ...challengeInput }] }));
      setChallengeInput({ problem: '', fix: '' });
    }
  };
  const removeChallenge = (i) => setFormData(p => ({ ...p, challenges: p.challenges.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        image: formData.cover_image, // keep old NOT NULL column in sync
        order: Number(formData.order) || 0,
        date: formData.date || null,
      };
      const { error } = await supabase.from('projects').insert([payload]);
      if (error) throw error;
      router.push('/admin/projects');
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, name, type = 'text', placeholder = '', required = false }) => (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">{label}{required && ' *'}</label>
      <input type={type} name={name} value={formData[name]} onChange={handleChange} required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
    </div>
  );

  const TextArea = ({ label, name, rows = 4, placeholder = '' }) => (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      <textarea name={name} value={formData[name]} onChange={handleChange} rows={rows} placeholder={placeholder}
        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y" />
    </div>
  );

  const TagList = ({ items, onRemove, color = 'primary' }) => (
    <div className="flex flex-wrap gap-2 mt-2">
      {items.map((t, i) => (
        <span key={i} className={`px-3 py-1 bg-${color}/10 text-${color} text-sm rounded-full border border-${color}/20 flex items-center gap-2`}>
          {typeof t === 'string' ? t : t.title || t.problem}
          <button type="button" onClick={() => onRemove(typeof t === 'string' ? t : i)}><X size={14} /></button>
        </span>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <Link href="/admin/projects">
          <Button variant="outline" className="mb-4"><ArrowLeft className="mr-2" size={18} />Back</Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Create New Project</h1>
        <p className="text-muted-foreground mt-1">Add a new project to your portfolio</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Basic Info ── */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Basic Information</h2>
          <div className="space-y-4">
            <Field label="Project Title" name="title" required placeholder="My Awesome Project" />
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">URL Slug *</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <p className="text-xs text-muted-foreground mt-1">/projects/{formData.slug || 'slug'}</p>
            </div>
            <TextArea label="Short Description" name="description" placeholder="One paragraph overview shown on the project card." />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Duration" name="duration" placeholder="Jan 2025 – Present" />
              <Field label="Date" name="date" type="date" />
            </div>
            <Field label="Display Order" name="order" type="number" placeholder="0" />
          </div>
        </section>

        {/* ── Technologies ── */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Technologies</h2>
          <div className="flex gap-2">
            <input value={techInput} onChange={e => setTechInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())}
              className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="React.js, Node.js…" />
            <Button type="button" onClick={addTech}><Plus size={18} className="mr-1" />Add</Button>
          </div>
          <TagList items={formData.technologies} onRemove={removeTech} />
        </section>

        {/* ── Tags ── */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Tags</h2>
          <div className="flex gap-2">
            <input value={tagInput} onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="mern, fullstack, real-time…" />
            <Button type="button" onClick={addTag}><Plus size={18} className="mr-1" />Add</Button>
          </div>
          <TagList items={formData.tags} onRemove={removeTag} color="secondary" />
        </section>

        {/* ── Media & Links ── */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Media &amp; Links</h2>
          <div className="space-y-5">
            <ImageUploader
              label="Cover Image"
              value={formData.cover_image}
              onChange={url => setFormData(p => ({ ...p, cover_image: url, image: url }))}
              folder="projects"
              hint="Recommended: 1280×720px. Shown as the project thumbnail."
            />
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2"><Github size={16} /> GitHub URL</label>
              <input type="url" name="github_url" value={formData.github_url} onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://github.com/username/repo" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2"><ExternalLink size={16} /> Live Demo URL</label>
              <input type="url" name="live_url" value={formData.live_url} onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://myproject.com" />
            </div>
          </div>
        </section>

        {/* ── Case Study ── */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Case Study</h2>
          <div className="space-y-4">
            <TextArea label="Problem Statement" name="problem_statement" rows={4} placeholder="What problem does this solve?" />
            <TextArea label="Solution" name="solution" rows={4} placeholder="How did you solve it?" />
            <TextArea label="Architecture Plan" name="architecture_plan" rows={4} placeholder="Client → Server → DB flow…" />
            <TextArea label="Code Structure" name="code_structure" rows={4} placeholder="Folder / module breakdown…" />
            <TextArea label="Performance Notes" name="performance_notes" rows={3} placeholder="Benchmarks, load times, optimisations…" />
            <TextArea label="Trade-offs" name="trade_offs" rows={3} placeholder="Why X over Y?" />
            <TextArea label="Lessons Learned" name="lessons_learned" rows={3} placeholder="What would you do differently?" />
            <TextArea label="Future Improvements" name="future_improvements" rows={3} placeholder="Roadmap / planned features…" />
            <TextArea label="Security Notes" name="security_notes" rows={3} placeholder="Auth, CORS, rate limiting…" />
          </div>
        </section>

        {/* ── Strategies ── */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Key Strategies</h2>
          <div className="space-y-3 mb-4">
            <input value={strategyInput.title} onChange={e => setStrategyInput(p => ({ ...p, title: e.target.value }))}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Strategy title" />
            <textarea value={strategyInput.description} onChange={e => setStrategyInput(p => ({ ...p, description: e.target.value }))} rows={2}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Description" />
            <Button type="button" onClick={addStrategy}><Plus size={18} className="mr-1" />Add Strategy</Button>
          </div>
          {formData.strategies.map((s, i) => (
            <div key={i} className="flex items-start justify-between p-3 bg-background rounded-lg border border-border mb-2">
              <div>
                <p className="font-medium text-foreground">{s.title}</p>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
              <button type="button" onClick={() => removeStrategy(i)}><X size={16} className="text-red-400" /></button>
            </div>
          ))}
        </section>

        {/* ── Challenges ── */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Challenges &amp; Fixes</h2>
          <div className="space-y-3 mb-4">
            <input value={challengeInput.problem} onChange={e => setChallengeInput(p => ({ ...p, problem: e.target.value }))}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Problem encountered" />
            <textarea value={challengeInput.fix} onChange={e => setChallengeInput(p => ({ ...p, fix: e.target.value }))} rows={2}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="How you fixed it" />
            <Button type="button" onClick={addChallenge}><Plus size={18} className="mr-1" />Add Challenge</Button>
          </div>
          {formData.challenges.map((c, i) => (
            <div key={i} className="flex items-start justify-between p-3 bg-background rounded-lg border border-border mb-2">
              <div>
                <p className="font-medium text-foreground">{c.problem}</p>
                <p className="text-sm text-muted-foreground">{c.fix}</p>
              </div>
              <button type="button" onClick={() => removeChallenge(i)}><X size={16} className="text-red-400" /></button>
            </div>
          ))}
        </section>

        {/* ── Settings ── */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Settings</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-5 h-5 accent-primary" />
              <div>
                <p className="font-medium text-foreground">Featured Project</p>
                <p className="text-sm text-muted-foreground">Show prominently on the homepage</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="published" checked={formData.published} onChange={handleChange} className="w-5 h-5 accent-primary" />
              <div>
                <p className="font-medium text-foreground">Publish Project</p>
                <p className="text-sm text-muted-foreground">Make visible to the public</p>
              </div>
            </label>
          </div>
        </section>

        {/* ── Actions ── */}
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary/90">
            {loading ? <><Loader2 size={18} className="animate-spin mr-2" />Creating…</> : <><Save size={18} className="mr-2" />Create Project</>}
          </Button>
          <Link href="/admin/projects">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
        </div>

      </form>
    </div>
  );
}
