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
    category: 'Class' as 'Class' | 'Workshop' | 'Teacher Training' | 'Retreat' | 'Special Event',
    classTypeId: '' as '' | string,
    title: '',
    date: '',
    end_date: '',
    time: '',
    instructorId: '' as '' | string,
    level: 'All Levels',
    capacity: 20,
    duration: '60 min',
    description: '',
    long_description: '',
    cover_image_url: '',
    gallery_images: [] as string[],
    room: '',
    price: '',
    early_bird_price: '',
    early_bird_deadline: '',
    registration_opens_at: ''
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

    // Class type is required only for 'Class' category
    const classTypeId = formData.classTypeId ? Number(formData.classTypeId) : null;
    if (formData.category === 'Class' && !Number.isFinite(classTypeId)) {
      setSubmitError('Please select a class type for regular classes');
      return;
    }
    if (!formData.date || !formData.time) {
      setSubmitError('Please select a date and time');
      return;
    }
    // Validate end_date for Retreat and Teacher Training
    if ((formData.category === 'Retreat' || formData.category === 'Teacher Training') && !formData.end_date) {
      setSubmitError('End date is required for retreats and teacher training');
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
    
    // Calculate ends_at based on whether end_date is provided
    let endsLocal: Date;
    if (formData.end_date) {
      // Multi-day event: end_date + time + duration
      const endDateTime = new Date(`${formData.end_date}T${formData.time}`);
      if (Number.isNaN(endDateTime.getTime())) {
        setSubmitError('Invalid end date');
        return;
      }
      endsLocal = new Date(endDateTime.getTime() + durationMinutes * 60_000);
    } else {
      // Single day event: start_date + time + duration
      endsLocal = new Date(startsLocal.getTime() + durationMinutes * 60_000);
    }

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
        category: formData.category as any,
        location: formData.room,
        instructor_id: formData.instructorId,
        created_by: creatorId,
        price: formData.price ? Number(formData.price) : null,
        early_bird_price: formData.early_bird_price ? Number(formData.early_bird_price) : null,
        early_bird_deadline: formData.early_bird_deadline || null,
        registration_opens_at: formData.registration_opens_at || null,
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
    
    // Handle category change - clear fields that don't apply to new category
    if (name === 'category') {
      setFormData(prev => {
        const newData = { ...prev, category: value as typeof prev.category };
        
        // Clear fields based on category
        if (value === 'Class') {
          // Regular classes don't need price, early bird, or end date fields
          newData.price = '';
          newData.early_bird_price = '';
          newData.early_bird_deadline = '';
          newData.registration_opens_at = '';
          newData.end_date = '';
        } else if (value === 'Workshop') {
          // Workshops need price but not early bird
          newData.early_bird_price = '';
          newData.early_bird_deadline = '';
          newData.registration_opens_at = '';
        }
        // Retreats and Teacher Training keep all fields
        
        return newData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'capacity' ? parseInt(value) : value
      }));
    }
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
              <option value="Class">Class</option>
              <option value="Workshop">Workshop</option>
              <option value="Teacher Training">Teacher Training</option>
              <option value="Retreat">Retreat</option>
              <option value="Special Event">Special Event</option>
            </select>
          </div>

          {/* Class Type */}
          <div>
            <label className="block text-sm text-[var(--color-stone)] mb-2">
              Class Type {formData.category === 'Class' ? '*' : '(Optional)'}
            </label>
            <select
              name="classTypeId"
              value={formData.classTypeId}
              onChange={handleChange}
              required={formData.category === 'Class'}
              className="w-full px-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] transition-all duration-300"
            >
              <option value="">{classTypesLoading ? 'Loading…' : 'Select a class type'}</option>
              {classTypes.map((t) => (
                <option key={t.id} value={String(t.id)}>
                  {t.title}
                </option>
              ))}
            </select>
            {formData.category !== 'Class' && (
              <p className="mt-1 text-xs text-[var(--color-stone)]">
                Class type is optional for {formData.category === 'Workshop' ? 'workshops' : formData.category === 'Teacher Training' ? 'teacher trainings' : formData.category === 'Retreat' ? 'retreats' : 'special events'}
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

          {/* Date Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[var(--color-stone)] mb-2">
                Start Date *
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

            {/* End Date - Show for Workshop, Retreat, Teacher Training, Special Event */}
            {formData.category !== 'Class' && (
              <div>
                <label className="block text-sm text-[var(--color-stone)] mb-2">
                  End Date {(formData.category === 'Retreat' || formData.category === 'Teacher Training') ? '*' : '(Optional)'}
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  required={formData.category === 'Retreat' || formData.category === 'Teacher Training'}
                  min={formData.date}
                  className="w-full px-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] transition-all duration-300"
                />
                <p className="mt-1 text-xs text-[var(--color-stone)]">
                  Leave empty for single-day events
                </p>
              </div>
            )}
          </div>

          {/* Time */}
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

          {/* Price - Show for Workshop, Retreat, Teacher Training */}
          {formData.category !== 'Class' && (
            <div>
              <label className="block text-sm text-[var(--color-stone)] mb-2">
                Price (฿) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="e.g., 1500"
                className="w-full px-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] transition-all duration-300"
              />
            </div>
          )}

          {/* Early Bird Fields - Show only for Retreat and Teacher Training */}
          {(formData.category === 'Retreat' || formData.category === 'Teacher Training') && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[var(--color-stone)] mb-2">
                    Early Bird Price (฿)
                  </label>
                  <input
                    type="number"
                    name="early_bird_price"
                    value={formData.early_bird_price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="e.g., 1200"
                    className="w-full px-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[var(--color-stone)] mb-2">
                    Early Bird Deadline
                  </label>
                  <input
                    type="date"
                    name="early_bird_deadline"
                    value={formData.early_bird_deadline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[var(--color-stone)] mb-2">
                  Registration Opens At
                </label>
                <input
                  type="datetime-local"
                  name="registration_opens_at"
                  value={formData.registration_opens_at}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] transition-all duration-300"
                />
              </div>
            </>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm text-[var(--color-stone)] mb-2">
              Description {formData.category === 'Class' ? '*' : '(Short description)'}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required={formData.category === 'Class'}
              rows={4}
              placeholder="Describe the class, what to expect, and who it's for..."
              className="w-full px-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] transition-all duration-300 resize-none"
            />
          </div>

          {/* Long Description - Show for Workshop, Retreat, Teacher Training */}
          {formData.category !== 'Class' && (
            <div>
              <label className="block text-sm text-[var(--color-stone)] mb-2">
                Long Description *
              </label>
              <textarea
                name="long_description"
                value={formData.long_description}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Provide detailed information about what students will learn, class flow, benefits, etc..."
                className="w-full px-4 py-3 border border-[var(--color-sand)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-sage)] transition-all duration-300 resize-none"
              />
            </div>
          )}

          {/* Cover Image Upload - Show for Workshop, Retreat, Special Event (NOT Teacher Training) */}
          {(formData.category === 'Workshop' || formData.category === 'Retreat' || formData.category === 'Special Event') && (
            <div>
              <label className="block text-sm text-[var(--color-stone)] mb-2">
                Cover Image *
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
          )}

          {/* Gallery Images - Show for Workshop, Retreat, Special Event (NOT Teacher Training) */}
          {(formData.category === 'Workshop' || formData.category === 'Retreat' || formData.category === 'Special Event') && (
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
          )}

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
