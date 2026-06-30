'use client';

import { useState, useMemo } from 'react';
import {
  Award, ExternalLink, X, Calendar, Hash,
  ShieldCheck, Link2, Tag, ChevronRight, LayoutGrid,
} from 'lucide-react';

// ── helpers ───────────────────────────────────────────────────
const fmt = (d) => d
  ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
  : null;

// ── Shared fallback placeholder ────────────────────────────────
function CertFallback({ large = false }) {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/10 via-primary/5 to-zinc-900"
      style={{ height: large ? 220 : 140 }}
    >
      <div className={`rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center ${
        large ? 'w-20 h-20' : 'w-10 h-10'
      }`}>
        <Award size={large ? 36 : 20} className="text-primary/60" />
      </div>
      {!large && <span className="text-[10px] text-muted-foreground/50 font-medium">No image</span>}
    </div>
  );
}

// ── Adaptive image for card (plain img + onError) ───────────────
function CertCardImage({ src, alt }) {
  const [failed, setFailed] = useState(!src);
  if (failed) return <CertFallback large={false} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="w-full h-auto block"
      style={{ maxHeight: 200, minHeight: 100, objectFit: 'contain', padding: '12px', background: 'transparent' }}
    />
  );
}

// ── Modal image (plain img + onError) ───────────────────────
function CertModalImage({ src, alt }) {
  const [failed, setFailed] = useState(!src);
  if (failed) return <CertFallback large />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className="w-full h-auto block"
      style={{ maxHeight: 380, objectFit: 'contain' }}
    />
  );
}

// ── Detail Modal ──────────────────────────────────────────
function CertModal({ cert, onClose }) {
  if (!cert) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-background/80 border border-border flex items-center justify-center hover:bg-primary/10 hover:border-primary/40 transition-all"
        >
          <X size={15} />
        </button>

        {/* Certificate image — adaptive ratio, never cropped */}
        <div className="w-full bg-zinc-950 overflow-hidden">
          <CertModalImage src={cert.image} alt={cert.title} />
          <div className="h-8 bg-gradient-to-t from-card to-transparent -mt-8 pointer-events-none" />
        </div>

        {/* Scrollable details */}
        <div className="overflow-y-auto p-6 flex-1">
          {cert.category && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold rounded-full mb-3">
              <Tag size={10} />{cert.category}
            </span>
          )}

          <h2 className="text-xl font-bold text-foreground mb-1 leading-snug">{cert.title}</h2>
          <p className="text-base text-primary font-semibold mb-5">{cert.issuer}</p>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {fmt(cert.date) && (
              <div className="flex items-center gap-2.5 p-3 bg-background rounded-xl border border-border">
                <Calendar size={14} className="text-primary shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Issued</p>
                  <p className="text-sm font-medium text-foreground">{fmt(cert.date)}</p>
                </div>
              </div>
            )}
            {fmt(cert.expiry_date) && (
              <div className="flex items-center gap-2.5 p-3 bg-background rounded-xl border border-border">
                <Calendar size={14} className="text-orange-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Expires</p>
                  <p className="text-sm font-medium text-foreground">{fmt(cert.expiry_date)}</p>
                </div>
              </div>
            )}
            {cert.credential_id && (
              <div className="flex items-center gap-2.5 p-3 bg-background rounded-xl border border-border">
                <Hash size={14} className="text-primary shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Credential ID</p>
                  <p className="text-sm font-mono text-foreground truncate">{cert.credential_id}</p>
                </div>
              </div>
            )}
            {cert.category && (
              <div className="flex items-center gap-2.5 p-3 bg-background rounded-xl border border-border">
                <Tag size={14} className="text-primary shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Category</p>
                  <p className="text-sm font-medium text-foreground">{cert.category}</p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {cert.description && (
            <div className="p-4 bg-background border border-border rounded-xl mb-5">
              <p className="text-sm text-muted-foreground leading-relaxed">{cert.description}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            {cert.url && (
              <a href={cert.url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors">
                <ExternalLink size={14} /> View Credential
              </a>
            )}
            {cert.verification_url && (
              <a href={cert.verification_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-background border border-border text-foreground text-sm font-semibold rounded-xl hover:border-primary/40 hover:bg-primary/5 transition-all">
                <ShieldCheck size={14} className="text-green-400" /> Verify
              </a>
            )}
            {cert.credential_id && (
              <button
                onClick={() => navigator.clipboard.writeText(cert.credential_id)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-background border border-border text-foreground text-sm font-semibold rounded-xl hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                <Link2 size={14} className="text-primary" /> Copy ID
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Cert card ────────────────────────────────────────────────
function CertCard({ cert, onClick }) {
  return (
    <button
      onClick={() => onClick(cert)}
      className="group w-full text-left bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
    >
      {/* Image area — adaptive ratio, no crop */}
      <div className="relative w-full bg-zinc-950 overflow-hidden">
        <CertCardImage src={cert.image} alt={cert.title} />
        {cert.category && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium rounded-full z-10">
            {cert.category}
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h2 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug flex-1">
            {cert.title}
          </h2>
          <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary shrink-0 mt-0.5 transition-colors" />
        </div>

        <p className="text-xs text-primary font-semibold mb-1">{cert.issuer}</p>

        {fmt(cert.date) && (
          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mb-2">
            <Calendar size={10} />{fmt(cert.date)}
          </p>
        )}

        {cert.description && (
          <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 mb-3 flex-1">
            {cert.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/60">
          <span className="text-[10px] text-muted-foreground/60 font-medium">
            {cert.credential_id ? `ID: ${cert.credential_id.slice(0, 12)}…` : 'Click to view'}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-primary font-semibold">
            <ExternalLink size={9} /> Details
          </span>
        </div>
      </div>
    </button>
  );
}

// ── Main export ───────────────────────────────────────────────
export default function CertificationsClient({ certifications }) {
  const [selected, setSelected] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => {
    const cats = new Set();
    certifications.forEach(c => { if (c.category) cats.add(c.category); });
    return ['All', ...Array.from(cats).sort()];
  }, [certifications]);

  const filtered = useMemo(() =>
    activeCategory === 'All'
      ? certifications
      : certifications.filter(c => c.category === activeCategory),
    [certifications, activeCategory]
  );

  return (
    <>
      {/* Category filter */}
      {categories.length > 2 && (
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
              }`}
            >
              {cat === 'All' ? <LayoutGrid size={12} /> : <Tag size={11} />}
              {cat}
              {cat === 'All' && (
                <span className={`text-xs ml-0.5 ${activeCategory === 'All' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {certifications.length}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
            <Award size={28} className="text-primary/60" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">No certifications in this category</h3>
          <button onClick={() => setActiveCategory('All')}
            className="mt-3 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors">
            Show all
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(cert => (
            <CertCard key={cert.id} cert={cert} onClick={setSelected} />
          ))}
        </div>
      )}

      {/* Modal */}
      {selected && <CertModal cert={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
