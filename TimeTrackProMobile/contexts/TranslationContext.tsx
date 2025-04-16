import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

// Translation type for IntelliSense
type Translation = {
  [key: string]: string | Translation;
};

// Available languages
export type SupportedLanguage = 'uk' | 'ru' | 'cs';

// Ukrainian translations
const uk: Translation = {
  common: {
    appName: 'TimeTrackPro',
    loading: 'Завантаження...',
    save: 'Зберегти',
    cancel: 'Скасувати',
    delete: 'Видалити',
    edit: 'Редагувати',
    back: 'Назад',
    next: 'Далі',
    yes: 'Так',
    no: 'Ні',
  },
  navigation: {
    timeEntries: 'Записи',
    analytics: 'Аналітика',
    reports: 'Звіти',
    settings: 'Налаштування',
  },
  auth: {
    login: 'Увійти',
    register: 'Зареєструватися',
    username: 'Ім\'я користувача',
    password: 'Пароль',
    confirmPassword: 'Підтвердити пароль',
    fullName: 'Повне ім\'я',
    email: 'Електронна пошта',
    phone: 'Телефон',
    position: 'Посада',
    forgotPassword: 'Забули пароль?',
    logout: 'Вийти',
    loginTitle: 'Вхід до системи',
    registerTitle: 'Створення нового облікового запису',
    invalidCredentials: 'Неправильне ім\'я користувача або пароль',
    usernameTaken: 'Ім\'я користувача вже зайняте',
    passwordMismatch: 'Паролі не збігаються',
  },
  timeEntries: {
    title: 'Записи часу',
    newEntry: 'Новий запис',
    date: 'Дата',
    startTime: 'Час початку',
    endTime: 'Час закінчення',
    hourlyRate: 'Погодинна ставка',
    notes: 'Нотатки',
    moodRating: 'Настрій',
    energyLevel: 'Рівень енергії',
    duration: 'Тривалість',
    earnings: 'Заробіток',
    noEntries: 'Немає записів для відображення',
    addEntry: 'Додати запис',
    editEntry: 'Редагувати запис',
    deleteEntry: 'Видалити запис',
    dayOff: 'Вихідний день',
    sickDay: 'Лікарняний',
    vacation: 'Відпустка',
    deleteConfirm: 'Ви впевнені, що хочете видалити цей запис?',
  },
  reports: {
    title: 'Звіти',
    monthlyReport: 'Місячний звіт',
    totalHours: 'Загальні години',
    targetHours: 'Цільові години',
    difference: 'Різниця',
    workDays: 'Робочі дні',
    daysWorked: 'Відпрацьовані дні',
    averagePerDay: 'Середнє за день',
    totalEarnings: 'Загальний заробіток',
    month: 'Місяць',
    year: 'Рік',
    selectMonth: 'Виберіть місяць',
    selectYear: 'Виберіть рік',
    export: 'Експорт',
    exportPDF: 'Експорт у PDF',
    exportExcel: 'Експорт в Excel',
    noData: 'Немає даних для відображення',
  },
  settings: {
    title: 'Налаштування',
    profile: 'Профіль',
    preferences: 'Параметри',
    language: 'Мова',
    theme: 'Тема',
    workHoursPerDay: 'Робочих годин на день',
    breakMinutes: 'Тривалість перерви (хв)',
    autoBreak: 'Автоматична перерва',
    workDays: 'Робочі дні',
    monday: 'Понеділок',
    tuesday: 'Вівторок',
    wednesday: 'Середа',
    thursday: 'Четвер',
    friday: 'П\'ятниця',
    saturday: 'Субота',
    sunday: 'Неділя',
    darkMode: 'Темний режим',
    lightMode: 'Світлий режим',
    systemMode: 'Системний режим',
    saveSuccess: 'Налаштування збережено',
  },
  analytics: {
    title: 'Аналітика',
    overview: 'Огляд',
    trends: 'Тренди',
    moodAnalysis: 'Аналіз настрою',
    energyAnalysis: 'Аналіз енергії',
    averageMood: 'Середній настрій',
    averageEnergy: 'Середня енергія',
    hoursDistribution: 'Розподіл годин',
    earningsDistribution: 'Розподіл заробітку',
    noData: 'Недостатньо даних для аналізу',
    advancedAnalytics: 'Розширена аналітика',
  },
  months: {
    1: 'Січень',
    2: 'Лютий',
    3: 'Березень',
    4: 'Квітень',
    5: 'Травень',
    6: 'Червень',
    7: 'Липень',
    8: 'Серпень',
    9: 'Вересень',
    10: 'Жовтень',
    11: 'Листопад',
    12: 'Грудень',
  },
  weekdays: {
    short: {
      0: 'Нд',
      1: 'Пн',
      2: 'Вт',
      3: 'Ср',
      4: 'Чт',
      5: 'Пт',
      6: 'Сб',
    },
    long: {
      0: 'Неділя',
      1: 'Понеділок',
      2: 'Вівторок',
      3: 'Середа',
      4: 'Четвер',
      5: 'П\'ятниця',
      6: 'Субота',
    },
  },
  errors: {
    generic: 'Сталася помилка',
    network: 'Помилка мережі',
    required: 'Це поле обов\'язкове',
    invalidDate: 'Неправильна дата',
    invalidTime: 'Неправильний час',
    endBeforeStart: 'Час закінчення не може бути раніше часу початку',
    sessionExpired: 'Сеанс закінчився. Будь ласка, увійдіть знову',
  },
};

// Russian translations
const ru: Translation = {
  common: {
    appName: 'TimeTrackPro',
    loading: 'Загрузка...',
    save: 'Сохранить',
    cancel: 'Отмена',
    delete: 'Удалить',
    edit: 'Редактировать',
    back: 'Назад',
    next: 'Далее',
    yes: 'Да',
    no: 'Нет',
  },
  navigation: {
    timeEntries: 'Записи',
    analytics: 'Аналитика',
    reports: 'Отчеты',
    settings: 'Настройки',
  },
  auth: {
    login: 'Войти',
    register: 'Зарегистрироваться',
    username: 'Имя пользователя',
    password: 'Пароль',
    confirmPassword: 'Подтвердить пароль',
    fullName: 'Полное имя',
    email: 'Электронная почта',
    phone: 'Телефон',
    position: 'Должность',
    forgotPassword: 'Забыли пароль?',
    logout: 'Выйти',
    loginTitle: 'Вход в систему',
    registerTitle: 'Создание новой учетной записи',
    invalidCredentials: 'Неправильное имя пользователя или пароль',
    usernameTaken: 'Имя пользователя уже занято',
    passwordMismatch: 'Пароли не совпадают',
  },
  timeEntries: {
    title: 'Записи времени',
    newEntry: 'Новая запись',
    date: 'Дата',
    startTime: 'Время начала',
    endTime: 'Время окончания',
    hourlyRate: 'Почасовая ставка',
    notes: 'Заметки',
    moodRating: 'Настроение',
    energyLevel: 'Уровень энергии',
    duration: 'Продолжительность',
    earnings: 'Заработок',
    noEntries: 'Нет записей для отображения',
    addEntry: 'Добавить запись',
    editEntry: 'Редактировать запись',
    deleteEntry: 'Удалить запись',
    dayOff: 'Выходной день',
    sickDay: 'Больничный',
    vacation: 'Отпуск',
    deleteConfirm: 'Вы уверены, что хотите удалить эту запись?',
  },
  reports: {
    title: 'Отчеты',
    monthlyReport: 'Месячный отчет',
    totalHours: 'Общие часы',
    targetHours: 'Целевые часы',
    difference: 'Разница',
    workDays: 'Рабочие дни',
    daysWorked: 'Отработанные дни',
    averagePerDay: 'Среднее за день',
    totalEarnings: 'Общий заработок',
    month: 'Месяц',
    year: 'Год',
    selectMonth: 'Выберите месяц',
    selectYear: 'Выберите год',
    export: 'Экспорт',
    exportPDF: 'Экспорт в PDF',
    exportExcel: 'Экспорт в Excel',
    noData: 'Нет данных для отображения',
  },
  settings: {
    title: 'Настройки',
    profile: 'Профиль',
    preferences: 'Параметры',
    language: 'Язык',
    theme: 'Тема',
    workHoursPerDay: 'Рабочих часов в день',
    breakMinutes: 'Продолжительность перерыва (мин)',
    autoBreak: 'Автоматический перерыв',
    workDays: 'Рабочие дни',
    monday: 'Понедельник',
    tuesday: 'Вторник',
    wednesday: 'Среда',
    thursday: 'Четверг',
    friday: 'Пятница',
    saturday: 'Суббота',
    sunday: 'Воскресенье',
    darkMode: 'Темный режим',
    lightMode: 'Светлый режим',
    systemMode: 'Системный режим',
    saveSuccess: 'Настройки сохранены',
  },
  analytics: {
    title: 'Аналитика',
    overview: 'Обзор',
    trends: 'Тренды',
    moodAnalysis: 'Анализ настроения',
    energyAnalysis: 'Анализ энергии',
    averageMood: 'Среднее настроение',
    averageEnergy: 'Средняя энергия',
    hoursDistribution: 'Распределение часов',
    earningsDistribution: 'Распределение заработка',
    noData: 'Недостаточно данных для анализа',
    advancedAnalytics: 'Расширенная аналитика',
  },
  months: {
    1: 'Январь',
    2: 'Февраль',
    3: 'Март',
    4: 'Апрель',
    5: 'Май',
    6: 'Июнь',
    7: 'Июль',
    8: 'Август',
    9: 'Сентябрь',
    10: 'Октябрь',
    11: 'Ноябрь',
    12: 'Декабрь',
  },
  weekdays: {
    short: {
      0: 'Вс',
      1: 'Пн',
      2: 'Вт',
      3: 'Ср',
      4: 'Чт',
      5: 'Пт',
      6: 'Сб',
    },
    long: {
      0: 'Воскресенье',
      1: 'Понедельник',
      2: 'Вторник',
      3: 'Среда',
      4: 'Четверг',
      5: 'Пятница',
      6: 'Суббота',
    },
  },
  errors: {
    generic: 'Произошла ошибка',
    network: 'Ошибка сети',
    required: 'Это поле обязательно',
    invalidDate: 'Неправильная дата',
    invalidTime: 'Неправильное время',
    endBeforeStart: 'Время окончания не может быть раньше времени начала',
    sessionExpired: 'Сеанс истек. Пожалуйста, войдите снова',
  },
};

// Czech translations
const cs: Translation = {
  common: {
    appName: 'TimeTrackPro',
    loading: 'Načítání...',
    save: 'Uložit',
    cancel: 'Zrušit',
    delete: 'Smazat',
    edit: 'Upravit',
    back: 'Zpět',
    next: 'Další',
    yes: 'Ano',
    no: 'Ne',
  },
  navigation: {
    timeEntries: 'Záznamy',
    analytics: 'Analytika',
    reports: 'Přehledy',
    settings: 'Nastavení',
  },
  auth: {
    login: 'Přihlásit se',
    register: 'Registrovat se',
    username: 'Uživatelské jméno',
    password: 'Heslo',
    confirmPassword: 'Potvrdit heslo',
    fullName: 'Celé jméno',
    email: 'E-mail',
    phone: 'Telefon',
    position: 'Pozice',
    forgotPassword: 'Zapomněli jste heslo?',
    logout: 'Odhlásit se',
    loginTitle: 'Přihlášení do systému',
    registerTitle: 'Vytvoření nového účtu',
    invalidCredentials: 'Nesprávné uživatelské jméno nebo heslo',
    usernameTaken: 'Uživatelské jméno je již obsazeno',
    passwordMismatch: 'Hesla se neshodují',
  },
  timeEntries: {
    title: 'Záznamy času',
    newEntry: 'Nový záznam',
    date: 'Datum',
    startTime: 'Čas začátku',
    endTime: 'Čas konce',
    hourlyRate: 'Hodinová sazba',
    notes: 'Poznámky',
    moodRating: 'Nálada',
    energyLevel: 'Úroveň energie',
    duration: 'Trvání',
    earnings: 'Výdělek',
    noEntries: 'Žádné záznamy k zobrazení',
    addEntry: 'Přidat záznam',
    editEntry: 'Upravit záznam',
    deleteEntry: 'Smazat záznam',
    dayOff: 'Volný den',
    sickDay: 'Nemocenská',
    vacation: 'Dovolená',
    deleteConfirm: 'Opravdu chcete smazat tento záznam?',
  },
  reports: {
    title: 'Přehledy',
    monthlyReport: 'Měsíční přehled',
    totalHours: 'Celkové hodiny',
    targetHours: 'Cílové hodiny',
    difference: 'Rozdíl',
    workDays: 'Pracovní dny',
    daysWorked: 'Odpracované dny',
    averagePerDay: 'Průměr za den',
    totalEarnings: 'Celkový výdělek',
    month: 'Měsíc',
    year: 'Rok',
    selectMonth: 'Vyberte měsíc',
    selectYear: 'Vyberte rok',
    export: 'Export',
    exportPDF: 'Export do PDF',
    exportExcel: 'Export do Excelu',
    noData: 'Žádná data k zobrazení',
  },
  settings: {
    title: 'Nastavení',
    profile: 'Profil',
    preferences: 'Předvolby',
    language: 'Jazyk',
    theme: 'Téma',
    workHoursPerDay: 'Pracovních hodin za den',
    breakMinutes: 'Délka přestávky (min)',
    autoBreak: 'Automatická přestávka',
    workDays: 'Pracovní dny',
    monday: 'Pondělí',
    tuesday: 'Úterý',
    wednesday: 'Středa',
    thursday: 'Čtvrtek',
    friday: 'Pátek',
    saturday: 'Sobota',
    sunday: 'Neděle',
    darkMode: 'Tmavý režim',
    lightMode: 'Světlý režim',
    systemMode: 'Systémový režim',
    saveSuccess: 'Nastavení uloženo',
  },
  analytics: {
    title: 'Analytika',
    overview: 'Přehled',
    trends: 'Trendy',
    moodAnalysis: 'Analýza nálady',
    energyAnalysis: 'Analýza energie',
    averageMood: 'Průměrná nálada',
    averageEnergy: 'Průměrná energie',
    hoursDistribution: 'Rozložení hodin',
    earningsDistribution: 'Rozložení výdělku',
    noData: 'Nedostatek dat pro analýzu',
    advancedAnalytics: 'Pokročilá analytika',
  },
  months: {
    1: 'Leden',
    2: 'Únor',
    3: 'Březen',
    4: 'Duben',
    5: 'Květen',
    6: 'Červen',
    7: 'Červenec',
    8: 'Srpen',
    9: 'Září',
    10: 'Říjen',
    11: 'Listopad',
    12: 'Prosinec',
  },
  weekdays: {
    short: {
      0: 'Ne',
      1: 'Po',
      2: 'Út',
      3: 'St',
      4: 'Čt',
      5: 'Pá',
      6: 'So',
    },
    long: {
      0: 'Neděle',
      1: 'Pondělí',
      2: 'Úterý',
      3: 'Středa',
      4: 'Čtvrtek',
      5: 'Pátek',
      6: 'Sobota',
    },
  },
  errors: {
    generic: 'Došlo k chybě',
    network: 'Chyba sítě',
    required: 'Toto pole je povinné',
    invalidDate: 'Neplatné datum',
    invalidTime: 'Neplatný čas',
    endBeforeStart: 'Čas konce nemůže být dříve než čas začátku',
    sessionExpired: 'Relace vypršela. Prosím, přihlaste se znovu',
  },
};

// All available translations
const translations = {
  uk,
  ru,
  cs,
};

// Type for translation context
interface TranslationContextType {
  t: (key: string) => string;
  currentLanguage: SupportedLanguage;
  changeLanguage: (lang: SupportedLanguage) => void;
  availableLanguages: { code: SupportedLanguage; name: string }[];
}

// Create i18n instance
const i18n = new I18n(translations);

// Create context
const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Get device language or default to Ukrainian
const getDeviceLanguage = (): SupportedLanguage => {
  const deviceLang = Localization.locale.split('-')[0];
  return (deviceLang as SupportedLanguage) in translations 
    ? (deviceLang as SupportedLanguage)
    : 'uk';
};

// Available language options
const availableLanguages = [
  { code: 'uk' as SupportedLanguage, name: 'Українська' },
  { code: 'ru' as SupportedLanguage, name: 'Русский' },
  { code: 'cs' as SupportedLanguage, name: 'Čeština' },
];

// Provider component
export function TranslationProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(getDeviceLanguage());
  
  // Set the language for i18n
  i18n.locale = currentLanguage;
  
  // Function to change language
  const changeLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    i18n.locale = lang;
    // In a real app, save language preference to AsyncStorage
  };
  
  // Translation function
  const t = (key: string): string => {
    return i18n.t(key);
  };
  
  return (
    <TranslationContext.Provider 
      value={{ 
        t, 
        currentLanguage, 
        changeLanguage,
        availableLanguages,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

// Hook to use translations in components
export function useTranslations() {
  const context = useContext(TranslationContext);
  
  if (context === undefined) {
    throw new Error('useTranslations must be used within a TranslationProvider');
  }
  
  return context;
}