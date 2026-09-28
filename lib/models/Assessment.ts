import mongoose, { Schema } from 'mongoose';

const QuestionSchema = new Schema({
  id: { type: String, required: true },
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswerIndex: { type: Number, required: true },
  explanation: { type: String, required: true },
  marks: { type: Number, default: 1 },
});

const AssessmentSchema = new Schema(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    courseTitle: { type: String, required: true },
    trainerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    trainerName: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    durationMinutes: { type: Number, default: 30 },
    totalMarks: { type: Number, default: 10 },
    passingPercentage: { type: Number, default: 60 },
    startDate: { type: Date },
    deadline: { type: Date },
    questions: [QuestionSchema],
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
  },
  { timestamps: true }
);

const AssessmentAttemptSchema = new Schema(
  {
    assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    traineeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    traineeName: { type: String, required: true },
    answers: [
      {
        questionIndex: { type: Number, required: true },
        selectedOption: { type: Number, required: true },
        isCorrect: { type: Boolean, required: true },
        marksAwarded: { type: Number, default: 0 },
      },
    ],
    score: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    percentage: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const AssessmentModel =
  mongoose.models.Assessment || mongoose.model('Assessment', AssessmentSchema);

export const AssessmentAttemptModel =
  mongoose.models.AssessmentAttempt ||
  mongoose.model('AssessmentAttempt', AssessmentAttemptSchema);
