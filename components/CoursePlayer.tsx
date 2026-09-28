'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Play,
  FileText,
  Presentation,
  Video,
  Download,
  Award,
  Clock,
  User,
  Star,
  ShieldCheck,
  ChevronRight,
  FileCheck2,
  AlertCircle,
  MessageSquare,
  AlertTriangle,
  Sparkles,
  GitFork,
} from 'lucide-react';
import {
  ICourse,
  IEnrollment,
  IAssessment,
  ILesson,
  ICertificate,
  ISessionUser,
  IAssessmentAttempt,
} from '@/lib/types';
import AssessmentRunner from '@/components/AssessmentRunner';
import CertificateView from '@/components/CertificateView';
import DocumentQABar from '@/components/DocumentQABar';

interface CoursePlayerProps {
  course: ICourse;
  initialEnrollment?: IEnrollment | null;
  assessment?: IAssessment | null;
  user?: ISessionUser | null;
}

export default function CoursePlayer({
  course,
  initialEnrollment,
  assessment,
  user,
}: CoursePlayerProps) {
  const router = useRouter();
  const [enrollment, setEnrollment] = useState<IEnrollment | null>(initialEnrollment || null);
  const [enrolling, setEnrolling] = useState(false);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [isPreAssessmentMode, setIsPreAssessmentMode] = useState(false);
  const [activeCertificate, setActiveCertificate] = useState<ICertificate | null>(null);

  // Active lesson selection (default to first lesson of first module)
  const firstLesson = course.modules[0]?.lessons[0] || null;
  const [activeLesson, setActiveLesson] = useState<ILesson | null>(firstLesson);

  // Mock pre-assessment diagnostic test structure for Feature 6
  const preAssessmentObj: IAssessment = {
    _id: `pre_${course._id}`,
    courseId: course._id,
    courseTitle: course.title,
    trainerId: course.trainerId,
    trainerName: course.trainerName,
    title: `Pre-Assessment Baseline: ${course.title}`,
    description:
      'Diagnostic baseline test evaluating incoming meteorological knowledge before course commencement. Result serves as baseline indicator for learning analytics.',
    durationMinutes: 20,
    totalMarks: 5,
    passingPercentage: 40,
    assessmentType: 'pre',
    status: 'published',
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'pre_1',
        questionText: 'What is the average tropospheric lapse rate?',
        options: ['9.8 °C/km', '6.5 °C/km', '3.2 °C/km', '1.0 °C/km'],
        correctAnswerIndex: 1,
        explanation: 'Standard environmental lapse rate in the troposphere is 6.5 °C/km.',
        marks: 1,
      },
      {
        id: 'pre_2',
        questionText: 'Which direction does the Coriolis force deflect air in the Northern Hemisphere?',
        options: ['Equatorward', 'Left of motion', 'Right of motion', 'Poleward'],
        correctAnswerIndex: 2,
        explanation: 'Deflects moving air parcels to their right.',
        marks: 1,
      },
      {
        id: 'pre_3',
        questionText: 'What is the standard height of a Stevenson screen above turf ground?',
        options: ['0.5 m', '1.25 to 1.5 m', '3.0 m', '5.0 m'],
        correctAnswerIndex: 1,
        explanation: 'Standard exposure height is 1.25 to 1.5 meters.',
        marks: 1,
      },
      {
        id: 'pre_4',
        questionText: 'What does CAPE > 2000 J/kg signify on a Tephigram?',
        options: ['Radiation fog', 'Severe thunderstorm potential', 'Dry subsidence', 'Stable inversion'],
        correctAnswerIndex: 1,
        explanation: 'High CAPE denotes large positive buoyancy for severe convection.',
        marks: 1,
      },
      {
        id: 'pre_5',
        questionText: 'Rainfall >= 115.6 mm in 24 hours is categorized as:',
        options: ['Moderate Rain', 'Heavy Rain', 'Very Heavy Rain', 'Extremely Heavy Rain'],
        correctAnswerIndex: 2,
        explanation: '115.6 to 204.4 mm is officially Very Heavy Rain.',
        marks: 1,
      },
    ],
  };

  // Handle Enrollment
  const handleEnroll = async () => {
    if (!user) {
      router.push(`/login?returnUrl=/courses/${course._id}`);
      return;
    }

    setEnrolling(true);
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course._id }),
      });
      const data = await res.json();
      if (res.ok) {
        setEnrollment(data.enrollment);
      } else {
        alert(data.error || 'Failed to enroll');
      }
    } catch (e) {
      console.error(e);
      alert('Error connecting to server.');
    } finally {
      setEnrolling(false);
    }
  };

  // Handle Lesson Complete
  const handleCompleteLesson = async (lessonId: string) => {
    if (!enrollment) return;
    setMarkingComplete(true);
    try {
      const res = await fetch('/api/enrollments/complete-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course._id, lessonId }),
      });
      const data = await res.json();
      if (res.ok) {
        setEnrollment(data.enrollment);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setMarkingComplete(false);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return enrollment?.completedLessonIds?.includes(lessonId) || false;
  };

  if (activeCertificate) {
    return (
      <div className="max-w-4xl mx-auto my-6">
        <CertificateView
          certificate={activeCertificate}
          onClose={() => setActiveCertificate(null)}
        />
      </div>
    );
  }

  // Active Assessment View (Either Pre or Post)
  if (showAssessment) {
    const activeExam = isPreAssessmentMode ? preAssessmentObj : assessment;
    if (activeExam) {
      return (
        <div className="max-w-4xl mx-auto my-6">
          <AssessmentRunner
            assessment={activeExam}
            onComplete={(attempt: IAssessmentAttempt, cert?: ICertificate) => {
              if (isPreAssessmentMode) {
                // Pre-assessment completed: record score
                if (enrollment) {
                  setEnrollment({
                    ...enrollment,
                    preAssessmentScore: attempt.percentage,
                    preAssessmentDate: new Date().toISOString(),
                  });
                }
                setShowAssessment(false);
                setIsPreAssessmentMode(false);
                alert(`Pre-assessment score (${attempt.percentage}%) recorded as baseline diagnostic!`);
              } else if (cert) {
                setActiveCertificate(cert);
              }
            }}
            onCancel={() => setShowAssessment(false)}
          />
        </div>
      );
    }
  }

  return (
    <div className="space-y-6">
      {/* Feature 20: Course Prerequisite Alert */}
      {course.prerequisites && course.prerequisites.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3 text-xs text-amber-900">
          <GitFork className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider text-[10px] text-amber-800">
              Prerequisite Recommendation:
            </span>
            <p>
              Complete <strong>{course.prerequisites.join(' & ')}</strong> before enrolling in{' '}
              <strong>{course.title}</strong> to ensure foundational comprehension of observational thermodynamics.
            </p>
            <div className="text-[11px] text-amber-700 flex items-center gap-1 pt-0.5">
              <span>Prerequisite sequence:</span>
              <span className="font-mono">{course.prerequisites.join(' → ')} → {course.title}</span>
            </div>
          </div>
        </div>
      )}

      {/* Course Hero & Header */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="bg-amber-400 text-blue-950 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
              Prototype Demo
            </span>
            <span className="bg-blue-800/80 text-blue-200 text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-700">
              {course.category}
            </span>
            <span className="bg-emerald-900/60 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-700">
              Difficulty: {course.difficulty}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif mb-2 tracking-tight">
            {course.title}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-3xl leading-relaxed mb-4">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-xs text-blue-200 pt-2 border-t border-blue-900/60">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Instructor: <strong>{course.trainerName}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Duration: <strong>{course.duration}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>
                Rating: <strong>{course.rating} / 5.0</strong> ({course.ratingCount} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Enrollment Progress & Action Strip */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {enrollment ? (
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 max-w-md">
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">Curriculum Progress</span>
                    <span className="font-mono font-bold text-blue-900">
                      {enrollment.progressPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-900 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${enrollment.progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Feature 6: Pre-Assessment Trigger */}
                <button
                  onClick={() => {
                    setIsPreAssessmentMode(true);
                    setShowAssessment(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-blue-950 rounded-lg text-xs font-bold shadow-xs transition"
                  title="Take baseline diagnostic pre-assessment"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>
                    {enrollment.preAssessmentScore !== undefined
                      ? `Pre-Test: ${enrollment.preAssessmentScore}%`
                      : 'Take Diagnostic Pre-Assessment'}
                  </span>
                </button>

                {/* Final Post-Assessment */}
                {assessment && (
                  <button
                    onClick={() => {
                      setIsPreAssessmentMode(false);
                      setShowAssessment(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-xs transition"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>
                      {enrollment.status === 'completed'
                        ? 'Retake Final Exam'
                        : 'Take Final Certification Exam'}
                    </span>
                  </button>
                )}

                {enrollment.certificateId && (
                  <button
                    onClick={async () => {
                      const res = await fetch(`/api/certificates/${enrollment.certificateId}`);
                      const d = await res.json();
                      if (d.certificate) setActiveCertificate(d.certificate);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-blue-950 rounded-lg text-xs font-bold shadow-xs transition"
                  >
                    <Award className="w-4 h-4" />
                    <span>View Digital Certificate</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-600">
                Enroll now to take the 20-minute diagnostic pre-assessment, complete modules, and receive an authentic IMD certificate.
              </div>
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="px-6 py-2.5 bg-blue-950 hover:bg-blue-900 text-white rounded-lg text-xs font-bold shadow-md transition shrink-0"
              >
                {enrolling ? 'Enrolling...' : 'Enroll in this Training'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Learning Classroom Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Syllabus Modules & Lessons Navigation */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-900" />
              <span>Curriculum Syllabus</span>
            </h3>
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {course.modules.map((mod) => (
              <div key={mod.id} className="p-3">
                <div className="font-bold text-xs text-slate-800 mb-2 font-serif">
                  {mod.title}
                </div>
                <div className="space-y-1">
                  {mod.lessons.map((les) => {
                    const isActive = activeLesson?.id === les.id;
                    const isDone = isLessonCompleted(les.id);
                    return (
                      <button
                        key={les.id}
                        onClick={() => setActiveLesson(les)}
                        className={`w-full text-left p-2 rounded-lg text-xs transition flex items-start gap-2.5 ${
                          isActive
                            ? 'bg-blue-50 border border-blue-200 text-blue-950 font-semibold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate leading-snug">{les.title}</p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {les.duration} • {les.type}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Lesson Player & Scientific Reading Area */}
        <div className="lg:col-span-8 space-y-6">
          {activeLesson ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 sm:p-8 space-y-6">
              {/* Lesson Title & Completion Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Active Lesson • {activeLesson.type.toUpperCase()}
                  </span>
                  <h2 className="text-xl font-bold font-serif text-slate-900 mt-1">
                    {activeLesson.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">{activeLesson.description}</p>
                </div>

                {enrollment && (
                  <button
                    onClick={() => handleCompleteLesson(activeLesson.id)}
                    disabled={markingComplete || isLessonCompleted(activeLesson.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition shadow-xs ${
                      isLessonCompleted(activeLesson.id)
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-default'
                        : 'bg-blue-950 hover:bg-blue-900 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {isLessonCompleted(activeLesson.id) ? 'Completed ✓' : 'Mark as Complete'}
                    </span>
                  </button>
                )}
              </div>

              {/* Video Embed Player */}
              {activeLesson.type === 'video' && (
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 shadow-md">
                  <iframe
                    className="w-full h-full"
                    src={activeLesson.contentUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                    title={activeLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              {/* Presentation Slides Simulator */}
              {activeLesson.type === 'presentation' && (
                <div className="p-6 rounded-xl border-2 border-slate-300 bg-slate-900 text-white shadow-inner">
                  <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800 mb-4">
                    <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                      <Presentation className="w-4 h-4" />
                      <span>Interactive Lecture Deck</span>
                    </span>
                    <span className="font-mono">Slide 1 of 4 • IMD Training Division</span>
                  </div>
                  <h3 className="text-lg font-bold font-serif mb-2 text-white">
                    {activeLesson.title}
                  </h3>
                  <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {activeLesson.contentBody}
                  </div>
                </div>
              )}

              {/* Article / Text Document with Meteorological Formulations */}
              {activeLesson.type === 'article' && (
                <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  {activeLesson.contentBody}
                </div>
              )}

              {/* Feature 13: In-Lesson Document Q&A Bar (Ask about this material) */}
              <DocumentQABar
                documentTitle={activeLesson.title}
                documentText={activeLesson.contentBody || activeLesson.description}
                courseTitle={course.title}
                lessonTitle={activeLesson.title}
              />

              {/* Attached Study Materials & Reference Guides */}
              {activeLesson.resources && activeLesson.resources.length > 0 && (
                <div className="pt-6 border-t border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-900" />
                    <span>Downloadable Lesson Materials & Reference PDFs</span>
                  </h4>
                  <div className="space-y-2">
                    {activeLesson.resources.map((r) => (
                      <div
                        key={r.id}
                        className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-900" />
                          <span className="font-semibold text-slate-800">{r.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({r.fileSize})</span>
                        </div>
                        <button
                          onClick={() => alert(`Downloading reference material: ${r.title}`)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-semibold text-slate-700"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500">
              Select a module lesson from the left syllabus to start studying.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
