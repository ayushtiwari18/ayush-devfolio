'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft, Save, X, Plus, ExternalLink, Loader2, Trash2, ImageIcon,
  Eye, EyeOff, ChevronDown, ChevronUp, Zap,
} from 'lucide-react';
import { GitHubIcon } from '@/components/icons/BrandIcons';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import ImageUploader from '@/components/admin/ImageUploader';
import FallbackImage from '@/components/ui/FallbackImage';
import { supabase } from '@/lib/supabase';

// ── Stable sub-components ────────────────────────────────────────────────────
function Field({ label, name, type = 'text', placeholder = '', required = false, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">{label}{required && ' *'}</label>
      <input type={type} name={name} value={value ?? ''} onChange={onChange} required={required}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
    </div>
  );
}

function TextArea({ label, name, rows = 4, placeholder = '', hint, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      {hint && <p className="text-xs text-muted-foreground mb-2">{hint}</p>}
      <textarea name={name} value={value ?? ''} onChange={onChange} rows={rows} placeholder={placeholder}
        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y font-mono text-sm" />
    </div>
  );
}

// ── Visibility toggle grid ───────────────────────────────────────────────────
const VISIBILITY_FIELDS = [
  { key: 'show_architecture',   label: 'Architecture' },
  { key: 'show_code_structure', label: 'Code Structure' },
  { key: 'show_challenges',     label: 'Challenges' },
  { key: 'show_strategies',     label: 'Strategies' },
  { key: 'show_performance',    label: 'Performance' },
  { key: 'show_tradeoffs',      label: 'Trade-offs' },
  { key: 'show_lessons',        label: 'Lessons Learned' },
  { key: 'show_future',         label: 'Future Plans' },
  { key: 'show_security',       label: 'Security' },
];

// ── Architecture type options ─────────────────────────────────────────────────
const ARCH_TYPES = [
  { value: 'text',    label: 'Plain Text',      desc: 'Rendered as formatted text' },
  { value: 'mermaid', label: 'Mermaid Diagram', desc: 'Flowchart rendered from mermaid syntax' },
  { value: 'image',   label: 'Image URL',       desc: 'architecture_plan field used as image src' },
];

// ── Main page ────────────────────────────────────────────────────────────────
export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const [loading,          setLoading]          = useState(false);
  const [fetching,         setFetching]         = useState(true);
  const [showDeleteModal,  setShowDeleteModal]  = useState(false);
  const [deleting,         setDeleting]         = useState(false);
  const [visibilityOpen,   setVisibilityOpen]   = useState(false);
  const [techInput,        setTechInput]        = useState('');
  const [tagInput,         setTagInput]         = useState('');
  const [strategyInput,    setStrategyInput]    = useState({ title: '', description: '' });
  const [challengeInput,   setChallengeInput]   = useState({ problem: '', fix: '' });
  const [metricInput,      setMetricInput]      = useState({ label: '', value: '', unit: '', good: true });
  const [formData,         setFormData]         = useState({});

  useEffect(() => { fetchProject(); }, [params.id]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase.from('projects').select('*').eq('id', params.id).single();
      if (error) throw error;
      setFormData({
        ...data,
        technologies:        data.technologies        || [],
        tags:                data.tags                || [],
        strategies:          data.strategies          || [],
        challenges:          data.challenges          || [],
        performance_metrics: data.performance_metrics || [],
        order_index:         data.order_index         ?? 0,
        date:                data.date ? data.date.split('T')[0] : '',
        // new columns — DB defaults already correct, but seed here for safety
        architecture_type:   data.architecture_type   || 'text',
        code_structure_json: data.code_structure_json || null,
        show_architecture:   data.show_architecture   ?? true,
        show_code_structure: data.show_code_structure ?? true,
        show_challenges:     data.show_challenges     ?? true,
        show_strategies:     data.show_strategies     ?? true,
        show_performance:    data.show_performance    ?? true,
        show_tradeoffs:      data.show_tradeoffs      ?? true,
        show_lessons:        data.show_lessons        ?? true,
        show_future:         data.show_future         ?? true,
        show_security:       data.show_security       ?? true,
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

  // ── Tech / Tag helpers ──
  const addTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData(p => ({ ...p, technologies: [...p.technologies, techInput.trim()] }));
      setTechInput('');
    }
  };
  const removeTech = t => setFormData(p => ({ ...p, technologies: p.technologies.filter(x => x !== t) }));

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(p => ({ ...p, tags: [...p.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };
  const removeTag = t => setFormData(p => ({ ...p, tags: p.tags.filter(x => x !== t) }));

  // ── Strategy / Challenge helpers ──
  const addStrategy = () => {
    if (strategyInput.title.trim()) {
      setFormData(p => ({ ...p, strategies: [...p.strategies, { ...strategyInput }] }));
      setStrategyInput({ title: '', description: '' });
    }
  };
  const removeStrategy = i => setFormData(p => ({ ...p, strategies: p.strategies.filter((_, idx) => idx !== i) }));

  const addChallenge = () => {
    if (challengeInput.problem.trim()) {
      setFormData(p => ({ ...p, challenges: [...p.challenges, { ...challengeInput }] }));
      setChallengeInput({ problem: '', fix: '' });
    }
  };
  const removeChallenge = i => setFormData(p => ({ ...p, challenges: p.challenges.filter((_, idx) => idx !== i) }));

  // ── Performance metric helpers ──
  const addMetric = () => {
    if (metricInput.label.trim() && metricInput.value.trim()) {
      setFormData(p => ({ ...p, performance_metrics: [...(p.performance_metrics || []), { ...metricInput }] }));
      setMetricInput({ label: '', value: '', unit: '', good: true });
    }
  };
  const removeMetric = i => setFormData(p => ({ ...p, performance_metrics: p.performance_metrics.filter((_, idx) => idx !== i) }));

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title:               formData.title,
        slug:                formData.slug,
        description:         formData.description,
        cover_image:         formData.cover_image,
        technologies:        formData.technologies,
        tags:                formData.tags,
        github_url:          formData.github_url,
        live_url:            formData.live_url,
        featured:            formData.featured,
        published:           formData.published,
        order_index:         Number(formData.order_index) || 0,
        duration:            formData.duration            || null,
        date:                formData.date                || null,
        problem_statement:   formData.problem_statement   || null,
        solution:            formData.solution            || null,
        architecture_plan:   formData.architecture_plan   || null,
        code_structure:      formData.code_structure      || null,
        performance_notes:   formData.performance_notes   || null,
        trade_offs:          formData.trade_offs          || null,
        lessons_learned:     formData.lessons_learned     || null,
        future_improvements: formData.future_improvements || null,
        security_notes:      formData.security_notes      || null,
        strategies:          formData.strategies,
        challenges:          formData.challenges,
        // ── new fields ──
        architecture_type:   formData.architecture_type   || 'text',
        performance_metrics: formData.performance_metrics?.length > 0 ? formData.performance_metrics : null,
        code_structure_json: formData.code_structure_json || null,
        show_architecture:   formData.show_architecture   ?? true,
        show_code_structure: formData.show_code_structure ?? true,
        show_challenges:     formData.show_challenges     ?? true,
        show_strategies:     formData.show_strategies     ?? true,
        show_performance:    formData.show_performance    ?? true,
        show_tradeoffs:      formData.show_tradeoffs      ?? true,
        show_lessons:        formData.show_lessons        ?? true,
        show_future:         formData.show_future         ?? true,
        show_security:       formData.show_security       ?? true,
        updated_at:          new Date().toISOString(),
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

  const handleConfirmedDelete = async () => {
    setDeleting(true);
    try {
      const { error } = await supabase.from('projects').delete().eq('id', params.id);
      if (error) throw error;
      router.push('/admin/projects');
    } catch (err) {
      alert('Error deleting: ' + err.message);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (fetching) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <ConfirmModal
        open={showDeleteModal}
        title="Delete Project?"
        description={`"${formData.title}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete Project"
        danger
        loading={deleting}
        onConfirm={handleConfirmedDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      <div className="mb-8">
        <Link href="/admin/projects">
          <Button variant="outline" className="mb-4"><ArrowLeft className="mr-2" size={18} />Back to Projects</Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Project</h1>
            <p className="text-muted-foreground mt-1">Update project information</p>
          </div>
          <Button variant="outline" onClick={() => setShowDeleteModal(true)}
            className="border-red-500 text-red-500 hover:bg-red-500/10">
            <Trash2 size={18} className="mr-2" />Delete
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Basic Info ─────────────────────────────────────────── */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Basic Information</h2>
          <div className="space-y-4">
            <Field label="Project Title" name="title" required value={formData.title} onChange={handleChange} />
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">URL Slug *</label>
              <input type="text" name="slug" value={formData.slug ?? ''} onChange={handleChange} required
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              <p className="text-xs text-muted-foreground mt-1">/projects/{formData.slug || 'slug'}</p>
            </div>
            <TextArea label="Short Description" name="description" value={formData.description} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Duration" name="duration" placeholder="Jan 2025 – Present" value={formData.duration} onChange={handleChange} />
              <Field label="Date" name="date" type="date" value={formData.date} onChange={handleChange} />
            </div>
            <Field label="Display Order" name="order_index" type="number" value={formData.order_index} onChange={handleChange} />
          </div>
        </section>

        {/* ── Technologies ───────────────────────────────────────── */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Technologies</h2>
          <div className="flex gap-2">
            <input value={techInput} onChange={e => setTechInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())}
              className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="React.js, Node.js…" />
            <Button type="button" onClick={addTech}><Plus size={18} className="mr-1" />Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.technologies?.map(t => (
              <span key={t} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20 flex items-center gap-2">
                {t}<button type="button" onClick={() => removeTech(t)}><X size={14} /></button>
              </span>
            ))}
          </div>
        </section>

        {/* ── Tags ───────────────────────────────────────────────── */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Tags</h2>
          <div className="flex gap-2">
            <input value={tagInput} onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="mern, fullstack…" />
            <Button type="button" onClick={addTag}><Plus size={18} className="mr-1" />Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.tags?.map(t => (
              <span key={t} className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full border border-border flex items-center gap-2">
                {t}<button type="button" onClick={() => removeTag(t)}><X size={14} /></button>
              </span>
            ))}
          </div>
        </section>

        {/* ── Media & Links ──────────────────────────────────────── */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Media &amp; Links</h2>
          <div className="space-y-5">
            <ImageUploader
              label="Cover Image"
              value={formData.cover_image}
              onChange={url => setFormData(p => ({ ...p, cover_image: url }))}
              folder="projects"
              hint="Recommended: 1280×720px."
            />
            {formData.cover_image && (
              <div className="relative h-40 rounded-xl overflow-hidden bg-muted border border-border">
                <FallbackImage src={formData.cover_image} alt="Cover preview" fill className="object-cover" unoptimized
                  fallback={<div className="flex flex-col items-center gap-2 text-muted-foreground"><ImageIcon size={32} /><span className="text-xs">Image failed to load</span></div>}
                  containerClassName="absolute inset-0 flex items-center justify-center bg-muted" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <span className="flex items-center gap-2"><GitHubIcon size={16} /> GitHub URL</span>
              </label>
              <input type="url" name="github_url" value={formData.github_url ?? ''} onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://github.com/username/repo" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <span className="flex items-center gap-2"><ExternalLink size={16} /> Live Demo URL</span>
              </label>
              <input type="url" name="live_url" value={formData.live_url ?? ''} onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://myproject.com" />
            </div>
          </div>
        </section>

        {/* ── Case Study ─────────────────────────────────────────── */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Case Study Content</h2>
          <div className="space-y-4">
            <TextArea label="Problem Statement" name="problem_statement" rows={4} value={formData.problem_statement} onChange={handleChange} />
            <TextArea label="Solution" name="solution" rows={4} value={formData.solution} onChange={handleChange} />

            {/* Architecture — type selector + content */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">Architecture</label>
              <div className="grid grid-cols-3 gap-2">
                {ARCH_TYPES.map(opt => (
                  <label key={opt.value}
                    className={`flex flex-col gap-1 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      formData.architecture_type === opt.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <input type="radio" name="architecture_type" value={opt.value}
                      checked={formData.architecture_type === opt.value}
                      onChange={handleChange} className="sr-only" />
                    <span className="text-sm font-semibold text-foreground">{opt.label}</span>
                    <span className="text-xs text-muted-foreground">{opt.desc}</span>
                  </label>
                ))}
              </div>
              <TextArea
                name="architecture_plan"
                rows={5}
                placeholder={
                  formData.architecture_type === 'mermaid'
                    ? 'graph TD\n  Client-->NextJS\n  NextJS-->Supabase\n  Supabase-->PostgreSQL'
                    : formData.architecture_type === 'image'
                    ? 'https://example.com/architecture-diagram.png'
                    : 'Describe your architecture…'
                }
                value={formData.architecture_plan}
                onChange={handleChange}
                hint={
                  formData.architecture_type === 'mermaid'
                    ? 'Enter valid Mermaid syntax. Preview available at mermaid.live'
                    : formData.architecture_type === 'image'
                    ? 'Enter the full URL of your architecture diagram image'
                    : undefined
                }
              />
            </div>

            <TextArea label="Code Structure (plain text)" name="code_structure" rows={4}
              placeholder="src/\n  app/ — Next.js routes\n  components/ — UI components\n  services/ — DB logic"
              value={formData.code_structure} onChange={handleChange} />
            <TextArea label="Performance Notes" name="performance_notes" rows={3} value={formData.performance_notes} onChange={handleChange} />
            <TextArea label="Trade-offs" name="trade_offs" rows={3} value={formData.trade_offs} onChange={handleChange} />
            <TextArea label="Lessons Learned" name="lessons_learned" rows={3} value={formData.lessons_learned} onChange={handleChange} />
            <TextArea label="Future Improvements" name="future_improvements" rows={3} value={formData.future_improvements} onChange={handleChange} />
            <TextArea label="Security Notes" name="security_notes" rows={3} value={formData.security_notes} onChange={handleChange} />
          </div>
        </section>

        {/* ── Performance Metrics Builder ─────────────────────────── */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-foreground mb-2">Performance Metrics</h2>
          <p className="text-sm text-muted-foreground mb-5">Visual metric cards shown on the public page (e.g. LCP, bundle size, uptime).</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            <input value={metricInput.label} onChange={e => setMetricInput(p => ({ ...p, label: e.target.value }))}
              className="px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Label (e.g. LCP)" />
            <input value={metricInput.value} onChange={e => setMetricInput(p => ({ ...p, value: e.target.value }))}
              className="px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Value (e.g. 1.2)" />
            <input value={metricInput.unit} onChange={e => setMetricInput(p => ({ ...p, unit: e.target.value }))}
              className="px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Unit (e.g. s, kb, %)" />
            <label className="flex items-center gap-2 px-3 py-2.5 bg-background border border-border rounded-lg cursor-pointer">
              <input type="checkbox" checked={metricInput.good} onChange={e => setMetricInput(p => ({ ...p, good: e.target.checked }))}
                className="w-4 h-4 accent-primary" />
              <span className="text-sm text-foreground">Good result</span>
            </label>
          </div>
          <Button type="button" onClick={addMetric} className="mb-4">
            <Plus size={16} className="mr-1" />Add Metric
          </Button>

          {(formData.performance_metrics || []).length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
              {formData.performance_metrics.map((m, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Zap size={14} className={m.good ? 'text-green-500' : 'text-red-400'} />
                    <div>
                      <p className="text-xs text-muted-foreground">{m.label}</p>
                      <p className="text-sm font-bold text-foreground">{m.value}{m.unit}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => removeMetric(i)}>
                    <X size={14} className="text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Strategies ─────────────────────────────────────────── */}
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

        {/* ── Challenges ─────────────────────────────────────────── */}
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

        {/* ── Section Visibility ─────────────────────────────────── */}
        <section className="bg-card border border-border rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setVisibilityOpen(v => !v)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Eye size={18} className="text-primary" />
              <div className="text-left">
                <p className="font-bold text-foreground">Section Visibility</p>
                <p className="text-xs text-muted-foreground">
                  {VISIBILITY_FIELDS.filter(f => formData[f.key] !== false).length} of {VISIBILITY_FIELDS.length} sections visible on public page
                </p>
              </div>
            </div>
            {visibilityOpen ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
          </button>

          {visibilityOpen && (
            <div className="px-6 pb-6 border-t border-border">
              <p className="text-xs text-muted-foreground mt-4 mb-4">
                Toggle which case study sections appear on the public project page. Hidden sections are still saved — just not displayed.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {VISIBILITY_FIELDS.map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg cursor-pointer hover:border-primary/40 transition-colors">
                    <input
                      type="checkbox"
                      name={key}
                      checked={formData[key] ?? true}
                      onChange={handleChange}
                      className="w-4 h-4 accent-primary"
                    />
                    <div className="flex items-center gap-2">
                      {(formData[key] ?? true)
                        ? <Eye size={13} className="text-primary" />
                        : <EyeOff size={13} className="text-muted-foreground" />
                      }
                      <span className="text-sm font-medium text-foreground">{label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ── Publish Settings ───────────────────────────────────── */}
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

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary/90">
            {loading ? <><Loader2 size={18} className="animate-spin mr-2" />Saving…</> : <><Save size={18} className="mr-2" />Save Changes</>}
          </Button>
          <Link href="/admin/projects"><Button type="button" variant="outline">Cancel</Button></Link>
        </div>

      </form>
    </div>
  );
}
