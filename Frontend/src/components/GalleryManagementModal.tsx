"use client";

import { useState, useEffect } from 'react';
import { X, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import { MultiImageUpload } from './MultiImageUpload';
import { toast } from 'sonner';

interface GalleryManagementModalProps {
  workshopId: number;
  workshopTitle: string;
  currentGalleryImages: string[] | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function GalleryManagementModal({ 
  workshopId, 
  workshopTitle, 
  currentGalleryImages,
  onClose,
  onSuccess 
}: GalleryManagementModalProps) {
  const [galleryImages, setGalleryImages] = useState<string[]>(currentGalleryImages || []);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('classes')
        .update({ gallery_images: galleryImages })
        .eq('id', workshopId);

      if (error) throw error;

      toast.success('Gallery updated successfully!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error updating gallery:', error);
      toast.error(error.message || 'Failed to update gallery');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[var(--color-sand)] flex items-center justify-between bg-gradient-to-r from-[var(--color-sage)] to-[var(--color-clay)] text-white">
          <div className="flex items-center gap-3">
            <ImageIcon size={24} />
            <div>
              <h2 className="text-2xl font-bold">Manage Gallery</h2>
              <p className="text-sm text-white/80 mt-1">{workshopTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-8">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[var(--color-earth-dark)] mb-2">
              Workshop Gallery Images
            </h3>
            <p className="text-sm text-[var(--color-stone)] mb-4">
              Upload photos from this workshop to create a beautiful gallery for attendees and visitors. 
              These images will be displayed in a slideshow on the workshop details page.
            </p>
          </div>

          <MultiImageUpload
            images={galleryImages}
            onImagesChange={setGalleryImages}
            maxImages={20}
          />

          <div className="mt-6 p-4 bg-[var(--color-sage)]/5 border border-[var(--color-sage)]/20 rounded-lg">
            <p className="text-sm text-[var(--color-stone)]">
              <strong>💡 Tip:</strong> Upload high-quality photos that showcase the workshop atmosphere, 
              activities, and participants. Recommended: 10-15 images for a great gallery experience.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-[var(--color-sand)] flex gap-3 justify-end bg-[var(--color-cream)]">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-[var(--color-sand)] hover:border-[var(--color-sage)] text-[var(--color-earth-dark)] rounded-lg font-medium transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[var(--color-sage)] hover:bg-[var(--color-clay)] text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Save Gallery</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
