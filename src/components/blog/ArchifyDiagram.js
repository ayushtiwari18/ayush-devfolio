'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Network,
  Cpu,
  Database,
  Globe,
  Bot,
  Shield,
  Layers,
  Server,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Flame,
  Radio,
  FileCode2,
} from 'lucide-react';

const TYPE_CONFIGS = {
  frontend: {
    name: 'Frontend Ingress',
    border: 'border-indigo-500/50 hover:border-indigo-400',
    bg: 'bg-indigo-950/25 hover:bg-indigo-950/40',
    badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    accent: '#6366F1',
    accentName: 'indigo',
    glow: 'rgba(99, 102, 241, 0.4)',
    icon: Globe,
  },
  backend: {
    name: 'Backend Service',
    border: 'border-emerald-500/50 hover:border-emerald-400',
    bg: 'bg-emerald-950/25 hover:bg-emerald-950/40',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    accent: '#10B981',
    accentName: 'emerald',
    glow: 'rgba(16, 185, 129, 0.4)',
    icon: Server,
  },
  database: {
    name: 'Database / Queue',
    border: 'border-amber-500/50 hover:border-amber-400',
    bg: 'bg-amber-950/25 hover:bg-amber-950/40',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    accent: '#F59E0B',
    accentName: 'amber',
    glow: 'rgba(245, 158, 11, 0.4)',
    icon: Database,
  },
  agent: {
    name: 'Autonomous Watchdog',
    border: 'border-purple-500/50 hover:border-purple-400',
    bg: 'bg-purple-950/25 hover:bg-purple-950/40',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    accent: '#A855F7',
    accentName: 'purple',
    glow: 'rgba(168, 85, 247, 0.4)',
    icon: Bot,
  },
  ai: {
    name: 'AI Agent',
    border: 'border-purple-500/50 hover:border-purple-400',
    bg: 'bg-purple-950/25 hover:bg-purple-950/40',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    accent: '#A855F7',
    accentName: 'purple',
    glow: 'rgba(168, 85, 247, 0.4)',
    icon: Bot,
  },
  security: {
    name: 'Security & Auth',
    border: 'border-cyan-500/50 hover:border-cyan-400',
    bg: 'bg-cyan-950/25 hover:bg-cyan-950/40',
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    accent: '#06B6D4',
    accentName: 'cyan',
    glow: 'rgba(6, 182, 212, 0.4)',
    icon: Shield,
  },
  messagebus: {
    name: 'Message Bus',
    border: 'border-sky-500/50 hover:border-sky-400',
    bg: 'bg-sky-950/25 hover:bg-sky-950/40',
    badge: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    accent: '#0EA5E9',
    accentName: 'sky',
    glow: 'rgba(14, 165, 233, 0.4)',
    icon: Zap,
  },
  external: {
    name: 'Failure Point / Crash',
    border: 'border-rose-500/60 hover:border-rose-400',
    bg: 'bg-rose-950/30 hover:bg-rose-950/45',
    badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    accent: '#F43F5E',
    accentName: 'rose',
    glow: 'rgba(244, 63, 94, 0.5)',
    icon: AlertTriangle,
  },
};

// Precise Cubic Bezier Point Calculation
function getCubicBezierPoint(t, p0, p1, p2, p3) {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  const x = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
  const y = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y;

  return { x, y };
}

export default function ArchifyDiagram({ rawJson }) {
  const [mounted, setMounted] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [hoveredConn, setHoveredConn] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Parse diagram definition safely
  const diagram = useMemo(() => {
    if (!rawJson) return null;
    try {
      const data = typeof rawJson === 'string' ? JSON.parse(rawJson) : rawJson;
      if (!Array.isArray(data.components)) return null;
      return data;
    } catch {
      return null;
    }
  }, [rawJson]);

  // Calculate canvas dimensions safely with generous breathing room
  const { width, height, nodeMap, fanOutMap } = useMemo(() => {
    const map = new Map();
    const fanOuts = new Map();
    let maxX = 900;
    let maxY = 400;

    const comps = diagram?.components || [];
    comps.forEach((c) => {
      const [x, y] = c.pos || [40, 40];
      const [w, h] = c.size || [170, 56];
      map.set(c.id, { ...c, x, y, w, h });
      if (x + w + 100 > maxX) maxX = x + w + 100;
      if (y + h + 100 > maxY) maxY = y + h + 100;
    });

    // Count fan-outs per node to stagger connection curves
    const conns = diagram?.connections || [];
    conns.forEach((conn) => {
      fanOuts.set(conn.from, (fanOuts.get(conn.from) || 0) + 1);
    });

    return { width: maxX, height: maxY, nodeMap: map, fanOutMap: fanOuts };
  }, [diagram]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedNodeId(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedNodeId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedNodeId]);

  if (!diagram) {
    return (
      <div className="my-8 rounded-2xl border border-red-500/30 bg-red-950/10 p-6 text-xs font-mono text-red-300">
        <span className="font-bold">⚠️ Archify System Diagram Error:</span> Invalid diagram JSON format. Check syntax.
      </div>
    );
  }

  const { title, subtitle, components = [], connections = [] } = diagram;

  // Selected node details for interactive modal
  const selectedNode = selectedNodeId ? nodeMap.get(selectedNodeId) : null;
  const isBrokenDiagram =
    title?.toLowerCase().includes('broken') ||
    title?.toLowerCase().includes('pre-optimization');

  // SSR / Hydration Skeleton
  if (!mounted) {
    return (
      <div className="my-8 rounded-2xl border border-white/10 bg-[#070A0F] shadow-2xl overflow-hidden p-6">
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Activity size={16} className="animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-mono font-bold text-white flex items-center gap-2">
                <span>{title || 'System Architecture'}</span>
                <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Interactive Flow
                </span>
              </h4>
              {subtitle && <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
        </div>
        <div className="h-[280px] rounded-xl bg-[#06080E] border border-white/5 flex items-center justify-center mt-4">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Mounting Interactive System Flow...</span>
          </div>
        </div>
      </div>
    );
  }

  // Smart Cardinal Router: calculates smooth Bezier curves, handles return loops, and staggers fan-out edges
  const calculateSmartCurve = (from, to, connIdx, totalFanOut) => {
    const isBackward = to.x + to.w < from.x - 30;

    // Backward / Return Loop (e.g. reaper -> urgent_q)
    if (isBackward) {
      const isUpper = from.y < height / 2;
      const startX = from.x + from.w * 0.3;
      const startY = isUpper ? from.y : from.y + from.h;
      const endX = to.x + to.w * 0.7;
      const endY = isUpper ? to.y - 6 : to.y + to.h + 6;

      const peakY = isUpper
        ? Math.min(from.y, to.y) - 65
        : Math.max(from.y + from.h, to.y + to.h) + 65;

      const p0 = { x: startX, y: startY };
      const p1 = { x: startX, y: peakY };
      const p2 = { x: endX, y: peakY };
      const p3 = { x: endX, y: endY };

      const pathD = `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;
      const labelPos = getCubicBezierPoint(0.5, p0, p1, p2, p3);
      labelPos.y += isUpper ? -14 : 14;

      return { pathD, labelPos, length: Math.abs(endX - startX) + 140, p0, p3 };
    }

    const dx = to.x + to.w / 2 - (from.x + from.w / 2);
    const dy = to.y + to.h / 2 - (from.y + from.h / 2);

    // Primarily Horizontal Flow
    if (Math.abs(dx) >= Math.abs(dy)) {
      // Distribute fan-out anchors evenly along source right edge
      const fanFraction = totalFanOut > 1 ? (connIdx + 1) / (totalFanOut + 1) : 0.5;
      const startX = from.x + from.w;
      const startY = from.y + from.h * fanFraction;
      const endX = to.x - 8; // Leave clearance for arrowhead
      const endY = to.y + to.h * 0.5;

      const deltaX = Math.max(35, Math.abs(endX - startX) * 0.45);
      const p0 = { x: startX, y: startY };
      const p1 = { x: startX + deltaX, y: startY };
      const p2 = { x: endX - deltaX, y: endY };
      const p3 = { x: endX, y: endY };

      const pathD = `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;

      // Stagger label placement along curve to prevent collisions
      const t = totalFanOut > 1 ? 0.38 + ((connIdx % 3) * 0.12) : 0.5;
      const labelPos = getCubicBezierPoint(t, p0, p1, p2, p3);

      return { pathD, labelPos, length: Math.sqrt(dx * dx + dy * dy), p0, p3 };
    } else {
      // Primarily Vertical Flow
      const isDown = dy > 0;
      const startX = from.x + from.w * 0.5;
      const startY = isDown ? from.y + from.h : from.y;
      const endX = to.x + to.w * 0.5;
      const endY = isDown ? to.y - 8 : to.y + to.h + 8;

      const deltaY = Math.max(30, Math.abs(endY - startY) * 0.45);
      const p0 = { x: startX, y: startY };
      const p1 = { x: startX, y: isDown ? startY + deltaY : startY - deltaY };
      const p2 = { x: endX, y: isDown ? endY - deltaY : endY + deltaY };
      const p3 = { x: endX, y: endY };

      const pathD = `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;
      const labelPos = getCubicBezierPoint(0.5, p0, p1, p2, p3);

      return { pathD, labelPos, length: Math.sqrt(dx * dx + dy * dy), p0, p3 };
    }
  };

  // Render SVG Connection Layer with flowing dash patterns and traveling animated particles
  const renderConnection = (conn, idx) => {
    const fromNode = nodeMap.get(conn.from);
    const toNode = nodeMap.get(conn.to);
    if (!fromNode || !toNode) return null;

    const totalFanOut = fanOutMap.get(conn.from) || 1;
    // Calculate index among connections sharing the same `from`
    const fanIdx = connections.slice(0, idx).filter((c) => c.from === conn.from).length;

    const { pathD, labelPos, length } = calculateSmartCurve(fromNode, toNode, fanIdx, totalFanOut);
    const isConnHovered = hoveredConn === idx;
    const isNodeHovered = hoveredNode === conn.from || hoveredNode === conn.to;
    const isActive = isConnHovered || isNodeHovered;
    const isDimmed = (hoveredNode || hoveredConn !== null) && !isActive;

    const toConfig = TYPE_CONFIGS[toNode.type] || TYPE_CONFIGS.backend;
    const fromConfig = TYPE_CONFIGS[fromNode.type] || TYPE_CONFIGS.backend;
    const markerType = toNode.type === 'external' ? 'rose' : toConfig.accentName;
    const markerUrl = isActive ? `url(#archify-arrow-active)` : `url(#archify-arrow-${markerType})`;

    // Particle speed proportional to curve length
    const animDuration = Math.max(1.8, Math.min(3.6, length / 180));

    return (
      <g
        key={idx}
        onMouseEnter={() => setHoveredConn(idx)}
        onMouseLeave={() => setHoveredConn(null)}
        className={`transition-opacity duration-300 ${isDimmed ? 'opacity-20' : 'opacity-100'}`}
      >
        {/* Soft Ambient Glow Track */}
        <path
          d={pathD}
          fill="none"
          stroke={isActive ? '#34D399' : fromConfig.accent}
          strokeWidth={isActive ? '5' : '3'}
          opacity={isActive ? '0.45' : '0.18'}
          strokeLinecap="round"
        />

        {/* Crisp Base Track */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Dynamic Animated Flowing Stream with Directional Arrowhead */}
        <path
          d={pathD}
          fill="none"
          stroke={isActive ? '#34D399' : toConfig.accent}
          strokeWidth={isActive ? '2.5' : '1.8'}
          strokeDasharray="6 6"
          className="archify-flowing-dash"
          markerEnd={markerUrl}
        />

        {/* Traveling Flow-State Particle Packets */}
        <circle r={isActive ? 3.8 : 3} fill={isActive ? '#34D399' : toConfig.accent} opacity="0.95">
          <animateMotion path={pathD} dur={`${animDuration}s`} repeatCount="indefinite" />
        </circle>
        <circle r="2.2" fill={isActive ? '#6EE7B7' : fromConfig.accent} opacity="0.75">
          <animateMotion
            path={pathD}
            dur={`${animDuration}s`}
            begin={`${animDuration / 2}s`}
            repeatCount="indefinite"
          />
        </circle>

        {/* Sleek Non-overlapping Connection Label Pill */}
        {conn.label && (
          <foreignObject
            x={labelPos.x - 70}
            y={labelPos.y - 12}
            width="140"
            height="24"
            className="overflow-visible pointer-events-none"
          >
            <div className="flex justify-center items-center h-full">
              <span
                title={conn.label}
                className={`px-2 py-0.5 rounded-full text-[9px] font-mono tracking-tight whitespace-nowrap shadow-xl border backdrop-blur-md transition-all ${
                  isActive
                    ? 'bg-[#0F172A] text-emerald-300 border-emerald-500/60 ring-2 ring-emerald-500/30 scale-105'
                    : 'bg-[#080C14]/95 text-gray-300 border-white/10'
                }`}
              >
                {conn.label}
              </span>
            </div>
          </foreignObject>
        )}
      </g>
    );
  };

  return (
    <div className="my-8 rounded-2xl border border-white/10 bg-[#070A0F] shadow-2xl overflow-hidden group">
      {/* Diagram Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-[#0C1018] border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Activity size={16} className="animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-mono font-bold text-white flex items-center gap-2">
              <span>{title || 'System Architecture'}</span>
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Interactive Flow · Click Node to Inspect
              </span>
              <span className="text-[9px] font-mono uppercase text-gray-400 border border-white/10 px-1.5 py-0.5 rounded bg-white/[0.04]">
                Archify IR
              </span>
            </h4>
            {subtitle && <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>

        {/* Zoom & Reset Controls */}
        <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/[0.08]">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={13} />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.65, z - 0.1))}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={13} />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Interactive Visual Canvas */}
      <div className="overflow-x-auto p-8 bg-[#06080E] custom-scrollbar flex justify-center">
        <div
          style={{
            width: `${width}px`,
            height: `${height}px`,
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
          }}
          className="relative transition-transform duration-200"
        >
          {/* SVG Connection Layer */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ width: `${width}px`, height: `${height}px` }}
          >
            <defs>
              {/* Subtle Blueprint Dot Grid */}
              <pattern
                id="archify-grid-pattern"
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="0.75" fill="rgba(255, 255, 255, 0.06)" />
              </pattern>

              {/* Arrowheads for different type categories */}
              <marker
                id="archify-arrow-emerald"
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <polygon points="0 1.5, 8 5, 0 8.5" fill="#10B981" />
              </marker>

              <marker
                id="archify-arrow-indigo"
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <polygon points="0 1.5, 8 5, 0 8.5" fill="#6366F1" />
              </marker>

              <marker
                id="archify-arrow-amber"
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <polygon points="0 1.5, 8 5, 0 8.5" fill="#F59E0B" />
              </marker>

              <marker
                id="archify-arrow-purple"
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <polygon points="0 1.5, 8 5, 0 8.5" fill="#A855F7" />
              </marker>

              <marker
                id="archify-arrow-cyan"
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <polygon points="0 1.5, 8 5, 0 8.5" fill="#06B6D4" />
              </marker>

              <marker
                id="archify-arrow-rose"
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <polygon points="0 1.5, 8 5, 0 8.5" fill="#F43F5E" />
              </marker>

              <marker
                id="archify-arrow-active"
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <polygon points="0 1, 9 5, 0 9" fill="#34D399" />
              </marker>
            </defs>

            {/* Background Dot Matrix Grid */}
            <rect width="100%" height="100%" fill="url(#archify-grid-pattern)" />

            {/* Render all connections */}
            {connections.map(renderConnection)}
          </svg>

          {/* Node Cards Layer */}
          {components.map((c) => {
            const config = TYPE_CONFIGS[c.type] || TYPE_CONFIGS.backend;
            const Icon = config.icon;
            const [x, y] = c.pos || [40, 40];
            const [w, h] = c.size || [170, 56];
            const isHovered = hoveredNode === c.id;
            const isConnectedToHoveredConn =
              hoveredConn !== null &&
              (connections[hoveredConn]?.from === c.id || connections[hoveredConn]?.to === c.id);
            const isHighlighted = isHovered || isConnectedToHoveredConn;

            return (
              <div
                key={c.id}
                onClick={() => setSelectedNodeId(c.id)}
                onMouseEnter={() => setHoveredNode(c.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  width: `${w}px`,
                  minHeight: `${h}px`,
                }}
                className={`absolute rounded-xl border p-3 shadow-2xl transition-all duration-200 cursor-pointer ${
                  config.border
                } ${config.bg} backdrop-blur-md ${
                  isHighlighted
                    ? 'ring-2 ring-emerald-400/80 -translate-y-1 shadow-emerald-500/20 shadow-2xl z-20 scale-[1.03]'
                    : 'z-10'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${config.badge}`}
                  >
                    <Icon size={14} />
                  </div>
                  <div className="overflow-hidden min-w-0 flex-1">
                    <p className="text-xs font-bold text-white tracking-tight truncate leading-tight flex items-center justify-between">
                      <span className="truncate">{c.label}</span>
                      {c.status === 'critical' || c.type === 'external' ? (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0 ml-1" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 shrink-0 ml-1" />
                      )}
                    </p>
                    {c.sublabel && (
                      <p className="text-[10px] font-mono text-gray-400 truncate mt-1">
                        {c.sublabel}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subtle Action Hint on Hover */}
                {isHovered && (
                  <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-emerald-400/90">
                    <span>Inspect Node</span>
                    <ArrowRight size={10} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Explanatory Modal on Block Click */}
      {selectedNode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-200 animate-in fade-in"
          onClick={() => setSelectedNodeId(null)}
        >
          <div
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0A0E17]/95 p-6 shadow-2xl shadow-black/80 text-white backdrop-blur-xl custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                    (TYPE_CONFIGS[selectedNode.type] || TYPE_CONFIGS.backend).badge
                  }`}
                >
                  {React.createElement(
                    (TYPE_CONFIGS[selectedNode.type] || TYPE_CONFIGS.backend).icon,
                    { size: 20 }
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-gray-300">
                      {(TYPE_CONFIGS[selectedNode.type] || TYPE_CONFIGS.backend).name}
                    </span>
                    {selectedNode.status === 'critical' || selectedNode.type === 'external' ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400 font-semibold flex items-center gap-1">
                        <Flame size={10} /> Bottleneck / Failure
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 size={10} /> Production Healthy
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1 leading-tight">
                    {selectedNode.label}
                  </h3>
                  {selectedNode.sublabel && (
                    <p className="text-xs font-mono text-gray-400 mt-0.5">
                      {selectedNode.sublabel}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNodeId(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Close (ESC)"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-4 space-y-4 text-xs leading-relaxed">
              {/* Architecture Purpose */}
              <div>
                <h5 className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold mb-1.5 flex items-center gap-1.5">
                  <Activity size={12} /> Architectural Purpose & Role
                </h5>
                <p className="text-gray-300 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                  {selectedNode.description ||
                    `${selectedNode.label} coordinates execution within the ${
                      title || 'system architecture'
                    }. It handles traffic flow and decouples dependent modules.`}
                </p>
              </div>

              {/* Tech Stack & Execution Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5">
                  <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                    Role In System
                  </p>
                  <p className="text-white font-semibold mt-0.5">
                    {selectedNode.role || 'Distributed Component'}
                  </p>
                </div>
                <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5">
                  <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                    Underlying Tech
                  </p>
                  <p className="text-emerald-400 font-mono mt-0.5">
                    {selectedNode.tech || 'Node.js / Distributed Queue'}
                  </p>
                </div>
              </div>

              {/* Failure Mode or Optimization Applied */}
              <div>
                <h5 className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold mb-1.5 flex items-center gap-1.5">
                  {isBrokenDiagram ? (
                    <>
                      <AlertTriangle size={12} /> Failure Mode & Root Cause
                    </>
                  ) : (
                    <>
                      <Sparkles size={12} /> Optimization & Architectural Invariant
                    </>
                  )}
                </h5>
                <p className="text-gray-300 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                  {selectedNode.failureMode ||
                    selectedNode.impact ||
                    (isBrokenDiagram
                      ? 'Suffered from resource exhaustion and unbounded in-memory allocations during high traffic spikes.'
                      : 'Equipped with bounded stream buffers, isolated concurrency lanes, and automated lease watchdog recovery.')}
                </p>
              </div>

              {/* Observed Production Metrics */}
              {selectedNode.metrics && (
                <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5">
                  <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">
                    Observed Production Metrics
                  </p>
                  <p className="text-emerald-300 font-mono text-[11px]">
                    {selectedNode.metrics}
                  </p>
                </div>
              )}

              {/* Connected Streams / Relationships */}
              <div>
                <h5 className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold mb-2 flex items-center gap-1.5">
                  <Network size={12} /> Connected Data Streams
                </h5>
                <div className="space-y-2">
                  {/* Incoming */}
                  {connections.filter((conn) => conn.to === selectedNode.id).length > 0 && (
                    <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                      <p className="text-[10px] font-mono text-gray-400 mb-1.5">
                        Incoming Inputs:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {connections
                          .filter((conn) => conn.to === selectedNode.id)
                          .map((conn, idx) => {
                            const source = nodeMap.get(conn.from);
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setSelectedNodeId(conn.from)}
                                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-gray-300 hover:text-white border border-white/10 transition-colors flex items-center gap-1 text-[10px]"
                              >
                                <ArrowLeft size={10} className="text-emerald-400" />
                                <span className="font-semibold">{source?.label || conn.from}</span>
                                {conn.label && (
                                  <span className="text-gray-500 font-mono">({conn.label})</span>
                                )}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* Outgoing */}
                  {connections.filter((conn) => conn.from === selectedNode.id).length > 0 && (
                    <div className="bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                      <p className="text-[10px] font-mono text-gray-400 mb-1.5">
                        Outgoing Dispatches:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {connections
                          .filter((conn) => conn.from === selectedNode.id)
                          .map((conn, idx) => {
                            const target = nodeMap.get(conn.to);
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setSelectedNodeId(conn.to)}
                                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-gray-300 hover:text-white border border-white/10 transition-colors flex items-center gap-1 text-[10px]"
                              >
                                <span className="font-semibold">{target?.label || conn.to}</span>
                                {conn.label && (
                                  <span className="text-gray-500 font-mono">({conn.label})</span>
                                )}
                                <ArrowRight size={10} className="text-emerald-400" />
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-white/10 flex justify-between items-center text-[11px] text-gray-400">
              <span className="font-mono">Click connected nodes to navigate</span>
              <button
                type="button"
                onClick={() => setSelectedNodeId(null)}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs transition-colors"
              >
                Close (ESC)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
