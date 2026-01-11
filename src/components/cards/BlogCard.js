'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, X, BookOpen, Tag, Share2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';

export default function BlogCard({ post }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getExcerpt = (content) => {
    if (!content) return '';
    const text = content.replace(/[#*`]/g, '').substring(0, 200);
    return text.length === 200 ? text + '...' : text;
  };

  return (
    <>
      {/* Blog Card */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="group cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 h-full">
          <div className="flex flex-col md:flex-row">
            {/* Post Image */}
            <div className="relative w-full md:w-72 h-56 bg-gradient-to-br from-primary/10 to-accent/10 flex-shrink-0 overflow-hidden">
              {post.cover_image ? (
                <Image
                  src={post.cover_image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen size={64} className="text-primary/30" />
                </div>
              )}
              
              {/* Reading Time Badge */}
              {post.reading_time && (
                <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded-full flex items-center gap-1">
                  <Clock size={12} />
                  {post.reading_time} min
                </div>
              )}

              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                <span className="text-white font-medium text-sm">Click to read article</span>
              </div>
            </div>

            {/* Post Content */}
            <div className="flex-1 p-6">
              {/* Meta Info */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>{formatDate(post.created_at)}</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h2>

              {/* Excerpt */}
              <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                {getExcerpt(post.content)}
              </p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20"
                    >
                      #{tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                      +{post.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Read More */}
              <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:underline pt-2 border-t border-border">
                <BookOpen size={16} />
                <span>Read Full Article →</span>
              </div>
            </div>
          </div>
        </div>
      </motion.article>

      {/* Modal Reader */}
      <AnimatePresence>
        {isModalOpen && (
          <BlogModal
            post={post}
            onClose={() => setIsModalOpen(false)}
            formatDate={formatDate}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function BlogModal({ post, onClose, formatDate }) {
  const copyLink = () => {
    const url = `${window.location.origin}/blog/${post.slug}`;
    navigator.clipboard.writeText(url);
    // Could add a toast notification here
  };

  const openInNewTab = () => {
    window.open(`/blog/${post.slug}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative bg-card border border-border rounded-2xl overflow-hidden max-w-4xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-md border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="hover:bg-muted"
            >
              <X size={18} />
            </Button>
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Reading Mode
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={copyLink}
              variant="ghost"
              size="sm"
              className="hover:bg-muted"
              title="Copy link"
            >
              <Share2 size={18} />
            </Button>
            <Button
              onClick={openInNewTab}
              variant="ghost"
              size="sm"
              className="hover:bg-muted"
              title="Open in new tab"
            >
              <ExternalLink size={18} />
            </Button>
          </div>
        </div>

        {/* Hero Image */}
        {post.cover_image && (
          <div className="relative h-64 sm:h-80 bg-gradient-to-br from-primary/20 to-accent/20">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="p-6 sm:p-8 lg:p-12 max-w-3xl mx-auto">
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{formatDate(post.created_at)}</span>
            </div>
            {post.reading_time && (
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{post.reading_time} min read</span>
              </div>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag size={16} />
                <span>{post.tags.length} tags</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-border">
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg prose-invert max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-3xl font-bold text-foreground mt-8 mb-4" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-2xl font-bold text-foreground mt-6 mb-3" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-xl font-semibold text-foreground mt-4 mb-2" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="text-muted-foreground leading-relaxed mb-4" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4" {...props} />
                ),
                code: ({ node, inline, ...props }) =>
                  inline ? (
                    <code className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-sm" {...props} />
                  ) : (
                    <code className="block p-4 bg-muted rounded-lg text-sm overflow-x-auto mb-4" {...props} />
                  ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4"
                    {...props}
                  />
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 sm:p-8 border-t border-border bg-muted/50">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Share this article</p>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={copyLink}
                    variant="outline"
                    size="sm"
                    className="hover:bg-primary/10 hover:border-primary"
                  >
                    <Share2 size={16} className="mr-2" />
                    Copy Link
                  </Button>
                </div>
              </div>
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                Close Reader
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
