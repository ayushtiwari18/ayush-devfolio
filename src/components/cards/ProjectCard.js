'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, X, Calendar, Code2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProjectCard({ project }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Project Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="group cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 h-full">
          {/* Featured Badge */}
          {project.featured && (
            <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
              <Star size={12} fill="white" />
              Featured
            </div>
          )}

          {/* Project Image */}
          <div className="relative h-56 bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
            {project.cover_image ? (
              <Image
                src={project.cover_image}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Code2 size={64} className="text-primary/30" />
              </div>
            )}
            
            {/* Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
              <span className="text-white font-medium text-sm">Click to view details</span>
            </div>
          </div>

          {/* Project Content */}
          <div className="p-6">
            {/* Title */}
            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {project.description}
            </p>

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.slice(0, 3).map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                    +{project.technologies.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              {project.github_url && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(project.github_url, '_blank');
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github size={16} />
                  <span className="hidden sm:inline">Code</span>
                </button>
              )}
              {project.live_url && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(project.live_url, '_blank');
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink size={16} />
                  <span className="hidden sm:inline">Live</span>
                </button>
              )}
              <span className="ml-auto text-primary text-sm font-medium group-hover:underline">
                View More →
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <ProjectModal
            project={project}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function ProjectModal({ project, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative bg-card border border-border rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Hero Image */}
        <div className="relative h-64 sm:h-80 bg-gradient-to-br from-primary/20 to-accent/20">
          {project.cover_image ? (
            <Image
              src={project.cover_image}
              alt={project.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Code2 size={96} className="text-primary/30" />
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
          
          {/* Featured Badge */}
          {project.featured && (
            <div className="absolute top-4 left-4 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-2">
              <Star size={16} fill="white" />
              Featured Project
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Title */}
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 gradient-text">
            {project.title}
          </h2>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
            {project.created_at && (
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{new Date(project.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
            )}
            {project.technologies && (
              <div className="flex items-center gap-2">
                <Code2 size={16} />
                <span>{project.technologies.length} Technologies</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-foreground mb-3">About This Project</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-3">Technologies Used</h3>
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20 hover:bg-primary/20 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-6 border-t border-border">
            {project.github_url && (
              <Button
                onClick={() => window.open(project.github_url, '_blank')}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                <Github size={20} />
                View Code
              </Button>
            )}
            {project.live_url && (
              <Button
                onClick={() => window.open(project.live_url, '_blank')}
                variant="outline"
                className="flex items-center gap-2 border-primary/50 hover:bg-primary/10"
              >
                <ExternalLink size={20} />
                Live Demo
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
