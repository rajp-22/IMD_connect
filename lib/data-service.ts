import fs from 'fs';
import path from 'path';
import { connectDB, isConnected } from './db';
import {
  UserModel,
  CourseModel,
  AssessmentModel,
  AssessmentAttemptModel,
  EnrollmentModel,
  CertificateModel,
  CompetencyModel,
  TraineeCompetencyModel,
  TrainerCompetencyModel,
  SkillGapModel,
  AnnouncementModel,
  FeedbackModel,
  TraineeProfileModel,
  TrainerProfileModel,
} from './models';
import {
  IUser,
  ITraineeProfile,
  ITrainerProfile,
  ICourse,
  IAssessment,
  IAssessmentAttempt,
  IEnrollment,
  ICertificate,
  ICompetency,
  ITraineeCompetency,
  ISkillGap,
  IAnnouncement,
  IFeedback,
  ITrainerCompetencyMatch,
  UserStatus,
  UserRole,
} from './types';
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
} from './seed-data';

const DATA_DIR = path.join(process.cwd(), '.data');

interface DatabaseStore {
  users: IUser[];
  traineeProfiles: ITraineeProfile[];
  trainerProfiles: ITrainerProfile[];
  courses: ICourse[];
  assessments: IAssessment[];
  assessmentAttempts: IAssessmentAttempt[];
  enrollments: IEnrollment[];
  certificates: ICertificate[];
  competencies: ICompetency[];
  traineeCompetencies: ITraineeCompetency[];
  skillGaps: ISkillGap[];
  announcements: IAnnouncement[];
  feedbacks: IFeedback[];
}

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getStoreFilePath(): string {
  ensureDataDir();
  return path.join(DATA_DIR, 'store.json');
}

function loadLocalStore(): DatabaseStore {
  const filePath = getStoreFilePath();
  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading store.json, reinitializing from seed:', e);
    }
  }

  const initialStore: DatabaseStore = {
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

  fs.writeFileSync(filePath, JSON.stringify(initialStore, null, 2), 'utf-8');
  return initialStore;
}

function saveLocalStore(store: DatabaseStore): void {
  const filePath = getStoreFilePath();
  fs.writeFileSync(filePath, JSON.stringify(store, null, 2), 'utf-8');
}

// Check MongoDB availability; if available, we can also sync/query MongoDB
async function getMongoOrLocal() {
  const conn = await connectDB();
  return { hasMongo: !!conn && isConnected() };
}

/* ========================================================
   USER OPERATIONS
   ======================================================== */

export async function getUsers(): Promise<IUser[]> {
  const store = loadLocalStore();
  return store.users;
}

export async function getUserById(id: string): Promise<IUser | null> {
  const store = loadLocalStore();
  return store.users.find((u) => u._id === id) || null;
}

export async function getUserByEmail(email: string): Promise<IUser | null> {
  const store = loadLocalStore();
  return (
    store.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim()) || null
  );
}

export async function createUser(userData: {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status?: UserStatus;
  department?: string;
  designation?: string;
  phone?: string;
}): Promise<IUser> {
  const store = loadLocalStore();
  const existing = store.users.find(
    (u) => u.email.toLowerCase() === userData.email.toLowerCase().trim()
  );
  if (existing) {
    throw new Error('A user with this official email already exists.');
  }

  // Trainees and Trainers require admin approval by default, unless seeded
  const initialStatus: UserStatus =
    userData.status || (userData.role === 'admin' ? 'approved' : 'pending');

  const newUser: IUser = {
    _id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: userData.name,
    email: userData.email.toLowerCase().trim(),
    passwordHash: userData.passwordHash,
    role: userData.role,
    status: initialStatus,
    department: userData.department || 'Meteorological Operations',
    designation: userData.designation || (userData.role === 'trainer' ? 'Meteorologist / Trainer' : 'Scientific Assistant'),
    phone: userData.phone || '',
    avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150`,
    createdAt: new Date().toISOString(),
  };

  store.users.push(newUser);

  // Automatically initialize profile
  if (newUser.role === 'trainee') {
    store.traineeProfiles.push({
      _id: `prof_${newUser._id}`,
      userId: newUser._id,
      department: newUser.department,
      designation: newUser.designation,
      phone: newUser.phone,
      bio: `Official Trainee at India Meteorological Department, ${newUser.department}.`,
      education: [],
      experience: [],
      skills: ['Meteorology Basics', 'Weather Observations'],
      interests: ['Atmospheric Dynamics', 'Satellite Nowcasting'],
      completedCertificatesCount: 0,
      updatedAt: new Date().toISOString(),
    });

    // Initialize baseline competencies
    store.competencies.forEach((c) => {
      store.traineeCompetencies.push({
        _id: `tc_${newUser._id}_${c._id}`,
        traineeId: newUser._id,
        competencyName: c.name,
        domain: c.domain,
        level: 'Beginner',
        score: Math.floor(Math.random() * 25) + 30, // 30-55% baseline
        lastUpdated: new Date().toISOString(),
      });
    });
  } else if (newUser.role === 'trainer') {
    store.trainerProfiles.push({
      _id: `prof_${newUser._id}`,
      userId: newUser._id,
      name: newUser.name,
      department: newUser.department,
      designation: newUser.designation,
      bio: `Certified Trainer at India Meteorological Department specializing in ${newUser.department}.`,
      experienceYears: 5,
      specializations: ['Meteorological Science', 'Weather Forecasting'],
      competencies: [
        { name: 'Meteorology', domain: 'Core Meteorological Science', level: 'Advanced', score: 85 },
        { name: 'Weather Forecasting', domain: 'Synoptic Operations', level: 'Advanced', score: 80 },
      ],
      rating: 5.0,
      totalCourses: 0,
      totalStudentsTaught: 0,
    });
  }

  saveLocalStore(store);
  return newUser;
}

export async function updateUserStatus(userId: string, status: UserStatus): Promise<IUser | null> {
  const store = loadLocalStore();
  const user = store.users.find((u) => u._id === userId);
  if (!user) return null;
  user.status = status;
  user.updatedAt = new Date().toISOString();
  saveLocalStore(store);
  return user;
}

export async function updateUserRole(userId: string, role: UserRole): Promise<IUser | null> {
  const store = loadLocalStore();
  const user = store.users.find((u) => u._id === userId);
  if (!user) return null;
  user.role = role;
  user.updatedAt = new Date().toISOString();
  saveLocalStore(store);
  return user;
}

/* ========================================================
   PROFILES
   ======================================================== */

export async function getTraineeProfile(userId: string): Promise<ITraineeProfile | null> {
  const store = loadLocalStore();
  return store.traineeProfiles.find((p) => p.userId === userId) || null;
}

export async function updateTraineeProfile(
  userId: string,
  data: Partial<ITraineeProfile>
): Promise<ITraineeProfile | null> {
  const store = loadLocalStore();
  let profile = store.traineeProfiles.find((p) => p.userId === userId);
  if (!profile) {
    const user = store.users.find((u) => u._id === userId);
    profile = {
      _id: `prof_${userId}`,
      userId,
      department: user?.department || 'Operations',
      designation: user?.designation || 'Staff',
      education: [],
      experience: [],
      skills: [],
      interests: [],
      completedCertificatesCount: 0,
      updatedAt: new Date().toISOString(),
    };
    store.traineeProfiles.push(profile);
  }

  Object.assign(profile, data, { updatedAt: new Date().toISOString() });
  saveLocalStore(store);
  return profile;
}

export async function getTrainerProfile(userId: string): Promise<ITrainerProfile | null> {
  const store = loadLocalStore();
  return store.trainerProfiles.find((p) => p.userId === userId) || null;
}

export async function getAllTrainers(): Promise<ITrainerProfile[]> {
  const store = loadLocalStore();
  return store.trainerProfiles;
}

/* ========================================================
   COURSES
   ======================================================== */

export async function getCourses(filters?: {
  category?: string;
  difficulty?: string;
  search?: string;
  trainerId?: string;
}): Promise<ICourse[]> {
  const store = loadLocalStore();
  let list = [...store.courses];

  if (filters?.trainerId) {
    list = list.filter((c) => c.trainerId === filters.trainerId);
  }

  if (filters?.category && filters.category !== 'All') {
    list = list.filter((c) => c.category.toLowerCase().includes(filters.category!.toLowerCase()));
  }

  if (filters?.difficulty && filters.difficulty !== 'All') {
    list = list.filter((c) => c.difficulty === filters.difficulty);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return list;
}

export async function getCourseById(id: string): Promise<ICourse | null> {
  const store = loadLocalStore();
  return store.courses.find((c) => c._id === id || c.slug === id) || null;
}

export async function createCourse(courseData: Partial<ICourse>): Promise<ICourse> {
  const store = loadLocalStore();
  const id = `course_${Date.now()}`;
  const slug = (courseData.title || 'course')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const newCourse: ICourse = {
    _id: id,
    title: courseData.title || 'Untitled Meteorological Course',
    slug: `${slug}-${Math.random().toString(36).substring(2, 6)}`,
    description: courseData.description || 'Comprehensive capacity building course.',
    category: courseData.category || 'General Meteorology',
    difficulty: courseData.difficulty || 'Beginner',
    duration: courseData.duration || '3 Weeks',
    trainerId: courseData.trainerId || 'usr_trainer_001',
    trainerName: courseData.trainerName || 'Dr. Rajesh Sharma',
    trainerRole: courseData.trainerRole || 'Senior Meteorologist',
    thumbnail:
      courseData.thumbnail ||
      'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600&auto=format&fit=crop',
    status: courseData.status || 'published',
    tags: courseData.tags || ['Meteorology', 'Training', 'IMD'],
    modules: courseData.modules || [],
    enrolledCount: 0,
    rating: 5.0,
    ratingCount: 0,
    disclaimer: 'Prototype Demo Content — Not Official IMD Material.',
    competencyDomain: courseData.competencyDomain || 'Meteorology',
    competencyGainPercentage: courseData.competencyGainPercentage || 25,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.courses.unshift(newCourse);
  saveLocalStore(store);
  return newCourse;
}

/* ========================================================
   ENROLLMENTS & LEARNING PROGRESS
   ======================================================== */

export async function getEnrollments(traineeId?: string): Promise<IEnrollment[]> {
  const store = loadLocalStore();
  if (traineeId) {
    return store.enrollments.filter((e) => e.traineeId === traineeId);
  }
  return store.enrollments;
}

export async function getEnrollment(courseId: string, traineeId: string): Promise<IEnrollment | null> {
  const store = loadLocalStore();
  return (
    store.enrollments.find((e) => e.courseId === courseId && e.traineeId === traineeId) || null
  );
}

export async function enrollTrainee(courseId: string, traineeId: string): Promise<IEnrollment> {
  const store = loadLocalStore();
  const existing = store.enrollments.find(
    (e) => e.courseId === courseId && e.traineeId === traineeId
  );
  if (existing) return existing;

  const course = store.courses.find((c) => c._id === courseId);
  if (!course) throw new Error('Course not found');

  const newEnrollment: IEnrollment = {
    _id: `enr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    courseId,
    courseTitle: course.title,
    traineeId,
    status: 'enrolled',
    progressPercentage: 0,
    completedLessonIds: [],
    enrolledAt: new Date().toISOString(),
    lastAccessedAt: new Date().toISOString(),
  };

  store.enrollments.push(newEnrollment);
  course.enrolledCount = (course.enrolledCount || 0) + 1;
  saveLocalStore(store);
  return newEnrollment;
}

export async function completeLesson(
  courseId: string,
  lessonId: string,
  traineeId: string
): Promise<IEnrollment> {
  const store = loadLocalStore();
  let enrollment = store.enrollments.find(
    (e) => e.courseId === courseId && e.traineeId === traineeId
  );

  if (!enrollment) {
    enrollment = await enrollTrainee(courseId, traineeId);
  }

  const course = store.courses.find((c) => c._id === courseId);
  if (!course) throw new Error('Course not found');

  // Count total lessons
  const allLessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
  const totalLessons = allLessonIds.length || 1;

  if (!enrollment.completedLessonIds.includes(lessonId)) {
    enrollment.completedLessonIds.push(lessonId);
  }

  enrollment.progressPercentage = Math.round(
    (enrollment.completedLessonIds.length / totalLessons) * 100
  );

  if (enrollment.progressPercentage >= 100) {
    enrollment.status = 'completed';
    enrollment.completedAt = new Date().toISOString();
  } else {
    enrollment.status = 'in-progress';
  }

  enrollment.lastAccessedAt = new Date().toISOString();
  saveLocalStore(store);
  return enrollment;
}

/* ========================================================
   ASSESSMENTS
   ======================================================== */

export async function getAssessments(courseId?: string): Promise<IAssessment[]> {
  const store = loadLocalStore();
  if (courseId) {
    return store.assessments.filter((a) => a.courseId === courseId);
  }
  return store.assessments;
}

export async function getAssessmentById(id: string): Promise<IAssessment | null> {
  const store = loadLocalStore();
  return store.assessments.find((a) => a._id === id || a.courseId === id) || null;
}

export async function createAssessment(data: Partial<IAssessment>): Promise<IAssessment> {
  const store = loadLocalStore();
  const id = `assess_${Date.now()}`;
  const course = store.courses.find((c) => c._id === data.courseId);

  const newAssessment: IAssessment = {
    _id: id,
    courseId: data.courseId || '',
    courseTitle: course?.title || data.courseTitle || 'Assessment',
    trainerId: data.trainerId || 'usr_trainer_001',
    trainerName: data.trainerName || 'Trainer',
    title: data.title || 'Course Assessment',
    description: data.description || 'MCQ assessment.',
    durationMinutes: data.durationMinutes || 20,
    totalMarks: data.questions?.reduce((acc, q) => acc + (q.marks || 1), 0) || 5,
    passingPercentage: data.passingPercentage || 60,
    startDate: data.startDate,
    deadline: data.deadline,
    questions: data.questions || [],
    status: 'published',
    createdAt: new Date().toISOString(),
  };

  store.assessments.push(newAssessment);
  if (course) {
    course.assessmentId = id;
  }
  saveLocalStore(store);
  return newAssessment;
}

export async function submitAssessmentAttempt(payload: {
  assessmentId: string;
  traineeId: string;
  selectedAnswers: { questionIndex: number; selectedOption: number }[];
}): Promise<{ attempt: IAssessmentAttempt; certificate?: ICertificate }> {
  const store = loadLocalStore();
  const assessment = store.assessments.find((a) => a._id === payload.assessmentId);
  if (!assessment) throw new Error('Assessment not found');

  const trainee = store.users.find((u) => u._id === payload.traineeId);
  if (!trainee) throw new Error('Trainee not found');

  let totalScore = 0;
  const gradedAnswers = assessment.questions.map((q, idx) => {
    const userAns = payload.selectedAnswers.find((a) => a.questionIndex === idx);
    const selectedOption = userAns !== undefined ? userAns.selectedOption : -1;
    const isCorrect = selectedOption === q.correctAnswerIndex;
    const marksAwarded = isCorrect ? q.marks || 1 : 0;
    totalScore += marksAwarded;
    return {
      questionIndex: idx,
      selectedOption,
      isCorrect,
      marksAwarded,
    };
  });

  const percentage = Math.round((totalScore / assessment.totalMarks) * 100);
  const passed = percentage >= assessment.passingPercentage;

  const attempt: IAssessmentAttempt = {
    _id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    assessmentId: assessment._id,
    courseId: assessment.courseId,
    traineeId: trainee._id,
    traineeName: trainee.name,
    answers: gradedAnswers,
    score: totalScore,
    totalMarks: assessment.totalMarks,
    percentage,
    passed,
    startedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    completedAt: new Date().toISOString(),
  };

  store.assessmentAttempts.push(attempt);

  // Update enrollment
  let enrollment = store.enrollments.find(
    (e) => e.courseId === assessment.courseId && e.traineeId === trainee._id
  );
  if (enrollment) {
    enrollment.assessmentAttemptId = attempt._id;
    enrollment.assessmentScore = percentage;
  }

  let generatedCert: ICertificate | undefined;

  // If passed, generate certificate and update competencies!
  if (passed) {
    if (enrollment) {
      enrollment.status = 'completed';
      enrollment.progressPercentage = 100;
      enrollment.completedAt = new Date().toISOString();
    }

    const course = store.courses.find((c) => c._id === assessment.courseId);
    const certId = `IMD-CC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    // Check if certificate already exists
    let existingCert = store.certificates.find(
      (c) => c.courseId === assessment.courseId && c.traineeId === trainee._id
    );

    if (!existingCert) {
      existingCert = {
        _id: `cert_${Date.now()}`,
        certificateId: certId,
        traineeId: trainee._id,
        traineeName: trainee.name,
        traineeDepartment: trainee.department,
        courseId: assessment.courseId,
        courseName: assessment.courseTitle,
        trainerName: assessment.trainerName,
        issueDate: new Date().toISOString(),
        completionDate: new Date().toISOString(),
        scorePercentage: percentage,
        verificationCode: `VER-IMD-${Math.floor(10000 + Math.random() * 90000)}-${course?.category.substring(0, 3).toUpperCase() || 'MET'}`,
      };
      store.certificates.push(existingCert);

      // Increment trainee profile certificate count
      const profile = store.traineeProfiles.find((p) => p.userId === trainee._id);
      if (profile) {
        profile.completedCertificatesCount = (profile.completedCertificatesCount || 0) + 1;
      }
    }

    if (enrollment) {
      enrollment.certificateId = existingCert.certificateId;
    }
    generatedCert = existingCert;

    // Boost Trainee Competency for course's domain!
    if (course?.competencyDomain) {
      const tc = store.traineeCompetencies.find(
        (c) => c.traineeId === trainee._id && c.competencyName === course.competencyDomain
      );
      if (tc) {
        tc.score = Math.min(100, tc.score + (course.competencyGainPercentage || 25));
        if (tc.score >= 80) tc.level = 'Advanced';
        else if (tc.score >= 55) tc.level = 'Intermediate';
        else tc.level = 'Beginner';
        tc.lastUpdated = new Date().toISOString();
      }

      // Recompute skill gap for this competency
      const gapIndex = store.skillGaps.findIndex(
        (g) => g.traineeId === trainee._id && g.competencyName === course.competencyDomain
      );
      if (gapIndex !== -1 && tc) {
        const required = store.skillGaps[gapIndex].requiredScore;
        const newGap = Math.max(0, required - tc.score);
        store.skillGaps[gapIndex].currentScore = tc.score;
        store.skillGaps[gapIndex].gap = newGap;
        store.skillGaps[gapIndex].status =
          newGap === 0 ? 'Satisfied' : newGap > 20 ? 'Critical' : 'Moderate';
      }
    }
  }

  saveLocalStore(store);
  return { attempt, certificate: generatedCert };
}

/* ========================================================
   CERTIFICATES
   ======================================================== */

export async function getCertificates(traineeId?: string): Promise<ICertificate[]> {
  const store = loadLocalStore();
  if (traineeId) {
    return store.certificates.filter((c) => c.traineeId === traineeId);
  }
  return store.certificates;
}

export async function getCertificateById(id: string): Promise<ICertificate | null> {
  const store = loadLocalStore();
  return (
    store.certificates.find((c) => c._id === id || c.certificateId === id) || null
  );
}

/* ========================================================
   COMPETENCY MAPPING & SKILL GAPS
   ======================================================== */

export async function getCompetencies(): Promise<ICompetency[]> {
  const store = loadLocalStore();
  return store.competencies;
}

export async function getTraineeCompetencies(traineeId: string): Promise<ITraineeCompetency[]> {
  const store = loadLocalStore();
  let traineeComps = store.traineeCompetencies.filter((c) => c.traineeId === traineeId);
  if (traineeComps.length === 0) {
    // Generate baseline competencies for new trainee
    store.competencies.forEach((c) => {
      const tc: ITraineeCompetency = {
        _id: `tc_${traineeId}_${c._id}`,
        traineeId,
        competencyName: c.name,
        domain: c.domain,
        level: 'Beginner',
        score: Math.floor(Math.random() * 25) + 35,
        lastUpdated: new Date().toISOString(),
      };
      store.traineeCompetencies.push(tc);
      traineeComps.push(tc);
    });
    saveLocalStore(store);
  }
  return traineeComps;
}

export async function getSkillGaps(traineeId: string): Promise<ISkillGap[]> {
  const store = loadLocalStore();
  const traineeComps = await getTraineeCompetencies(traineeId);
  const competencies = store.competencies;

  const gaps: ISkillGap[] = [];

  for (const comp of competencies) {
    const userComp = traineeComps.find((tc) => tc.competencyName === comp.name);
    const currentScore = userComp ? userComp.score : 30;
    const requiredScore = comp.targetBenchmark || 75;
    const gap = Math.max(0, requiredScore - currentScore);

    // Map real recommended courses for this gap
    const matchedCourses = store.courses
      .filter((c) => c.competencyDomain === comp.name || c.tags.includes(comp.name))
      .map((c) => ({
        id: c._id,
        title: c.title,
        difficulty: c.difficulty,
        duration: c.duration,
      }));

    gaps.push({
      traineeId,
      competencyName: comp.name,
      currentScore,
      requiredScore,
      gap,
      status: gap === 0 ? 'Satisfied' : gap > 20 ? 'Critical' : 'Moderate',
      recommendedCourseIds: matchedCourses.map((c) => c.id),
      recommendedCourses: matchedCourses,
    });
  }

  return gaps;
}

/* ========================================================
   TRAINER COMPETENCY MATCHING ENGINE
   ======================================================== */

export async function calculateTrainerCompetencyMatches(
  requiredCompetencies: string[]
): Promise<ITrainerCompetencyMatch[]> {
  const store = loadLocalStore();
  const trainers = store.trainerProfiles;

  if (!requiredCompetencies || requiredCompetencies.length === 0) {
    requiredCompetencies = ['Meteorology', 'Weather Forecasting', 'Data Analysis'];
  }

  const results: ITrainerCompetencyMatch[] = trainers.map((t) => {
    let matchedCount = 0;
    const matchedDetails = requiredCompetencies.map((req) => {
      const match = t.competencies.find(
        (c) => c.name.toLowerCase().trim() === req.toLowerCase().trim()
      );
      if (match && match.score >= 60) {
        matchedCount++;
        return {
          name: req,
          hasCompetency: true,
          level: match.level,
          score: match.score,
        };
      }
      return {
        name: req,
        hasCompetency: false,
      };
    });

    const matchScore = Math.round((matchedCount / requiredCompetencies.length) * 100);

    return {
      trainerId: t.userId,
      trainerName: t.name,
      department: t.department,
      designation: t.designation,
      experienceYears: t.experienceYears,
      rating: t.rating,
      matchedCompetencies: matchedDetails,
      matchScore,
      matchedCount,
      totalRequired: requiredCompetencies.length,
    };
  });

  return results.sort((a, b) => b.matchScore - a.matchScore);
}

/* ========================================================
   ANNOUNCEMENTS & FEEDBACK
   ======================================================== */

export async function getAnnouncements(): Promise<IAnnouncement[]> {
  const store = loadLocalStore();
  return store.announcements.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createAnnouncement(data: {
  title: string;
  content: string;
  type: 'general' | 'course' | 'achievement' | 'urgent';
  targetRole: 'all' | 'trainee' | 'trainer';
  priority?: 'normal' | 'high';
  author?: string;
}): Promise<IAnnouncement> {
  const store = loadLocalStore();
  const newAnn: IAnnouncement = {
    _id: `ann_${Date.now()}`,
    title: data.title,
    content: data.content,
    type: data.type,
    targetRole: data.targetRole,
    priority: data.priority || 'normal',
    author: data.author || 'Director General of Meteorology (IMD)',
    createdAt: new Date().toISOString(),
  };

  store.announcements.unshift(newAnn);
  saveLocalStore(store);
  return newAnn;
}

export async function getFeedbacks(courseId?: string): Promise<IFeedback[]> {
  const store = loadLocalStore();
  if (courseId) {
    return store.feedbacks.filter((f) => f.courseId === courseId);
  }
  return store.feedbacks;
}

export async function createFeedback(data: {
  courseId: string;
  traineeId: string;
  rating: number;
  comments: string;
}): Promise<IFeedback> {
  const store = loadLocalStore();
  const course = store.courses.find((c) => c._id === data.courseId);
  const trainee = store.users.find((u) => u._id === data.traineeId);

  const fb: IFeedback = {
    _id: `fb_${Date.now()}`,
    courseId: data.courseId,
    courseTitle: course?.title || 'IMD Course',
    traineeId: data.traineeId,
    traineeName: trainee?.name || 'Trainee',
    rating: data.rating,
    comments: data.comments,
    createdAt: new Date().toISOString(),
  };

  store.feedbacks.unshift(fb);

  // Update course rating average
  if (course) {
    const courseFeedbacks = store.feedbacks.filter((f) => f.courseId === course._id);
    const sum = courseFeedbacks.reduce((acc, f) => acc + f.rating, 0);
    course.rating = Math.round((sum / courseFeedbacks.length) * 10) / 10;
    course.ratingCount = courseFeedbacks.length;
  }

  saveLocalStore(store);
  return fb;
}

/* ========================================================
   ADMIN ANALYTICS AGGREGATIONS
   ======================================================== */

export async function getAdminDashboardMetrics() {
  const store = loadLocalStore();

  const totalUsers = store.users.length;
  const traineesCount = store.users.filter((u) => u.role === 'trainee').length;
  const trainersCount = store.users.filter((u) => u.role === 'trainer').length;
  const pendingApprovalsCount = store.users.filter((u) => u.status === 'pending').length;
  const totalCourses = store.courses.length;
  const activeEnrollments = store.enrollments.filter(
    (e) => e.status === 'in-progress' || e.status === 'enrolled'
  ).length;
  const completedCourses = store.enrollments.filter((e) => e.status === 'completed').length;
  const certificatesIssued = store.certificates.length;

  // Monthly enrollment trend (mocked realistic timeline for IMD portal)
  const monthlyTrends = [
    { month: 'Oct 2025', enrollments: 34, completions: 18 },
    { month: 'Nov 2025', enrollments: 52, completions: 29 },
    { month: 'Dec 2025', enrollments: 68, completions: 42 },
    { month: 'Jan 2026', enrollments: 95, completions: 61 },
    { month: 'Feb 2026', enrollments: 124, completions: 88 },
    { month: 'Mar 2026', enrollments: 156, completions: 112 },
  ];

  // Course completion distribution
  const coursePopularity = store.courses.map((c) => ({
    name: c.title.length > 25 ? c.title.substring(0, 22) + '...' : c.title,
    enrolled: c.enrolledCount || 20,
    rating: c.rating,
  }));

  // Role distribution
  const roleDistribution = [
    { name: 'Trainees', value: traineesCount, color: '#1D4ED8' },
    { name: 'Trainers', value: trainersCount, color: '#0D9488' },
    { name: 'Admins', value: store.users.filter((u) => u.role === 'admin').length, color: '#D97706' },
  ];

  // Competency benchmark averages
  const competencyAverages = store.competencies.map((comp) => {
    const scores = store.traineeCompetencies
      .filter((tc) => tc.competencyName === comp.name)
      .map((tc) => tc.score);
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 55;
    return {
      domain: comp.name,
      average: avg,
      benchmark: comp.targetBenchmark,
    };
  });

  return {
    cards: {
      totalUsers,
      traineesCount,
      trainersCount,
      pendingApprovalsCount,
      totalCourses,
      activeEnrollments,
      completedCourses,
      certificatesIssued,
    },
    monthlyTrends,
    coursePopularity,
    roleDistribution,
    competencyAverages,
    pendingUsers: store.users.filter((u) => u.status === 'pending'),
    recentCertificates: store.certificates.slice(0, 5),
    recentFeedbacks: store.feedbacks.slice(0, 5),
  };
}
