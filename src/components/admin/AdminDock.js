'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAdminMode } from '@/context/AdminModeContext';
import { supabase } from '@/lib/supabase';
import {
  Eye,
  Edit3,
  MessageSquare,
  LogOut,
  ChevronDown,
  ChevronUp,
  Plus,
  Shield,
  Compass,
  Settings,
  Sparkles,
  BookOpen,
  ExternalLink,
  Globe,
} from 'lucide-react';

const SECTIONS = [
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'stats', label: 'Coding Stats' },
  { id: 'projects', label: 'Projects' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contact' },
];

export default function AdminDock() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    isAdmin,
    editMode,
    toggleEditMode,
    unreadCount,
    openDrawer,
    logout,
    user,
    showToast,
  } = useAdminMode();

  const [collapsed, setCollapsed] = useState(false);
  const [sectionNavOpen, setSectionNavOpen] = useState(false);

  // Dynamic route recognition
  const blogSlugMatch = pathname ? pathname.match(/^\/blog\/([^/?#]+)/) : null;
  const isBlogPost = Boolean(blogSlugMatch);
  const blogSlug = blogSlugMatch ? blogSlugMatch[1] : null;

  const projectSlugMatch = pathname ? pathname.match(/^\/projects\/([^/?#]+)/) : null;
  const isProjectDetail = Boolean(projectSlugMatch);
  const projectSlug = projectSlugMatch ? projectSlugMatch[1] : null;

  const [blogData, setBlogData] = useState(null);
  const [projectData, setProjectData] = useState(null);

  // Fetch contextual blog post metadata when on /blog/[slug]
  useEffect(() => {
    let isCurrent = true;
    if (isBlogPost && blogSlug) {
      supabase
        .from('blog_posts')
        .select('id, title, slug, published')
        .eq('slug', blogSlug)
        .single()
        .then(({ data }) => {
          if (isCurrent && data) {
            setBlogData(data);
          }
        })
        .catch(() => {});
    } else {
      setBlogData(null);
    }
    return () => {
      isCurrent = false;
    };
  }, [isBlogPost, blogSlug]);

  // Fetch contextual project metadata when on /projects/[slug]
  useEffect(() => {
    let isCurrent = true;
    if (isProjectDetail && projectSlug) {
      supabase
        .from('projects')
        .select('id, title, slug, live_url, github_url, description, published, featured, cover_image, technologies, tags')
        .eq('slug', projectSlug)
        .single()
        .then(({ data }) => {
          if (isCurrent && data) {
            setProjectData(data);
          }
        })
        .catch(() => {});
    } else {
      setProjectData(null);
    }
    return () => {
      isCurrent = false;
    };
  }, [isProjectDetail, projectSlug]);

  // If not admin, do not render dock at all
  if (!isAdmin) return null;

  const isHome = pathname === '/';
  const isProjects = pathname === '/projects';
  const isBlog = pathname === '/blog';

  const scrollToSection = (sectionId) => {
    setSectionNavOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleEditArticle = () => {
    if (!editMode) toggleEditMode();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('admin:set-blog-view', { detail: 'edit' }));
      window.dispatchEvent(new CustomEvent('admin:edit-article'));
    }
    if (pathname && !pathname.includes('?edit=true')) {
      if (router?.push) {
        router.push(`${pathname}?edit=true`);
      } else if (typeof window !== 'undefined') {
        window.location.search = '?edit=true';
      }
    }
  };

  const handleTogglePublished = async () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('admin:toggle-published'));
    }

    if (blogData?.id) {
      const nextPublished = !blogData.published;
      setBlogData((prev) => (prev ? { ...prev, published: nextPublished } : prev));
      try {
        const { error } = await supabase
          .from('blog_posts')
          .update({ published: nextPublished, updated_at: new Date().toISOString() })
          .eq('id', blogData.id);

        if (error) throw error;

        showToast?.(
          `Article "${blogData.title || blogSlug}" set to ${nextPublished ? 'Published' : 'Draft'}`,
          'success'
        );

        fetch('/api/admin/revalidate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-secret': process.env.NEXT_PUBLIC_ADMIN_SECRET || '',
          },
          body: JSON.stringify({ paths: ['/blog', `/blog/${blogSlug}`] }),
        }).catch(() => {});

        router?.refresh?.();
      } catch (err) {
        showToast?.(err?.message || 'Failed to update publication status', 'error');
      }
    } else {
      showToast?.('Toggled article publication state', 'info');
    }
  };

  const handleBackToCatalog = () => {
    if (router?.push) {
      router.push('/blog');
    } else if (typeof window !== 'undefined') {
      window.location.href = '/blog';
    }
  };

  const handleEditStory = () => {
    if (!editMode) toggleEditMode();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('admin:set-project-view', { detail: 'edit' }));
      window.dispatchEvent(new CustomEvent('admin:edit-story'));
    }
    if (pathname && !pathname.includes('?edit=true')) {
      if (router?.push) {
        router.push(`${pathname}?edit=true`);
      } else if (typeof window !== 'undefined') {
        window.location.search = '?edit=true';
      }
    }
  };

  const handleViewLiveDemo = () => {
    if (projectData?.live_url) {
      if (typeof window !== 'undefined') {
        window.open(projectData.live_url, '_blank', 'noopener,noreferrer');
      }
    } else if (typeof document !== 'undefined') {
      const liveAnchor = document.querySelector('a[href^="http"]:not([href*="github.com"])');
      if (liveAnchor?.href && typeof window !== 'undefined') {
        window.open(liveAnchor.href, '_blank', 'noopener,noreferrer');
      } else {
        showToast?.('No live demo URL configured for this project', 'info');
      }
    }
  };

  if (collapsed) {
    return (
      <aside
        aria-label="Admin command dock"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9990] animate-in fade-in slide-in-from-bottom-2 duration-200"
      >
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0a0a0c]/90 border border-primary/40 backdrop-blur-xl shadow-2xl shadow-primary/20 text-xs font-mono-code text-white hover:border-primary hover:bg-[#121216] transition-all group"
          title="Click to expand Admin HUD"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-primary">Admin HUD</span>
          <span className="text-muted-foreground group-hover:text-foreground">
            {editMode ? '• Edit' : '• Preview'}
          </span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] text-amber-300 font-bold">
              {unreadCount}
            </span>
          )}
          <ChevronUp size={14} className="text-muted-foreground group-hover:text-primary transition-colors ml-0.5" />
        </button>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Admin command dock"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9990] w-auto max-w-[95vw] animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-2xl bg-[#08080b]/90 border border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,240,255,0.08)] ring-1 ring-white/5">
        {/* HUD Identity Badge */}
        <div className="hidden sm:flex items-center gap-2 pl-2 pr-1 border-r border-white/10">
          <div className="w-6 h-6 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
            <Shield size={13} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-primary leading-tight">
              Admin HUD
            </span>
            <span className="text-[9px] font-mono-code text-muted-foreground truncate max-w-[85px] leading-tight">
              {user?.email?.split('@')[0] || 'Ayush'}
            </span>
          </div>
        </div>

        {/* Mode Switcher Pill */}
        <div className="flex items-center p-0.5 rounded-xl bg-black/60 border border-white/10">
          <button
            type="button"
            onClick={() => !editMode || toggleEditMode()}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono-code font-medium transition-all ${
              !editMode
                ? 'bg-primary/20 text-primary border border-primary/40 shadow-sm shadow-primary/20 font-bold'
                : 'text-muted-foreground hover:text-white'
            }`}
            title="Preview Mode: Interact with the page as visitors see it"
          >
            <Eye size={13} />
            <span className="hidden xs:inline">Preview</span>
          </button>
          <button
            type="button"
            onClick={() => editMode || toggleEditMode()}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono-code font-medium transition-all ${
              editMode
                ? 'bg-primary text-black border border-primary shadow-sm shadow-primary/40 font-bold'
                : 'text-muted-foreground hover:text-white'
            }`}
            title="Edit Mode: Inspect and edit content directly on the canvas"
          >
            <Edit3 size={13} />
            <span className="hidden xs:inline">Edit</span>
          </button>
        </div>

        {/* Context-aware Actions */}
        {isHome && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setSectionNavOpen((v) => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono-code text-zinc-300 hover:text-white transition-all"
              title="Jump to Section"
            >
              <Compass size={13} className="text-primary" />
              <span className="hidden md:inline">Jump</span>
              <ChevronDown size={12} className={`transition-transform duration-200 ${sectionNavOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Section Jump Dropdown */}
            {sectionNavOpen && (
              <>
                <div
                  className="fixed inset-0 z-[9991]"
                  onClick={() => setSectionNavOpen(false)}
                />
                <div className="absolute bottom-full mb-2 left-0 z-[9992] min-w-[150px] p-1.5 rounded-xl bg-[#0c0c10] border border-white/15 backdrop-blur-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2 py-1 text-[9px] font-mono-code uppercase tracking-wider text-muted-foreground font-semibold border-b border-white/5 mb-1">
                    Sections
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {SECTIONS.map((sec) => (
                      <button
                        key={sec.id}
                        onClick={() => scrollToSection(sec.id)}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono-code text-zinc-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between"
                      >
                        <span>{sec.label}</span>
                        <span className="text-[10px] text-muted-foreground">#{sec.id}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {isProjects && (
          <button
            type="button"
            onClick={() => openDrawer('project-new')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-primary/15 hover:bg-primary/25 border border-primary/30 text-xs font-mono-code text-primary font-semibold transition-all"
          >
            <Plus size={13} />
            <span className="hidden sm:inline">Add Project</span>
          </button>
        )}

        {isBlog && (
          <button
            type="button"
            onClick={() => openDrawer('blog-new')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-primary/15 hover:bg-primary/25 border border-primary/30 text-xs font-mono-code text-primary font-semibold transition-all"
            aria-label="New Post"
          >
            <Plus size={13} />
            <span className="hidden sm:inline">New Post</span>
          </button>
        )}

        {/* Dynamic Blog Article Contextual Controls */}
        {isBlogPost && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleEditArticle}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-primary/15 hover:bg-primary/25 border border-primary/30 text-xs font-mono-code text-primary font-semibold transition-all"
              title="Edit article in-context"
              aria-label="Edit Article"
            >
              <Edit3 size={13} />
              <span className="hidden sm:inline">Edit Article</span>
            </button>

            <button
              type="button"
              onClick={handleTogglePublished}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono-code font-semibold transition-all ${
                blogData?.published === false
                  ? 'bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300'
                  : 'bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400'
              }`}
              title="Toggle published status"
              aria-label="Toggle Published"
            >
              <Globe size={13} />
              <span className="hidden sm:inline">Toggle Published</span>
            </button>

            <button
              type="button"
              onClick={handleBackToCatalog}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono-code text-zinc-300 hover:text-white transition-all"
              title="Return to Publications Catalog"
              aria-label="Back to Catalog"
            >
              <BookOpen size={13} />
              <span className="hidden sm:inline">Back to Catalog</span>
            </button>
          </div>
        )}

        {/* Dynamic Project Route Contextual Controls */}
        {isProjectDetail && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleEditStory}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-primary/15 hover:bg-primary/25 border border-primary/30 text-xs font-mono-code text-primary font-semibold transition-all"
              title="Edit project story & telemetry"
              aria-label="Edit Story"
            >
              <Edit3 size={13} />
              <span className="hidden sm:inline">Edit Story</span>
            </button>

            <button
              type="button"
              onClick={handleViewLiveDemo}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-mono-code text-emerald-400 font-semibold transition-all"
              title={projectData?.live_url ? `Open live demo (${projectData.live_url})` : 'View live deployment'}
              aria-label="View Live Demo"
            >
              <ExternalLink size={13} />
              <span className="hidden sm:inline">View Live Demo</span>
            </button>
          </div>
        )}

        {/* Unread Inquiries / Messages Trigger */}
        <button
          type="button"
          onClick={() => openDrawer('messages')}
          className="relative flex items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-all"
          title={`Inquiries Inbox (${unreadCount} unread)`}
          aria-label="Open contact inquiries inbox"
        >
          <MessageSquare size={14} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-amber-500 text-black text-[9px] font-mono-code font-bold flex items-center justify-center shadow-lg shadow-amber-500/40 animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Global Settings Drawer Trigger */}
        <button
          type="button"
          onClick={() => openDrawer('settings')}
          className="flex items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-all"
          title="Site & SEO Settings"
          aria-label="Open global site settings"
        >
          <Settings size={14} />
        </button>

        {/* Logout Trigger */}
        <button
          type="button"
          onClick={logout}
          className="flex items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-zinc-400 hover:text-red-400 transition-all"
          title="Sign out from Admin Mode"
          aria-label="Sign out from admin mode"
        >
          <LogOut size={14} />
        </button>

        {/* Collapse Toggle */}
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          className="flex items-center justify-center p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-all"
          title="Minimize Dock"
          aria-label="Minimize admin dock"
        >
          <ChevronDown size={14} />
        </button>
      </div>
    </aside>
  );
}
