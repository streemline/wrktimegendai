import { Dictionary } from './index';

export const cs: Dictionary = {
  // Общие
  appName: 'TimeTrackPro',
  welcome: 'Vítejte',
  loading: 'Načítání...',
  
  // Навигация
  nav: {
    home: 'Domů',
    profile: 'Profil',
    stats: 'Statistiky',
    logout: 'Odhlásit se',
    login: 'Přihlásit se',
    register: 'Registrace',
    logoutSuccess: 'Odhlášení úspěšné',
    logoutSuccessMessage: 'Úspěšně jste se odhlásili ze systému',
    logoutError: 'Nepodařilo se odhlásit ze systému',
  },
  
  // Вкладки для аналитики
  tabs: {
    timesheet: 'Čas',
    analytics: 'Analýza',
    achievements: 'Úspěchy',
    overview: 'Přehled',
    productivity: 'Produktivita',
  },
  
  // Форма времени
  timeForm: {
    date: 'Datum',
    startTime: 'Čas zahájení',
    endTime: 'Čas ukončení',
    notes: 'Poznámky',
    hourlyRate: 'Hodinová sazba',
    addEntry: 'Přidat záznam',
    editEntry: 'Upravit záznam',
    deleteEntry: 'Smazat záznam',
    didNotWork: 'Nepracoval jsem',
    dayOff: 'Volný den',
  },
  
  // Профиль пользователя
  profile: {
    title: 'Profil uživatele',
    fullName: 'Celé jméno',
    email: 'Email',
    phone: 'Telefon',
    position: 'Pozice',
    workHours: 'Pracovních hodin denně',
    breakMinutes: 'Minut přestávky',
    autoBreak: 'Automatická přestávka',
    workDays: 'Pracovní dny',
    update: 'Aktualizovat',
    cancel: 'Zrušit',
    uploadImage: 'Nahrát fotografii',
    language: 'Jazyk',
    languageSettings: 'Nastavení jazyka',
    changePassword: 'Změnit heslo',
    password: {
      title: 'Změna hesla',
      description: 'Zadejte své aktuální heslo a nové heslo pro změnu',
      current: 'Aktuální heslo',
      new: 'Nové heslo',
      confirm: 'Potvrďte nové heslo',
      show: 'Zobrazit hesla',
      cancel: 'Zrušit',
      submit: 'Změnit heslo',
      saving: 'Ukládání...',
      success: 'Heslo bylo změněno',
      successMessage: 'Vaše heslo bylo úspěšně aktualizováno',
      error: 'Chyba',
      errorMessage: 'Nepodařilo se změnit heslo: ',
      validation: {
        currentRequired: 'Aktuální heslo je povinné',
        newRequired: 'Nové heslo musí obsahovat alespoň 6 znaků',
        confirmRequired: 'Potvrzení hesla je povinné',
        mismatch: 'Hesla se neshodují',
      },
    },
  },
  
  // Месяцы и дни недели
  months: [
    'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 
    'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'
  ],
  weekdays: [
    'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'
  ],
  weekdaysShort: ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'],
  
  // Аналитика
  analytics: {
    totalHours: 'Celkové hodiny',
    avgWorkday: 'Průměrný pracovní den',
    overtime: 'Přesčasy',
    productivity: 'Produktivita',
    fromPlan: 'z plánu',
    workDays: 'Pracovní dny',
    ofPlan: 'z plánu',
    fromLastMonth: 'od minulého měsíce',
    advancedAnalytics: 'Pokročilá analýza',
    monthlyOverview: 'Měsíční přehled',
    monthStats: 'Statistiky měsíce',
    timeDistribution: 'Rozdělení pracovní doby',
    trends: 'Trendy',
    distribution: 'Rozdělení',
    efficiency: 'Efektivita',
    totalTime: 'Celkový čas',
    workingDays: 'Pracovních dnů',
    entriesCount: 'Počet záznamů',
    hoursWorked: 'Odpracovaných hodin',
    hoursPlanned: 'Plánovaných hodin',
    hoursByWeekday: 'Hodiny podle dnů v týdnu',
    hoursByDaytime: 'Hodiny podle denní doby',
    morning: 'Ráno (6-12)',
    afternoon: 'Odpoledne (12-18)',
    evening: 'Večer (18-22)',
    night: 'Noc (22-6)',
    workedVsTarget: 'Odpracováno / Plánováno',
    exportData: 'Exportovat',
  },
  
  // Экспорт
  export: {
    title: 'Export dat',
    format: 'Formát souboru',
    options: 'Možnosti',
    includeProfile: 'Zahrnout data profilu',
    includeNotes: 'Zahrnout poznámky',
    includeSalary: 'Zahrnout údaje o mzdě',
    includeProjects: 'Zahrnout údaje o projektech',
    downloadFile: 'Stáhnout soubor',
    cancel: 'Zrušit',
  },
  
  // Авторизация
  auth: {
    loginTitle: 'Přihlášení do systému',
    registerTitle: 'Registrace',
    username: 'Uživatelské jméno',
    password: 'Heslo',
    confirmPassword: 'Potvrzení hesla',
    fullName: 'Celé jméno',
    email: 'Email',
    login: 'Přihlásit se',
    register: 'Zaregistrovat se',
    switchToRegister: 'Vytvořit účet',
    switchToLogin: 'Už máte účet? Přihlásit se',
    error: 'Chyba',
    validation: {
      required: 'Toto pole je povinné',
      tooShort: 'Příliš krátký text',
      tooLong: 'Příliš dlouhý text',
      passwordMismatch: 'Hesla se neshodují',
      invalidEmail: 'Nesprávný formát emailu',
    },
  },
  
  // Достижения
  achievements: {
    title: 'Úspěchy',
    progress: 'Pokrok',
    locked: 'Zamčeno',
    unlocked: 'Odemčeno',
    timeMaster: 'Mistr času',
    consistencyChamp: 'Šampion konzistence',
    efficiencyGuru: 'Guru efektivity',
    currentStreak: 'Aktuální série',
    bestStreak: 'Nejlepší série',
    thisWeek: 'Tento týden',
    thisMonth: 'Tento měsíc',
  },
  
  // Подсказки
  tooltips: {
    timesheet: {
      title: 'Tabulka pracovní doby',
      content: 'Zde můžete vidět a spravovat své záznamy o pracovní době',
    },
    analytics: {
      title: 'Analýza',
      content: 'Detailní přehled vaší produktivity a statistik práce',
    },
    achievements: {
      title: 'Úspěchy',
      content: 'Vaše pracovní úspěchy a úroveň produktivity',
    },
  },
};