'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { LayoutTemplate, AlertCircle, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ---------------------------------------------------------------------------
// Mermaid renderer — loaded dynamically, never in SSR bundle
// ---------------------------------------------------------------------------
function MermaidDiagram({ code }) {
  const ref   = useRef(null);
  const [err, setErr]       = useState(null);
  const [ready, setReady]   = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function render() {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: { primaryColor: '#6366f1', edgeLabelBackground: '#1e1e2e' },
        });
        const id  = `mermaid-${Math.random().toString(36).slice(2)}`;
        const { svg } = await mermaid.render(id, code);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
          setReady(true);
        }
      } catch (e) {
        if (!cancelled) setErr(e.message || 'Invalid Mermaid syntax');
      }
    }
    render();
    return () => { cancelled = true; };
  }, [code]);

  if (err) return (
    <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
      <AlertCircle size={16} />
      <span>Diagram error: {err}</span>
    </div>
  );

  return (
    <div className="relative">
      {!ready && (
        <div className="flex items-center gap-2 py-8 justify-center text-muted-foreground text-sm">
          <Loader2 size={16} className="animate-spin" />
          <span>Rendering diagram…</span>
        </div>
      )}
      <div
        ref={ref}
        className="w-full overflow-x-auto rounded-xl bg-muted/30 border border-border p-4"
        style={{ display: ready ? 'block' : 'none' }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// ArchitectureViewer — handles text | mermaid | image
// Props:
//   architecturePlan  — string content
//   architectureType  — 'text' | 'mermaid' | 'image'
//   apiFlowDiagram    — legacy image URL
//   dbSchemaVisual    — legacy image URL
// ---------------------------------------------------------------------------
export default function ArchitectureViewer({
  architecturePlan,
  architectureType = 'text',
  apiFlowDiagram,
  dbSchemaVisual,
}) {
  const hasMain   = architecturePlan && architecturePlan.trim() !== '';
  const hasLegacy = apiFlowDiagram || dbSchemaVisual;
  if (!hasMain && !hasLegacy) return null;

  return (
    <section id="architecture" className="mb-12 scroll-mt-24">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
          <LayoutTemplate size={17} className="text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Architecture</h2>
      </div>

      <div className="border-l-2 border-primary/20 pl-5 space-y-6">
        {hasMain && (
          <>
            {architectureType === 'mermaid' && (
              <MermaidDiagram code={architecturePlan} />
            )}
            {architectureType === 'image' && (
              <div className="relative w-full rounded-xl overflow-hidden border border-border bg-muted">
                <Image
                  src={architecturePlan}
                  alt="Architecture diagram"
                  width={1200} height={600}
                  className="w-full h-auto"
                  style={{ objectFit: 'contain' }}
                  unoptimized
                />
              </div>
            )}
            {architectureType === 'text' && (
              <div className="prose prose-invert prose-blue max-w-none text-muted-foreground prose-p:text-[0.95rem]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{architecturePlan}</ReactMarkdown>
              </div>
            )}
          </>
        )}

        {/* Legacy image fields */}
        {apiFlowDiagram && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">API Flow</p>
            <div className="relative w-full rounded-xl overflow-hidden border border-border bg-muted">
              <Image src={apiFlowDiagram} alt="API flow diagram" width={1200} height={600} className="w-full h-auto" style={{ objectFit: 'contain' }} unoptimized />
            </div>
          </div>
        )}
        {dbSchemaVisual && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Database Schema</p>
            <div className="relative w-full rounded-xl overflow-hidden border border-border bg-muted">
              <Image src={dbSchemaVisual} alt="Database schema" width={1200} height={600} className="w-full h-auto" style={{ objectFit: 'contain' }} unoptimized />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
