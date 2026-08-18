export default function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1320px] px-5 md:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  );
}
