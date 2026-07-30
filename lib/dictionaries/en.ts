import type { Dictionary } from "./ru";

export const en: Dictionary = {
  nav: {
    home: "Home",
    about: "About",
    skills: "Skills",
    works: "Works",
    blog: "Blog",
    contact: "Contact",
  },
  common: {
    openDemo: "Open demo",
    allWorks: "All works",
    backToWorks: "← All works",
    backToBlog: "← All articles",
    readArticle: "Read",
    minRead: "min read",
    year: "Year",
    role: "Role",
    stack: "Stack",
    client: "Client",
    status: "Status",
    theme: "Theme",
    language: "Language",
  },
  hero: {
    label: "Frontend Developer · E-commerce",
    title: "Interfaces that sell and run like clockwork",
    subtitle:
      "I design and build fast storefronts and web apps: design systems, measurable performance, cinematic delivery — zero visual noise.",
    ctaPrimary: "View works",
    ctaSecondary: "Discuss a project",
    stats: [
      { value: "5+", label: "years in development" },
      { value: "30+", label: "projects shipped" },
      { value: "100/100", label: "Lighthouse as a norm" },
    ],
  },
  manifesto: {
    label: "Principles",
    title: "How I work",
    principles: [
      {
        number: "01",
        title: "Precision",
        description:
          "Every element in its place. Grid, typography, spacing — governed by a system, not chance.",
      },
      {
        number: "02",
        title: "Function",
        description:
          "No decoration. If an element doesn't solve a user problem — it doesn't exist.",
      },
      {
        number: "03",
        title: "Result",
        description:
          "Beauty is a consequence of sound engineering. Measurable outcomes over visual noise.",
      },
    ],
  },
  works: {
    label: "Cases",
    title: "Selected works",
    subtitle:
      "Every project is a fully working product: from architecture to the last pixel.",
    allWorks: "All works →",
  },
  about: {
    label: "About",
    title: "A developer who thinks like an engineer",
    bio: [
      "I'm a frontend developer with an engineering background. My focus is storefronts and online shops where speed and presentation directly drive revenue: catalogs, product pages, checkout, account areas.",
      "My approach is systems over one-offs: design tokens, a component library, clear conventions. This foundation lets a product scale without technical debt or rewrites.",
      "I work full-cycle: brief, prototype, design system, markup, animation, deploy, monitoring. I measure outcomes in numbers — Core Web Vitals, conversion, time to first byte.",
    ],
    facts: [
      { label: "Experience", value: "5+ years" },
      { label: "Projects", value: "30+" },
      { label: "Focus", value: "Frontend · E-commerce" },
      { label: "Format", value: "Full-cycle" },
    ],
    portraitAlt: "Developer portrait in monochrome dot-matrix stylization",
    services: {
      label: "Services",
      title: "What I do",
      items: [
        {
          title: "Company websites",
          description:
            "Fast marketing sites: project catalogs, forms, SEO foundation. The first screen sells, the rest proves.",
        },
        {
          title: "Online stores",
          description:
            "Catalog, filters, product page, cart, checkout. My core specialization — where speed equals revenue.",
        },
        {
          title: "Design systems",
          description:
            "Tokens, component libraries, documentation. Order that survives releases and team changes.",
        },
        {
          title: "Audit & performance",
          description:
            "Core Web Vitals, accessibility, technical SEO. A prioritized plan: what to fix first and why.",
        },
      ],
    },
    process: {
      label: "Process",
      title: "How the work goes",
      steps: [
        {
          title: "Brief & estimate",
          description:
            "A 30-minute call: goals, scope, constraints. Within a day — an estimate and a plan with checkpoints.",
        },
        {
          title: "Prototype",
          description:
            "Key screens and user flows before development starts. Scope fixed — no mid-project surprises.",
        },
        {
          title: "Design system",
          description:
            "Tokens, components, states. The foundation that makes development fast and predictable.",
        },
        {
          title: "Development",
          description:
            "Markup, animation, integrations. A demo every week — progress you can see, not hear about.",
        },
        {
          title: "Launch & metrics",
          description:
            "Deploy, monitoring, Web Vitals. Two weeks after release — a numbers report.",
        },
      ],
    },
  },
  cta: {
    title: "Have a project? Let's talk.",
    subtitle:
      "I reply within one business day. A 30-minute call — and you have an estimate, timeline, and plan.",
    button: "Get in touch",
  },
  skills: {
    label: "Skills",
    title: "Technologies and tools",
    subtitle: "The stack I use daily for production work.",
    groups: [
      {
        domain: "Frontend",
        items: [
          "React",
          "Next.js",
          "TypeScript",
          "Tailwind CSS",
          "Framer Motion",
          "CSS 3D / View Transitions",
        ],
      },
      {
        domain: "E-commerce",
        items: [
          "Catalogs & filters",
          "Product pages",
          "Checkout",
          "Storefront SEO",
          "Web Vitals",
          "A/B testing",
        ],
      },
      {
        domain: "Backend & Data",
        items: ["Node.js", "PostgreSQL", "REST API", "GraphQL", "Prisma", "Redis"],
      },
      {
        domain: "Tools",
        items: ["Figma", "Design Systems", "Docker", "Vercel", "Git", "Accessibility"],
      },
    ],
  },
  contact: {
    label: "Contact",
    title: "Let's discuss your project",
    subtitle: "Tell me about the task — I'll propose a solution, timeline, and cost.",
    availability: "Open for new projects · I reply within one business day",
    emailLabel: "Email",
    telegramLabel: "Telegram",
    githubLabel: "GitHub",
    form: {
      name: "Your name",
      email: "Email",
      message: "Describe your project",
      submit: "Send",
      sending: "Sending…",
      successTitle: "Message sent",
      successText: "I'll reply within one business day.",
      errorTitle: "Failed to send",
      errorText: "Please try again or email me directly.",
    },
  },
  footer: {
    tagline: "Engineering approach to web development",
    rights: "Made with precision",
  },
  blog: {
    label: "Blog",
    title: "Engineering notes",
    subtitle: "Breakdowns of decisions, patterns and performance work from real projects.",
    empty: "No articles yet — coming soon.",
  },
};
