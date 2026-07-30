interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({
  children,
  className = "",
  hover = true,
}: CardProps) {
  return (
    <div
      className={`rounded-lg border border-surface-3 bg-surface-1 p-6 transition-all duration-200 ${
        hover ? "hover:-translate-y-0.5 hover:border-text-tertiary" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
