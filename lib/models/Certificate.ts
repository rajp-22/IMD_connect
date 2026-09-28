import mongoose, { Schema } from 'mongoose';

const CertificateSchema = new Schema(
  {
    certificateId: { type: String, required: true, unique: true },
    traineeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    traineeName: { type: String, required: true },
    traineeDepartment: { type: String, default: 'Meteorological Operations' },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    courseName: { type: String, required: true },
    trainerName: { type: String, required: true },
    issueDate: { type: Date, default: Date.now },
    completionDate: { type: Date, default: Date.now },
    scorePercentage: { type: Number, required: true },
    verificationCode: { type: String, required: true },
  },
  { timestamps: true }
);

export const CertificateModel =
  mongoose.models.Certificate || mongoose.model('Certificate', CertificateSchema);
