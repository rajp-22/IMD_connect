import mongoose, { Schema } from 'mongoose';

const AnnouncementSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: {
      type: String,
      enum: ['general', 'course', 'achievement', 'urgent'],
      default: 'general',
    },
    targetRole: {
      type: String,
      enum: ['all', 'trainee', 'trainer'],
      default: 'all',
    },
    author: { type: String, default: 'Director General of Meteorology (IMD)' },
    priority: { type: String, enum: ['normal', 'high'], default: 'normal' },
  },
  { timestamps: true }
);

export const AnnouncementModel =
  mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementSchema);
