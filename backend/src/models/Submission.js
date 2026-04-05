import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answer: { type: String, required: true, trim: true },
    submittedAt: { type: Date, default: Date.now },
    reviewed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

export const Submission = mongoose.model('Submission', submissionSchema);
