export type UserRole = 'trainee' | 'trainer' | 'admin';
export type UserStatus = 'pending' | 'approved' | 'rejected' | 'inactive';
export type CompetencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  status: UserStatus;
  department: string;
  designation: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ITraineeEducation {
  degree: string;
  institution: string;
  qualification: string;
  year: string;
}

export interface ITraineeExperience {
  organization: string;
  position: string;
  years: number;
}

export interface ITraineeProfile {
  _id: string;
  userId: string;
  department: string;
  designation: string;
  phone?: string;
  bio?: string;
  education: ITraineeEducation[];
  experience: ITraineeExperience[];
  skills: string[];
  interests: string[];
  completedCertificatesCount: number;
  learningHours?: number;
  learningStreakDays?: number;
  badges?: string[];
  updatedAt: string;
}

export interface ITrainerCompetencyScore {
  name: string;
  domain: string;
  level: CompetencyLevel;
  score: number; // 0-100
}

export interface ITrainerProfile {
  _id: string;
  userId: string;
  name: string;
  department: string;
  designation: string;
  bio: string;
  experienceYears: number;
  specializations: string[];
  competencies: ITrainerCompetencyScore[];
  rating: number;
  totalCourses: number;
  totalStudentsTaught: number;
  certifications?: string[];
  coursesTaught?: string[];
}

export interface ILearningResource {
  id: string;
  title: string;
  type: 'pdf' | 'ppt' | 'doc' | 'video' | 'link';
  fileUrl: string;
  fileSize?: string;
  description?: string;
  folder?: string;
}

export interface ILesson {
  id: string;
  title: string;
  description: string;
  order: number;
  duration: string; // e.g. "25 mins"
  type: 'video' | 'pdf' | 'presentation' | 'article';
  contentUrl?: string;
  contentBody?: string;
  demoPdfPages?: string[]; // for simulation of reading slides/PDF
  resources?: ILearningResource[];
}

export interface IModule {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: ILesson[];
}

export interface IQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  marks: number;
}

export interface IAssessment {
  _id: string;
  courseId: string;
  courseTitle: string;
  trainerId: string;
  trainerName: string;
  title: string;
  description: string;
  durationMinutes: number;
  totalMarks: number;
  passingPercentage: number;
  assessmentType?: 'pre' | 'post' | 'standard';
  startDate?: string;
  deadline?: string;
  questions: IQuestion[];
  status: 'draft' | 'published';
  createdAt: string;
}

export interface IAssessmentAttempt {
  _id: string;
  assessmentId: string;
  courseId: string;
  traineeId: string;
  traineeName: string;
  assessmentType?: 'pre' | 'post' | 'standard';
  answers: {
    questionIndex: number;
    selectedOption: number;
    isCorrect: boolean;
    marksAwarded: number;
  }[];
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  startedAt: string;
  completedAt: string;
}

export interface ICourse {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty: CompetencyLevel;
  duration: string;
  trainerId: string;
  trainerName: string;
  trainerRole?: string;
  thumbnail: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  modules: IModule[];
  assessmentId?: string;
  preAssessmentId?: string;
  prerequisites?: string[]; // course IDs or titles that must be completed
  enrolledCount: number;
  rating: number;
  ratingCount: number;
  disclaimer: string;
  competencyDomain: string;
  competencyGainPercentage: number; // how much score this course improves
  createdAt: string;
  updatedAt: string;
}

export interface IEnrollment {
  _id: string;
  courseId: string;
  courseTitle: string;
  traineeId: string;
  status: 'enrolled' | 'in-progress' | 'completed';
  progressPercentage: number;
  completedLessonIds: string[];
  enrolledAt: string;
  completedAt?: string;
  lastAccessedAt: string;
  preAssessmentScore?: number;
  preAssessmentDate?: string;
  assessmentAttemptId?: string;
  assessmentScore?: number; // post-assessment score
  postAssessmentDate?: string;
  improvementPoints?: number; // e.g. +39
  certificateId?: string;
}

export interface ICertificate {
  _id: string;
  certificateId: string;
  traineeId: string;
  traineeName: string;
  traineeDepartment?: string;
  courseId: string;
  courseName: string;
  trainerName: string;
  issueDate: string;
  completionDate: string;
  scorePercentage: number;
  preScorePercentage?: number;
  verificationCode: string;
  verificationUrl?: string;
}

export interface IFeedback {
  _id: string;
  courseId: string;
  courseTitle: string;
  traineeId: string;
  traineeName: string;
  trainerId?: string;
  rating: number;
  trainerRating?: number;
  comments: string;
  createdAt: string;
}

export interface ICompetency {
  _id: string;
  name: string;
  domain: string;
  description: string;
  category: string;
  icon: string;
  requiredLevel: CompetencyLevel;
  relatedCourses: string[];
  relatedRoles: string[];
  targetBenchmark: number; // e.g. 75%
}

export interface ITraineeCompetency {
  _id: string;
  traineeId: string;
  competencyName: string;
  domain: string;
  level: CompetencyLevel;
  score: number; // 0-100
  lastUpdated: string;
}

export interface IRoleCompetencyRequirement {
  competencyName: string;
  requiredScore: number; // 0-100
  requiredLevel: CompetencyLevel;
}

export interface IRoleTemplate {
  _id: string;
  name: string; // e.g. "Weather Forecaster", "Radar Meteorologist", "Climate Research Analyst"
  code: string;
  department: string;
  description: string;
  requiredCompetencies: IRoleCompetencyRequirement[];
  recommendedCourseIds: string[];
  disclaimer: string;
}

export interface ISkillGap {
  traineeId: string;
  competencyName: string;
  currentScore: number;
  requiredScore: number;
  gap: number;
  status: 'Critical' | 'Moderate' | 'Satisfied';
  recommendedCourseIds: string[];
  recommendedCourses?: {
    id: string;
    title: string;
    difficulty: string;
    duration: string;
  }[];
  explanation?: string;
}

export interface ICourseRecommendation {
  course: ICourse;
  reasons: string[]; // transparent why: ["Addresses your Weather Forecasting skill gap (35%)", "Matches your target role: Weather Forecaster"]
  matchScore: number;
  gapCompetency?: string;
  prerequisitesMet: boolean;
}

export interface ILearningPathStep {
  id: string;
  stepNumber: number;
  courseId: string;
  title: string;
  description: string;
  type: 'course' | 'assessment' | 'milestone';
  duration: string;
  status: 'completed' | 'in-progress' | 'current' | 'locked';
  prerequisiteStepIds?: string[];
  score?: number;
  completedAt?: string;
}

export interface ILearningPath {
  _id: string;
  userId: string;
  roleTemplateId?: string;
  title: string;
  goal: string;
  targetRole: string;
  progress: number; // 0-100%
  estimatedDuration: string;
  currentStep: number;
  nextRecommendedStep: string;
  steps: ILearningPathStep[];
  createdAt: string;
  updatedAt: string;
}

export interface ITrainerCompetencyMatch {
  trainerId: string;
  trainerName: string;
  department: string;
  designation: string;
  experienceYears: number;
  rating: number;
  matchedCompetencies: {
    name: string;
    hasCompetency: boolean;
    level?: CompetencyLevel;
    score?: number;
  }[];
  missingCompetencies: string[];
  matchScore: number; // Transparent percentage match e.g. 100% or 67%
  matchedCount: number;
  totalRequired: number;
  certifications?: string[];
  coursesPreviouslyTaught?: string[];
}

export interface IDepartmentSkillCell {
  competencyName: string;
  averageScore: number;
  requiredScore: number;
  gap: number;
  employeeCount: number;
  recommendedCourses: string[];
}

export interface IDepartmentSkillCoverage {
  department: string;
  totalEmployees: number;
  competencies: IDepartmentSkillCell[];
}

export interface ITrainingImpactMetrics {
  averagePreTestScore: number; // e.g. 48%
  averagePostTestScore: number; // e.g. 79%
  averageImprovement: number; // +31 points
  completionRate: number; // e.g. 84%
  totalLearningHours: number; // e.g. 1420
  courseEngagementRate: number; // e.g. 91%
  disclaimer: string;
  courseBreakdown: {
    courseId: string;
    courseTitle: string;
    preAvg: number;
    postAvg: number;
    improvement: number;
    participants: number;
    completionRate: number;
  }[];
  departmentBreakdown: {
    department: string;
    preAvg: number;
    postAvg: number;
    improvement: number;
    completionRate: number;
  }[];
}

export type CalendarEventType =
  | 'COURSE'
  | 'TRAINING'
  | 'ASSESSMENT'
  | 'EXAM'
  | 'ASSIGNMENT'
  | 'DEADLINE'
  | 'MEETING'
  | 'WORKSHOP'
  | 'CERTIFICATION'
  | 'COMPETENCY'
  | 'HOLIDAY'
  | 'ADMINISTRATIVE'
  | 'OTHER'
  | 'course_start'
  | 'live_session'
  | 'assessment_deadline'
  | 'workshop'
  | 'cert_expiry'
  | 'training_event';

export type EventPriority = 'low' | 'medium' | 'high' | 'urgent';
export type EventStatus = 'scheduled' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'overdue';

export interface ITrainingEvent {
  _id: string;
  id?: string;
  title: string;
  description: string;
  type: CalendarEventType;
  eventType?: CalendarEventType;
  date: string; // YYYY-MM-DD
  time?: string;
  startDateTime?: string; // ISO string or 'YYYY-MM-DDTHH:mm'
  endDateTime?: string; // ISO string or 'YYYY-MM-DDTHH:mm'
  duration?: string;
  location?: string;
  locationOrLink?: string;
  organizer?: {
    id?: string;
    name: string;
    role?: string;
    avatar?: string;
  };
  participants?: {
    id?: string;
    name: string;
    role?: 'trainee' | 'trainer' | 'admin' | 'all';
    cohort?: string;
  }[];
  targetRole?: 'all' | 'trainee' | 'trainer' | 'admin';
  targetRoles?: ('all' | 'trainee' | 'trainer' | 'admin')[];
  userId?: string;
  courseId?: string;
  courseTitle?: string;
  moduleId?: string;
  moduleTitle?: string;
  assessmentId?: string;
  priority?: EventPriority;
  status?: EventStatus;
  completedUserIds?: string[];
  reminderSettings?: {
    enabled: boolean;
    preset: '15m' | '30m' | '1h' | '1d' | '3d' | 'custom';
    customMinutes?: number;
  };
  personalReminders?: {
    userId: string;
    note?: string;
    remindBefore: string;
  }[];
  relatedResources?: {
    title: string;
    url: string;
    type: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ICalendarConflict {
  conflictingEventId: string;
  conflictingTitle: string;
  conflictingTime: string;
  conflictingDate: string;
  reason: string;
}

export interface ITrainerLibraryResource {
  id: string;
  trainerId: string;
  folder: string; // e.g. "Weather Forecasting", "Satellite Meteorology"
  title: string;
  type: 'video' | 'pdf' | 'presentation' | 'document' | 'dataset';
  fileName: string;
  fileSize: string;
  fileUrl: string;
  uploadedAt: string;
  usedInCourses: string[];
}

export interface ICompetencyPassport {
  traineeId: string;
  name: string;
  department: string;
  designation: string;
  avatar?: string;
  learningStreakDays: number;
  totalLearningHours: number;
  completedCoursesCount: number;
  assessmentAverage: number;
  verifiedCompetencies: {
    name: string;
    score: number;
    level: CompetencyLevel;
    verifiedDate: string;
    verifiedBy: string;
  }[];
  certificates: {
    certificateId: string;
    courseName: string;
    issueDate: string;
    scorePercentage: number;
    verificationCode: string;
  }[];
  milestones: {
    badge: string;
    title: string;
    description: string;
    achievedAt: string;
  }[];
}

export interface IAICitation {
  sourceDocument: string;
  sectionTitle: string;
  snippet: string;
}

export interface IAIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: IAICitation[];
  suggestedFollowups?: string[];
}

export interface IAIConversation {
  _id: string;
  userId: string;
  contextType: 'general' | 'course' | 'lesson' | 'assessment_review';
  courseId?: string;
  lessonId?: string;
  title: string;
  messages: IAIMessage[];
  updatedAt: string;
}

export interface IAnnouncement {
  _id: string;
  title: string;
  content: string;
  type: 'general' | 'course' | 'achievement' | 'urgent';
  targetRole: 'all' | 'trainee' | 'trainer';
  author: string;
  priority: 'normal' | 'high';
  createdAt: string;
}

export interface INotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type?: 'deadline' | 'competency_gap' | 'recommendation' | 'progress' | 'cert_expiry' | 'system';
  link?: string;
  createdAt: string;
}

export interface ISessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  department: string;
  designation: string;
}
