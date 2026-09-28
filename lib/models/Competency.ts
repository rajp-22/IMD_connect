import mongoose, { Schema } from 'mongoose';

const CompetencySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    domain: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: 'Core Meteorological Science' },
    icon: { type: String, default: 'Compass' },
    requiredLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Intermediate',
    },
    relatedCourses: [{ type: String }],
    relatedRoles: [{ type: String }],
    targetBenchmark: { type: Number, default: 75 },
  },
  { timestamps: true }
);

const TraineeCompetencySchema = new Schema(
  {
    traineeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    competencyName: { type: String, required: true },
    domain: { type: String, required: true },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Beginner',
    },
    score: { type: Number, min: 0, max: 100, default: 50 },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const TrainerCompetencySchema = new Schema(
  {
    trainerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    competencyName: { type: String, required: true },
    domain: { type: String, required: true },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Advanced',
    },
    score: { type: Number, min: 0, max: 100, default: 85 },
  },
  { timestamps: true }
);

const SkillGapSchema = new Schema(
  {
    traineeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    competencyName: { type: String, required: true },
    currentScore: { type: Number, required: true },
    requiredScore: { type: Number, required: true },
    gap: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Critical', 'Moderate', 'Satisfied'],
      default: 'Moderate',
    },
    recommendedCourseIds: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    explanation: { type: String },
  },
  { timestamps: true }
);

export const CompetencyModel =
  mongoose.models.Competency || mongoose.model('Competency', CompetencySchema);

export const TraineeCompetencyModel =
  mongoose.models.TraineeCompetency ||
  mongoose.model('TraineeCompetency', TraineeCompetencySchema);

export const TrainerCompetencyModel =
  mongoose.models.TrainerCompetency ||
  mongoose.model('TrainerCompetency', TrainerCompetencySchema);

export const SkillGapModel =
  mongoose.models.SkillGap || mongoose.model('SkillGap', SkillGapSchema);
