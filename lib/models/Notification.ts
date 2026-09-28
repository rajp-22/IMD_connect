import mongoose, { Schema } from 'mongoose';

const NotificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    type: {
      type: String,
      enum: [
        'deadline',
        'competency_gap',
        'recommendation',
        'progress',
        'cert_expiry',
        'system',
      ],
      default: 'system',
    },
    link: { type: String, default: '' },
  },
  { timestamps: true }
);

export const NotificationModel =
  mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
