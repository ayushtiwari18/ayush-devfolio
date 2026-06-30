import {
  Layers, Cpu, GitBranch, Shield, Rocket, Database,
  RefreshCw, Code2, Globe, Lock, Gauge, BrainCircuit,
} from 'lucide-react';

// Auto-assign icon based on strategy title keywords
const ICON_COLORS = [
  { icon: Layers,       color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  { icon: Cpu,          color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20'   },
  { icon: GitBranch,    color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20'  },
  { icon: Shield,       color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  { icon: Rocket,       color: 'text-pink-400',   bg: 'bg-pink-500/10',   border: 'border-pink-500/20'   },
  { icon: Database,     color: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/20'   },
  { icon: RefreshCw,    color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  { icon: Code2,        color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  { icon: Globe,        color: 'text-teal-400',   bg: 'bg-teal-500/10',   border: 'border-teal-500/20'   },
  { icon: Lock,         color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20'    },
  { icon: Gauge,        color: 'text-emerald-400',bg: 'bg-emerald-500/10',border: 'border-emerald-500/20'},
  { icon: BrainCircuit, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
];

export default function StrategyGrid({ strategies }) {
  if (!strategies || strategies.length === 0) return null;

  return (
    <section id="strategies" className="mb-12 scroll-mt-24">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
          <Rocket size={17} className="text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Key Strategies</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {strategies.map((item, i) => {
          const { icon: Icon, color, bg, border } = ICON_COLORS[i % ICON_COLORS.length];
          return (
            <div
              key={i}
              className="group p-5 bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${bg} border ${border} shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon size={18} className={color} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1.5">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
