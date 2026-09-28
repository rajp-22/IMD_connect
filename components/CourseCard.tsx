import React from 'react';
import Link from 'next/link';
import { Clock, User, Star, ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';
import { ICourse, IEnrollment } from '@/lib/types';

interface CourseCardProps {
  course: ICourse;
  enrollment?: IEnrollment | null;
  isEnrolled?: boolean;
  enrollmentProgress?: number;
  onEnroll?: (courseId: string) => void;
  enrolling?: boolean;
}

export default function CourseCard({
  course,
  enrollment,
  isEnrolled,
  enrollmentProgress,
  onEnroll,
  enrolling = false,
}: CourseCardProps) {
  const isCompleted = enrollment?.status === 'completed' || enrollmentProgress === 100;
  const isInProgress =
    isEnrolled ||
    enrollment?.status === 'in-progress' ||
    (enrollment?.progressPercentage || 0) > 0 ||
    (enrollmentProgress || 0) > 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col justify-between group">
      <div>
        {/* Course Thumbnail */}
        <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              course.thumbnail ||
              'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600&auto=format&fit=crop'
            }
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

          {/* Prototype disclaimer badge */}
          <div className="absolute top-2 left-2 bg-amber-500 text-blue-950 font-black text-[9px] uppercase px-2 py-0.5 rounded shadow-sm tracking-wider">
            Prototype Demo
          </div>

          {/* Difficulty Badge */}
          <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-white/20">
            {course.difficulty}
          </div>

          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-xs">
            <span className="text-[11px] font-medium text-slate-200 truncate">
              {course.category}
            </span>
            <span className="flex items-center gap-1 font-mono text-[11px] text-amber-300 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {course.rating}
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-4 sm:p-5">
          <Link href={`/courses/${course._id}`}>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-900 transition line-clamp-2 mb-2 font-serif">
              {course.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
            {course.description}
          </p>

          <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-900" />
              <span className="truncate max-w-[120px] font-medium text-slate-700">
                {course.trainerName}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{course.duration}</span>
            </div>
          </div>

          {/* Progress bar if enrolled */}
          {enrollment && (
            <div className="mb-3 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-500">
                  {isCompleted ? 'Completed' : 'Course Progress'}
                </span>
                <span className="font-bold text-blue-900">{enrollment.progressPercentage}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isCompleted ? 'bg-emerald-600' : 'bg-blue-600'
                  }`}
                  style={{ width: `${enrollment.progressPercentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
        {enrollment ? (
          <Link
            href={`/courses/${course._id}`}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition bg-blue-950 hover:bg-blue-900 text-white shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isCompleted ? 'Review Course Material' : 'Continue Learning'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : onEnroll ? (
          <button
            onClick={() => onEnroll(course._id)}
            disabled={enrolling}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition bg-blue-900 hover:bg-blue-800 text-white shadow-xs"
          >
            <span>{enrolling ? 'Enrolling...' : 'Enroll in Training'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <Link
            href={`/courses/${course._id}`}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-900 border border-slate-200 hover:border-blue-300"
          >
            <span>View Syllabus & Enroll</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
