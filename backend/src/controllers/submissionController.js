import { Assignment, ASSIGNMENT_STATUS } from '../models/Assignment.js';
import { Submission } from '../models/Submission.js';

export const submitAssignment = async (req, res) => {
  const { assignmentId } = req.params;
  const { answer } = req.body;

  if (!answer?.trim()) return res.status(400).json({ message: 'Answer is required' });

  const assignment = await Assignment.findById(assignmentId);
  if (!assignment || assignment.status !== ASSIGNMENT_STATUS.PUBLISHED) {
    return res.status(404).json({ message: 'Published assignment not found' });
  }

  if (new Date() > new Date(assignment.dueDate)) {
    return res.status(400).json({ message: 'Cannot submit after due date' });
  }

  const existingSubmission = await Submission.findOne({
    assignment: assignmentId,
    student: req.user._id,
  });

  if (existingSubmission) {
    return res.status(409).json({ message: 'You have already submitted this assignment' });
  }

  const submission = await Submission.create({
    assignment: assignmentId,
    student: req.user._id,
    answer: answer.trim(),
  });

  return res.status(201).json(submission);
};

export const getStudentSubmissions = async (req, res) => {
  const submissions = await Submission.find({ student: req.user._id })
    .populate('assignment', 'title dueDate status')
    .sort({ submittedAt: -1 });

  return res.json(submissions);
};

export const getTeacherSubmissionsByAssignment = async (req, res) => {
  const { assignmentId } = req.params;

  const assignment = await Assignment.findOne({ _id: assignmentId, teacher: req.user._id });
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

  const submissions = await Submission.find({ assignment: assignmentId })
    .populate('student', 'name email')
    .sort({ submittedAt: -1 });

  return res.json(submissions);
};

export const markSubmissionReviewed = async (req, res) => {
  const { submissionId } = req.params;
  const submission = await Submission.findById(submissionId).populate('assignment');

  if (!submission) return res.status(404).json({ message: 'Submission not found' });
  if (submission.assignment.teacher.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  submission.reviewed = true;
  await submission.save();
  return res.json(submission);
};
