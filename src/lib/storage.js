/**
 * storage.js — Supabase Storage helpers
 * ----------------------------------------
 * uploadImage(file, bucket, folder)
 *   → uploads file, returns { url, path, error }
 *
 * deleteImage(path, bucket)
 *   → deletes by storage path, returns { error }
 *
 * Buckets used:
 *   'portfolio'  — projects cover images     (folder: projects/)
 *   'portfolio'  — timeline media images     (folder: timeline/)
 *   'portfolio'  — blog cover images         (folder: blog/)
 *   'portfolio'  — certifications images     (folder: certifications/)
 *
 * Setup: create a public bucket named 'portfolio' in Supabase Storage.
 * RLS: allow authenticated users to INSERT/DELETE.
 */

import { supabase } from './supabase';

const DEFAULT_BUCKET = 'portfolio';

/**
 * Upload a single file to Supabase Storage.
 * @param {File}   file
 * @param {string} folder  e.g. 'projects', 'timeline', 'blog'
 * @param {string} bucket  defaults to 'portfolio'
 * @returns {{ url: string|null, path: string|null, error: string|null }}
 */
export async function uploadImage(file, folder = 'general', bucket = DEFAULT_BUCKET) {
  try {
    // Sanitise filename — timestamp prefix avoids collisions
    const ext      = file.name.split('.').pop().toLowerCase();
    const safeName = file.name
      .replace(/\.[^.]+$/, '')           // strip extension
      .replace(/[^a-z0-9]/gi, '-')       // slug-safe
      .toLowerCase()
      .slice(0, 40);                     // max 40 chars
    const fileName = `${folder}/${Date.now()}-${safeName}.${ext}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { url: publicUrl, path: data.path, error: null };
  } catch (err) {
    console.error('[storage] uploadImage error:', err);
    return { url: null, path: null, error: err.message || 'Upload failed' };
  }
}

/**
 * Delete a file from Supabase Storage by its path.
 * @param {string} path    e.g. 'projects/1234-my-project.jpg'
 * @param {string} bucket
 * @returns {{ error: string|null }}
 */
export async function deleteImage(path, bucket = DEFAULT_BUCKET) {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    if (error) throw error;
    return { error: null };
  } catch (err) {
    console.error('[storage] deleteImage error:', err);
    return { error: err.message || 'Delete failed' };
  }
}
