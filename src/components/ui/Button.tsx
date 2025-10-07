import Link from "next/link";

type Variant = "primary" | "secondary" | "neutral";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}

const base =
  "inline-flex items-center justify-center text-center rounded-xl px-6 py-3 font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";
const variants: Record<Variant, string> = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md focus:ring-indigo-500",
  secondary:
    "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm hover:shadow-md focus:ring-slate-400",
  neutral:
    "bg-slate-800 text-white hover:bg-slate-900 shadow-sm hover:shadow-md focus:ring-slate-600",
};

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
