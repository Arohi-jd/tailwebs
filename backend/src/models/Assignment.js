import mongoose from 'mongoose';

export const ASSIGNMENT_STATUS = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  COMPLETED: 'Completed',
};

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: Object.values(ASSIGNMENT_STATUS),
      default: ASSIGNMENT_STATUS.DRAFT,
    },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Assignment = mongoose.model('Assignment', assignmentSchema);
