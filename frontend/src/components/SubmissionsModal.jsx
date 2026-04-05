import { formatDate } from '../utils/date';
import { X, CheckCircle2, Circle } from 'lucide-react';

const SubmissionsModal = ({ isOpen, onClose, submissions, onMarkReviewed }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-bg">
      <div className="flex flex-col max-h-[85vh] w-full max-w-5xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
              <h2 className="text-lg font-bold text-flux-navy">Student Submissions</h2>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Review answers submitted by your students</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 bg-slate-50/50">
            {submissions.length === 0 ? (
              <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                      <CheckCircle2 className="text-slate-300" size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700">No submissions yet</h3>
                  <p className="text-sm text-slate-500 mt-1">Students haven't submitted anything for this assignment.</p>
              </div>
            ) : (
                <div className="space-y-4">
                {submissions.map((submission) => (
                    <div key={submission._id} className="bg-white border text-sm border-slate-200 rounded-xl p-5 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-flux-blue/10 flex items-center justify-center text-flux-blue font-bold text-lg">
                                    {(submission.student?.name || 'S').charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800">{submission.student?.name}</h4>
                                    <p className="text-xs font-medium text-slate-500">{formatDate(submission.submittedAt)}</p>
                                </div>
                            </div>
                            <div>
                                {submission.reviewed ? (
                                    <div className="flex items-center gap-1.5 rounded-full bg-flux-green/10 px-3 py-1.5 text-xs font-bold text-flux-green border border-flux-green/20">
                                        <CheckCircle2 size={14} /> Reviewed
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-600 border border-orange-100">
                                        <Circle size={14} className="fill-orange-500/20" /> Pending
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100/50">
                            <p className="text-slate-700 whitespace-pre-wrap">{submission.answer}</p>
                        </div>

                        {!submission.reviewed && (
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => onMarkReviewed(submission._id)}
                                    className="flex items-center gap-2 rounded-lg bg-flux-navy px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
                                >
                                    <CheckCircle2 size={16} /> Mark as Reviewed
                                </button>
                            </div>
                        )}
                    </div>
                ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionsModal;
