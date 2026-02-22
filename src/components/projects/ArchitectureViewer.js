'use client';

import Image from 'next/image';

/**
 * ArchitectureViewer — CLIENT COMPONENT (dynamic import, ssr: false)
 * -------------------------------------------------------------------
 * Renders api_flow_diagram or db_schema_visual as a next/image.
 * Dynamically imported — never in initial bundle.
 * Renders nothing if both fields are null.
 *
 * Props:
 *   apiFlowDiagram   – image URL or null
 *   dbSchemaVisual   – image URL or null
 */
export default function ArchitectureViewer({ apiFlowDiagram, dbSchemaVisual }) {
  if (!apiFlowDiagram && !dbSchemaVisual) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
        <span aria-hidden="true">🗺️</span>
        Architecture & Schema
      </h2>
      <div className="space-y-6">
        {apiFlowDiagram && (
          <div>
            <p className="text-sm text-muted-foreground mb-3 font-medium">API Flow</p>
            <div className="relative w-full rounded-xl overflow-hidden border border-border bg-muted" style={{ minHeight: 200 }}>
              <Image
                src={apiFlowDiagram}
                alt="API flow diagram"
                width={1200}
                height={600}
                className="w-full h-auto"
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
        )}
        {dbSchemaVisual && (
          <div>
            <p className="text-sm text-muted-foreground mb-3 font-medium">Database Schema</p>
            <div className="relative w-full rounded-xl overflow-hidden border border-border bg-muted" style={{ minHeight: 200 }}>
              <Image
                src={dbSchemaVisual}
                alt="Database schema visual"
                width={1200}
                height={600}
                className="w-full h-auto"
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
