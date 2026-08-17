/**
 * Единая конфигурация сайта.
 * Публичные контакты сайта.
 */
export const siteConfig = {
  /** Бренд портфолио */
  name: "CV Эмир Семенов [ПРОФИ.РУ]",
  domain: "dev-developer.vercel.app",
  url: "https://dev-developer.vercel.app",

  telegramUrl: "https://t.me/EMIR_000",
  profiUrl: "https://profi.ru/profile/SemenovEZ",
} as const;

export type SiteConfig = typeof siteConfig;
