import { Assignment, ASSIGNMENT_STATUS } from '../models/Assignment.js';

const statusOrder = [
  ASSIGNMENT_STATUS.DRAFT,
  ASSIGNMENT_STATUS.PUBLISHED,
  ASSIGNMENT_STATUS.COMPLETED,
];

const canMoveForward = (currentStatus, newStatus) =>
  statusOrder.indexOf(newStatus) === statusOrder.indexOf(currentStatus) + 1;

export const createAssignment = async (req, res) => {
  const { title, description, dueDate } = req.body;

  if (!title || !description || !dueDate) {
    return res.status(400).json({ message: 'Title, description and due date are required' });
  }

  const assignment = await Assignment.create({
    title,
    description,
    dueDate,
    teacher: req.user._id,
    status: ASSIGNMENT_STATUS.DRAFT,
  });

  return res.status(201).json(assignment);
};

export const getTeacherAssignments = async (req, res) => {
  const { status } = req.query;
  const query = { teacher: req.user._id };
  if (status && status !== 'All') query.status = status;

  const assignments = await Assignment.find(query).sort({ createdAt: -1 });
  return res.json(assignments);
};

export const getTeacherSummary = async (req, res) => {
  const counts = await Assignment.aggregate([
    { $match: { teacher: req.user._id } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const summary = {
    Draft: 0,
    Published: 0,
    Completed: 0,
  };

  counts.forEach((entry) => {
    summary[entry._id] = entry.count;
  });

  return res.json(summary);
};

export const updateDraftAssignment = async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate } = req.body;

  const assignment = await Assignment.findOne({ _id: id, teacher: req.user._id });
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

  if (assignment.status !== ASSIGNMENT_STATUS.DRAFT) {
    return res.status(400).json({ message: 'Only Draft assignments can be edited' });
  }

  if (title) assignment.title = title;
  if (description) assignment.description = description;
  if (dueDate) assignment.dueDate = dueDate;

  await assignment.save();
  return res.json(assignment);
};

export const deleteDraftAssignment = async (req, res) => {
  const { id } = req.params;
  const assignment = await Assignment.findOne({ _id: id, teacher: req.user._id });

  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
  if (assignment.status !== ASSIGNMENT_STATUS.DRAFT) {
    return res.status(400).json({ message: 'Only Draft assignments can be deleted' });
  }

  await assignment.deleteOne();
  return res.json({ message: 'Assignment deleted' });
};

export const changeAssignmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!statusOrder.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const assignment = await Assignment.findOne({ _id: id, teacher: req.user._id });
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

  if (!canMoveForward(assignment.status, status)) {
    return res
      .status(400)
      .json({ message: 'Status can only move forward by one step: Draft → Published → Completed' });
  }

  assignment.status = status;
  await assignment.save();

  return res.json(assignment);
};

export const getPublishedAssignmentsForStudent = async (req, res) => {
  const assignments = await Assignment.find({ status: ASSIGNMENT_STATUS.PUBLISHED })
    .populate('teacher', 'name email')
    .sort({ dueDate: 1 });
  return res.json(assignments);
};
