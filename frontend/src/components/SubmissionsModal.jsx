import { formatDate } from '../utils/date';

const SubmissionsModal = ({ isOpen, onClose, submissions, onMarkReviewed }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-bg">
      <div className="max-h-[80vh] w-full max-w-5xl overflow-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Student Submissions</h2>
          <button onClick={onClose} className="rounded-md px-3 py-1 text-slate-600 hover:bg-slate-100">
            Close
          </button>
        </div>

        {submissions.length === 0 ? (
          <p className="text-sm text-slate-500">No submissions yet.</p>
        ) : (
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left text-slate-600">
                <th className="px-3 py-2">Student</th>
                <th className="px-3 py-2">Answer</th>
                <th className="px-3 py-2">Submitted At</th>
                <th className="px-3 py-2">Reviewed</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission._id} className="border-b">
                  <td className="px-3 py-2 font-medium">{submission.student?.name}</td>
                  <td className="max-w-xl px-3 py-2 text-slate-700">{submission.answer}</td>
                  <td className="px-3 py-2 text-slate-600">{formatDate(submission.submittedAt)}</td>
                  <td className="px-3 py-2">
                    {submission.reviewed ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700">
                        Reviewed
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {!submission.reviewed && (
                      <button
                        onClick={() => onMarkReviewed(submission._id)}
                        className="rounded-md bg-slate-800 px-3 py-1 text-xs text-white"
                      >
                        Mark Reviewed
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SubmissionsModal;
