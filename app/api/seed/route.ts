import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {
  SEED_USERS,
  SEED_TRAINEE_PROFILES,
  SEED_TRAINER_PROFILES,
  SEED_COURSES,
  SEED_ASSESSMENTS,
  SEED_ENROLLMENTS,
  SEED_CERTIFICATES,
  SEED_COMPETENCIES,
  SEED_TRAINEE_COMPETENCIES,
  SEED_SKILL_GAPS,
  SEED_ANNOUNCEMENTS,
  SEED_FEEDBACKS,
} from '@/lib/seed-data';

export async function POST() {
  try {
    const dataDir = path.join(process.cwd(), '.data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const initialStore = {
      users: [...SEED_USERS],
      traineeProfiles: [...SEED_TRAINEE_PROFILES],
      trainerProfiles: [...SEED_TRAINER_PROFILES],
      courses: [...SEED_COURSES],
      assessments: [...SEED_ASSESSMENTS],
      assessmentAttempts: [],
      enrollments: [...SEED_ENROLLMENTS],
      certificates: [...SEED_CERTIFICATES],
      competencies: [...SEED_COMPETENCIES],
      traineeCompetencies: [...SEED_TRAINEE_COMPETENCIES],
      skillGaps: [...SEED_SKILL_GAPS],
      announcements: [...SEED_ANNOUNCEMENTS],
      feedbacks: [...SEED_FEEDBACKS],
    };

    fs.writeFileSync(
      path.join(dataDir, 'store.json'),
      JSON.stringify(initialStore, null, 2),
      'utf-8'
    );

    return NextResponse.json({
      success: true,
      message: 'Database re-seeded successfully with official prototype courses and test data.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
