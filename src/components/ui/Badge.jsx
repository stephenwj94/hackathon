export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-permira-navy text-permira-text-secondary',
    orange: 'bg-permira-orange/20 text-permira-orange',
    success: 'bg-permira-success/20 text-permira-success',
    danger: 'bg-permira-danger/20 text-permira-danger',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-widest ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
