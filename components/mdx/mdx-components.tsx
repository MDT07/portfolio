/**
 * Маппинг MDX-элементов на стилизованные компоненты по DESIGN.md.
 * Tailwind preflight сбрасывает стили — возвращаем типографику вручную.
 */
export const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="mb-4 mt-12 text-2xl font-semibold tracking-tight text-text-primary"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="mb-3 mt-8 text-xl font-semibold tracking-tight text-text-primary"
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-4 leading-relaxed text-text-secondary" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-accent underline-offset-4 transition-colors hover:text-accent-hover hover:underline"
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mb-6 list-none space-y-2.5 pl-0" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className="mb-6 list-decimal space-y-2.5 pl-5 text-text-secondary marker:font-mono marker:text-text-tertiary"
      {...props}
    />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li
      className="relative pl-5 leading-relaxed text-text-secondary before:absolute before:left-0 before:font-mono before:text-accent before:content-['—']"
      {...props}
    />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-text-primary" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="rounded border border-surface-3 bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em] text-text-primary"
      {...props}
    />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="mb-6 overflow-x-auto rounded-lg border border-surface-3 bg-surface-1 p-5 font-mono text-sm [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0"
      {...props}
    />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="mb-6 border-l-2 border-accent pl-5 italic text-text-secondary"
      {...props}
    />
  ),
  hr: () => <hr className="my-12 border-surface-3" />,
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="mb-6 w-full rounded-lg border border-surface-3"
      loading="lazy"
      {...props}
      alt={props.alt ?? ""}
    />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="mb-6 overflow-x-auto rounded-lg border border-surface-3">
      <table className="w-full text-sm" {...props} />
    </div>
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="border-b border-surface-3 bg-surface-1 px-4 py-2.5 text-left font-mono text-xs font-medium uppercase tracking-wider text-text-tertiary"
      {...props}
    />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className="border-b border-surface-3 px-4 py-2.5 text-text-secondary last:border-b-0"
      {...props}
    />
  ),
};
