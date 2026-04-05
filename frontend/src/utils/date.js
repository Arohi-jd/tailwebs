export const formatDate = (dateValue) =>
  new Date(dateValue).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

export const getDaysLeft = (dateValue) => {
  const now = new Date();
  const due = new Date(dateValue);
  const diff = due.setHours(23, 59, 59, 999) - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
