import { Dictionary } from './index';

export const ru: Dictionary = {
  // Общие
  appName: 'TimeTrackPro',
  welcome: 'Добро пожаловать',
  loading: 'Загрузка...',
  
  // Навигация
  nav: {
    home: 'Главная',
    profile: 'Профиль',
    stats: 'Статистика',
    logout: 'Выйти',
    login: 'Войти',
    register: 'Регистрация',
    logoutSuccess: 'Выход выполнен',
    logoutSuccessMessage: 'Вы успешно вышли из системы',
    logoutError: 'Не удалось выйти из системы',
  },
  
  // Вкладки для аналитики
  tabs: {
    timesheet: 'Время',
    analytics: 'Аналитика',
    achievements: 'Достижения',
    overview: 'Обзор',
    productivity: 'Продуктивность',
  },
  
  // Форма времени
  timeForm: {
    date: 'Дата',
    startTime: 'Время начала',
    endTime: 'Время окончания',
    notes: 'Примечания',
    hourlyRate: 'Почасовая ставка',
    addEntry: 'Добавить запись',
    editEntry: 'Редактировать запись',
    deleteEntry: 'Удалить запись',
    didNotWork: 'Не вышел на работу',
    dayOff: 'Выходной',
  },
  
  // Профиль пользователя
  profile: {
    title: 'Профиль пользователя',
    fullName: 'Полное имя',
    email: 'Email',
    phone: 'Телефон',
    position: 'Должность',
    workHours: 'Рабочих часов в день',
    breakMinutes: 'Минут перерыва',
    autoBreak: 'Автоматический перерыв',
    workDays: 'Рабочие дни',
    update: 'Обновить',
    cancel: 'Отмена',
    uploadImage: 'Загрузить фото',
    language: 'Язык',
    languageSettings: 'Настройки языка',
    changePassword: 'Изменить пароль',
    password: {
      title: 'Изменение пароля',
      description: 'Введите ваш текущий пароль и новый пароль для изменения',
      current: 'Текущий пароль',
      new: 'Новый пароль',
      confirm: 'Подтвердите новый пароль',
      show: 'Показать пароли',
      cancel: 'Отмена',
      submit: 'Изменить пароль',
      saving: 'Сохранение...',
      success: 'Пароль изменен',
      successMessage: 'Ваш пароль успешно обновлен',
      error: 'Ошибка',
      errorMessage: 'Не удалось изменить пароль: ',
      validation: {
        currentRequired: 'Текущий пароль обязателен',
        newRequired: 'Новый пароль должен содержать не менее 6 символов',
        confirmRequired: 'Подтверждение пароля обязательно',
        mismatch: 'Пароли не совпадают',
      },
    },
  },
  
  // Месяцы и дни недели
  months: [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ],
  weekdays: [
    'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'
  ],
  weekdaysShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  
  // Аналитика
  analytics: {
    totalHours: 'Общие часы',
    avgWorkday: 'Средний рабочий день',
    overtime: 'Сверхурочные',
    productivity: 'Продуктивность',
    fromPlan: 'от плана',
    workDays: 'Рабочие дни',
    ofPlan: 'от плана',
    fromLastMonth: 'от прошлого месяца',
    advancedAnalytics: 'Расширенная аналитика',
    monthlyOverview: 'Помесячный обзор',
    monthStats: 'Статистика месяца',
    timeDistribution: 'Распределение рабочего времени',
    trends: 'Тренды',
    distribution: 'Распределение',
    efficiency: 'Эффективность',
    totalTime: 'Общее время',
    workingDays: 'Рабочих дней',
    entriesCount: 'Количество записей',
    hoursWorked: 'Отработано часов',
    hoursPlanned: 'Запланировано часов',
    hoursByWeekday: 'Часы по дням недели',
    hoursByDaytime: 'Часы по времени суток',
    morning: 'Утро (6-12)',
    afternoon: 'День (12-18)',
    evening: 'Вечер (18-22)',
    night: 'Ночь (22-6)',
    workedVsTarget: 'Отработано / Запланировано',
    exportData: 'Экспортировать',
  },
  
  // Экспорт
  export: {
    title: 'Экспорт данных',
    format: 'Формат файла',
    options: 'Опции',
    includeProfile: 'Включить данные профиля',
    includeNotes: 'Включить примечания',
    includeSalary: 'Включить данные об оплате',
    includeProjects: 'Включить данные о проектах',
    downloadFile: 'Скачать файл',
    cancel: 'Отмена',
  },
  
  // Авторизация
  auth: {
    loginTitle: 'Вход в систему',
    registerTitle: 'Регистрация',
    username: 'Имя пользователя',
    password: 'Пароль',
    confirmPassword: 'Подтверждение пароля',
    fullName: 'Полное имя',
    email: 'Email',
    login: 'Войти',
    register: 'Зарегистрироваться',
    switchToRegister: 'Создать учетную запись',
    switchToLogin: 'Уже есть учетная запись? Войти',
    error: 'Ошибка',
    validation: {
      required: 'Это поле обязательное',
      tooShort: 'Слишком короткий текст',
      tooLong: 'Слишком длинный текст',
      passwordMismatch: 'Пароли не совпадают',
      invalidEmail: 'Неправильный формат email',
    },
  },
  
  // Достижения
  achievements: {
    title: 'Достижения',
    progress: 'Прогресс',
    locked: 'Заблокировано',
    unlocked: 'Разблокировано',
    timeMaster: 'Мастер времени',
    consistencyChamp: 'Чемпион стабильности',
    efficiencyGuru: 'Гуру эффективности',
    currentStreak: 'Текущая серия',
    bestStreak: 'Лучшая серия',
    thisWeek: 'На этой неделе',
    thisMonth: 'В этом месяце',
  },
  
  // Подсказки
  tooltips: {
    timesheet: {
      title: 'Таблица рабочего времени',
      content: 'Здесь вы можете видеть и управлять своими записями о рабочем времени',
    },
    analytics: {
      title: 'Аналитика',
      content: 'Детальный обзор вашей продуктивности и статистики работы',
    },
    achievements: {
      title: 'Достижения',
      content: 'Ваши рабочие достижения и уровень продуктивности',
    },
  },
};