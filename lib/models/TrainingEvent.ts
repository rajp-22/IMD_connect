import mongoose, { Schema } from 'mongoose';

const TrainingEventSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    type: { type: String, default: 'TRAINING' },
    eventType: { type: String, default: 'TRAINING' },
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, default: '10:00 AM – 12:00 PM IST' },
    startDateTime: { type: String },
    endDateTime: { type: String },
    duration: { type: String, default: '1 Hour' },
    location: { type: String, default: 'IMD Central Facility / Webex' },
    locationOrLink: { type: String, default: 'IMD Central Facility / Webex' },
    organizer: {
      id: { type: String },
      name: { type: String, default: 'IMD Directorate' },
      role: { type: String },
      avatar: { type: String },
    },
    participants: [
      {
        id: { type: String },
        name: { type: String },
        role: { type: String },
        cohort: { type: String },
      },
    ],
    targetRole: { type: String, default: 'all' },
    targetRoles: [{ type: String, default: 'all' }],
    userId: { type: Schema.Types.Mixed },
    courseId: { type: Schema.Types.Mixed },
    courseTitle: { type: String, default: '' },
    moduleId: { type: String },
    moduleTitle: { type: String },
    assessmentId: { type: String },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    status: { type: String, enum: ['scheduled', 'upcoming', 'ongoing', 'completed', 'cancelled', 'overdue'], default: 'upcoming' },
    completedUserIds: [{ type: String }],
    reminderSettings: {
      enabled: { type: Boolean, default: true },
      preset: { type: String, default: '1d' },
      customMinutes: { type: Number },
    },
    personalReminders: [
      {
        userId: { type: String },
        note: { type: String },
        remindBefore: { type: String },
      },
    ],
    relatedResources: [
      {
        title: { type: String },
        url: { type: String },
        type: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export const TrainingEventModel =
  mongoose.models.TrainingEvent || mongoose.model('TrainingEvent', TrainingEventSchema);
