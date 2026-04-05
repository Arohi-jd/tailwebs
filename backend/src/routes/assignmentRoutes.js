import { Router } from 'express';
import {
  changeAssignmentStatus,
  createAssignment,
  deleteDraftAssignment,
  getPublishedAssignmentsForStudent,
  getTeacherAssignments,
  getTeacherSummary,
  updateDraftAssignment,
} from '../controllers/assignmentController.js';
import { authorize, protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/student/published', authorize('student'), getPublishedAssignmentsForStudent);

router.get('/teacher', authorize('teacher'), getTeacherAssignments);
router.get('/teacher/summary', authorize('teacher'), getTeacherSummary);
router.post('/teacher', authorize('teacher'), createAssignment);
router.put('/teacher/:id', authorize('teacher'), updateDraftAssignment);
router.delete('/teacher/:id', authorize('teacher'), deleteDraftAssignment);
router.patch('/teacher/:id/status', authorize('teacher'), changeAssignmentStatus);

export default router;
