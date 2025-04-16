import { uk } from "./uk";
import { cs } from "./cs";
import { ru } from "./ru";

// Тип для доступных языков
export type SupportedLanguage = "uk" | "cs" | "ru";

// Структура словаря
export interface Dictionary {
  // Общие
  appName: string;
  welcome: string;
  loading: string;

  // Навигация
  nav: {
    home: string;
    profile: string;
    stats: string;
    logout: string;
    login: string;
    register: string;
    logoutSuccess: string;
    logoutSuccessMessage: string;
    logoutError: string;
  };

  // Вкладки для аналитики
  tabs: {
    timesheet: string;
    analytics: string;
    achievements: string;
    overview: string;
    productivity: string;
  };

  // Форма времени
  timeForm: {
    date: string;
    startTime: string;
    endTime: string;
    notes: string;
    hourlyRate: string;
    addEntry: string;
    editEntry: string;
    deleteEntry: string;
    didNotWork: string;
    dayOff: string;
  };

  // Профиль пользователя
  profile: {
    title: string;
    fullName: string;
    email: string;
    phone: string;
    position: string;
    workHours: string;
    breakMinutes: string;
    autoBreak: string;
    workDays: string;
    update: string;
    cancel: string;
    uploadImage: string;
    language: string;
    languageSettings: string;
    changePassword: string;
    password: {
      title: string;
      description: string;
      current: string;
      new: string;
      confirm: string;
      show: string;
      cancel: string;
      submit: string;
      saving: string;
      success: string;
      successMessage: string;
      error: string;
      errorMessage: string;
      validation: {
        currentRequired: string;
        newRequired: string;
        confirmRequired: string;
        mismatch: string;
      };
    };
  };

  // Месяцы и дни недели
  months: string[];
  weekdays: string[];
  weekdaysShort: string[];

  // Аналитика
  analytics: {
    totalHours: string;
    avgWorkday: string;
    overtime: string;
    productivity: string;
    fromPlan: string;
    workDays: string;
    ofPlan: string;
    fromLastMonth: string;
    advancedAnalytics: string;
    monthlyOverview: string;
    monthStats: string;
    timeDistribution: string;
    trends: string;
    distribution: string;
    efficiency: string;
    totalTime: string;
    workingDays: string;
    entriesCount: string;
    hoursWorked: string;
    hoursPlanned: string;
    hoursByWeekday: string;
    hoursByDaytime: string;
    morning: string;
    afternoon: string;
    evening: string;
    night: string;
    workedVsTarget: string;
    exportData: string;
  };

  // Экспорт
  export: {
    title: string;
    format: string;
    options: string;
    includeProfile: string;
    includeNotes: string;
    includeSalary: string;
    includeProjects: string;
    downloadFile: string;
    cancel: string;
  };

  // Авторизация
  auth: {
    loginTitle: string;
    registerTitle: string;
    username: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    email: string;
    login: string;
    register: string;
    switchToRegister: string;
    switchToLogin: string;
    error: string;
    validation: {
      required: string;
      tooShort: string;
      tooLong: string;
      passwordMismatch: string;
      invalidEmail: string;
    };
  };

  // Достижения
  achievements: {
    title: string;
    progress: string;
    locked: string;
    unlocked: string;
    timeMaster: string;
    consistencyChamp: string;
    efficiencyGuru: string;
    currentStreak: string;
    bestStreak: string;
    thisWeek: string;
    thisMonth: string;
  };

  // Подсказки
  tooltips: {
    timesheet: {
      title: string;
      content: string;
    };
    analytics: {
      title: string;
      content: string;
    };
    achievements: {
      title: string;
      content: string;
    };
  };
}

export const dictionaries: Record<SupportedLanguage, Dictionary> = {
  uk,
  cs,
  ru,
};

export function getLanguageName(lang: SupportedLanguage): string {
  switch (lang) {
    case "uk":
      return "Українська";
    case "cs":
      return "Čeština";
    case "ru":
      return "Русский";
    default:
      return "Українська";
  }
}
