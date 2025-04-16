import { Dictionary } from "./index";

export const uk: Dictionary = {
  // Общие
  appName: "TimeTrackPro",
  welcome: "Ласкаво просимо",
  loading: "Завантаження...",

  // Навигация
  nav: {
    home: "Головна",
    profile: "Профіль",
    stats: "Статистика",
    logout: "Вийти",
    login: "Увійти",
    register: "Реєстрація",
    logoutSuccess: "Вихід виконано",
    logoutSuccessMessage: "Ви успішно вийшли з системи",
    logoutError: "Не вдалось вийти з системи",
  },

  // Вкладки для аналитики
  tabs: {
    timesheet: "Час",
    analytics: "Аналітика",
    achievements: "Досягнення",
    overview: "Огляд",
    productivity: "Продуктивність",
  },

  // Форма времени
  timeForm: {
    date: "Дата",
    startTime: "Час початку",
    endTime: "Час закінчення",
    notes: "Примітки",
    hourlyRate: "Погодинна ставка",
    addEntry: "Додати запис",
    editEntry: "Редагувати запис",
    deleteEntry: "Видалити запис",
    didNotWork: "Не вийшов на роботу",
    dayOff: "Вихідний",
  },

  // Профиль пользователя
  profile: {
    title: "Профіль користувача",
    fullName: "Повне ім'я",
    email: "Email",
    phone: "Телефон",
    position: "Посада",
    workHours: "Робочих годин на день",
    breakMinutes: "Хвилин перерви",
    autoBreak: "Автоматична перерва",
    workDays: "Робочі дні",
    update: "Оновити",
    cancel: "Скасувати",
    uploadImage: "Завантажити фото",
    language: "Мова",
    languageSettings: "Налаштування мови",
    changePassword: "Змінити пароль",
    password: {
      title: "Зміна пароля",
      description: "Введіть ваш поточний пароль і новий пароль для зміни",
      current: "Поточний пароль",
      new: "Новий пароль",
      confirm: "Підтвердіть новий пароль",
      show: "Показати паролі",
      cancel: "Скасувати",
      submit: "Змінити пароль",
      saving: "Збереження...",
      success: "Пароль змінено",
      successMessage: "Ваш пароль успішно оновлено",
      error: "Помилка",
      errorMessage: "Не вдалось змінити пароль: ",
      validation: {
        currentRequired: "Поточний пароль є обов'язковим",
        newRequired: "Новий пароль повинен містити щонайменше 6 символів",
        confirmRequired: "Підтвердження пароля є обов'язковим",
        mismatch: "Паролі не співпадають",
      },
    },
  },

  // Месяцы и дни недели
  months: [
    "Січень",
    "Лютий",
    "Березень",
    "Квітень",
    "Травень",
    "Червень",
    "Липень",
    "Серпень",
    "Вересень",
    "Жовтень",
    "Листопад",
    "Грудень",
  ],
  weekdays: [
    "Понеділок",
    "Вівторок",
    "Середа",
    "Четвер",
    "П'ятниця",
    "Субота",
    "Неділя",
  ],
  weekdaysShort: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"],

  // Аналитика
  analytics: {
    totalHours: "Загальні години",
    avgWorkday: "Середній робочий день",
    overtime: "Понаднормові",
    productivity: "Продуктивність",
    fromPlan: "від плану",
    workDays: "Робочі дні",
    ofPlan: "від плану",
    fromLastMonth: "від минулого місяця",
    advancedAnalytics: "Розширена аналітика",
    monthlyOverview: "Помісячний огляд",
    monthStats: "Статистика місяця",
    timeDistribution: "Розподіл робочого часу",
    trends: "Тренди",
    distribution: "Розподіл",
    efficiency: "Ефективність",
    totalTime: "Загальний час",
    workingDays: "Робочих днів",
    entriesCount: "Кількість записів",
    hoursWorked: "Відпрацьовано годин",
    hoursPlanned: "Заплановано годин",
    hoursByWeekday: "Години за днями тижня",
    hoursByDaytime: "Години за часом доби",
    morning: "Ранок (6-12)",
    afternoon: "День (12-18)",
    evening: "Вечір (18-22)",
    night: "Ніч (22-6)",
    workedVsTarget: "Відпрацьовано / Заплановано",
    exportData: "Експортувати",
  },

  // Экспорт
  export: {
    title: "Експорт даних",
    format: "Формат файлу",
    options: "Опції",
    includeProfile: "Включити дані профілю",
    includeNotes: "Включити примітки",
    includeSalary: "Включити дані про оплату",
    includeProjects: "Включити дані про проекти",
    downloadFile: "Завантажити файл",
    cancel: "Скасувати",
  },

  // Авторизация
  auth: {
    loginTitle: "Вхід до системи",
    registerTitle: "Реєстрація",
    username: "Ім'я користувача",
    password: "Пароль",
    confirmPassword: "Підтвердження паролю",
    fullName: "Повне ім'я",
    email: "Email",
    login: "Увійти",
    register: "Зареєструватися",
    switchToRegister: "Створити обліковий запис",
    switchToLogin: "Вже маєте обліковий запис? Увійти",
    error: "Помилка",
    validation: {
      required: "Це поле обов'язкове",
      tooShort: "Занадто короткий текст",
      tooLong: "Занадто довгий текст",
      passwordMismatch: "Паролі не співпадають",
      invalidEmail: "Неправильний формат email",
    },
  },

  // Достижения
  achievements: {
    title: "Досягнення",
    progress: "Прогрес",
    locked: "Заблоковано",
    unlocked: "Розблоковано",
    timeMaster: "Майстер часу",
    consistencyChamp: "Чемпіон стабільності",
    efficiencyGuru: "Гуру ефективності",
    currentStreak: "Поточна серія",
    bestStreak: "Найкраща серія",
    thisWeek: "Цього тижня",
    thisMonth: "Цього місяця",
  },

  // Подсказки
  tooltips: {
    timesheet: {
      title: "Таблиця робочого часу",
      content:
        "Тут ви можете бачити та керувати своїми записами про робочий час",
    },
    analytics: {
      title: "Аналітика",
      content: "Детальний огляд вашої продуктивності та статистики роботи",
    },
    achievements: {
      title: "Досягнення",
      content: "Ваші робочі досягнення та рівень продуктивності",
    },
  },
};
