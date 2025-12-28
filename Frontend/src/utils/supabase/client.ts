import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';
import type { Database } from '../../types/database.types';

export const supabase = createClient<Database>(
  `https://${projectId}.supabase.co`,
  publicAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
