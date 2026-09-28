'use client';

import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Award,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
} from 'lucide-react';
import { IAssessment, IAssessmentAttempt, ICertificate } from '@/lib/types';
import confetti from 'canvas-confetti';

interface AssessmentRunnerProps {
  assessment: IAssessment;
  onComplete?: (attempt: IAssessmentAttempt, cert?: ICertificate) => void;
  onCancel?: () => void;
}

export default function AssessmentRunner({
  assessment,
  onComplete,
  onCancel,
}: AssessmentRunnerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState((assessment.durationMinutes || 20) * 60);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    attempt: IAssessmentAttempt;
    certificate?: ICertificate;
  } | null>(null);

  // Countdown timer
  useEffect(() => {
    if (result) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [result]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionIndex: number) => {
    if (result) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const answersArray = assessment.questions.map((_, idx) => ({
        questionIndex: idx,
        selectedOption: selectedAnswers[idx] !== undefined ? selectedAnswers[idx] : -1,
      }));

      const res = await fetch(`/api/assessments/${assessment._id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedAnswers: answersArray }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
        if (data.attempt.passed) {
          // Trigger celebratory confetti
          try {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch (e) {}
        }
        if (onComplete) {
          onComplete(data.attempt, data.certificate);
        }
      } else {
        alert(data.error || 'Failed to submit assessment.');
      }
    } catch (e) {
      console.error(e);
      alert('Network error submitting assessment.');
    } finally {
      setSubmitting(false);
    }
  };

  const currentQ = assessment.questions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const isAllAnswered = answeredCount === assessment.questions.length;

  return (
    <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden max-w-4xl mx-auto my-4">
      {/* Top Banner */}
      <div className="bg-blue-950 text-white p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="bg-blue-800 text-blue-200 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
            Official Evaluation Exam
          </span>
          <h2 className="text-lg sm:text-xl font-bold font-serif mt-1">
            {assessment.title}
          </h2>
          <p className="text-xs text-blue-200">{assessment.courseTitle}</p>
        </div>

        {!result && (
          <div className="flex items-center gap-3 bg-blue-900/80 border border-blue-700/60 px-3 py-1.5 rounded-lg">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <div>
              <p className="text-[10px] uppercase text-blue-300 font-semibold">Time Remaining</p>
              <p className="text-sm font-mono font-bold text-amber-300">{formatTime(timeLeft)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Content: Active Test or Results */}
      {!result ? (
        <div className="p-6">
          {/* Question Stepper */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
            <div className="text-xs text-slate-500 font-medium">
              Question{' '}
              <strong className="text-slate-800 text-sm">{currentQuestionIndex + 1}</strong> of{' '}
              {assessment.questions.length}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {assessment.questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-7 h-7 rounded text-xs font-bold transition ${
                    currentQuestionIndex === idx
                      ? 'bg-blue-950 text-white ring-2 ring-blue-500'
                      : selectedAnswers[idx] !== undefined
                      ? 'bg-blue-100 text-blue-900 font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Question Text */}
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-base font-semibold text-slate-900 leading-snug">
                {currentQuestionIndex + 1}. {currentQ.questionText}
              </h3>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                {currentQ.marks || 1} Mark{(currentQ.marks || 1) > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQ.options.map((opt, oIdx) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === oIdx;
              return (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => handleSelectOption(oIdx)}
                  className={`w-full text-left p-3.5 rounded-lg border text-xs sm:text-sm font-medium transition flex items-center gap-3 ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-600 text-blue-950 font-semibold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
                      isSelected
                        ? 'border-blue-700 bg-blue-700 text-white'
                        : 'border-slate-300 text-slate-500'
                    }`}
                  >
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-md transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-3">
              {currentQuestionIndex < assessment.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-md shadow-xs transition"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-md shadow-xs transition"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>{submitting ? 'Evaluating...' : 'Submit Assessment'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Evaluation Results View */
        <div className="p-6">
          <div
            className={`p-6 rounded-xl border text-center mb-6 ${
              result.attempt.passed
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-red-50 border-red-200 text-red-950'
            }`}
          >
            <div className="flex justify-center mb-2">
              {result.attempt.passed ? (
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                  <XCircle className="w-8 h-8" />
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold font-serif">
              {result.attempt.passed ? 'Assessment Passed Successfully!' : 'Benchmark Not Met'}
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
              {result.attempt.passed
                ? 'Your knowledge assessment meets the official IMD competency standards. Your credentials have been permanently registered.'
                : `You scored ${result.attempt.percentage}%. The passing threshold is ${assessment.passingPercentage}%. Please review the explanations below and re-attempt.`}
            </p>

            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-200/60 font-mono text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Score</span>
                <span className="text-base font-bold">
                  {result.attempt.score} / {result.attempt.totalMarks}
                </span>
              </div>
              <div className="h-6 w-px bg-slate-300"></div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Percentage</span>
                <span className="text-base font-bold">{result.attempt.percentage}%</span>
              </div>
              <div className="h-6 w-px bg-slate-300"></div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Status</span>
                <span
                  className={`font-bold uppercase ${
                    result.attempt.passed ? 'text-emerald-700' : 'text-red-700'
                  }`}
                >
                  {result.attempt.passed ? 'PASSED' : 'FAILED'}
                </span>
              </div>
            </div>

            {result.certificate && (
              <div className="mt-4 p-3 bg-white/80 rounded-lg border border-emerald-300 flex items-center justify-between max-w-md mx-auto">
                <div className="flex items-center gap-2 text-left">
                  <Award className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Digital Certificate Issued</p>
                    <p className="text-[10px] font-mono text-slate-500">
                      ID: {result.certificate.certificateId}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Ready to View
                </span>
              </div>
            )}
          </div>

          {/* Detailed Question Explanations */}
          <div className="space-y-4 mb-6">
            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
              Detailed Question Analysis & Explanations
            </h4>
            {assessment.questions.map((q, qIdx) => {
              const attemptAnswer = result.attempt.answers[qIdx];
              const isCorrect = attemptAnswer?.isCorrect;
              return (
                <div
                  key={qIdx}
                  className={`p-4 rounded-lg border text-xs leading-relaxed ${
                    isCorrect
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-red-50/40 border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-semibold text-slate-900">
                      {qIdx + 1}. {q.questionText}
                    </p>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {isCorrect ? 'Correct (+1)' : 'Incorrect (0)'}
                    </span>
                  </div>

                  <div className="space-y-1 mb-2">
                    <p className="text-slate-600">
                      <strong>Your Answer:</strong>{' '}
                      {attemptAnswer?.selectedOption >= 0
                        ? `${String.fromCharCode(65 + attemptAnswer.selectedOption)}) ${
                            q.options[attemptAnswer.selectedOption]
                          }`
                        : 'Not answered'}
                    </p>
                    {!isCorrect && (
                      <p className="text-emerald-800 font-semibold">
                        <strong>Correct Answer:</strong> {String.fromCharCode(65 + q.correctAnswerIndex)}){' '}
                        {q.options[q.correctAnswerIndex]}
                      </p>
                    )}
                  </div>

                  <div className="p-2.5 bg-white/80 rounded border border-slate-200 text-slate-700">
                    <strong className="text-slate-900">Explanation:</strong> {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            {!result.attempt.passed && (
              <button
                onClick={() => {
                  setResult(null);
                  setSelectedAnswers({});
                  setCurrentQuestionIndex(0);
                  setTimeLeft((assessment.durationMinutes || 20) * 60);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 text-white text-xs font-semibold rounded-md hover:bg-blue-800 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Assessment</span>
              </button>
            )}
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-md transition"
              >
                Close Review
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
