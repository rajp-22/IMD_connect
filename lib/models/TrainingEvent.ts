import mongoose, { Schema } from 'mongoose';

const TrainingEventSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    type: {
      type: String,
      enum: [
        'course_start',
        'live_session',
        'assessment_deadline',
        'workshop',
        'training_event',
        'cert_expiry',
      ],
      default: 'training_event',
    },
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, default: '10:00 AM - 12:00 PM' },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    courseTitle: { type: String, default: '' },
    targetRole: {
      type: String,
      enum: ['all', 'trainee', 'trainer'],
      default: 'all',
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    locationOrLink: { type: String, default: 'IMD Central Auditorium / Webex' },
  },
  { timestamps: true }
);

export const TrainingEventModel =
  mongoose.models.TrainingEvent || mongoose.model('TrainingEvent', TrainingEventSchema);
