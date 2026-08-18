import type { Dictionary } from "./ru";

export const en: Dictionary = {
  nav: {
    about: "About",
    services: "Services",
    works: "Works",
    aiWorks: "AI works",
    contact: "Start a project",
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
  home: {
    hero: {
      eyebrow: "Emir Semenov · independent developer",
      title: "Digital products — from idea to production.",
      description:
        "I design and ship web platforms, interfaces, and intelligent automation systems. Architecture, UX/UI, development, integrations, and deployment stay in one delivery loop.",
      primary: "View projects",
      secondary: "Discuss a project",
      signature: "Design × Engineering × AI",
      signals: [
        { label: "Web", value: "Sites, platforms, interfaces" },
        { label: "AI", value: "Assistants, RAG, agents" },
        { label: "Automation", value: "Bots, APIs, workflows" },
      ],
    },
    services: {
      label: "Services",
      title: "Not an isolated feature. A complete product.",
      intro:
        "I work at product level: understand the context, define the system, and take it through to a working launch.",
      items: [
        {
          title: "Web products",
          outcome: "Turn an idea or business problem into a clear digital interface.",
          description:
            "Landing pages, corporate sites, portfolios, web applications, dashboards, e-commerce, and custom platforms.",
        },
        {
          title: "AI systems",
          outcome: "Embed intelligence into a real process, not a decorative chat window.",
          description:
            "AI assistants, agents, RAG and knowledge bases, LLM integrations, tool calling, and controlled actions.",
        },
        {
          title: "Bots and automation",
          outcome: "Reduce manual hand-offs between messages, data, and services.",
          description:
            "Telegram, WhatsApp, VK, and web bots, CRM/API integrations, lead qualification, and internal workflows.",
        },
        {
          title: "Full-cycle development",
          outcome: "One delivery logic from the first map to production and support.",
          description:
            "Discovery, UX/UI, architecture, frontend, integrations, data, authentication flows, testing, deployment, and optimization.",
        },
      ],
    },
    work: {
      label: "Selected work",
      title: "The evidence lives in the working interface.",
      intro:
        "The cases show more than visual polish: flows, state, architecture decisions, and interaction are part of the proof.",
      disclosure:
        "Some projects are self-initiated concepts and working prototypes. They are labelled clearly and are not presented as client work.",
      openCase: "Explore the case",
      openDemo: "Open working demo",
      featuredLabel: "Competition AI project",
      featuredTitle: "CRMP · Pipeline Intelligence",
      featuredText:
        "A CRM system with the AgentP AI assistant. The project participated in an Anadolu University competition in the AI category.",
      featuredLink: "Open CRMP",
    },
    expertise: {
      label: "Expertise",
      title: "The stack is organized by problems, not logos.",
      intro:
        "Only tools and disciplines supported by current projects or the professional profile are shown.",
      groups: [
        {
          label: "Interfaces",
          title: "Frontend and product UI",
          description:
            "Component interfaces, responsive systems, complex state, and a technical SEO foundation.",
          items: ["Next.js", "React", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "MDX"],
          proof: "This portfolio and its case routes are built with Next.js, React, and TypeScript.",
        },
        {
          label: "Motion",
          title: "Motion and creative development",
          description:
            "Animation explains hierarchy, state, and transition without blocking scroll or adding needless cost.",
          items: ["Framer Motion", "GSAP", "Lenis", "Canvas 2D", "SVG", "CSS Motion"],
          proof: "FORM, AURA, NORDE, and the portfolio interactions demonstrate different motion approaches.",
        },
        {
          label: "AI systems",
          title: "AI, agents, and knowledge systems",
          description:
            "Context, retrieval, structured output, validation, and external action form one controlled loop.",
          items: ["LLM integrations", "RAG", "AI agents", "Tool calling", "Structured outputs", "Knowledge bases", "Prompt design"],
          proof: "CRMP and AI Works demonstrate pipelines, human-in-the-loop, and deterministic action boundaries.",
        },
        {
          label: "Delivery",
          title: "Backend, integrations, and production",
          description:
            "I connect the interface to APIs, data, and external services, then take the product to an observable release.",
          items: ["Python", "FastAPI", "PostgreSQL", "REST API", "Webhooks", "Authentication flows", "Git", "Vercel"],
          proof: "CRMP demonstrates the React / FastAPI / PostgreSQL stack; this portfolio deploys automatically from GitHub to Vercel.",
        },
      ],
    },
    process: {
      label: "Process",
      title: "Each stage removes uncertainty.",
      items: [
        { title: "Context", description: "Goal, audience, constraints, data, and definition of done." },
        { title: "Architecture", description: "Flows, information model, integrations, and technical boundaries." },
        { title: "UX/UI", description: "Prototype, visual system, states, and responsive behaviour." },
        { title: "Development", description: "Components, logic, API connections, data, and accessibility." },
        { title: "Validation", description: "Functional flows, devices, performance, and edge cases." },
        { title: "Launch", description: "Deployment, analytics, monitoring, and a clear handover." },
      ],
    },
    ai: {
      label: "AI and automation",
      title: "Intelligence only where it improves the decision.",
      description:
        "I design bots and AI tools with context, a knowledge layer, result validation, and safe action through an API or webhook.",
      points: ["Telegram · WhatsApp · VK · Web chat", "RAG · knowledge bases · AI agents", "CRM · API · internal processes"],
      link: "Enter the AI workshop",
    },
    profile: {
      label: "Professional profile",
      title: "I work where product, design, and engineering meet.",
      description:
        "The job is not just to write an interface. I connect the user flow, visual system, technical architecture, and launch into one maintainable product.",
      notes: ["Direct collaboration without needless layers", "Decisions are explained and documented", "Clarity, speed, and maintainability come first"],
    },
    faq: {
      label: "FAQ",
      title: "Before the first message",
      items: [
        { question: "What can I bring to you?", answer: "A new web product, a redesign of an existing interface, an AI assistant, a bot, an integration, or workflow automation." },
        { question: "Can we start without a finished specification?", answer: "Yes. A goal, audience, and current problem are enough to begin. The solution structure and project boundaries can be defined during discovery." },
        { question: "How is the stack chosen?", answer: "From product requirements, integrations, load, and maintenance needs. Technology follows architecture rather than being selected for its name." },
        { question: "How do we start?", answer: "Complete the short brief below or contact me directly via Telegram or PROFI.RU. Unconfirmed timelines and prices are not published on the site." },
      ],
    },
    contact: {
      label: "New project",
      title: "Let’s build something worth launching.",
      intro: "Describe the task briefly. The form prepares and copies a brief, then opens a direct Telegram conversation.",
      name: "Your name",
      contact: "How should I reach you?",
      type: "Project type",
      types: ["Web product", "AI / bot", "Automation", "Redesign", "Other"],
      description: "What needs to be built or improved?",
      submit: "Copy brief and open Telegram",
      success: "Brief copied. Telegram opened in a new tab.",
      fallback: "Telegram opened. If the brief was not copied, copy the field content manually.",
      direct: "Or go directly",
    },
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
      "Self-initiated concepts and working prototypes with a clear problem, decisions, stack, and interactive demo.",
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
    label: "AI Works", title: "AI embedded in the workflow",
    intro: "I design AI tools as controlled systems, with context, clear boundaries, result validation, and an action in the right service.",
    explore: "Explore the system",
    heroMeta: [
      { label: "Context", value: "Data, rules, and intent" },
      { label: "Control", value: "Validation before action" },
      { label: "Integration", value: "APIs, webhooks, and services" },
    ],
    solutions: {
      label: "Solution types", title: "From a task to a working system",
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
    featured: {
      label: "Competition project",
      competition: "Anadolu University · AI category",
      title: "CRMP — Pipeline Intelligence",
      description: "A CRM platform with the AgentP AI assistant, bringing pipeline, communication, tasks, and validated AI actions into one workspace. The project participated in an Anadolu University competition in the AI category.",
      link: "Open the project website",
      ariaLabel: "Open the CRMP competition project in a new tab",
      stack: ["React", "TypeScript", "FastAPI", "PostgreSQL", "RAG"],
      preview: {
        pipeline: "Working pipeline",
        agent: "AgentP intelligence",
        signal: "Next action validated",
        columns: ["Context", "Priority", "Action"],
      },
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
