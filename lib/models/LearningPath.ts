import mongoose, { Schema } from 'mongoose';

const LearningPathStepSchema = new Schema({
  id: { type: String, required: true },
  stepNumber: { type: Number, required: true },
  courseId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  type: {
    type: String,
    enum: ['course', 'assessment', 'milestone'],
    default: 'course',
  },
  duration: { type: String, default: '3 Weeks' },
  status: {
    type: String,
    enum: ['completed', 'in-progress', 'current', 'locked'],
    default: 'locked',
  },
  prerequisiteStepIds: [{ type: String }],
  score: { type: Number },
  completedAt: { type: Date },
});

const LearningPathSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    roleTemplateId: { type: Schema.Types.ObjectId, ref: 'RoleTemplate' },
    title: { type: String, required: true },
    goal: { type: String, required: true },
    targetRole: { type: String, required: true },
    progress: { type: Number, default: 0 },
    estimatedDuration: { type: String, default: '16 Weeks' },
    currentStep: { type: Number, default: 1 },
    nextRecommendedStep: { type: String, default: '' },
    steps: [LearningPathStepSchema],
  },
  { timestamps: true }
);

export const LearningPathModel =
  mongoose.models.LearningPath || mongoose.model('LearningPath', LearningPathSchema);
