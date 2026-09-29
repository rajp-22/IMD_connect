'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Layers,
  FileText,
  UploadCloud,
  FileCheck2,
  Eye,
  CheckCircle2,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { CompetencyLevel, ILesson, IModule, IQuestion } from '@/lib/types';

export default function CreateCoursePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [publishing, setPublishing] = useState(false);

  // Step 1: Course Info
  const [courseInfo, setCourseInfo] = useState({
    title: '',
    category: 'Synoptic Meteorology & Forecasting',
    difficulty: 'Beginner' as CompetencyLevel,
    duration: '4 Weeks (20 Hours)',
    competencyDomain: 'Weather Forecasting',
    competencyGainPercentage: 25,
    description: '',
    thumbnail:
      'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600&auto=format&fit=crop',
    tags: 'Meteorology, Training, IMD',
  });

  // Step 2 & 3: Modules & Lessons
  const [modules, setModules] = useState<IModule[]>([
    {
      id: 'mod_1',
      title: 'Module 1: Meteorological Fundamentals',
      description: 'Foundational concepts and atmospheric physics.',
      order: 1,
      lessons: [
        {
          id: 'les_1_1',
          title: '1.1 Atmospheric Thermodynamic Laws',
          description: 'Hydrostatic equation and lapse rate calculations.',
          order: 1,
          duration: '30 mins',
          type: 'article',
          contentBody:
            'Comprehensive overview of thermodynamic laws governing tropospheric stability and adiabatic expansion.',
        },
      ],
    },
  ]);

  // Step 4: Upload Resources
  const [resources, setResources] = useState<
    { title: string; type: 'pdf' | 'ppt' | 'video'; fileSize: string; status: string }[]
  >([
    {
      title: 'Atmospheric_Thermodynamics_Lecture_Notes.pdf',
      type: 'pdf',
      fileSize: '2.4 MB',
      status: 'Uploaded (Local Demo Fallback)',
    },
  ]);
  const [newResourceTitle, setNewResourceTitle] = useState('');
  const [newResourceType, setNewResourceType] = useState<'pdf' | 'ppt' | 'video'>('pdf');

  // Step 5: Assessment
  const [assessmentTitle, setAssessmentTitle] = useState('Final Module Evaluation');
  const [passingPercentage, setPassingPercentage] = useState(60);
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [questions, setQuestions] = useState<IQuestion[]>([
    {
      id: 'q_1',
      questionText: 'What is the environmental lapse rate in standard atmosphere?',
      options: ['6.5 °C/km', '9.8 °C/km', '3.5 °C/km', '1.0 °C/km'],
      correctAnswerIndex: 0,
      explanation: 'Standard environmental lapse rate is approximately 6.5 °C per kilometer.',
      marks: 1,
    },
  ]);

  // Step Navigation Helper
  const steps = [
    { num: 1, label: 'Course Info' },
    { num: 2, label: 'Modules' },
    { num: 3, label: 'Lessons' },
    { num: 4, label: 'Resources' },
    { num: 5, label: 'Assessment' },
    { num: 6, label: 'Preview' },
    { num: 7, label: 'Publish' },
  ];

  // Actions
  const addModule = () => {
    const newMod: IModule = {
      id: `mod_${modules.length + 1}`,
      title: `Module ${modules.length + 1}: Operational Procedures`,
      description: 'Operational guidelines and observation workflows.',
      order: modules.length + 1,
      lessons: [],
    };
    setModules([...modules, newMod]);
  };

  const addLessonToModule = (moduleId: string) => {
    setModules(
      modules.map((m) => {
        if (m.id === moduleId) {
          const newLes: ILesson = {
            id: `les_${m.id}_${m.lessons.length + 1}`,
            title: `Lesson ${m.order}.${m.lessons.length + 1}: Core Principles`,
            description: 'Lesson syllabus overview.',
            order: m.lessons.length + 1,
            duration: '25 mins',
            type: 'article',
            contentBody: 'Scientific content and operational forecasting procedures.',
          };
          return { ...m, lessons: [...m.lessons, newLes] };
        }
        return m;
      })
    );
  };

  const addResource = () => {
    if (!newResourceTitle) return;
    setResources([
      ...resources,
      {
        title: newResourceTitle,
        type: newResourceType,
        fileSize: '1.8 MB',
        status: 'Uploaded (Local Demo Fallback)',
      },
    ]);
    setNewResourceTitle('');
  };

  const addQuestion = () => {
    const newQ: IQuestion = {
      id: `q_${questions.length + 1}`,
      questionText: 'New meteorological evaluation question',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswerIndex: 0,
      explanation: 'Official explanation of correct physical principles.',
      marks: 1,
    };
    setQuestions([...questions, newQ]);
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      // 1. Create Course
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: courseInfo.title,
          description: courseInfo.description,
          category: courseInfo.category,
          difficulty: courseInfo.difficulty,
          duration: courseInfo.duration,
          competencyDomain: courseInfo.competencyDomain,
          competencyGainPercentage: courseInfo.competencyGainPercentage,
          thumbnail: courseInfo.thumbnail,
          tags: courseInfo.tags.split(',').map((t) => t.trim()),
          modules,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to create course');
        setPublishing(false);
        return;
      }

      // 2. Create Assessment linked to this course
      if (data.course?._id) {
        await fetch('/api/assessments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId: data.course._id,
            courseTitle: data.course.title,
            title: assessmentTitle,
            description: `Certification Assessment for ${data.course.title}`,
            passingPercentage,
            durationMinutes,
            questions,
          }),
        });
      }

      alert('Course and Assessment published successfully!');
      router.push(`/courses/${data.course._id}`);
      router.refresh();
    } catch (e) {
      console.error(e);
      alert('Error publishing course');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold font-serif text-slate-900">
          Curriculum Authoring & Course Creation Studio
        </h1>
        <p className="text-xs text-slate-500">
          Author multi-tier courses, structured modules, recorded lecture materials, and MCQ
          assessments.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[500px]">
          {steps.map((s, idx) => (
            <div key={s.num} className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStep(s.num)}
                className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition ${
                  currentStep === s.num
                    ? 'bg-blue-950 text-white ring-2 ring-blue-500'
                    : currentStep > s.num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {currentStep > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
              </button>
              <span
                className={`text-xs font-medium whitespace-nowrap ${
                  currentStep === s.num ? 'text-slate-900 font-bold' : 'text-slate-500'
                }`}
              >
                {s.label}
              </span>
              {idx < steps.length - 1 && <div className="w-6 h-px bg-slate-200 mx-1"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: Course Info */}
      {currentStep === 1 && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-2xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <BookOpen className="w-4 h-4 text-blue-900" />
            <span>Step 1: Course Information</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Course Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={courseInfo.title}
              onChange={(e) => setCourseInfo({ ...courseInfo, title: e.target.value })}
              placeholder="e.g. Advanced Doppler Weather Radar Analysis"
              className="input-gov font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={courseInfo.category}
                onChange={(e) => setCourseInfo({ ...courseInfo, category: e.target.value })}
                className="input-gov bg-white"
              >
                <option value="Synoptic Meteorology & Forecasting">
                  Synoptic Meteorology & Forecasting
                </option>
                <option value="Remote Sensing & Earth Observation">
                  Remote Sensing & Earth Observation
                </option>
                <option value="Computational Meteorology & GIS">
                  Computational Meteorology & GIS
                </option>
                <option value="Radar Meteorology & Nowcasting">Radar Meteorology & Nowcasting</option>
                <option value="Numerical Weather Prediction">Numerical Weather Prediction</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Difficulty Level
              </label>
              <select
                value={courseInfo.difficulty}
                onChange={(e) =>
                  setCourseInfo({ ...courseInfo, difficulty: e.target.value as CompetencyLevel })
                }
                className="input-gov bg-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Associated Competency Domain
              </label>
              <select
                value={courseInfo.competencyDomain}
                onChange={(e) => setCourseInfo({ ...courseInfo, competencyDomain: e.target.value })}
                className="input-gov bg-white"
              >
                <option value="Weather Forecasting">Weather Forecasting</option>
                <option value="Meteorology">Meteorology</option>
                <option value="Satellite Meteorology">Satellite Meteorology</option>
                <option value="Data Analysis">Data Analysis</option>
                <option value="Python">Python</option>
                <option value="Climate Science">Climate Science</option>
                <option value="Numerical Weather Prediction">Numerical Weather Prediction</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Estimated Duration
              </label>
              <input
                type="text"
                value={courseInfo.duration}
                onChange={(e) => setCourseInfo({ ...courseInfo, duration: e.target.value })}
                placeholder="4 Weeks (20 Hours)"
                className="input-gov"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Course Description & Objectives
            </label>
            <textarea
              rows={3}
              value={courseInfo.description}
              onChange={(e) => setCourseInfo({ ...courseInfo, description: e.target.value })}
              placeholder="Outline specific meteorological skills, forecast charts, and practical competencies imparted..."
              className="input-gov"
            ></textarea>
          </div>
        </div>
      )}

      {/* STEP 2: Create Modules */}
      {currentStep === 2 && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-900" />
              <span>Step 2: Course Modules Hierarchy</span>
            </h2>
            <button
              onClick={addModule}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-900 text-white rounded text-xs font-semibold hover:bg-blue-800"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Module</span>
            </button>
          </div>

          <div className="space-y-3">
            {modules.map((mod, idx) => (
              <div key={mod.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-blue-950 font-serif">
                    Module {idx + 1}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {mod.lessons.length} Lessons attached
                  </span>
                </div>
                <input
                  type="text"
                  value={mod.title}
                  onChange={(e) => {
                    const updated = [...modules];
                    updated[idx].title = e.target.value;
                    setModules(updated);
                  }}
                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 font-semibold mb-2"
                />
                <input
                  type="text"
                  value={mod.description}
                  onChange={(e) => {
                    const updated = [...modules];
                    updated[idx].description = e.target.value;
                    setModules(updated);
                  }}
                  className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 text-slate-600"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: Add Lessons */}
      {currentStep === 3 && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-2xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <FileText className="w-4 h-4 text-blue-900" />
            <span>Step 3: Lessons, Lectures & Content</span>
          </h2>

          <div className="space-y-4">
            {modules.map((mod) => (
              <div key={mod.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-900">{mod.title}</h3>
                  <button
                    onClick={() => addLessonToModule(mod.id)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-300 hover:bg-blue-50 text-blue-900 rounded text-[11px] font-semibold"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Lesson</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {mod.lessons.map((les, lIdx) => (
                    <div
                      key={les.id}
                      className="p-3 bg-white rounded border border-slate-200 text-xs space-y-2"
                    >
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={les.title}
                          onChange={(e) => {
                            const updated = [...modules];
                            const m = updated.find((x) => x.id === mod.id);
                            if (m) m.lessons[lIdx].title = e.target.value;
                            setModules(updated);
                          }}
                          className="col-span-2 px-2 py-1 border border-slate-300 rounded font-semibold text-xs"
                        />
                        <select
                          value={les.type}
                          onChange={(e) => {
                            const updated = [...modules];
                            const m = updated.find((x) => x.id === mod.id);
                            if (m) m.lessons[lIdx].type = e.target.value as any;
                            setModules(updated);
                          }}
                          className="px-2 py-1 border border-slate-300 rounded text-xs bg-white"
                        >
                          <option value="article">Article / Text</option>
                          <option value="video">Recorded Video Lecture</option>
                          <option value="presentation">Presentation / Slides</option>
                          <option value="pdf">PDF Document</option>
                        </select>
                      </div>
                      <textarea
                        rows={2}
                        value={les.contentBody}
                        onChange={(e) => {
                          const updated = [...modules];
                          const m = updated.find((x) => x.id === mod.id);
                          if (m) m.lessons[lIdx].contentBody = e.target.value;
                          setModules(updated);
                        }}
                        placeholder="Lesson scientific content or markdown text..."
                        className="w-full px-2 py-1 border border-slate-300 rounded text-xs text-slate-700"
                      ></textarea>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: Upload Resources */}
      {currentStep === 4 && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-2xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <UploadCloud className="w-4 h-4 text-blue-900" />
            <span>Step 4: Upload Study Materials & Storage Fallback</span>
          </h2>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-700 shrink-0" />
            <span>
              <strong>Storage Architecture:</strong> Ready for S3 / Cloudinary / Supabase Storage.
              Running with safe local mock fallback for prototype demonstrations.
            </span>
          </div>

          <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 text-center space-y-2">
            <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-700">Attach Document / Presentation</p>
            <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
              <input
                type="text"
                value={newResourceTitle}
                onChange={(e) => setNewResourceTitle(e.target.value)}
                placeholder="File name e.g. Synoptic_Analysis_Manual.pdf"
                className="px-3 py-1.5 text-xs rounded border border-slate-300 w-full"
              />
              <select
                value={newResourceType}
                onChange={(e) => setNewResourceType(e.target.value as any)}
                className="px-2 py-1.5 text-xs rounded border border-slate-300 bg-white"
              >
                <option value="pdf">PDF</option>
                <option value="ppt">PPTX</option>
                <option value="video">Video</option>
              </select>
              <button
                type="button"
                onClick={addResource}
                className="px-3 py-1.5 bg-blue-950 text-white rounded text-xs font-bold whitespace-nowrap"
              >
                Attach
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {resources.map((res, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-white border border-slate-200 text-xs flex items-center justify-between"
              >
                <span className="font-semibold text-slate-800">{res.title}</span>
                <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
                  <span>{res.fileSize}</span>
                  <span className="text-emerald-700 font-bold">{res.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 5: Create Assessment */}
      {currentStep === 5 && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-blue-900" />
              <span>Step 5: Author MCQ Assessment</span>
            </h2>
            <button
              onClick={addQuestion}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-900 text-white rounded text-xs font-semibold hover:bg-blue-800"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Assessment Title
              </label>
              <input
                type="text"
                value={assessmentTitle}
                onChange={(e) => setAssessmentTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Passing Percentage
              </label>
              <input
                type="number"
                value={passingPercentage}
                onChange={(e) => setPassingPercentage(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs rounded border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Duration (Minutes)
              </label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs rounded border border-slate-300"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {questions.map((q, qIdx) => (
              <div key={q.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Question #{qIdx + 1}</span>
                  <span className="text-[10px] text-slate-400">1 Mark</span>
                </div>
                <input
                  type="text"
                  value={q.questionText}
                  onChange={(e) => {
                    const updated = [...questions];
                    updated[qIdx].questionText = e.target.value;
                    setQuestions(updated);
                  }}
                  className="w-full px-3 py-1.5 rounded border border-slate-300 font-semibold"
                />

                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-2">
                      <span className="font-bold text-slate-400 text-xs w-4">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...questions];
                          updated[qIdx].options[oIdx] = e.target.value;
                          setQuestions(updated);
                        }}
                        className="w-full px-2 py-1 text-xs rounded border border-slate-300"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <span className="font-bold text-slate-700">Correct Answer:</span>
                  <select
                    value={q.correctAnswerIndex}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[qIdx].correctAnswerIndex = Number(e.target.value);
                      setQuestions(updated);
                    }}
                    className="px-2 py-1 rounded border border-slate-300 bg-white"
                  >
                    {q.options.map((_, idx) => (
                      <option key={idx} value={idx}>
                        Option {String.fromCharCode(65 + idx)}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  type="text"
                  value={q.explanation}
                  onChange={(e) => {
                    const updated = [...questions];
                    updated[qIdx].explanation = e.target.value;
                    setQuestions(updated);
                  }}
                  placeholder="Physical explanation for why this option is correct..."
                  className="w-full px-2 py-1 text-xs rounded border border-slate-300 text-slate-600"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 6: Preview */}
      {currentStep === 6 && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-2xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Eye className="w-4 h-4 text-blue-900" />
            <span>Step 6: Course & Assessment Preview</span>
          </h2>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="text-lg font-bold text-blue-950 font-serif mb-1">
              {courseInfo.title || 'Untitled Meteorological Course'}
            </h3>
            <p className="text-xs text-slate-600 mb-2">{courseInfo.description}</p>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-500">
              <span>Category: {courseInfo.category}</span>
              <span>Level: {courseInfo.difficulty}</span>
              <span>Duration: {courseInfo.duration}</span>
              <span>Domain: {courseInfo.competencyDomain}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Curriculum Summary:
            </h4>
            {modules.map((m, idx) => (
              <div key={m.id} className="p-3 bg-white rounded border border-slate-200 text-xs">
                <span className="font-bold text-slate-900">
                  Module {idx + 1}: {m.title}
                </span>{' '}
                ({m.lessons.length} Lessons)
              </div>
            ))}
          </div>

          <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-xs text-emerald-900">
            <strong>Attached Assessment:</strong> {assessmentTitle} ({questions.length} Questions,{' '}
            {passingPercentage}% passing threshold).
          </div>
        </div>
      )}

      {/* STEP 7: Publish */}
      {currentStep === 7 && (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center space-y-4 shadow-2xs">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold font-serif text-slate-900">
            Ready to Publish Course to IMD Portal
          </h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Publishing will register this course in the central MongoDB database, make it available
            in the catalog for trainee enrollments, and link it with the skill gap recommendation
            engine.
          </p>

          <div className="pt-4">
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-md transition"
            >
              {publishing ? 'Publishing Course...' : 'Confirm & Publish Course'}
            </button>
          </div>
        </div>
      )}

      {/* Wizard Footer Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 rounded-md transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Step</span>
        </button>

        {currentStep < 7 && (
          <button
            onClick={() => setCurrentStep((prev) => Math.min(7, prev + 1))}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-950 hover:bg-blue-900 rounded-md shadow-xs transition"
          >
            <span>Proceed to Step {currentStep + 1}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
