/**
 * Единая конфигурация сайта.
 * Все контакты — заглушки: заменить значения здесь, и они обновятся везде.
 */
export const siteConfig = {
  /** Бренд портфолио */
  name: "dev.developer",
  /** Домен-заглушка (заменить при появлении своего) */
  domain: "dev-developer.vercel.app",
  url: "https://dev-developer.vercel.app",

  /** Контакты (заглушки) */
  email: "hello@dev-developer.dev",
  telegramHandle: "@dev_developer",
  telegramUrl: "https://t.me/dev_developer",
  githubHandle: "dev-developer",
  githubUrl: "https://github.com/dev-developer",
  linkedinUrl: "https://www.linkedin.com/in/dev-developer",

  /** Formspree endpoint для формы контактов (заглушка) */
  formspreeEndpoint: "https://formspree.io/f/FORM_ID",
} as const;

export type SiteConfig = typeof siteConfig;
