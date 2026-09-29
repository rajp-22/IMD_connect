import mongoose, { Schema } from 'mongoose';

const AICitationSchema = new Schema({
  sourceDocument: { type: String, required: true },
  sectionTitle: { type: String, required: true },
  snippet: { type: String, required: true },
});

const AIMessageSchema = new Schema({
  id: { type: String, required: true },
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  citations: [AICitationSchema],
  suggestedFollowups: [{ type: String }],
});

const AIConversationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    contextType: {
      type: String,
      enum: ['general', 'course', 'lesson', 'assessment_review'],
      default: 'general',
    },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    lessonId: { type: String },
    title: { type: String, default: 'MeghSetu AI Session' },
    messages: [AIMessageSchema],
  },
  { timestamps: true }
);

export const AIConversationModel =
  mongoose.models.AIConversation ||
  mongoose.model('AIConversation', AIConversationSchema);
