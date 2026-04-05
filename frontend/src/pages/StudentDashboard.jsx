import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/EmptyState';
import { formatDate, getDaysLeft } from '../utils/date';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setError('');
      const [assignmentsRes, submissionsRes] = await Promise.all([
        api.get('/assignments/student/published'),
        api.get('/submissions/student/me'),
      ]);
      setAssignments(assignmentsRes.data);
      setSubmissions(submissionsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load assignments');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const submissionMap = useMemo(() => {
    const map = new Map();
    submissions.forEach((submission) => {
      map.set(submission.assignment?._id || submission.assignment, submission);
    });
    return map;
  }, [submissions]);

  const submittedCount = submissionMap.size;
  const totalCount = assignments.length;
  const progress = totalCount ? Math.round((submittedCount / totalCount) * 100) : 0;

  const handleSubmit = async (assignmentId) => {
    try {
      const answer = answers[assignmentId]?.trim();
      if (!answer) return;

      await api.post(`/submissions/student/${assignmentId}`, { answer });
      setAnswers((prev) => ({ ...prev, [assignmentId]: '' }));
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Welcome, {user?.name}</h1>
            <p className="text-sm text-slate-500">Published assignments and your submission status</p>
          </div>
          <button onClick={logout} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">
            Logout
          </button>
        </div>

        <div className="card mb-6">
          <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
            <span>
              You've submitted {submittedCount} out of {totalCount} assignments
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full bg-emerald-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        {assignments.length === 0 ? (
          <EmptyState
            title="No published assignments"
            subtitle="Your teacher has not published any assignments yet."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {assignments.map((assignment) => {
              const submission = submissionMap.get(assignment._id);
              const daysLeft = getDaysLeft(assignment.dueDate);
              const isOverdue = daysLeft < 0;
              const urgent = daysLeft >= 0 && daysLeft < 3;

              return (
                <div key={assignment._id} className="card">
                  <h3 className="text-lg font-semibold text-slate-800">{assignment.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{assignment.description}</p>
                  <p className="mt-3 text-xs text-slate-500">Due: {formatDate(assignment.dueDate)}</p>

                  <p
                    className={`mt-1 text-xs font-semibold ${
                      isOverdue ? 'text-red-600' : urgent ? 'text-orange-500' : 'text-slate-500'
                    }`}
                  >
                    {isOverdue ? 'Overdue' : `${daysLeft} day(s) left`}
                  </p>

                  {!submission && !isOverdue && (
                    <div className="mt-4">
                      <textarea
                        placeholder="Type your answer"
                        rows={4}
                        value={answers[assignment._id] || ''}
                        onChange={(e) =>
                          setAnswers((prev) => ({ ...prev, [assignment._id]: e.target.value }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      />
                      <button
                        onClick={() => handleSubmit(assignment._id)}
                        className="mt-2 rounded-md bg-brand-500 px-4 py-2 text-sm text-white"
                      >
                        Submit
                      </button>
                    </div>
                  )}

                  {submission && (
                    <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                      <div className="mb-2 inline-flex rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                        ✅ Submitted
                      </div>
                      <p className="text-sm text-slate-700">{submission.answer}</p>
                    </div>
                  )}

                  {!submission && isOverdue && (
                    <p className="mt-4 text-sm font-medium text-red-600">
                      Submission blocked because due date has passed.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
