import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import AssignmentStepper from '../components/AssignmentStepper';
import AssignmentFormModal from '../components/AssignmentFormModal';
import SubmissionsModal from '../components/SubmissionsModal';
import EmptyState from '../components/EmptyState';
import { formatDate } from '../utils/date';
import { Plus, LogOut, FileText, Send, CheckCircle, Eye, Edit2, Trash2, TrendingUp } from 'lucide-react';

const filters = ['All', 'Draft', 'Published', 'Completed'];

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [summary, setSummary] = useState({ Draft: 0, Published: 0, Completed: 0 });
  const [activeFilter, setActiveFilter] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [isSubmissionsOpen, setIsSubmissionsOpen] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
  const [error, setError] = useState('');

  const loadAssignments = async (status = activeFilter) => {
    const { data } = await api.get('/assignments/teacher', { params: { status } });
    setAssignments(data);
  };

  const loadSummary = async () => {
    const { data } = await api.get('/assignments/teacher/summary');
    setSummary(data);
  };

  const refresh = async (status = activeFilter) => {
    try {
      setError('');
      await Promise.all([loadAssignments(status), loadSummary()]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    }
  };

  useEffect(() => {
    refresh('All');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFilterChange = async (status) => {
    setActiveFilter(status);
    await refresh(status);
  };

  const handleCreateOrUpdate = async (payload) => {
    try {
      if (editingAssignment) {
        await api.put(`/assignments/teacher/${editingAssignment._id}`, payload);
      } else {
        await api.post('/assignments/teacher', payload);
      }
      setIsFormOpen(false);
      setEditingAssignment(null);
      await refresh(activeFilter);
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/assignments/teacher/${id}`);
      await refresh(activeFilter);
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const changeStatus = async (id, status) => {
    try {
      await api.patch(`/assignments/teacher/${id}/status`, { status });
      await refresh(activeFilter);
    } catch (err) {
      setError(err.response?.data?.message || 'Status update failed');
    }
  };

  const openSubmissions = async (assignmentId) => {
    try {
      const { data } = await api.get(`/submissions/teacher/${assignmentId}`);
      setSelectedAssignmentId(assignmentId);
      setSubmissions(data);
      setIsSubmissionsOpen(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch submissions');
    }
  };

  const markReviewed = async (submissionId) => {
    await api.patch(`/submissions/teacher/review/${submissionId}`);
    const { data } = await api.get(`/submissions/teacher/${selectedAssignmentId}`);
    setSubmissions(data);
  };

  const getSummaryIcon = (status) => {
    switch (status) {
      case 'Draft': return <FileText className="text-slate-400" size={24} />;
      case 'Published': return <Send className="text-flux-blue" size={24} />;
      case 'Completed': return <CheckCircle className="text-flux-green" size={24} />;
      default: return <TrendingUp className="text-flux-darkgray" size={24} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Banner / Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="flex gap-1 text-flux-green font-black text-xl tracking-tighter">
                <span className="text-flux-darkgray">&gt;</span>
                <span className="text-flux-blue">&gt;</span>
                <span className="text-flux-green">&gt;</span>
             </div>
             <div>
              <h1 className="text-xl font-bold text-flux-navy leading-tight">Welcome, {user?.name}</h1>
              <p className="text-xs text-slate-500 font-medium tracking-wide">TEACHER DASHBOARD</p>
             </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setEditingAssignment(null);
                setIsFormOpen(true);
              }}
              className="flex items-center gap-2 rounded-lg bg-flux-blue px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-flux-blue/20 hover:bg-flux-navy hover:shadow-lg transition-all"
            >
              <Plus size={16} /> Create Assignment
            </button>
            <button onClick={logout} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-10">
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-600 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-red-600"></div>
             {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {['Draft', 'Published', 'Completed'].map((status) => (
            <button
              key={status}
              onClick={() => onFilterChange(status)}
              className={`relative overflow-hidden rounded-2xl border bg-white p-6 text-left transition-all hover:shadow-md ${activeFilter === status ? 'border-flux-blue ring-1 ring-flux-blue shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{status}</p>
                <div className="p-2 rounded-lg bg-slate-50">
                  {getSummaryIcon(status)}
                </div>
              </div>
              <p className="text-4xl font-extrabold text-flux-navy">{summary[status] || 0}</p>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2 pb-4 border-b border-slate-200">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                activeFilter === filter
                  ? 'bg-flux-navy text-white shadow-md'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Assignments Grid */}
        {assignments.length === 0 ? (
          <EmptyState
            title="No assignments in this view"
            subtitle="Create a new assignment or switch the filter above."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {assignments.map((assignment) => (
              <div key={assignment._id} className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-flux-navy leading-tight">{assignment.title}</h3>
                    <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                      {assignment.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <StatusBadge status={assignment.status} />
                  </div>
                </div>

                <div className="mb-5 flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 inline-flex w-fit px-3 py-1.5 rounded-lg border border-slate-100">
                  <span>Due:</span>
                  <span className="text-flux-navy">{formatDate(assignment.dueDate)}</span>
                </div>
                
                <div className="mt-auto">
                    <div className="my-4">
                        <AssignmentStepper status={assignment.status} />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                    {assignment.status === 'Draft' && (
                        <>
                        <button
                            onClick={() => {
                            setEditingAssignment(assignment);
                            setIsFormOpen(true);
                            }}
                            className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            <Edit2 size={16} /> Edit
                        </button>
                        <button
                            onClick={() => handleDelete(assignment._id)}
                            className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <Trash2 size={16} /> Delete
                        </button>
                        <button
                            onClick={() => changeStatus(assignment._id, 'Published')}
                            className="w-full flex items-center justify-center gap-2 rounded-lg bg-flux-blue px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-flux-navy transition-colors mt-2"
                        >
                            <Send size={16} /> Publish
                        </button>
                        </>
                    )}

                    {assignment.status === 'Published' && (
                        <>
                        <button
                            onClick={() => openSubmissions(assignment._id)}
                            className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-flux-blue text-flux-blue px-4 py-2.5 text-sm font-semibold hover:bg-blue-50 transition-colors"
                        >
                            <Eye size={16} /> View Submissions
                        </button>
                        <button
                            onClick={() => changeStatus(assignment._id, 'Completed')}
                            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-flux-green px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-600 transition-colors"
                        >
                            <CheckCircle size={16} /> Mark Completed
                        </button>
                        </>
                    )}

                    {assignment.status === 'Completed' && (
                        <button
                        onClick={() => openSubmissions(assignment._id)}
                        className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                        <Eye size={16} /> View Submissions
                        </button>
                    )}
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <AssignmentFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingAssignment(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingAssignment}
      />

      <SubmissionsModal
        isOpen={isSubmissionsOpen}
        onClose={() => setIsSubmissionsOpen(false)}
        submissions={submissions}
        onMarkReviewed={markReviewed}
      />
    </div>
  );
};

export default TeacherDashboard;
