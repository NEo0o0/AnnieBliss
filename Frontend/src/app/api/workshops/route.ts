import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { createSupabasePublicClient } from '@/utils/supabase/public';

export const revalidate = 30;

const WORKSHOP_CATEGORIES = ['Workshop', 'Retreat', 'Special Event'] as const;

async function fetchWorkshopsFromDb() {
  const supabase = createSupabasePublicClient();

  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .in('category', [...WORKSHOP_CATEGORIES])
    .eq('is_cancelled', false)
    .order('starts_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function GET() {
  try {
    const cached = unstable_cache(() => fetchWorkshopsFromDb(), ['api/workshops'], {
      revalidate,
    });

    const data = await cached();
    return NextResponse.json({ data });
  } catch (err: any) {
    console.error('[API /api/workshops] GET failed', err);
    return NextResponse.json(
      { error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
