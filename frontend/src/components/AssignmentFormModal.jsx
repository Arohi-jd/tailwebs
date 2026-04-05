import { useEffect, useState } from 'react';

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
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">{initialData ? 'Edit Assignment' : 'Create Assignment'}</h2>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <input
            required
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
          <textarea
            required
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
          <input
            required
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-brand-500 px-4 py-2 text-sm text-white">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentFormModal;
