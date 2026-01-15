import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { packageId?: number } | null;
  const packageId = Number(body?.packageId);

  if (!Number.isFinite(packageId)) {
    return NextResponse.json({ error: 'Invalid package id' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch package details (bundles only: packages table should not include drop-in).
  const { data: pkg, error: pkgError } = await supabase
    .from('packages')
    .select('id, credits, duration_days, type, is_active')
    .eq('id', packageId)
    .single();

  if (pkgError || !pkg) {
    return NextResponse.json({ error: 'Package not found' }, { status: 404 });
  }

  if (!pkg.is_active) {
    return NextResponse.json({ error: 'Package is not active' }, { status: 400 });
  }

  const now = new Date();
  const expire = new Date(now);
  expire.setDate(expire.getDate() + (pkg.duration_days ?? 0));

  const { error: createError } = await supabase.from('user_packages').insert({
    user_id: user.id,
    package_id: pkg.id,
    credits_remaining: pkg.type === 'credits' ? pkg.credits : null,
    start_at: now.toISOString(),
    activated_at: now.toISOString(),
    expire_at: expire.toISOString(),
    status: 'active',
  });

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
