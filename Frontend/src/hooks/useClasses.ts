import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '../types/database.types';

type Class = Tables<'classes'>;
type ClassInsert = TablesInsert<'classes'>;
type ClassUpdate = TablesUpdate<'classes'>;

interface UseClassesOptions {
  startDate?: string;
  endDate?: string;
  category?: string;
  classTypeId?: number;
  autoFetch?: boolean;
}

export function useClasses(options: UseClassesOptions = {}) {
  const { startDate, endDate, category, classTypeId, autoFetch = true } = options;
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('classes')
        .select('*, class_types(*)')
        .eq('is_cancelled', false)
        .order('starts_at', { ascending: true });

      if (startDate) {
        query = query.gte('starts_at', startDate);
      }

      if (endDate) {
        query = query.lte('starts_at', endDate);
      }

      if (category) {
        query = query.eq('category', category);
      }

      if (classTypeId) {
        query = query.eq('class_type_id', classTypeId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setClasses(data || []);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching classes:', err);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, category, classTypeId]);

  useEffect(() => {
    if (autoFetch) {
      fetchClasses();
    }
  }, [autoFetch, fetchClasses]);

  const createClass = async (classData: ClassInsert) => {
    try {
      const { data, error: createError } = await supabase
        .from('classes')
        .insert(classData)
        .select()
        .single();

      if (createError) throw createError;

      setClasses(prev => [...prev, data]);
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  };

  const updateClass = async (id: number, updates: ClassUpdate) => {
    try {
      const { data, error: updateError } = await supabase
        .from('classes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      setClasses(prev => prev.map(c => (c.id === id ? data : c)));
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  };

  const deleteClass = async (id: number) => {
    try {
      const { error: deleteError } = await supabase
        .from('classes')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setClasses(prev => prev.filter(c => c.id !== id));
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const cancelClass = async (id: number) => {
    return updateClass(id, { is_cancelled: true });
  };

  return {
    classes,
    loading,
    error,
    fetchClasses,
    createClass,
    updateClass,
    deleteClass,
    cancelClass,
  };
}
