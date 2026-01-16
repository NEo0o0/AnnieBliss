"use client";

import { X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { ImageUpload } from './ImageUpload';
import { MultiImageUpload } from './MultiImageUpload';
import type { Tables, TablesInsert } from '@/types/database.types';

interface CreateClassModalProps {
  onClose: () => void;
  onCreated?: () => void;
}

type ClassTypeRow = Tables<'class_types'>;

function formatDuration(minutes: number | null) {
  const safe = typeof minutes === 'number' && Number.isFinite(minutes) ? minutes : 60;
  return `${safe} min`;
}

function parseDurationToMinutes(value: string) {
  const match = value.match(/(\d+)/);
  const parsed = match ? Number(match[1]) : NaN;
  return Number.isFinite(parsed) ? parsed : 60;
}

export function CreateClassModal({ onClose, onCreated }: CreateClassModalProps) {
  const [classTypes, setClassTypes] = useState<ClassTypeRow[]>([]);
  const [classTypesLoading, setClassTypesLoading] = useState(false);
  const [classTypesError, setClassTypesError] = useState<string | null>(null);

  const [instructors, setInstructors] = useState<Array<{ id: string; full_name: string | null }>>([]);
  const [instructorsLoading, setInstructorsLoading] = useState(false);
  const [instructorsError, setInstructorsError] = useState<Error | null>(null);

  const [rooms, setRooms] = useState<Array<{ id: number; name: string }>>([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [roomsError, setRoomsError] = useState<string | null>(null);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    category: 'class' as 'class' | 'workshop' | 'teacher_training' | 'retreat',
    classTypeId: '' as '' | string,
    title: '',
    date: '',
    time: '',
    instructorId: '' as '' | string,
    level: 'All Levels',
    capacity: 20,
    duration: '60 min',
    description: '',
    long_description: '',
    cover_image_url: '',
    gallery_images: [] as string[],
    room: ''
  });

  const selectedClassType = useMemo(() => {
    const id = Number(formData.classTypeId);
    if (!Number.isFinite(id)) return null;
    return classTypes.find((t) => t.id === id) ?? null;
  }, [classTypes, formData.classTypeId]);

  useEffect(() => {
    const loadTypes = async () => {
      setClassTypesLoading(true);
      setClassTypesError(null);
      try {
        const { data, error } = await supabase
          .from('class_types')
          .select('id, title, description, duration_minutes')
          .order('title', { ascending: true });
        if (error) throw error;
        setClassTypes((data ?? []) as ClassTypeRow[]);
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        setClassTypesError(message);
      } finally {
        setClassTypesLoading(false);
      }
    };

    void loadTypes();
  }, []);

  useEffect(() => {
    if (!selectedClassType) return;

    setFormData((prev) => ({
      ...prev,
      title: selectedClassType.title ?? prev.title,
      duration: formatDuration(selectedClassType.duration_minutes),
      description: selectedClassType.description ?? prev.description,
    }));
  }, [selectedClassType]);

  useEffect(() => {
    const loadInstructors = async () => {
      setInstructorsLoading(true);
      setInstructorsError(null);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('role', ['admin', 'instructor'])
          .order('full_name', { ascending: true });

        if (error) throw error;
        setInstructors((data ?? []) as Array<{ id: string; full_name: string | null }>);
      } catch (e) {
        const err: any = e;
        const asError = err instanceof Error ? err : new Error(err?.message ?? String(err));
        setInstructorsError(asError);
        console.error('Failed to load instructors:', {
          message: err?.message,
          details: err?.details,
          hint: err?.hint,
          code: err?.code,
          raw: e,
        });
        setInstructors([]);
      } finally {
        setInstructorsLoading(false);
      }
    };

    void loadInstructors();
  }, []);

  useEffect(() => {
    const loadRooms = async () => {
      setRoomsLoading(true);
      setRoomsError(null);
      try {
        const { data, error } = await supabase
          .from('rooms' as any)
          .select('id, name')
          .order('name', { ascending: true });

        if (error) throw error;
        setRooms((data ?? []) as any);

        setFormData((prev) => {
          if (prev.room) return prev;
          const first = (data ?? [])[0] as any;
          return first?.name ? { ...prev, room: String(first.name) } : prev;
        });
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        setRoomsError(message);
        setRooms([]);
      } finally {
        setRoomsLoading(false);
      }
    };

    void loadRooms();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Class type is required only for 'class' category
    const classTypeId = formData.classTypeId ? Number(formData.classTypeId) : null;
    if (formData.category === 'class' && !Number.isFinite(classTypeId)) {
      setSubmitError('Please select a class type for regular classes');
      return;
    }
    if (!formData.date || !formData.time) {
      setSubmitError('Please select a date and time');
      return;
    }
    if (!formData.instructorId) {
      setSubmitError('Please select an instructor');
      return;
    }

    const startsLocal = new Date(`${formData.date}T${formData.time}`);
    if (Number.isNaN(startsLocal.getTime())) {
      setSubmitError('Invalid date/time');
      return;
    }

    const durationMinutes = selectedClassType?.duration_minutes ?? parseDurationToMinutes(formData.duration);
    const endsLocal = new Date(startsLocal.getTime() + durationMinutes * 60_000);

    setSubmitLoading(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      const creatorId = authData?.user?.id ?? null;

      const insertPayload: TablesInsert<'classes'> = {
        title: formData.title,
        description: formData.description,
        long_description: formData.long_description || null,
        cover_image_url: formData.cover_image_url || null,
        level: formData.level,
        capacity: Number(formData.capacity),
        class_type_id: classTypeId,
        starts_at: startsLocal.toISOString(),
        ends_at: endsLocal.toISOString(),
        category: formData.category,
        location: formData.room,
        instructor_id: formData.instructorId,
        created_by: creatorId,
      };

      const { error } = await supabase.from('classes').insert(insertPayload);
      if (error) throw error;

      onClose();
      onCreated?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setSubmitError(message || 'Failed to create class');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[var(--color-sage)] to-[var(--color-clay)] text-white p-8 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors duration-300"
          >
            <X size={24} />
          </button>
          
          <h2 className="text-white">Create New Class</h2>
          <p className="text-white/90 mt-2">Add a new class to the schedule</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Category */}
          <div>
            <label className="block text-sm text-[var(--color-stone)] mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] transition-all duration-300"
            >
              <option value="class">Class</option>
              <option value="workshop">Workshop</option>
              <option value="teacher_training">Teacher Training</option>
              <option value="retreat">Retreat</option>
            </select>
          </div>

          {/* Class Type */}
          <div>
            <label className="block text-sm text-[var(--color-stone)] mb-2">
              Class Type {formData.category === 'class' ? '*' : '(Optional)'}
            </label>
            <select
              name="classTypeId"
              value={formData.classTypeId}
              onChange={handleChange}
              required={formData.category === 'class'}
              className="w-full px-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] transition-all duration-300"
            >
              <option value="">{classTypesLoading ? 'Loading…' : 'Select a class type'}</option>
              {classTypes.map((t) => (
                <option key={t.id} value={String(t.id)}>
                  {t.title}
                </option>
              ))}
            </select>
            {formData.category !== 'class' && (
              <p className="mt-1 text-xs text-[var(--color-stone)]">
                Class type is optional for {formData.category === 'workshop' ? 'workshops' : formData.category === 'teacher_training' ? 'teacher trainings' : 'retreats'}
              </p>
            )}
            {classTypesError ? (
              <div className="mt-2 text-sm text-red-700">{classTypesError}</div>
            ) : null}
          </div>

          {/* Class Title */}
          <div>
            <label className="block text-sm text-[var(--color-stone)] mb-2">
              Class Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Morning Flow"
              className="w-full px-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] transition-all duration-300"
            />
          </div>

          {/* Day and Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[var(--color-stone)] mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--color-stone)] mb-2">
                Time *
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] transition-all duration-300"
              />
            </div>
          </div>

          {/* Instructor and Level Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[var(--color-stone)] mb-2">
                Instructor *
              </label>
              <select
                name="instructorId"
                value={formData.instructorId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] transition-all duration-300"
              >
                <option value="">{instructorsLoading ? 'Loading…' : 'Select an instructor'}</option>
                {instructors.map((p) => {
                  const label = p.full_name ?? p.id;
                  return (
                    <option key={p.id} value={p.id}>
                      {label}
                    </option>
                  );
                })}
              </select>
              {instructorsError ? (
                <div className="mt-2 text-sm text-red-700">{instructorsError.message}</div>
              ) : null}
            </div>

            <div>
              <label className="block text-sm text-[var(--color-stone)] mb-2">
                Level *
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] transition-all duration-300"
              >
                <option value="All Levels">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Duration, Room, and Capacity Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-[var(--color-stone)] mb-2">
                Duration *
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] transition-all duration-300"
              >
                <option value="45 min">45 min</option>
                <option value="60 min">60 min</option>
                <option value="75 min">75 min</option>
                <option value="90 min">90 min</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-[var(--color-stone)] mb-2">
                Room *
              </label>
              <select
                name="room"
                value={formData.room}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] transition-all duration-300"
              >
                <option value="">{roomsLoading ? 'Loading…' : 'Select a room'}</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
              {roomsError ? (
                <div className="mt-2 text-sm text-red-700">{roomsError}</div>
              ) : null}
            </div>

            <div>
              <label className="block text-sm text-[var(--color-stone)] mb-2">
                Capacity *
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
                max="50"
                className="w-full px-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] transition-all duration-300"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-[var(--color-stone)] mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Describe the class, what to expect, and who it's for..."
              className="w-full px-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] transition-all duration-300 resize-none"
            />
          </div>

          {/* Long Description */}
          <div>
            <label className="block text-sm text-[var(--color-stone)] mb-2">
              Long Description (Optional)
            </label>
            <textarea
              name="long_description"
              value={formData.long_description}
              onChange={handleChange}
              rows={6}
              placeholder="Provide detailed information about what students will learn, class flow, benefits, etc..."
              className="w-full px-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] transition-all duration-300 resize-none"
            />
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm text-[var(--color-stone)] mb-2">
              Cover Image (Optional)
            </label>
            <ImageUpload
              currentImageUrl={formData.cover_image_url}
              onUpload={(url) => {
                setFormData(prev => ({
                  ...prev,
                  cover_image_url: url
                }));
              }}
            />
          </div>

          {/* Gallery Images */}
          <div>
            <label className="block text-sm text-[var(--color-stone)] mb-2">
              Gallery Images (Optional)
            </label>
            <p className="text-xs text-[var(--color-stone)] mb-3">
              Upload multiple images to showcase this class/workshop in a gallery slideshow
            </p>
            <MultiImageUpload
              images={formData.gallery_images}
              onImagesChange={(images) => {
                setFormData(prev => ({
                  ...prev,
                  gallery_images: images
                }));
              }}
              maxImages={10}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-[var(--color-sand)] text-[var(--color-stone)] rounded-lg hover:bg-[var(--color-cream)] transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="flex-1 px-6 py-3 bg-[var(--color-sage)] hover:bg-[var(--color-clay)] text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {submitLoading ? 'Creating…' : 'Create Class'}
            </button>
          </div>
          {submitError ? (
            <div className="text-sm text-red-700">{submitError}</div>
          ) : null}
        </form>
      </div>
    </div>
  );
}
