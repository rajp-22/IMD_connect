'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { ICourse, IEnrollment, IFeedback } from '@/lib/types';

export default function TraineeFeedbackPage() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [previousFeedbacks, setPreviousFeedbacks] = useState<IFeedback[]>([]);

  useEffect(() => {
    fetch('/api/courses')
      .then((res) => res.json())
      .then((data) => {
        if (data.courses?.length) {
          setCourses(data.courses);
          setSelectedCourseId(data.courses[0]._id);
        }
      });

    fetch('/api/feedback')
      .then((res) => res.json())
      .then((data) => {
        if (data.feedbacks) {
          setPreviousFeedbacks(data.feedbacks);
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !comments) return;

    setSubmitting(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: selectedCourseId,
          rating,
          comments,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setComments('');
        setPreviousFeedbacks((prev) => [data.feedback, ...prev]);
        setTimeout(() => setSuccess(false), 4000);
      } else {
        alert(data.error || 'Failed to submit feedback.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold font-serif text-slate-900">Course Quality Feedback</h1>
        <p className="text-xs text-slate-500">
          Provide constructive feedback and ratings to assist IMD instructors in improving future
          curriculum deliveries.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Thank you! Your feedback has been officially registered and aggregated.</span>
        </div>
      )}

      {/* Submission Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Completed Course
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-white"
            >
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title} ({c.trainerName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Course Overall Rating (1 to 5 Stars)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-slate-300 hover:text-amber-400 transition"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-mono font-bold text-slate-700 ml-2">
                {rating} / 5 Stars
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Written Evaluation & Technical Feedback
            </label>
            <textarea
              required
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Detail your experience with the modules, clarity of lectures, accuracy of radar/synoptic datasets, and practical utility for shift duties..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-950 hover:bg-blue-900 text-white rounded-lg text-xs font-bold shadow-xs transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting...' : 'Submit Official Feedback'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Previously Submitted Feedback */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-900" />
          <span>Recent Feedback Submissions</span>
        </h3>

        <div className="space-y-3">
          {previousFeedbacks.map((fb) => (
            <div
              key={fb._id}
              className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900">{fb.courseTitle}</span>
                <span className="flex items-center gap-1 font-mono font-bold text-amber-600">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {fb.rating}.0
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed italic">&ldquo;{fb.comments}&rdquo;</p>
              <div className="mt-2 text-[10px] text-slate-400 font-mono">
                By {fb.traineeName} •{' '}
                {new Date(fb.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
