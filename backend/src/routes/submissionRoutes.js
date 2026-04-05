import { Router } from 'express';
import {
  getStudentSubmissions,
  getTeacherSubmissionsByAssignment,
  markSubmissionReviewed,
  submitAssignment,
} from '../controllers/submissionController.js';
import { authorize, protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.post('/student/:assignmentId', authorize('student'), submitAssignment);
router.get('/student/me', authorize('student'), getStudentSubmissions);

router.get('/teacher/:assignmentId', authorize('teacher'), getTeacherSubmissionsByAssignment);
router.patch('/teacher/review/:submissionId', authorize('teacher'), markSubmissionReviewed);

export default router;
