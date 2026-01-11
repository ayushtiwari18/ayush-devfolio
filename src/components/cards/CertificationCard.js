'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Calendar, ExternalLink, X, Building2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CertificationCard({ certification }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <>
      {/* Certification Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="group cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 h-full">
          {/* Certificate Image */}
          <div className="relative h-48 bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
            {certification.image ? (
              <Image
                src={certification.image}
                alt={certification.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Award size={64} className="text-primary/30" />
              </div>
            )}
            
            {/* Date Badge */}
            {certification.date && (
              <div className="absolute top-3 right-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded-full flex items-center gap-1">
                <Calendar size={12} />
                {formatDate(certification.date)}
              </div>
            )}

            {/* Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
              <span className="text-white font-medium text-sm">Click to view details</span>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            {/* Award Icon */}
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mb-4">
              <Award className="text-primary" size={24} />
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {certification.title}
            </h3>

            {/* Issuer */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Building2 size={14} />
              <span className="line-clamp-1">{certification.issuer}</span>
            </div>

            {/* View Details CTA */}
            <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:underline pt-4 border-t border-border">
              <CheckCircle2 size={16} />
              <span>View Details →</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <CertificationModal
            certification={certification}
            onClose={() => setIsModalOpen(false)}
            formatDate={formatDate}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function CertificationModal({ certification, onClose, formatDate }) {
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
        className="relative bg-card border border-border rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Certificate Image */}
        <div className="relative h-64 sm:h-80 bg-gradient-to-br from-primary/20 to-accent/20">
          {certification.image ? (
            <Image
              src={certification.image}
              alt={certification.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Award size={96} className="text-primary/30" />
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
          
          {/* Verified Badge */}
          <div className="absolute bottom-4 left-4 px-4 py-2 bg-green-500/90 backdrop-blur-sm text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-2">
            <CheckCircle2 size={16} />
            Verified Credential
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Award Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl mb-6">
            <Award className="text-primary" size={32} />
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
            {certification.title}
          </h2>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 mb-6 pb-6 border-b border-border">
            {/* Issuer */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Building2 size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Issued by</p>
                <p className="text-sm font-semibold text-foreground">{certification.issuer}</p>
              </div>
            </div>

            {/* Date */}
            {certification.date && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Calendar size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Issued on</p>
                  <p className="text-sm font-semibold text-foreground">{formatDate(certification.date)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-foreground mb-3">About This Certification</h3>
            <div className="space-y-3 text-muted-foreground">
              <p className="leading-relaxed">
                This certification validates expertise and knowledge in {certification.title.toLowerCase()}. 
                Issued by {certification.issuer}, this credential demonstrates professional competency and 
                commitment to continuous learning.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg">
                  <CheckCircle2 size={18} className="text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Verified Credential</p>
                    <p className="text-xs text-muted-foreground">Authenticity confirmed</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg">
                  <Award size={18} className="text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Professional Level</p>
                    <p className="text-xs text-muted-foreground">Industry recognized</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-6 border-t border-border">
            {certification.url && (
              <Button
                onClick={() => window.open(certification.url, '_blank')}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                <ExternalLink size={20} />
                View Certificate
              </Button>
            )}
            <Button
              onClick={onClose}
              variant="outline"
              className="border-primary/50 hover:bg-primary/10"
            >
              Close
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
