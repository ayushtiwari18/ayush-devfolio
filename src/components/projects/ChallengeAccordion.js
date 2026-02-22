'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * ChallengeAccordion — CLIENT COMPONENT
 * --------------------------------------
 * Maps challenges JSONB array → accordion.
 * Each item: { problem: string, fix: string }
 * Only interactive part in the case-study — needs useState.
 * Renders nothing if challenges is null or empty.
 */
export default function ChallengeAccordion({ challenges }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!challenges || challenges.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
        <span aria-hidden="true">🔧</span>
        Technical Challenges & Fixes
      </h2>
      <div className="space-y-3">
        {challenges.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left bg-card hover:bg-primary/5 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-medium text-foreground text-sm pr-4">
                  {item.problem}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-muted-foreground shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 bg-card">
                  <div className="pt-3 border-t border-border">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <span className="text-primary font-medium">Fix: </span>
                      {item.fix}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
