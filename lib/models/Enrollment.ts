import mongoose, { Schema } from 'mongoose';

const EnrollmentSchema = new Schema(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    courseTitle: { type: String, required: true },
    traineeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['enrolled', 'in-progress', 'completed'],
      default: 'enrolled',
    },
    progressPercentage: { type: Number, default: 0 },
    completedLessonIds: [{ type: String }],
    enrolledAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    lastAccessedAt: { type: Date, default: Date.now },
    assessmentAttemptId: { type: Schema.Types.ObjectId, ref: 'AssessmentAttempt' },
    assessmentScore: { type: Number },
    certificateId: { type: String },
  },
  { timestamps: true }
);

export const EnrollmentModel =
  mongoose.models.Enrollment || mongoose.model('Enrollment', EnrollmentSchema);
