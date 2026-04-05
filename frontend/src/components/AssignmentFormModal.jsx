import { useEffect, useState } from 'react';
import { X, Save, Calendar, Type, FileText } from 'lucide-react';

const AssignmentFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState({ title: '', description: '', dueDate: '' });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        dueDate: initialData.dueDate ? initialData.dueDate.slice(0, 10) : '',
      });
    } else {
      setForm({ title: '', description: '', dueDate: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <div className="modal-bg">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200 transform transition-all scale-100 opacity-100">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-flux-navy">
                {initialData ? 'Edit Assignment' : 'Create Assignment'}
            </h2>
            <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors">
                <X size={20} />
            </button>
        </div>
        <form className="p-6 space-y-5" onSubmit={handleSubmit}>
          <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Title</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Type size={16} className="text-slate-400" />
                  </div>
                  <input
                    required
                    name="title"
                    placeholder="E.g., Quantum Physics Essay"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 pl-10 py-2.5 text-sm focus:border-flux-blue focus:bg-white focus:outline-none focus:ring-4 focus:ring-flux-blue/10 transition-all font-medium text-slate-800"
                  />
              </div>
          </div>
          <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Description</label>
              <div className="relative">
                  <div className="absolute top-3 left-0 pl-3 pointer-events-none">
                      <FileText size={16} className="text-slate-400" />
                  </div>
                  <textarea
                    required
                    name="description"
                    placeholder="Enter the details and requirements..."
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 pl-10 py-2.5 text-sm focus:border-flux-blue focus:bg-white focus:outline-none focus:ring-4 focus:ring-flux-blue/10 transition-all font-medium text-slate-800 resize-none"
                  />
              </div>
          </div>
          <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Due Date</label>
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={16} className="text-slate-400" />
                  </div>
                  <input
                    required
                    type="date"
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 pl-10 py-2.5 text-sm focus:border-flux-blue focus:bg-white focus:outline-none focus:ring-4 focus:ring-flux-blue/10 transition-all font-medium text-slate-800"
                  />
              </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button type="submit" className="flex items-center gap-2 rounded-xl bg-flux-blue px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-flux-navy hover:shadow-lg transition-all group">
              <Save size={16} className="group-hover:scale-110 transition-transform" /> Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentFormModal;
