'use client';

import { useState } from 'react';
import { ChevronDown, Bug, Wrench, AlertTriangle } from 'lucide-react';

export default function ChallengeAccordion({ challenges }) {
  const [openIndex, setOpenIndex] = useState(null);
  if (!challenges || challenges.length === 0) return null;

  return (
    <section id="challenges" className="mb-12 scroll-mt-24">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 shrink-0">
          <AlertTriangle size={17} className="text-orange-400" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Technical Challenges</h2>
      </div>

      <div className="relative border-l-2 border-primary/20 pl-5 space-y-0">
        {challenges.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="relative mb-4">
              {/* Timeline dot */}
              <div className="absolute -left-[1.85rem] top-4 w-3.5 h-3.5 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              </div>

              <div className="border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-colors bg-card">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-primary/5 transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3 pr-4">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500/15 shrink-0">
                      <Bug size={12} className="text-orange-400" />
                    </div>
                    <span className="font-medium text-foreground text-sm">{item.problem}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-muted-foreground shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 bg-card">
                    <div className="pt-3 border-t border-border flex gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/15 shrink-0 mt-0.5">
                        <Wrench size={12} className="text-green-400" />
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        <span className="text-green-400 font-semibold">Fix: </span>
                        {item.fix}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
