import { TeacherTrainingClient } from './TeacherTrainingClient';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import type { Tables } from '@/types/database.types';

export const revalidate = 30;

type Training = Tables<'classes'> & {
  early_bird_price: number | null;
  early_bird_deadline: string | null;
  registration_opens_at: string | null;
};

export default async function TeacherTrainingPage() {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from('classes')
    .select('*')
    .eq('category', 'Teacher Training')
    .order('starts_at', { ascending: true });

  const initialTrainings: Training[] = (data ?? []) as unknown as Training[];

  return <TeacherTrainingClient initialTrainings={initialTrainings} />;
}
