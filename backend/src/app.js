import cors from 'cors';
import express from 'express';
import { config } from './config.js';
import authRoutes from './routes/authRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

const normalizeOrigin = (value) => value?.trim().replace(/\/+$/, '');

const allowedOrigins = config.corsOrigin
	? config.corsOrigin.split(',').map((origin) => normalizeOrigin(origin))
	: [];

app.use(
	cors({
		origin: (origin, callback) => {
			const requestOrigin = normalizeOrigin(origin);
			if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(requestOrigin)) {
				return callback(null, true);
			}
			return callback(null, false);
		},
	})
);
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ message: 'API is running' }));

app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
