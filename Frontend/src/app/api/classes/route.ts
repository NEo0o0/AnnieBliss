import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { createSupabasePublicClient } from '@/utils/supabase/public';

export const revalidate = 30;

function toIsoOrNull(value: string | null): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

async function fetchClassesFromDb(params: {
  start?: string | null;
  end?: string | null;
  category?: string | null;
  classTypeId?: number | null;
}) {
  const supabase = createSupabasePublicClient();

  let query = supabase
    .from('classes')
    .select('*, class_types(*)')
    .eq('is_cancelled', false)
    .order('starts_at', { ascending: true });

  if (params.start) query = query.gte('starts_at', params.start);
  if (params.end) query = query.lte('starts_at', params.end);
  if (params.category) query = query.eq('category', params.category);
  if (params.classTypeId != null) query = query.eq('class_type_id', params.classTypeId);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const start = toIsoOrNull(url.searchParams.get('start'));
  const end = toIsoOrNull(url.searchParams.get('end'));
  const category = url.searchParams.get('category');
  const classTypeIdRaw = url.searchParams.get('classTypeId');
  const classTypeId = classTypeIdRaw ? Number(classTypeIdRaw) : null;

  const cacheKey = [
    'api/classes',
    start ?? '',
    end ?? '',
    category ?? '',
    classTypeIdRaw ?? '',
  ];

  try {
    const cached = unstable_cache(
      () =>
        fetchClassesFromDb({
          start,
          end,
          category,
          classTypeId: Number.isFinite(classTypeId) ? classTypeId : null,
        }),
      cacheKey,
      { revalidate }
    );

    const data = await cached();
    return NextResponse.json({ data });
  } catch (err: any) {
    console.error('[API /api/classes] GET failed', err);
    return NextResponse.json(
      { error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
