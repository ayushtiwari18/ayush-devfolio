'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, X, Plus, Github, ExternalLink, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import ImageUploader from '@/components/admin/ImageUploader';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [techInput, setTechInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [strategyInput, setStrategyInput] = useState({ title: '', description: '' });
  const [challengeInput, setChallengeInput] = useState({ problem: '', fix: '' });
  const [formData, setFormData] = useState({});

  useEffect(() => { fetchProject(); }, [params.id]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase.from('projects').select('*').eq('id', params.id).single();
      if (error) throw error;
      setFormData({
        ...data,
        technologies: data.technologies || [],
        tags: data.tags || [],
        strategies: data.strategies || [],
        challenges: data.challenges || [],
        order: data.order ?? 0,
        date: data.date ? data.date.split('T')[0] : '',
      });
    } catch (err) {
      alert('Error loading project: ' + err.message);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
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
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('projects').update(payload).eq('id', params.id);
      if (error) throw error;
      router.push('/admin/projects');
    } catch (err) {
      alert('Error updating project: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    try {
      const { error } = await supabase.from('projects').delete().eq('id', params.id);
      if (error) throw error;
      router.push('/admin/projects');
    } catch (err) {
      alert('Error deleting: ' + err.message);
    }
  };

  if (fetching) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
    </div>
  );

  const Field = ({ label, name, type = 'text', placeholder = '', required = false }) => (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">{label}{required && ' *'}</label>
      <input type={type} name={name} value={formData[name] ?? ''} onChange={handleChange} required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
    </div>
  );

  const TextArea = ({ label, name, rows = 4, placeholder = '' }) => (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      <textarea name={name} value={formData[name] ?? ''} onChange={handleChange} rows={rows} placeholder={placeholder}
        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <Link href="/admin/projects">
          <Button variant="outline" className="mb-4"><ArrowLeft className="mr-2" size={18} />Back to Projects</Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Project</h1>
            <p className="text-muted-foreground mt-1">Update project information</p>
          </div>
          <Button variant="outline" onClick={handleDelete} className="border-red-500 text-red-500 hover:bg-red-500/10">
            <Trash2 size={18} className="mr-2" />Delete
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Basic Info ── */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Basic Information</h2>
          <div className="space-y-4">
            <Field label="Project Title" name="title" required />
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">URL Slug *</label>
              <input type="text" name="slug" value={formData.slug ?? ''} onChange={handleChange} required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <p className="text-xs text-muted-foreground mt-1">/projects/{formData.slug || 'slug'}</p>
            </div>
            <TextArea label="Short Description" name="description" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Duration" name="duration" placeholder="Jan 2025 – Present" />
              <Field label="Date" name="date" type="date" />
            </div>
            <Field label="Display Order" name="order" type="number" />
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
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.technologies?.map(t => (
              <span key={t} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20 flex items-center gap-2">
                {t}<button type="button" onClick={() => removeTech(t)}><X size={14} /></button>
              </span>
            ))}
          </div>
        </section>

        {/* ── Tags ── */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Tags</h2>
          <div className="flex gap-2">
            <input value={tagInput} onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="mern, fullstack…" />
            <Button type="button" onClick={addTag}><Plus size={18} className="mr-1" />Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags?.map(t => (
              <span key={t} className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full border border-border flex items-center gap-2">
                {t}<button type="button" onClick={() => removeTag(t)}><X size={14} /></button>
              </span>
            ))}
          </div>
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
              <input type="url" name="github_url" value={formData.github_url ?? ''} onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://github.com/username/repo" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2"><ExternalLink size={16} /> Live Demo URL</label>
              <input type="url" name="live_url" value={formData.live_url ?? ''} onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://myproject.com" />
            </div>
          </div>
        </section>

        {/* ── Case Study ── */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Case Study</h2>
          <div className="space-y-4">
            <TextArea label="Problem Statement" name="problem_statement" rows={4} />
            <TextArea label="Solution" name="solution" rows={4} />
            <TextArea label="Architecture Plan" name="architecture_plan" rows={4} />
            <TextArea label="Code Structure" name="code_structure" rows={4} />
            <TextArea label="Performance Notes" name="performance_notes" rows={3} />
            <TextArea label="Trade-offs" name="trade_offs" rows={3} />
            <TextArea label="Lessons Learned" name="lessons_learned" rows={3} />
            <TextArea label="Future Improvements" name="future_improvements" rows={3} />
            <TextArea label="Security Notes" name="security_notes" rows={3} />
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
          {formData.strategies?.map((s, i) => (
            <div key={i} className="flex items-start justify-between p-3 bg-background rounded-lg border border-border mb-2">
              <div><p className="font-medium text-foreground">{s.title}</p><p className="text-sm text-muted-foreground">{s.description}</p></div>
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
          {formData.challenges?.map((c, i) => (
            <div key={i} className="flex items-start justify-between p-3 bg-background rounded-lg border border-border mb-2">
              <div><p className="font-medium text-foreground">{c.problem}</p><p className="text-sm text-muted-foreground">{c.fix}</p></div>
              <button type="button" onClick={() => removeChallenge(i)}><X size={16} className="text-red-400" /></button>
            </div>
          ))}
        </section>

        {/* ── Settings ── */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Settings</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="featured" checked={formData.featured ?? false} onChange={handleChange} className="w-5 h-5 accent-primary" />
              <div><p className="font-medium text-foreground">Featured Project</p><p className="text-sm text-muted-foreground">Show prominently on the homepage</p></div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="published" checked={formData.published ?? true} onChange={handleChange} className="w-5 h-5 accent-primary" />
              <div><p className="font-medium text-foreground">Publish Project</p><p className="text-sm text-muted-foreground">Make visible to the public</p></div>
            </label>
          </div>
        </section>

        {/* ── Actions ── */}
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary/90">
            {loading ? <><Loader2 size={18} className="animate-spin mr-2" />Saving…</> : <><Save size={18} className="mr-2" />Save Changes</>}
          </Button>
          <Link href="/admin/projects">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
        </div>

      </form>
    </div>
  );
}
