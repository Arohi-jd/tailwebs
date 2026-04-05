const colorByStatus = {
  Draft: 'bg-slate-100 text-slate-700',
  Published: 'bg-blue-100 text-blue-700',
  Completed: 'bg-emerald-100 text-emerald-700',
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${colorByStatus[status]}`}>
    {status}
  </span>
);

export default StatusBadge;
