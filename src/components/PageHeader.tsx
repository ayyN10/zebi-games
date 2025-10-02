interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function PageHeader({ title, subtitle, className = "" }: PageHeaderProps) {
  return (
    <header className={`text-center space-y-3 ${className}`}>
      <h1 className="text-4xl font-bold tracking-tight text-slate-900">{title}</h1>
      {subtitle ? <p className="text-slate-600">{subtitle}</p> : null}
    </header>
  );
}
