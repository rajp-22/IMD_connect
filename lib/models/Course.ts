import mongoose, { Schema } from 'mongoose';

const LearningResourceSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['pdf', 'ppt', 'doc', 'video', 'link'], default: 'pdf' },
  fileUrl: { type: String, required: true },
  fileSize: { type: String, default: '1.2 MB' },
  description: { type: String, default: '' },
});

const LessonSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  order: { type: Number, default: 1 },
  duration: { type: String, default: '20 mins' },
  type: {
    type: String,
    enum: ['video', 'pdf', 'presentation', 'article'],
    default: 'article',
  },
  contentUrl: { type: String, default: '' },
  contentBody: { type: String, default: '' },
  demoPdfPages: [{ type: String }],
  resources: [LearningResourceSchema],
});

const ModuleSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  order: { type: Number, default: 1 },
  lessons: [LessonSchema],
});

const CourseSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, default: 'General Meteorology' },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Beginner',
    },
    duration: { type: String, default: '4 Weeks' },
    trainerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    trainerName: { type: String, required: true },
    trainerRole: { type: String, default: 'Senior Meteorologist, IMD' },
    thumbnail: { type: String, default: '' },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },
    tags: [{ type: String }],
    modules: [ModuleSchema],
    assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment' },
    preAssessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment' },
    prerequisites: [{ type: String }],
    enrolledCount: { type: Number, default: 0 },
    rating: { type: Number, default: 4.8 },
    ratingCount: { type: Number, default: 0 },
    disclaimer: {
      type: String,
      default: 'Prototype Demo Content — Not Official IMD Material.',
    },
    competencyDomain: { type: String, default: 'Meteorology' },
    competencyGainPercentage: { type: Number, default: 25 },
  },
  { timestamps: true }
);

export const CourseModel = mongoose.models.Course || mongoose.model('Course', CourseSchema);
