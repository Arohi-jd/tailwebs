import { FileText, Send, CheckCircle } from 'lucide-react';

const icons = {
  Draft: FileText,
  Published: Send,
  Completed: CheckCircle,
};

const styles = {
  Draft: 'bg-slate-100 text-slate-700 border-slate-200',
  Published: 'bg-blue-50 text-flux-blue border-blue-100',
  Completed: 'bg-green-50 text-flux-green border-green-100',
};

const StatusBadge = ({ status }) => {
  const Icon = icons[status] || FileText;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${styles[status]}`}>
      <Icon size={12} />
      {status}
    </span>
  );
};

export default StatusBadge;
