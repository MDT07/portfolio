import type { Dictionary } from "./ru";

export const en: Dictionary = {
  nav: {
    about: "About",
    works: "Works",
    aiWorks: "AI works",
  },
  common: {
    openDemo: "Open demo",
    allWorks: "All works",
    backToWorks: "← All works",
    year: "Year",
    role: "Role",
    stack: "Stack",
    client: "Client",
    status: "Status",
    theme: "Theme",
    language: "Language",
    sound: "Sound",
    aiWorksFrame: "Interactive AI Works page",
  },
  hero: {
    label: "Web developer · AI bots",
    titleLines: ["Web projects", "and AI bots", "for specific tasks"],
    subtitle:
      "I build responsive web projects and AI-powered bots, from interface and scenario design to API integrations and webhook actions.",
    ctaPrimary: "View works",
    ctaSecondary: "Message on Telegram",
    scroll: "Scroll",
    marquee: [
      "Frontend",
      "E-commerce",
      "Design Systems",
      "Performance",
      "TypeScript",
      "Accessibility",
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
    title: "Web developer · AI bots",
    intro: "I build responsive web projects and AI-powered bots, from interface and scenario design to API integrations and webhook actions.",
    directions: {
      label: "Focus areas", title: "What I can build",
      items: [
        { title: "Web", description: "Websites and interfaces with clear structure, careful responsive behaviour, and considered user flows." },
        { title: "AI", description: "AI bots and assistants for search, response drafts, document work, and internal knowledge." },
        { title: "Integrations", description: "Connections between services, APIs, and workflows with clear rules and validation." },
      ],
    },
    stack: { label: "Web stack", items: ["Next.js", "React", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind CSS", "Framer Motion", "GSAP", "Canvas 2D", "MDX", "Git", "Vercel"] },
    skills: { label: "Skills", items: ["Responsive development", "Components and design systems", "Animation", "APIs and webhooks", "Performance", "Accessibility", "Technical SEO"] },
    approach: {
      label: "Approach", title: "A clear task needs a clear system",
      description: "I start with context and the user flow, then define the interface, data, and working rules. The result should be useful for people and maintainable for the team.",
    },
    worksLink: "View works",
    contacts: { label: "Contacts", telegram: "Message on Telegram", profi: "Profile on Profi.ru" },
  },
  aiWorks: {
    label: "AI Works", title: "A light AI workshop",
    intro: "I design calm, understandable AI tools for real work — from the first request to a validated action.",
    solutions: {
      label: "Solution types", title: "What we can build",
      items: [
        { title: "AI bots", description: "Conversational assistants for a team, customers, or an internal knowledge base." },
        { title: "Document work", description: "Search, review, and prepare materials with a required result check." },
        { title: "Automation", description: "Connected scenarios between services where AI supports one controlled step." },
      ],
    },
    process: {
      label: "Process", title: "A deterministic loop",
      steps: [
        { label: "Request", description: "The user's request and goal." }, { label: "Context", description: "The needed data, rules, and boundaries." }, { label: "AI core", description: "Task processing within the scenario." }, { label: "Validation", description: "A result check before continuing." }, { label: "Action", description: "A clear action in the selected service." },
      ],
    },
    scenarios: {
      label: "Scenarios", title: "Examples of a local process",
      items: [
        { title: "Reviewing an incoming request", description: "The assistant gathers request details, checks them against the rules, and prepares a response draft.", steps: ["Request", "Context", "Draft", "Validation", "Response"] },
        { title: "Navigating knowledge", description: "A team asks a question; the tool finds relevant material and shows it alongside the answer.", steps: ["Question", "Materials", "Summary", "Validation", "Source"] },
        { title: "Preparing a task", description: "A message becomes a structured task draft for a person to review before it is created.", steps: ["Message", "Fields", "Draft", "Review", "Task"] },
      ],
    },
    principles: { label: "Principles", items: ["Context over guesses", "Validate before acting", "A person stays in the loop", "The tool explains the next step"] },
    cta: { title: "Discuss an AI scenario", subtitle: "Describe the task and we can identify where AI will genuinely help.", telegram: "Message on Telegram", profi: "Open Profi.ru" },
  },
  cta: {
    title: "Have a task? Let's talk.",
    subtitle:
      "Describe the task and we can choose a suitable format for a web project or AI integration.",
    button: "Message on Telegram",
  },
  footer: {
    tagline: "Engineering approach to web development",
    rights: "Made with precision",
  },
  lab: "Experiments",
  tech: "Technology",
};
