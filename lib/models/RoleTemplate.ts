import mongoose, { Schema } from 'mongoose';

const RoleCompetencyRequirementSchema = new Schema({
  competencyName: { type: String, required: true },
  requiredScore: { type: Number, required: true, min: 0, max: 100 },
  requiredLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Intermediate',
  },
});

const RoleTemplateSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    description: { type: String, required: true },
    requiredCompetencies: [RoleCompetencyRequirementSchema],
    recommendedCourseIds: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    disclaimer: {
      type: String,
      default:
        'This competency matrix is for training recommendations only. Not for employment, promotion, or disciplinary decisions.',
    },
  },
  { timestamps: true }
);

export const RoleTemplateModel =
  mongoose.models.RoleTemplate || mongoose.model('RoleTemplate', RoleTemplateSchema);
