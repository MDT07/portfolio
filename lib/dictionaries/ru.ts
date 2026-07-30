export const ru = {
  nav: {
    home: "Главная",
    about: "Обо мне",
    skills: "Скиллы",
    works: "Работы",
    blog: "Блог",
    contact: "Контакты",
  },
  common: {
    openDemo: "Открыть демо",
    allWorks: "Все работы",
    backToWorks: "← Все работы",
    backToBlog: "← Все статьи",
    readArticle: "Читать",
    minRead: "мин чтения",
    year: "Год",
    role: "Роль",
    stack: "Стек",
    client: "Клиент",
    status: "Статус",
    theme: "Тема",
    language: "Язык",
  },
  hero: {
    label: "Frontend Developer · E-commerce",
    title: "Интерфейсы, которые продают и работают как часы",
    subtitle:
      "Проектирую и собираю быстрые витрины и веб-приложения: дизайн-системы, измеримая производительность, кинематографичная подача — без визуального шума.",
    ctaPrimary: "Смотреть работы",
    ctaSecondary: "Обсудить проект",
    stats: [
      { value: "5+", label: "лет в разработке" },
      { value: "30+", label: "проектов запущено" },
      { value: "100/100", label: "Lighthouse как норма" },
    ],
  },
  manifesto: {
    label: "Принципы",
    title: "Как я работаю",
    principles: [
      {
        number: "01",
        title: "Точность",
        description:
          "Каждый элемент на своём месте. Сетка, типографика, отступы — всё подчинено системе, а не случайности.",
      },
      {
        number: "02",
        title: "Функция",
        description:
          "Никакой декоративности. Если элемент не решает задачу пользователя — он не существует.",
      },
      {
        number: "03",
        title: "Результат",
        description:
          "Красота — следствие правильной инженерии. Измеримый результат важнее визуального шума.",
      },
    ],
  },
  works: {
    label: "Кейсы",
    title: "Избранные работы",
    subtitle:
      "Каждый проект — полностью рабочий продукт: от архитектуры до последнего пикселя.",
    allWorks: "Все работы →",
  },
  about: {
    label: "Обо мне",
    title: "Разработчик, который думает как инженер",
    bio: [
      "Я — frontend-разработчик с инженерным бэкграундом. Специализация — витрины и интернет-магазины, где скорость и подача напрямую влияют на выручку: каталоги, карточки товара, чекаут, личный кабинет.",
      "Мой подход — система вместо разовых решений: дизайн-токены, компонентная библиотека, чёткие конвенции. Такой фундамент позволяет масштабировать продукт без технического долга и переделываний.",
      "Работаю полным циклом: бриф, прототип, дизайн-система, вёрстка, анимация, деплой, мониторинг. Измеряю результат в цифрах — Core Web Vitals, конверсия, время до первого байта.",
    ],
    facts: [
      { label: "Опыт", value: "5+ лет" },
      { label: "Проектов", value: "30+" },
      { label: "Фокус", value: "Frontend · E-commerce" },
      { label: "Формат", value: "Full-cycle" },
    ],
    portraitAlt: "Портрет разработчика в точечной монохромной стилизации",
  },
  skills: {
    label: "Скиллы",
    title: "Технологии и инструменты",
    subtitle: "Стек, который я использую ежедневно для production-решений.",
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
          "Каталоги и фильтры",
          "Карточка товара",
          "Чекаут",
          "SEO для магазинов",
          "Web Vitals",
          "A/B-тесты",
        ],
      },
      {
        domain: "Backend & Data",
        items: ["Node.js", "PostgreSQL", "REST API", "GraphQL", "Prisma", "Redis"],
      },
      {
        domain: "Инструменты",
        items: ["Figma", "Design Systems", "Docker", "Vercel", "Git", "Accessibility"],
      },
    ],
  },
  contact: {
    label: "Контакты",
    title: "Обсудим ваш проект",
    subtitle: "Расскажите о задаче — предложу решение, сроки и стоимость.",
    emailLabel: "Email",
    telegramLabel: "Telegram",
    githubLabel: "GitHub",
    form: {
      name: "Ваше имя",
      email: "Email",
      message: "Опишите ваш проект",
      submit: "Отправить",
      sending: "Отправка…",
      successTitle: "Сообщение отправлено",
      successText: "Отвечу в течение рабочего дня.",
      errorTitle: "Не удалось отправить",
      errorText: "Попробуйте ещё раз или напишите напрямую на email.",
    },
  },
  footer: {
    tagline: "Инженерный подход к веб-разработке",
    rights: "Сделано с точностью",
  },
  blog: {
    label: "Блог",
    title: "Заметки о разработке",
    subtitle: "Разборы решений, паттернов и производительности из реальных проектов.",
    empty: "Статей пока нет — скоро появятся.",
  },
} as const;

/** Расширяет все литеральные строки до string, сохраняя структуру словаря */
type DeepString<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? DeepString<U>[]
    : { [K in keyof T]: DeepString<T[K]> };

export type Dictionary = DeepString<typeof ru>;
