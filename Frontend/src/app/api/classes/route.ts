import { NextResponse } from 'next/server';
import { createSupabasePublicClient } from '@/utils/supabase/public';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

  console.log('[fetchClassesFromDb] Query params:', {
    start: params.start,
    end: params.end,
    category: params.category,
    classTypeId: params.classTypeId
  });

  // Use LEFT JOIN for class_types so classes without valid class_type_id still appear
  let query = supabase
    .from('classes')
    .select('*, class_types!left(*)')
    .order('starts_at', { ascending: true });

  // For date range, use < instead of <= for end to cover full 24 hours
  if (params.start) query = query.gte('starts_at', params.start);
  if (params.end) {
    // Extend end date to cover the entire day (add 1 day and use < instead of <=)
    const endDate = new Date(params.end);
    endDate.setDate(endDate.getDate() + 1);
    query = query.lt('starts_at', endDate.toISOString());
  }
  
  // Case-insensitive category filter
  if (params.category) {
    query = query.ilike('category', params.category);
  }
  
  if (params.classTypeId != null) query = query.eq('class_type_id', params.classTypeId);

  const { data, error } = await query;
  
  console.log('[fetchClassesFromDb] Query result:', {
    count: data?.length ?? 0,
    error: error?.message,
    firstClass: data?.[0] ? {
      id: data[0].id,
      title: data[0].title,
      starts_at: data[0].starts_at,
      category: data[0].category,
      is_cancelled: data[0].is_cancelled
    } : null
  });
  
  if (error) throw error;
  
  // Filter out cancelled classes in JS to ensure we see all data first
  const filtered = data?.filter(c => !c.is_cancelled) ?? [];
  
  console.log('[fetchClassesFromDb] After filtering cancelled:', {
    originalCount: data?.length ?? 0,
    filteredCount: filtered.length
  });
  
  return filtered;
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const start = toIsoOrNull(url.searchParams.get('start'));
  const end = toIsoOrNull(url.searchParams.get('end'));
  const category = url.searchParams.get('category');
  const classTypeIdRaw = url.searchParams.get('classTypeId');
  const classTypeId = classTypeIdRaw ? Number(classTypeIdRaw) : null;

  try {
    const data = await fetchClassesFromDb({
      start,
      end,
      category,
      classTypeId: Number.isFinite(classTypeId) ? classTypeId : null,
    });

    return NextResponse.json({ data });
  } catch (err: any) {
    console.error('[API /api/classes] GET failed', err);
    return NextResponse.json(
      { error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
