/**
 * Единая конфигурация сайта.
 * Публичные контакты сайта.
 */
export const siteConfig = {
  /** Бренд портфолио */
  name: "CV Эмир Семенов [ПРОФИ.РУ]",
  domain: "emir-semenov-portfolio.vercel.app",
  url: "https://emir-semenov-portfolio.vercel.app",

  telegramUrl: "https://t.me/EMIR_000",
  profiUrl: "https://profi.ru/profile/SemenovEZ",
  crmpUrl: "https://mdt07.github.io/CRMP/",
} as const;

export type SiteConfig = typeof siteConfig;
