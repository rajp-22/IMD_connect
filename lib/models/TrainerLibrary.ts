import mongoose, { Schema } from 'mongoose';

const TrainerLibraryResourceSchema = new Schema(
  {
    trainerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    folder: { type: String, required: true },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['video', 'pdf', 'presentation', 'document', 'dataset'],
      default: 'pdf',
    },
    fileName: { type: String, required: true },
    fileSize: { type: String, default: '2.5 MB' },
    fileUrl: { type: String, required: true },
    usedInCourses: [{ type: String }],
  },
  { timestamps: true }
);

export const TrainerLibraryModel =
  mongoose.models.TrainerLibrary ||
  mongoose.model('TrainerLibrary', TrainerLibraryResourceSchema);
