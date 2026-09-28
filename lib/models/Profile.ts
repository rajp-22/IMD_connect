import mongoose, { Schema } from 'mongoose';

const FeedbackSchema = new Schema(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    courseTitle: { type: String, required: true },
    traineeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    traineeName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comments: { type: String, required: true },
  },
  { timestamps: true }
);

export const FeedbackModel =
  mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);

const TraineeProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    department: { type: String, default: 'Meteorological Operations' },
    designation: { type: String, default: 'Scientific Assistant' },
    phone: { type: String, default: '' },
    bio: { type: String, default: '' },
    education: [
      {
        degree: String,
        institution: String,
        qualification: String,
        year: String,
      },
    ],
    experience: [
      {
        organization: String,
        position: String,
        years: Number,
      },
    ],
    skills: [{ type: String }],
    interests: [{ type: String }],
    completedCertificatesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const TraineeProfileModel =
  mongoose.models.TraineeProfile || mongoose.model('TraineeProfile', TraineeProfileSchema);

const TrainerProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true },
    department: { type: String, default: 'Numerical Weather Prediction Division' },
    designation: { type: String, default: 'Senior Scientist / Principal Trainer' },
    bio: { type: String, default: '' },
    experienceYears: { type: Number, default: 12 },
    specializations: [{ type: String }],
    competencies: [
      {
        name: String,
        domain: String,
        level: String,
        score: Number,
      },
    ],
    rating: { type: Number, default: 4.9 },
    totalCourses: { type: Number, default: 1 },
    totalStudentsTaught: { type: Number, default: 45 },
  },
  { timestamps: true }
);

export const TrainerProfileModel =
  mongoose.models.TrainerProfile || mongoose.model('TrainerProfile', TrainerProfileSchema);
