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
  RoleTemplateModel,
  LearningPathModel,
  TrainingEventModel,
  NotificationModel,
  TrainerLibraryModel,
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
  IRoleTemplate,
  ILearningPath,
  ILearningPathStep,
  ITrainingImpactMetrics,
  IDepartmentSkillCoverage,
  ITrainingEvent,
  ITrainerLibraryResource,
  INotification,
  ICompetencyPassport,
  ICourseRecommendation,
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
  SEED_ROLE_TEMPLATES,
  SEED_LEARNING_PATHS,
  SEED_DEPARTMENT_HEATMAP,
  SEED_TRAINING_EVENTS,
  SEED_TRAINER_LIBRARY,
  SEED_NOTIFICATIONS,
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
  roleTemplates: IRoleTemplate[];
  learningPaths: ILearningPath[];
  trainingEvents: ITrainingEvent[];
  trainerLibrary: ITrainerLibraryResource[];
  notifications: INotification[];
  departmentHeatmap: IDepartmentSkillCoverage[];
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
      const parsed: DatabaseStore = JSON.parse(data);

      let needsSave = false;
      if (!parsed.roleTemplates || parsed.roleTemplates.length === 0) {
        parsed.roleTemplates = [...SEED_ROLE_TEMPLATES];
        needsSave = true;
      }
      if (!parsed.learningPaths || parsed.learningPaths.length === 0) {
        parsed.learningPaths = [...SEED_LEARNING_PATHS];
        needsSave = true;
      }
      if (!parsed.trainingEvents || parsed.trainingEvents.length === 0) {
        parsed.trainingEvents = [...SEED_TRAINING_EVENTS];
        needsSave = true;
      }
      if (!parsed.trainerLibrary || parsed.trainerLibrary.length === 0) {
        parsed.trainerLibrary = [...SEED_TRAINER_LIBRARY];
        needsSave = true;
      }
      if (!parsed.notifications || parsed.notifications.length === 0) {
        parsed.notifications = [...SEED_NOTIFICATIONS];
        needsSave = true;
      }
      if (!parsed.departmentHeatmap || parsed.departmentHeatmap.length === 0) {
        parsed.departmentHeatmap = [...SEED_DEPARTMENT_HEATMAP];
        needsSave = true;
      }
      if (parsed.users.length < SEED_USERS.length) {
        parsed.users = [...SEED_USERS];
        needsSave = true;
      }
      if (parsed.courses.length < SEED_COURSES.length) {
        parsed.courses = [...SEED_COURSES];
        needsSave = true;
      }
      if (parsed.competencies.length < SEED_COMPETENCIES.length) {
        parsed.competencies = [...SEED_COMPETENCIES];
        needsSave = true;
      }

      if (needsSave) {
        fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), 'utf-8');
      }
      return parsed;
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
    roleTemplates: [...SEED_ROLE_TEMPLATES],
    learningPaths: [...SEED_LEARNING_PATHS],
    trainingEvents: [...SEED_TRAINING_EVENTS],
    trainerLibrary: [...SEED_TRAINER_LIBRARY],
    notifications: [...SEED_NOTIFICATIONS],
    departmentHeatmap: [...SEED_DEPARTMENT_HEATMAP],
  };

  fs.writeFileSync(filePath, JSON.stringify(initialStore, null, 2), 'utf-8');
  return initialStore;
}

function saveLocalStore(store: DatabaseStore): void {
  const filePath = getStoreFilePath();
  fs.writeFileSync(filePath, JSON.stringify(store, null, 2), 'utf-8');
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
    store.users.find(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    ) || null
  );
}

export async function createUser(userData: {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  department: string;
  designation: string;
  phone?: string;
  status?: UserStatus;
}): Promise<IUser> {
  const store = loadLocalStore();
  const newUser: IUser = {
    _id: `usr_${Date.now()}`,
    name: userData.name,
    email: userData.email,
    passwordHash: userData.passwordHash,
    role: userData.role,
    status: userData.status || (userData.role === 'admin' ? 'approved' : 'pending'),
    department: userData.department,
    designation: userData.designation,
    phone: userData.phone,
    createdAt: new Date().toISOString(),
  };

  store.users.push(newUser);

  // Initialize profile
  if (userData.role === 'trainee') {
    store.traineeProfiles.push({
      _id: `prof_${newUser._id}`,
      userId: newUser._id,
      department: newUser.department,
      designation: newUser.designation,
      phone: newUser.phone,
      bio: '',
      education: [],
      experience: [],
      skills: [],
      interests: [],
      completedCertificatesCount: 0,
      learningHours: 0,
      learningStreakDays: 1,
      badges: ['🏅 New Recruit'],
      updatedAt: new Date().toISOString(),
    });
  } else if (userData.role === 'trainer') {
    store.trainerProfiles.push({
      _id: `prof_${newUser._id}`,
      userId: newUser._id,
      name: newUser.name,
      department: newUser.department,
      designation: newUser.designation,
      bio: '',
      experienceYears: 5,
      specializations: [],
      competencies: [],
      rating: 5.0,
      totalCourses: 0,
      totalStudentsTaught: 0,
      certifications: [],
      coursesTaught: [],
    });
  }

  saveLocalStore(store);
  return newUser;
}

export async function updateUser(
  id: string,
  data: Partial<IUser>
): Promise<IUser | null> {
  const store = loadLocalStore();
  const idx = store.users.findIndex((u) => u._id === id);
  if (idx === -1) return null;

  store.users[idx] = {
    ...store.users[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  saveLocalStore(store);
  return store.users[idx];
}

export async function updateUserStatus(id: string, status: UserStatus): Promise<IUser | null> {
  return updateUser(id, { status });
}

export async function updateUserRole(id: string, role: UserRole): Promise<IUser | null> {
  return updateUser(id, { role });
}

/**
 * Demo Story Step 1: Admin approves trainer
 */
export async function approveTrainer(userId: string): Promise<IUser | null> {
  const store = loadLocalStore();
  const user = store.users.find((u) => u._id === userId);
  if (!user) return null;

  user.status = 'approved';
  user.updatedAt = new Date().toISOString();

  // Add notification to trainer
  store.notifications.push({
    _id: `notif_${Date.now()}`,
    userId: user._id,
    title: 'Trainer Application Approved',
    message: 'Your trainer credentials have been approved by IMD DG Admin. You can now create and publish courses.',
    read: false,
    type: 'system',
    link: '/trainer/courses/create',
    createdAt: new Date().toISOString(),
  });

  saveLocalStore(store);
  return user;
}

export async function deleteUser(id: string): Promise<boolean> {
  const store = loadLocalStore();
  const initialLen = store.users.length;
  store.users = store.users.filter((u) => u._id !== id);
  if (store.users.length !== initialLen) {
    saveLocalStore(store);
    return true;
  }
  return false;
}

/* ========================================================
   PROFILE OPERATIONS
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
  const idx = store.traineeProfiles.findIndex((p) => p.userId === userId);
  if (idx === -1) {
    const newProfile: ITraineeProfile = {
      _id: `prof_${userId}`,
      userId,
      department: data.department || 'IMD Operational Centre',
      designation: data.designation || 'Scientific Assistant',
      phone: data.phone,
      bio: data.bio || '',
      education: data.education || [],
      experience: data.experience || [],
      skills: data.skills || [],
      interests: data.interests || [],
      completedCertificatesCount: 0,
      learningHours: 0,
      learningStreakDays: 1,
      badges: ['🏅 New Recruit'],
      updatedAt: new Date().toISOString(),
    };
    store.traineeProfiles.push(newProfile);
    saveLocalStore(store);
    return newProfile;
  }

  store.traineeProfiles[idx] = {
    ...store.traineeProfiles[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  saveLocalStore(store);
  return store.traineeProfiles[idx];
}

export async function getTrainerProfile(userId: string): Promise<ITrainerProfile | null> {
  const store = loadLocalStore();
  return store.trainerProfiles.find((p) => p.userId === userId) || null;
}

export async function getAllTrainers(): Promise<ITrainerProfile[]> {
  const store = loadLocalStore();
  return store.trainerProfiles;
}

export async function updateTrainerProfile(
  userId: string,
  data: Partial<ITrainerProfile>
): Promise<ITrainerProfile | null> {
  const store = loadLocalStore();
  const idx = store.trainerProfiles.findIndex((p) => p.userId === userId);
  if (idx === -1) return null;

  store.trainerProfiles[idx] = {
    ...store.trainerProfiles[idx],
    ...data,
  };
  saveLocalStore(store);
  return store.trainerProfiles[idx];
}

/* ========================================================
   COURSE OPERATIONS & PREREQUISITE ENGINE (Feature 20)
   ======================================================== */

export async function getCourses(filter?: {
  status?: string;
  category?: string;
  trainerId?: string;
  search?: string;
  difficulty?: string;
}): Promise<ICourse[]> {
  const store = loadLocalStore();
  let result = store.courses;

  if (filter?.status) {
    result = result.filter((c) => c.status === filter.status);
  }
  if (filter?.category) {
    result = result.filter((c) => c.category === filter.category);
  }
  if (filter?.trainerId) {
    result = result.filter((c) => c.trainerId === filter.trainerId);
  }
  if (filter?.difficulty) {
    result = result.filter((c) => c.difficulty.toLowerCase() === filter.difficulty?.toLowerCase());
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    result = result.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  return result;
}

export async function getCourseById(id: string): Promise<ICourse | null> {
  const store = loadLocalStore();
  return store.courses.find((c) => c._id === id || c.slug === id) || null;
}

export async function getCourseBySlug(slug: string): Promise<ICourse | null> {
  const store = loadLocalStore();
  return store.courses.find((c) => c.slug === slug || c._id === slug) || null;
}

export async function createCourse(data: Partial<ICourse>): Promise<ICourse> {
  const store = loadLocalStore();
  const newCourse: ICourse = {
    _id: `course_${Date.now()}`,
    title: data.title || 'New IMD Meteorological Course',
    slug: (data.title || 'new-course')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, ''),
    description: data.description || '',
    category: data.category || 'General Meteorology',
    difficulty: data.difficulty || 'Beginner',
    duration: data.duration || '4 Weeks',
    trainerId: data.trainerId || 'usr_trainer_001',
    trainerName: data.trainerName || 'Dr. Rajesh Sharma',
    trainerRole: data.trainerRole || 'Senior Meteorologist, IMD',
    thumbnail:
      data.thumbnail ||
      'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600&auto=format&fit=crop',
    status: data.status || 'published',
    tags: data.tags || ['Meteorology', 'Training'],
    modules: data.modules || [],
    enrolledCount: 0,
    rating: 5.0,
    ratingCount: 0,
    disclaimer: 'Prototype Demo Content — Not Official IMD Material.',
    competencyDomain: data.competencyDomain || 'Weather Forecasting',
    competencyGainPercentage: data.competencyGainPercentage || 25,
    prerequisites: data.prerequisites || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.courses.push(newCourse);
  saveLocalStore(store);
  return newCourse;
}

export async function updateCourse(
  id: string,
  data: Partial<ICourse>
): Promise<ICourse | null> {
  const store = loadLocalStore();
  const idx = store.courses.findIndex((c) => c._id === id || c.slug === id);
  if (idx === -1) return null;

  store.courses[idx] = {
    ...store.courses[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  saveLocalStore(store);
  return store.courses[idx];
}

export async function deleteCourse(id: string): Promise<boolean> {
  const store = loadLocalStore();
  const initialLen = store.courses.length;
  store.courses = store.courses.filter((c) => c._id !== id);
  if (store.courses.length !== initialLen) {
    saveLocalStore(store);
    return true;
  }
  return false;
}

/**
 * Feature 20: Course Prerequisite Engine
 */
export async function checkPrerequisitesMet(
  traineeId: string,
  courseId: string
): Promise<{ met: boolean; missingPrerequisites: string[]; prerequisiteChain: string[] }> {
  const store = loadLocalStore();
  const course = store.courses.find((c) => c._id === courseId || c.slug === courseId);
  if (!course || !course.prerequisites || course.prerequisites.length === 0) {
    return { met: true, missingPrerequisites: [], prerequisiteChain: [] };
  }

  const completedEnrollments = store.enrollments.filter(
    (e) => e.traineeId === traineeId && e.status === 'completed'
  );
  const completedCourseTitles = completedEnrollments.map((e) => e.courseTitle.toLowerCase());
  const completedCourseIds = completedEnrollments.map((e) => e.courseId);

  const missing: string[] = [];
  for (const prereq of course.prerequisites) {
    const isCompleted =
      completedCourseIds.includes(prereq) ||
      completedCourseTitles.some((t) => t.includes(prereq.toLowerCase()));
    if (!isCompleted) {
      missing.push(prereq);
    }
  }

  return {
    met: missing.length === 0,
    missingPrerequisites: missing,
    prerequisiteChain: [...course.prerequisites, course.title],
  };
}

/* ========================================================
   ENROLLMENT & PROGRESS OPERATIONS
   ======================================================== */

export async function getEnrollments(filter?: {
  traineeId?: string;
  courseId?: string;
  status?: string;
} | string): Promise<IEnrollment[]> {
  const store = loadLocalStore();
  let result = store.enrollments;
  const f = typeof filter === 'string' ? { traineeId: filter } : filter;
  if (f?.traineeId) {
    result = result.filter((e) => e.traineeId === f.traineeId);
  }
  if (f?.courseId) {
    result = result.filter((e) => e.courseId === f.courseId);
  }
  if (f?.status) {
    result = result.filter((e) => e.status === f.status);
  }
  return result;
}

export async function getEnrollmentById(id: string): Promise<IEnrollment | null> {
  const store = loadLocalStore();
  return store.enrollments.find((e) => e._id === id) || null;
}

export async function getEnrollment(
  courseId: string,
  traineeId: string
): Promise<IEnrollment | null> {
  const store = loadLocalStore();
  return (
    store.enrollments.find(
      (e) => (e.courseId === courseId || e.courseId === courseId) && e.traineeId === traineeId
    ) || null
  );
}

export async function enrollTrainee(courseId: string, traineeId: string): Promise<IEnrollment> {
  return enrollInCourse(traineeId, courseId);
}

export async function completeLesson(
  courseId: string,
  lessonId: string,
  traineeId: string
): Promise<IEnrollment | null> {
  const store = loadLocalStore();
  let enrollment = store.enrollments.find(
    (e) => e.courseId === courseId && e.traineeId === traineeId
  );
  if (!enrollment) {
    enrollment = await enrollInCourse(traineeId, courseId);
  }
  return updateLessonProgress(enrollment._id, lessonId);
}

export async function enrollInCourse(
  traineeId: string,
  courseId: string
): Promise<IEnrollment> {
  const store = loadLocalStore();
  const course = store.courses.find((c) => c._id === courseId || c.slug === courseId);
  if (!course) throw new Error('Course not found');

  const existing = store.enrollments.find(
    (e) => e.traineeId === traineeId && e.courseId === course._id
  );
  if (existing) return existing;

  const newEnrollment: IEnrollment = {
    _id: `enr_${Date.now()}`,
    courseId: course._id,
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

export async function updateLessonProgress(
  enrollmentId: string,
  lessonId: string
): Promise<IEnrollment | null> {
  const store = loadLocalStore();
  const enrollment = store.enrollments.find((e) => e._id === enrollmentId);
  if (!enrollment) return null;

  const course = store.courses.find((c) => c._id === enrollment.courseId);
  if (!course) return null;

  if (!enrollment.completedLessonIds.includes(lessonId)) {
    enrollment.completedLessonIds.push(lessonId);
  }

  // Calculate total lessons in course
  let totalLessons = 0;
  course.modules?.forEach((m) => {
    totalLessons += m.lessons?.length || 0;
  });

  const progress = totalLessons > 0
    ? Math.round((enrollment.completedLessonIds.length / totalLessons) * 100)
    : 0;

  enrollment.progressPercentage = Math.min(100, progress);
  enrollment.status = progress >= 100 ? 'completed' : 'in-progress';
  enrollment.lastAccessedAt = new Date().toISOString();
  if (progress >= 100 && !enrollment.completedAt) {
    enrollment.completedAt = new Date().toISOString();
  }

  saveLocalStore(store);
  return enrollment;
}

/**
 * Feature 6: Record Pre-Assessment Baseline
 */
export async function recordPreAssessmentAttempt(
  traineeId: string,
  courseId: string,
  answers: any[],
  score: number,
  totalMarks: number
): Promise<IEnrollment> {
  const store = loadLocalStore();
  let enrollment = store.enrollments.find(
    (e) => e.traineeId === traineeId && e.courseId === courseId
  );

  const percentage =
    score > totalMarks
      ? Math.min(100, Math.round(score))
      : totalMarks > 0
      ? Math.min(100, Math.round((score / totalMarks) * 100))
      : Math.min(100, Math.round(score));

  if (!enrollment) {
    const course = store.courses.find((c) => c._id === courseId);
    enrollment = {
      _id: `enr_${Date.now()}`,
      courseId,
      courseTitle: course?.title || 'IMD Course',
      traineeId,
      status: 'in-progress',
      progressPercentage: 5,
      completedLessonIds: [],
      enrolledAt: new Date().toISOString(),
      preAssessmentScore: percentage,
      preAssessmentDate: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
    };
    store.enrollments.push(enrollment);
  } else {
    enrollment.preAssessmentScore = percentage;
    enrollment.preAssessmentDate = new Date().toISOString();
    enrollment.lastAccessedAt = new Date().toISOString();
  }

  saveLocalStore(store);
  return enrollment;
}

/**
 * Feature 7: Pre-Assessment vs Post-Assessment Comparison
 */
export async function getPrePostComparison(traineeId: string, courseId: string) {
  const store = loadLocalStore();
  const enrollment = store.enrollments.find(
    (e) => e.traineeId === traineeId && e.courseId === courseId
  );
  if (!enrollment) return null;

  return {
    preScore: enrollment.preAssessmentScore ?? 42,
    postScore: enrollment.assessmentScore,
    improvement:
      enrollment.assessmentScore !== undefined && enrollment.preAssessmentScore !== undefined
        ? enrollment.assessmentScore - enrollment.preAssessmentScore
        : undefined,
  };
}

/* ========================================================
   ASSESSMENT OPERATIONS
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
  return store.assessments.find((a) => a._id === id) || null;
}

export async function createAssessment(data: Partial<IAssessment>): Promise<IAssessment> {
  const store = loadLocalStore();
  const newAssessment: IAssessment = {
    _id: `assess_${Date.now()}`,
    courseId: data.courseId || '',
    courseTitle: data.courseTitle || 'Weather Assessment',
    trainerId: data.trainerId || 'usr_trainer_001',
    trainerName: data.trainerName || 'Dr. Rajesh Sharma',
    title: data.title || 'Course Assessment',
    description: data.description || '',
    durationMinutes: data.durationMinutes || 20,
    totalMarks: data.totalMarks || 5,
    passingPercentage: data.passingPercentage || 60,
    assessmentType: data.assessmentType || 'post',
    questions: data.questions || [],
    status: 'published',
    createdAt: new Date().toISOString(),
  };

  store.assessments.push(newAssessment);
  saveLocalStore(store);
  return newAssessment;
}

export async function submitAssessmentAttempt(data: {
  assessmentId: string;
  traineeId: string;
  answers?: { questionIndex: number; selectedOption: number }[];
  selectedAnswers?: { questionIndex: number; selectedOption: number }[];
}): Promise<{ attempt: IAssessmentAttempt; certificate?: ICertificate; improvement?: number }> {
  const store = loadLocalStore();
  const assessment = store.assessments.find((a) => a._id === data.assessmentId);
  if (!assessment) throw new Error('Assessment not found');

  const trainee = store.users.find((u) => u._id === data.traineeId);
  if (!trainee) throw new Error('Trainee not found');

  const submittedAnswers = data.answers || data.selectedAnswers || [];
  let score = 0;
  const processedAnswers = submittedAnswers.map((ans) => {
    const q = assessment.questions[ans.questionIndex];
    const isCorrect = q && q.correctAnswerIndex === ans.selectedOption;
    if (isCorrect) score += q.marks;
    return {
      questionIndex: ans.questionIndex,
      selectedOption: ans.selectedOption,
      isCorrect: !!isCorrect,
      marksAwarded: isCorrect ? q.marks : 0,
    };
  });

  const percentage = Math.round((score / assessment.totalMarks) * 100);
  const passed = percentage >= assessment.passingPercentage;

  const attempt: IAssessmentAttempt = {
    _id: `att_${Date.now()}`,
    assessmentId: assessment._id,
    courseId: assessment.courseId,
    traineeId: trainee._id,
    traineeName: trainee.name,
    assessmentType: assessment.assessmentType || 'post',
    answers: processedAnswers,
    score,
    totalMarks: assessment.totalMarks,
    percentage,
    passed,
    startedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    completedAt: new Date().toISOString(),
  };

  store.assessmentAttempts.push(attempt);

  // Update Enrollment
  const enrollment = store.enrollments.find(
    (e) => e.traineeId === trainee._id && e.courseId === assessment.courseId
  );

  let improvement: number | undefined;
  if (enrollment) {
    enrollment.assessmentAttemptId = attempt._id;
    enrollment.assessmentScore = percentage;
    enrollment.postAssessmentDate = new Date().toISOString();

    if (enrollment.preAssessmentScore !== undefined) {
      improvement = percentage - enrollment.preAssessmentScore;
      enrollment.improvementPoints = improvement;
    }

    if (passed) {
      enrollment.status = 'completed';
      enrollment.progressPercentage = 100;
      enrollment.completedAt = new Date().toISOString();
    }
  }

  let generatedCert: ICertificate | undefined;
  if (passed && assessment.assessmentType !== 'pre') {
    const course = store.courses.find((c) => c._id === assessment.courseId);
    let existingCert = store.certificates.find(
      (c) => c.traineeId === trainee._id && c.courseId === assessment.courseId
    );

    if (!existingCert) {
      const certId = `CC-2026-${Math.floor(100000 + Math.random() * 900000)}`;
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
        preScorePercentage: enrollment?.preAssessmentScore ?? 42,
        scorePercentage: percentage,
        verificationCode: certId,
        verificationUrl: `/verify/${certId}`,
      };
      store.certificates.push(existingCert);

      const profile = store.traineeProfiles.find((p) => p.userId === trainee._id);
      if (profile) {
        profile.completedCertificatesCount = (profile.completedCertificatesCount || 0) + 1;
        profile.learningHours = (profile.learningHours || 100) + 20;
      }
    }

    if (enrollment) {
      enrollment.certificateId = existingCert.certificateId;
    }
    generatedCert = existingCert;

    // Feature 7: Boost Trainee Competency for course's domain!
    if (course?.competencyDomain) {
      const tc = store.traineeCompetencies.find(
        (c) => c.traineeId === trainee._id && c.competencyName === course.competencyDomain
      );
      if (tc) {
        tc.score = Math.min(100, tc.score + (course.competencyGainPercentage || 28));
        if (tc.score >= 90) tc.level = 'Expert';
        else if (tc.score >= 75) tc.level = 'Advanced';
        else if (tc.score >= 50) tc.level = 'Intermediate';
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
  return { attempt, certificate: generatedCert, improvement };
}

/* ========================================================
   CERTIFICATES & VERIFICATION (Feature 21)
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
    store.certificates.find(
      (c) => c._id === id || c.certificateId === id || c.verificationCode === id
    ) || null
  );
}

export async function getCertificateByVerificationCode(code: string): Promise<ICertificate | null> {
  const store = loadLocalStore();
  return (
    store.certificates.find(
      (c) =>
        c.verificationCode.toLowerCase().trim() === code.toLowerCase().trim() ||
        c.certificateId.toLowerCase().trim() === code.toLowerCase().trim()
    ) || null
  );
}

/* ========================================================
   COMPETENCY MAPPING & SKILL GAPS (Feature 1 & 3)
   ======================================================== */

export async function getCompetencies(): Promise<ICompetency[]> {
  const store = loadLocalStore();
  return store.competencies;
}

export async function getTraineeCompetencies(traineeId: string): Promise<ITraineeCompetency[]> {
  const store = loadLocalStore();
  let traineeComps = store.traineeCompetencies.filter((c) => c.traineeId === traineeId);
  if (traineeComps.length === 0) {
    store.competencies.forEach((c) => {
      const tc: ITraineeCompetency = {
        _id: `tc_${traineeId}_${c._id}`,
        traineeId,
        competencyName: c.name,
        domain: c.domain,
        level: 'Beginner',
        score: Math.floor(Math.random() * 25) + 40,
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
    const currentScore = userComp ? userComp.score : 45;
    const requiredScore = comp.targetBenchmark || 75;
    const gap = Math.max(0, requiredScore - currentScore);

    const matchedCourses = store.courses
      .filter(
        (c) =>
          c.competencyDomain === comp.name ||
          c.tags.some((t) => t.toLowerCase().includes(comp.name.toLowerCase()))
      )
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
      explanation:
        'These courses address competencies where your current level is below the selected role requirement.',
    });
  }

  return gaps.sort((a, b) => b.gap - a.gap);
}

/* ========================================================
   ROLE-BASED COMPETENCY MATRIX (Feature 2)
   ======================================================== */

export async function getRoleTemplates(): Promise<IRoleTemplate[]> {
  const store = loadLocalStore();
  return store.roleTemplates;
}

export async function getRoleTemplateById(id: string): Promise<IRoleTemplate | null> {
  const store = loadLocalStore();
  return (
    store.roleTemplates.find((r) => r._id === id || r.code === id || r.name === id) || null
  );
}

/**
 * Compare Trainee Competencies against Role Requirements.
 * Formula: Skill Gap = Required Competency - Current Competency
 */
export async function compareTraineeToRole(traineeId: string, roleCodeOrId: string) {
  const store = loadLocalStore();
  const trainee = store.users.find((u) => u._id === traineeId);
  if (!trainee) throw new Error('Trainee not found');

  const role =
    store.roleTemplates.find((r) => r._id === roleCodeOrId || r.code === roleCodeOrId) ||
    store.roleTemplates[0];

  const traineeComps = await getTraineeCompetencies(traineeId);

  let totalRequired = 0;
  let totalCurrent = 0;

  const comparisons = role.requiredCompetencies.map((req) => {
    const userComp = traineeComps.find(
      (tc) => tc.competencyName.toLowerCase() === req.competencyName.toLowerCase()
    );
    const currentScore = userComp ? userComp.score : 40;
    const gap = Math.max(0, req.requiredScore - currentScore);
    const meetsRequirement = currentScore >= req.requiredScore;

    totalRequired += req.requiredScore;
    totalCurrent += Math.min(currentScore, req.requiredScore);

    const recommendedCourses = store.courses.filter(
      (c) =>
        c.competencyDomain === req.competencyName ||
        c.tags.some((t) => t.toLowerCase() === req.competencyName.toLowerCase())
    );

    return {
      competencyName: req.competencyName,
      requiredLevel: req.requiredLevel,
      requiredScore: req.requiredScore,
      currentScore,
      currentLevel: userComp?.level || 'Beginner',
      gap,
      meetsRequirement,
      recommendedCourses,
    };
  });

  const overallReadiness = Math.round((totalCurrent / totalRequired) * 100);

  return {
    trainee,
    role,
    comparisons,
    overallReadiness,
    disclaimer:
      'This competency matrix is for training recommendations only. Not for employment, promotion, or disciplinary decisions.',
  };
}

/* ========================================================
   PERSONALIZED LEARNING PATH ENGINE (Feature 4)
   ======================================================== */

export async function getLearningPathByUserId(userId: string): Promise<ILearningPath | null> {
  const store = loadLocalStore();
  return store.learningPaths.find((lp) => lp.userId === userId) || store.learningPaths[0] || null;
}

export async function updateLearningPathStep(
  userId: string,
  stepId: string,
  status: 'completed' | 'in-progress' | 'current' | 'locked',
  score?: number
): Promise<ILearningPath | null> {
  const store = loadLocalStore();
  const lp = store.learningPaths.find((p) => p.userId === userId);
  if (!lp) return null;

  const step = lp.steps.find((s) => s.id === stepId);
  if (step) {
    step.status = status;
    if (score !== undefined) step.score = score;
    if (status === 'completed') step.completedAt = new Date().toISOString();
  }

  // Update overall progress percentage
  const completedCount = lp.steps.filter((s) => s.status === 'completed').length;
  lp.progress = Math.round((completedCount / lp.steps.length) * 100);
  lp.updatedAt = new Date().toISOString();

  saveLocalStore(store);
  return lp;
}

/* ========================================================
   SMART COURSE RECOMMENDATIONS WITH "WHY" REASONS (Feature 5)
   ======================================================== */

export async function getSmartCourseRecommendations(
  traineeId: string
): Promise<ICourseRecommendation[]> {
  const store = loadLocalStore();
  const trainee = store.users.find((u) => u._id === traineeId);
  const gaps = await getSkillGaps(traineeId);
  const enrollments = store.enrollments.filter((e) => e.traineeId === traineeId);
  const completedCourseIds = enrollments
    .filter((e) => e.status === 'completed')
    .map((e) => e.courseId);

  const recommendations: ICourseRecommendation[] = [];

  for (const course of store.courses) {
    if (completedCourseIds.includes(course._id)) continue;

    const reasons: string[] = [];
    let matchScore = 50;

    // Check 1: Skill gap addressal
    const gapComp = gaps.find(
      (g) =>
        g.competencyName === course.competencyDomain && g.gap > 0
    );
    if (gapComp) {
      reasons.push(
        `✓ Addresses your ${gapComp.competencyName} skill gap (${gapComp.gap}% gap detected)`
      );
      matchScore += 25;
    }

    // Check 2: Role alignment
    reasons.push('✓ Matches your target role requirements (Weather Forecaster)');
    matchScore += 15;

    // Check 3: Prerequisite value
    if (course.slug === 'weather-forecasting-fundamentals') {
      reasons.push('✓ Core prerequisite for Advanced Tropical Cyclone Forecasting');
      matchScore += 10;
    }

    // Check 4: Course prerequisites met
    const prereqCheck = await checkPrerequisitesMet(traineeId, course._id);

    recommendations.push({
      course,
      reasons,
      matchScore: Math.min(100, matchScore),
      gapCompetency: course.competencyDomain,
      prerequisitesMet: prereqCheck.met,
    });
  }

  return recommendations.sort((a, b) => b.matchScore - a.matchScore);
}

/* ========================================================
   TRAINING IMPACT ANALYTICS (Feature 8)
   ======================================================== */

export async function getTrainingImpactAnalytics(filters?: {
  courseId?: string;
  department?: string;
  role?: string;
  timePeriod?: string;
}): Promise<ITrainingImpactMetrics> {
  const store = loadLocalStore();
  let enrollments = store.enrollments.filter(
    (e) => e.preAssessmentScore !== undefined && e.assessmentScore !== undefined
  );

  if (filters?.courseId) {
    enrollments = enrollments.filter((e) => e.courseId === filters.courseId);
  }

  const preScores = enrollments.map((e) => e.preAssessmentScore!);
  const postScores = enrollments.map((e) => e.assessmentScore!);

  const avgPre = preScores.length
    ? Math.round(preScores.reduce((a, b) => a + b, 0) / preScores.length)
    : 48;
  const avgPost = postScores.length
    ? Math.round(postScores.reduce((a, b) => a + b, 0) / postScores.length)
    : 79;
  const avgImprovement = avgPost - avgPre;

  const totalCompleted = store.enrollments.filter((e) => e.status === 'completed').length;
  const totalEnrollments = store.enrollments.length || 1;
  const completionRate = Math.round((totalCompleted / totalEnrollments) * 100);

  const courseBreakdown = store.courses.map((c) => {
    const cEnrs = store.enrollments.filter((e) => e.courseId === c._id);
    const cPre = cEnrs.filter((e) => e.preAssessmentScore !== undefined).map((e) => e.preAssessmentScore!);
    const cPost = cEnrs.filter((e) => e.assessmentScore !== undefined).map((e) => e.assessmentScore!);

    const pPre = cPre.length ? Math.round(cPre.reduce((a, b) => a + b, 0) / cPre.length) : 46;
    const pPost = cPost.length ? Math.round(cPost.reduce((a, b) => a + b, 0) / cPost.length) : 80;

    return {
      courseId: c._id,
      courseTitle: c.title,
      preAvg: pPre,
      postAvg: pPost,
      improvement: pPost - pPre,
      participants: cEnrs.length || 15,
      completionRate: 85,
    };
  });

  const departmentBreakdown = [
    { department: 'Synoptic Forecasting Operations', preAvg: 46, postAvg: 81, improvement: 35, completionRate: 88 },
    { department: 'Satellite Meteorology Division', preAvg: 50, postAvg: 82, improvement: 32, completionRate: 86 },
    { department: 'Radar & Instrumentation Network', preAvg: 44, postAvg: 77, improvement: 33, completionRate: 80 },
    { department: 'Climate Research & Services', preAvg: 52, postAvg: 78, improvement: 26, completionRate: 84 },
    { department: 'Aviation Weather Services', preAvg: 48, postAvg: 79, improvement: 31, completionRate: 82 },
  ];

  return {
    averagePreTestScore: avgPre,
    averagePostTestScore: avgPost,
    averageImprovement: avgImprovement,
    completionRate,
    totalLearningHours: 1420,
    courseEngagementRate: 91,
    disclaimer:
      'Metrics are training and learning indicators rather than causal proof of organizational performance.',
    courseBreakdown,
    departmentBreakdown,
  };
}

/* ========================================================
   ORGANIZATIONAL SKILL HEATMAP & INSIGHTS (Feature 10 & 11)
   ======================================================== */

export async function getDepartmentSkillHeatmap(): Promise<IDepartmentSkillCoverage[]> {
  const store = loadLocalStore();
  return store.departmentHeatmap;
}

export async function getDepartmentTrainingInsights(department?: string) {
  const heatmap = await getDepartmentSkillHeatmap();
  const selectedDept = department ? heatmap.find((h) => h.department === department) : null;

  const topSkillGaps = [
    { name: 'Weather Forecasting', gap: 35, affectedEmployees: 34 },
    { name: 'Data Analysis', gap: 28, affectedEmployees: 26 },
    { name: 'Python', gap: 23, affectedEmployees: 32 },
    { name: 'Satellite Meteorology', gap: 20, affectedEmployees: 19 },
    { name: 'Radar Meteorology', gap: 18, affectedEmployees: 15 },
  ];

  const mostRequestedCourses = [
    { title: 'Weather Forecasting Fundamentals', demand: 84 },
    { title: 'Python for Meteorological Data Analysis', demand: 110 },
    { title: 'Satellite Meteorology', demand: 62 },
    { title: 'Weather Observation & Surface Instrumentation', demand: 76 },
    { title: 'Climate Data Analysis & Extreme Weather Modeling', demand: 45 },
  ];

  const lowestCompetencyAreas = [
    { name: 'Weather Forecasting Operations', avgScore: 45 },
    { name: 'Satellite Image Interpretation', avgScore: 50 },
    { name: 'Extreme Value Climatology', avgScore: 55 },
  ];

  return {
    topSkillGaps,
    mostRequestedCourses,
    lowestCompetencyAreas,
    completionRate: 84,
    avgImprovement: 31,
  };
}

/* ========================================================
   TRAINER COMPETENCY MATCHING (Feature 9)
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
    const missing: string[] = [];

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
      missing.push(req);
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
      missingCompetencies: missing,
      matchScore,
      matchedCount,
      totalRequired: requiredCompetencies.length,
      certifications: t.certifications || ['IMD Certified Trainer'],
      coursesPreviouslyTaught: t.coursesTaught || ['Operational Meteorology Course'],
    };
  });

  return results.sort((a, b) => b.matchScore - a.matchScore);
}

/* ========================================================
   TRAINER KNOWLEDGE LIBRARY (Feature 15)
   ======================================================== */

export async function getTrainerLibraryResources(
  trainerId?: string,
  folder?: string
): Promise<ITrainerLibraryResource[]> {
  const store = loadLocalStore();
  let result = store.trainerLibrary;
  if (trainerId) {
    result = result.filter((r) => r.trainerId === trainerId);
  }
  if (folder) {
    result = result.filter((r) => r.folder === folder);
  }
  return result;
}

export async function addTrainerLibraryResource(
  resource: Partial<ITrainerLibraryResource>
): Promise<ITrainerLibraryResource> {
  const store = loadLocalStore();
  const newRes: ITrainerLibraryResource = {
    id: `res_lib_${Date.now()}`,
    trainerId: resource.trainerId || 'usr_trainer_001',
    folder: resource.folder || 'Weather Forecasting',
    title: resource.title || 'Meteorological Resource',
    type: resource.type || 'pdf',
    fileName: resource.fileName || 'Resource.pdf',
    fileSize: resource.fileSize || '2.0 MB',
    fileUrl: resource.fileUrl || '/docs/sample.pdf',
    uploadedAt: new Date().toISOString(),
    usedInCourses: resource.usedInCourses || [],
  };

  store.trainerLibrary.push(newRes);
  saveLocalStore(store);
  return newRes;
}

/* ========================================================
   TRAINING CALENDAR (Feature 16)
   ======================================================== */

export async function getTrainingEvents(
  userId?: string,
  role?: string
): Promise<ITrainingEvent[]> {
  const store = loadLocalStore();
  let events = store.trainingEvents;
  if (role) {
    events = events.filter((e) => e.targetRole === 'all' || e.targetRole === role);
  }
  if (userId) {
    events = events.filter((e) => !e.userId || e.userId === userId);
  }
  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export async function createTrainingEvent(
  event: Partial<ITrainingEvent>
): Promise<ITrainingEvent> {
  const store = loadLocalStore();
  const newEvent: ITrainingEvent = {
    _id: `evt_${Date.now()}`,
    title: event.title || 'Training Event',
    description: event.description || '',
    type: event.type || 'training_event',
    date: event.date || new Date().toISOString().split('T')[0],
    time: event.time || '10:00 AM - 12:00 PM IST',
    courseId: event.courseId,
    courseTitle: event.courseTitle,
    targetRole: event.targetRole || 'all',
    userId: event.userId,
    locationOrLink: event.locationOrLink || 'IMD Auditorium / Virtual Webex',
  };

  store.trainingEvents.push(newEvent);
  saveLocalStore(store);
  return newEvent;
}

/* ========================================================
   NOTIFICATIONS (Feature 17)
   ======================================================== */

export async function getNotifications(userId: string): Promise<INotification[]> {
  const store = loadLocalStore();
  return store.notifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  const store = loadLocalStore();
  const notif = store.notifications.find((n) => n._id === id);
  if (notif) {
    notif.read = true;
    saveLocalStore(store);
    return true;
  }
  return false;
}

export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
  const store = loadLocalStore();
  let changed = false;
  store.notifications.forEach((n) => {
    if (n.userId === userId && !n.read) {
      n.read = true;
      changed = true;
    }
  });
  if (changed) saveLocalStore(store);
  return changed;
}

/* ========================================================
   COMPETENCY PASSPORT & GAMIFICATION (Feature 18 & 22)
   ======================================================== */

export async function getCompetencyPassport(
  traineeId: string
): Promise<ICompetencyPassport | null> {
  const store = loadLocalStore();
  const trainee = store.users.find((u) => u._id === traineeId);
  if (!trainee) return null;

  const profile = store.traineeProfiles.find((p) => p.userId === traineeId);
  const traineeComps = await getTraineeCompetencies(traineeId);
  const certs = store.certificates.filter((c) => c.traineeId === traineeId);
  const enrollments = store.enrollments.filter((e) => e.traineeId === traineeId);

  const completedCount = enrollments.filter((e) => e.status === 'completed').length;
  const scores = enrollments
    .filter((e) => e.assessmentScore !== undefined)
    .map((e) => e.assessmentScore!);
  const avgScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 87;

  const verifiedCompetencies = traineeComps
    .filter((tc) => tc.score >= 50)
    .map((tc) => ({
      name: tc.competencyName,
      score: tc.score,
      level: tc.level,
      verifiedDate: tc.lastUpdated,
      verifiedBy: 'IMD Central Board of Capacity Examination',
    }));

  const passportCertificates = certs.map((c) => ({
    certificateId: c.certificateId,
    courseName: c.courseName,
    issueDate: c.issueDate,
    scorePercentage: c.scorePercentage,
    verificationCode: c.verificationCode,
  }));

  const milestones = [
    {
      badge: '🏅 Data Analysis Practitioner',
      title: 'Data Analysis Practitioner',
      description: 'Demonstrated proficiency in meteorological time-series and gridded dataset analysis.',
      achievedAt: '2026-02-28',
    },
    {
      badge: '🏅 50 Hours of Learning',
      title: '50 Hours of Dedicated Study',
      description: 'Completed over 50 structured hours of capacity building.',
      achievedAt: '2026-02-15',
    },
    {
      badge: '🏅 5 Courses Completed',
      title: 'Multi-Discipline Scholar',
      description: 'Completed foundational modules across synoptic, satellite, and radar meteorology.',
      achievedAt: '2026-03-01',
    },
    {
      badge: '🏅 Assessment Excellence',
      title: 'Assessment Excellence',
      description: 'Achieved >80% score on comprehensive final examination.',
      achievedAt: '2026-02-28',
    },
  ];

  return {
    traineeId: trainee._id,
    name: trainee.name,
    department: trainee.department,
    designation: trainee.designation,
    avatar: trainee.avatar,
    learningStreakDays: profile?.learningStreakDays || 14,
    totalLearningHours: profile?.learningHours || 126,
    completedCoursesCount: completedCount || 4,
    assessmentAverage: avgScore,
    verifiedCompetencies,
    certificates: passportCertificates,
    milestones,
  };
}

/* ========================================================
   EARLY LEARNING SUPPORT SIGNAL (Feature 23)
   ======================================================== */

export async function getEarlyLearningSupportSignal(traineeId: string) {
  const store = loadLocalStore();
  const enrollments = store.enrollments.filter((e) => e.traineeId === traineeId);
  const attempts = store.assessmentAttempts.filter((a) => a.traineeId === traineeId);

  const lowAttempts = attempts.filter((a) => a.percentage < 55);
  const needsSupport = lowAttempts.length >= 1;

  const remedialCourses = store.courses.filter(
    (c) => c.difficulty === 'Beginner' && c.category.includes('Meteorology')
  );

  return {
    needsSupport,
    recentScores: attempts.map((a) => a.percentage),
    recommendedRemedialCourses: remedialCourses,
    guidanceMessage:
      'Additional learning support may be useful. Review these foundational revision materials to strengthen core thermodynamic and synoptic concepts before taking your next assessment.',
  };
}

/* ========================================================
   GLOBAL KNOWLEDGE SEARCH (Feature 14)
   ======================================================== */

export async function searchKnowledgeBase(query: string) {
  const store = loadLocalStore();
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const results: {
    type: 'course' | 'lesson' | 'resource' | 'competency' | 'assessment';
    title: string;
    subtitle: string;
    link: string;
    icon: string;
  }[] = [];

  // 1. Search Courses
  store.courses.forEach((c) => {
    if (
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q))
    ) {
      results.push({
        type: 'course',
        title: c.title,
        subtitle: `Course • ${c.difficulty} • ${c.duration}`,
        link: `/courses/${c.slug || c._id}`,
        icon: 'BookOpen',
      });
    }

    // 2. Search Lessons
    c.modules?.forEach((m) => {
      m.lessons?.forEach((l) => {
        if (
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.contentBody?.toLowerCase().includes(q)
        ) {
          results.push({
            type: 'lesson',
            title: l.title,
            subtitle: `Lesson in ${c.title} • ${l.duration}`,
            link: `/courses/${c.slug || c._id}?lesson=${l.id}`,
            icon: 'FileText',
          });
        }
      });
    });
  });

  // 3. Search Competencies
  store.competencies.forEach((comp) => {
    if (
      comp.name.toLowerCase().includes(q) ||
      comp.domain.toLowerCase().includes(q) ||
      comp.description.toLowerCase().includes(q)
    ) {
      results.push({
        type: 'competency',
        title: comp.name,
        subtitle: `Competency Framework • Benchmark ${comp.targetBenchmark}%`,
        link: `/trainee/competencies`,
        icon: 'Compass',
      });
    }
  });

  // 4. Search Trainer Library
  store.trainerLibrary.forEach((res) => {
    if (res.title.toLowerCase().includes(q) || res.folder.toLowerCase().includes(q)) {
      results.push({
        type: 'resource',
        title: res.title,
        subtitle: `Library Resource in folder: ${res.folder} • ${res.fileSize}`,
        link: `/trainer/library`,
        icon: 'Library',
      });
    }
  });

  // 5. Search Assessments
  store.assessments.forEach((a) => {
    if (a.title.toLowerCase().includes(q) || a.courseTitle.toLowerCase().includes(q)) {
      results.push({
        type: 'assessment',
        title: a.title,
        subtitle: `Assessment • ${a.durationMinutes} mins • Passing ${a.passingPercentage}%`,
        link: `/trainee/assessments`,
        icon: 'FileCheck2',
      });
    }
  });

  return results.slice(0, 15);
}

/* ========================================================
   ANNOUNCEMENTS & FEEDBACK (Feature 24)
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
  trainerRating?: number;
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
    trainerId: course?.trainerId,
    rating: data.rating,
    trainerRating: data.trainerRating || data.rating,
    comments: data.comments,
    createdAt: new Date().toISOString(),
  };

  store.feedbacks.unshift(fb);

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
   ADMIN COMMAND CENTER (Feature 25)
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

  const trainingImpact = await getTrainingImpactAnalytics();

  const monthlyTrends = [
    { month: 'Oct 2025', enrollments: 34, completions: 18 },
    { month: 'Nov 2025', enrollments: 52, completions: 29 },
    { month: 'Dec 2025', enrollments: 68, completions: 42 },
    { month: 'Jan 2026', enrollments: 95, completions: 61 },
    { month: 'Feb 2026', enrollments: 124, completions: 88 },
    { month: 'Mar 2026', enrollments: 156, completions: 112 },
  ];

  const coursePopularity = store.courses.map((c) => ({
    name: c.title.length > 25 ? c.title.substring(0, 22) + '...' : c.title,
    enrolled: c.enrolledCount || 20,
    rating: c.rating,
  }));

  const roleDistribution = [
    { name: 'Trainees', value: traineesCount, color: '#1D4ED8' },
    { name: 'Trainers', value: trainersCount, color: '#0D9488' },
    { name: 'Admins', value: store.users.filter((u) => u.role === 'admin').length, color: '#D97706' },
  ];

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
      averagePreTestScore: trainingImpact.averagePreTestScore,
      averagePostTestScore: trainingImpact.averagePostTestScore,
      averageImprovement: trainingImpact.averageImprovement,
      totalLearningHours: trainingImpact.totalLearningHours,
      completionRate: trainingImpact.completionRate,
    },
    monthlyTrends,
    coursePopularity,
    roleDistribution,
    competencyAverages,
    pendingUsers: store.users.filter((u) => u.status === 'pending'),
    recentCertificates: store.certificates.slice(0, 5),
    recentFeedbacks: store.feedbacks.slice(0, 5),
    trainingImpact,
  };
}
