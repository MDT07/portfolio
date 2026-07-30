interface TagProps {
  children: React.ReactNode;
  accent?: boolean;
}

export default function Tag({ children, accent = false }: TagProps) {
  return (
    <span
      className={`inline-block rounded border px-2 py-0.5 font-mono text-xs font-medium ${
        accent
          ? "border-accent bg-accent-subtle text-accent"
          : "border-surface-3 bg-surface-2 text-text-secondary"
      }`}
    >
      {children}
    </span>
  );
}
