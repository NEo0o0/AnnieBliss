'use client';

import { TeacherTrainingHero } from '@/components/TeacherTrainingHero';
import { Curriculum } from '@/components/Curriculum';
import { SchedulePricing } from '@/components/SchedulePricing';
import { ApplyCTA } from '@/components/ApplyCTA';
import type { Tables } from '@/types/database.types';

type Training = Tables<'classes'> & {
  early_bird_price: number | null;
  early_bird_deadline: string | null;
  registration_opens_at: string | null;
};

export function TeacherTrainingClient({ initialTrainings }: { initialTrainings: Training[] }) {
  return (
    <>
      <TeacherTrainingHero initialTrainings={initialTrainings} />
      <Curriculum />
      <SchedulePricing initialTrainings={initialTrainings} />
      <ApplyCTA />
    </>
  );
}
