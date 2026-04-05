const EmptyState = ({ title, subtitle }) => (
  <div className="card flex flex-col items-center justify-center py-16 text-center">
    <div className="mb-3 text-3xl">📭</div>
    <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
    <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
  </div>
);

export default EmptyState;
