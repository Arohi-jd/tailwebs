import { Inbox } from 'lucide-react';

const EmptyState = ({ title, subtitle }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 py-16 px-6 text-center shadow-sm">
    <div className="mb-4 inline-flex items-center justify-center rounded-full bg-slate-100 p-4 text-slate-400">
      <Inbox size={40} strokeWidth={1.5} />
    </div>
    <h3 className="text-xl font-bold text-flux-navy">{title}</h3>
    <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">{subtitle}</p>
  </div>
);

export default EmptyState;
