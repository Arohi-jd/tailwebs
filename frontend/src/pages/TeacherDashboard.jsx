import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import AssignmentStepper from '../components/AssignmentStepper';
import AssignmentFormModal from '../components/AssignmentFormModal';
import SubmissionsModal from '../components/SubmissionsModal';
import EmptyState from '../components/EmptyState';
import { formatDate } from '../utils/date';

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

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Welcome, {user?.name}</h1>
            <p className="text-sm text-slate-500">Manage assignment workflow from Draft to Completed</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setEditingAssignment(null);
                setIsFormOpen(true);
              }}
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              + Create Assignment
            </button>
            <button onClick={logout} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">
              Logout
            </button>
          </div>
        </div>

        {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <div className="mb-6 grid gap-3 md:grid-cols-3">
          {['Draft', 'Published', 'Completed'].map((status) => (
            <button
              key={status}
              onClick={() => onFilterChange(status)}
              className="card text-left transition hover:border-brand-500"
            >
              <p className="text-xs text-slate-500">{status}</p>
              <p className="mt-1 text-2xl font-bold text-slate-800">{summary[status] || 0}</p>
            </button>
          ))}
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`rounded-full px-4 py-1.5 text-sm ${
                activeFilter === filter
                  ? 'bg-brand-500 text-white'
                  : 'border border-slate-300 bg-white text-slate-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {assignments.length === 0 ? (
          <EmptyState
            title="No assignments in this view"
            subtitle="Create a new assignment or switch the filter above."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {assignments.map((assignment) => (
              <div key={assignment._id} className="card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">{assignment.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {assignment.description.length > 120
                        ? `${assignment.description.slice(0, 120)}...`
                        : assignment.description}
                    </p>
                  </div>
                  <StatusBadge status={assignment.status} />
                </div>

                <p className="mt-3 text-xs text-slate-500">Due: {formatDate(assignment.dueDate)}</p>
                <AssignmentStepper status={assignment.status} />

                <div className="mt-4 flex flex-wrap gap-2">
                  {assignment.status === 'Draft' && (
                    <>
                      <button
                        onClick={() => {
                          setEditingAssignment(assignment);
                          setIsFormOpen(true);
                        }}
                        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(assignment._id)}
                        className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-600"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => changeStatus(assignment._id, 'Published')}
                        className="rounded-md bg-brand-500 px-3 py-1.5 text-sm text-white"
                      >
                        Publish
                      </button>
                    </>
                  )}

                  {assignment.status === 'Published' && (
                    <>
                      <button
                        onClick={() => openSubmissions(assignment._id)}
                        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
                      >
                        View Submissions
                      </button>
                      <button
                        onClick={() => changeStatus(assignment._id, 'Completed')}
                        className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm text-white"
                      >
                        Mark Completed
                      </button>
                    </>
                  )}

                  {assignment.status === 'Completed' && (
                    <button
                      onClick={() => openSubmissions(assignment._id)}
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
                    >
                      View Submissions
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
