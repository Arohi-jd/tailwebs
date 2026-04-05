import cors from 'cors';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ message: 'API is running' }));

app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);

// Backward-compatible route aliases for accidental double /api in frontend base URLs.
app.use('/api/api/auth', authRoutes);
app.use('/api/api/assignments', assignmentRoutes);
app.use('/api/api/submissions', submissionRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
