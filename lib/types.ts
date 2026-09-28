export type UserRole = 'trainee' | 'trainer' | 'admin';
export type UserStatus = 'pending' | 'approved' | 'rejected' | 'inactive';
export type CompetencyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

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
}

export interface ILearningResource {
  id: string;
  title: string;
  type: 'pdf' | 'ppt' | 'doc' | 'video' | 'link';
  fileUrl: string;
  fileSize?: string;
  description?: string;
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
  assessmentAttemptId?: string;
  assessmentScore?: number;
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
  verificationCode: string;
}

export interface IFeedback {
  _id: string;
  courseId: string;
  courseTitle: string;
  traineeId: string;
  traineeName: string;
  rating: number;
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
  matchScore: number; // Transparent percentage match e.g. 100% or 67%
  matchedCount: number;
  totalRequired: number;
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
