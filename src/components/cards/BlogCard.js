'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, BookOpen } from 'lucide-react';

export default function BlogCard({ post }) {
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
    <Link href={`/blog/${post.slug}`}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="group cursor-pointer"
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
    </Link>
  );
}
