import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import EmptyState from '../components/EmptyState';
import { formatDate, getDaysLeft } from '../utils/date';
import { LogOut, Clock, AlertCircle, CheckCircle2, Navigation, Send, BookOpen, AlertTriangle } from 'lucide-react';

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
      if (err.response?.status === 401) {
        logout();
        return;
      }
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
      if (err.response?.status === 401) {
        logout();
        return;
      }
      setError(err.response?.data?.message || 'Submission failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/90 bg-app-bg bg-cover bg-fixed bg-center bg-blend-overlay font-sans">
      {/* Top Banner / Header */}
      <header className="bg-flux-navy/95 border-b border-slate-800 sticky top-0 z-30 shadow-lg backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-4 md:px-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="flex gap-1 text-flux-green font-black text-xl tracking-tighter">
                <span className="text-slate-500">&gt;</span>
                <span className="text-flux-blue">&gt;</span>
                <span className="text-flux-green">&gt;</span>
             </div>
             <div>
              <h1 className="text-xl font-bold text-white leading-tight">Hello, {user?.name}</h1>
              <p className="text-xs text-slate-300 font-medium tracking-wide">STUDENT SPACE</p>
             </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-800/70 px-4 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-700 hover:text-white transition-colors">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-10">
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 md:p-8 shadow-sm mb-8">
            <div className="absolute -right-10 -top-10 w-48 h-48 bg-flux-blue/5 rounded-full blur-2xl"></div>
            <div className="relative z-10 flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-flux-green/10 text-flux-green rounded-xl">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-flux-navy">Your Progress</h2>
                        <p className="text-sm font-medium text-slate-500">
                        You've completed <span className="font-bold text-slate-800">{submittedCount}</span> out of <span className="font-bold text-slate-800">{totalCount}</span> assignments
                        </p>
                    </div>
                </div>
                <div className="text-4xl font-extrabold text-flux-green">
                    {progress}%
                </div>
            </div>
            <div className="relative h-4 overflow-hidden rounded-full bg-slate-100 border border-slate-200/60 mt-6">
                <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-flux-blue to-flux-green transition-all duration-1000 ease-out rounded-full" 
                    style={{ width: `${progress}%` }} 
                />
            </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-600 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-red-600"></div>
             {error}
          </div>
        )}

        {assignments.length === 0 ? (
          <EmptyState
            title="No assignments yet"
            subtitle="Take a break! Your teacher hasn't published any assignments."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {assignments.map((assignment) => {
              const submission = submissionMap.get(assignment._id);
              const daysLeft = getDaysLeft(assignment.dueDate);
              const isOverdue = daysLeft < 0;
              const urgent = daysLeft >= 0 && daysLeft < 3;

              return (
                <div key={assignment._id} className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
                  <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                      <BookOpen size={80} />
                  </div>
                  
                  <div className="relative z-10 flex-1">
                      <h3 className="text-xl font-bold text-flux-navy leading-tight">{assignment.title}</h3>
                      <p className="mt-3 text-sm text-slate-600 line-clamp-3 leading-relaxed">
                          {assignment.description}
                      </p>

                      <div className="mt-5 flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                              <Clock size={14} className="text-slate-400" />
                              <span>{formatDate(assignment.dueDate)}</span>
                          </div>

                          {!submission && (
                              <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border ${
                                  isOverdue ? 'bg-red-50 text-red-600 border-red-100' : 
                                  urgent ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                                  'bg-flux-blue/5 text-flux-blue border-flux-blue/10'
                                }`}>
                                {isOverdue && <AlertTriangle size={14} />}
                                {urgent && !isOverdue && <AlertCircle size={14} />}
                                {!urgent && !isOverdue && <Navigation size={14} className="rotate-45" />}
                                <span>{isOverdue ? 'Overdue' : `${daysLeft} day(s) left`}</span>
                              </div>
                          )}
                      </div>
                  </div>

                  <div className="relative z-10 mt-6 pt-5 border-t border-slate-100">
                      {!submission && !isOverdue && (
                        <div>
                          <div className="relative">
                            <textarea
                              placeholder="Type your answer here..."
                              rows={4}
                              value={answers[assignment._id] || ''}
                              onChange={(e) =>
                                setAnswers((prev) => ({ ...prev, [assignment._id]: e.target.value }))
                              }
                              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:border-flux-blue focus:bg-white focus:outline-none focus:ring-4 focus:ring-flux-blue/10 transition-all resize-none"
                            />
                          </div>
                          <button
                            onClick={() => handleSubmit(assignment._id)}
                            disabled={!answers[assignment._id]?.trim()}
                            className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-flux-blue px-4 py-3 text-sm font-semibold text-white shadow-md shadow-flux-blue/20 hover:bg-flux-navy hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            <Send size={16} /> Submit Answer
                          </button>
                        </div>
                      )}

                      {submission && (
                        <div className="rounded-xl border border-flux-green/20 bg-flux-green/5 p-4">
                          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-flux-green/10 px-3 py-1 text-xs font-bold text-flux-green">
                            <CheckCircle2 size={14} /> Submitted successfully
                          </div>
                          <p className="text-sm font-medium text-slate-700 whitespace-pre-wrap">{submission.answer}</p>
                        </div>
                      )}

                      {!submission && isOverdue && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
                            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
                            <div>
                                <p className="text-sm font-bold text-red-700">Submission Blocked</p>
                                <p className="text-sm text-red-600 mt-1">The due date for this assignment has strictly passed.</p>
                            </div>
                        </div>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800 bg-flux-navy/95 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-4 md:px-10 flex flex-wrap items-center justify-between gap-2 text-sm">
          <p className="font-medium text-slate-200">© 2026 FLUX Assignment Portal</p>
          <p className="text-slate-400">Keep learning, keep shipping</p>
        </div>
      </footer>
    </div>
  );
};

export default StudentDashboard;
