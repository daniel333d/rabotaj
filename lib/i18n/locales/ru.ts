import type { Dictionary } from "./pl";

const ru: Dictionary = {
  meta: {
    locale: "ru",
    label: "Русский"
  },
  common: {
    save: "Сохранить",
    saved: "Сохранено",
    apply: "Откликнуться",
    applyFast: "Отклик за 15 секунд",
    seeMore: "Показать больше",
    seeAll: "Показать все",
    seeCompany: "Смотреть компанию",
    seeExample: "Смотреть пример",
    loading: "Загрузка…",
    close: "Закрыть",
    filters: "Фильтры",
    clearFilters: "Сбросить фильтры",
    showResults: "Показать результаты",
    sortBy: "Сортировка",
    perMonth: "/ мес.",
    gross: "брутто"
  },
  nav: {
    jobs: "Вакансии",
    companies: "Компании",
    salary: "Зарплаты",
    careerCenter: "Центр карьеры",
    employers: "Работодателям",
    login: "Войти",
    register: "Создать аккаунт",
    postJob: "Добавить вакансию",
    dashboard: "Кабинет",
    logout: "Выйти"
  },
  hero: {
    headline: "Работай без границ.",
    subtitle:
      "Найди проверенную работу в Польше и по всей Европе. Создай один карьерный профиль, откликайся быстрее и отслеживай каждый этап отбора.",
    positionLabel: "Должность, профессия или навык",
    positionPlaceholder: "напр. Frontend Developer, сварщик, водитель",
    locationLabel: "Город, страна или удалённо",
    locationPlaceholder: "напр. Варшава, Германия, удалённо",
    cta: "Найти работу",
    popularLabel: "Популярные запросы",
    matchLabel: "Соответствие",
    verifiedEmployer: "Verified Employer",
    interviewInvite: "Приглашение на собеседование",
    passportPreview: "Career Passport"
  },
  popularSearches: {
    remote: "Удалённая работа",
    noExperience: "Без опыта",
    accommodation: "С проживанием",
    ukraine: "Для граждан Украины",
    it: "IT",
    production: "Производство",
    transport: "Транспорт",
    construction: "Строительство"
  },
  badges: {
    verifiedEmployer: "Verified Employer",
    salaryDisclosed: "Зарплата указана",
    remote: "Удалённая работа",
    noCv: "Отклик без резюме",
    respondsFast: "Обычно отвечает в течение 2 дней"
  },
  latestJobs: {
    kicker: "Последние вакансии",
    title: "Последние и рекомендуемые вакансии",
    intro: "Свежие вакансии от проверенных работодателей в Польше и Европе.",
    cta: "Смотреть все вакансии"
  },
  careerPassport: {
    kicker: "Career Passport",
    title: "Один карьерный профиль. Все отклики.",
    text: "Создай цифровой карьерный профиль, который будешь использовать для каждого отклика. Не заполняй одни и те же формы каждый раз.",
    createCta: "Создать Career Passport",
    exampleCta: "Смотреть пример",
    relocation: "Готовность к переезду",
    languages: "Языки",
    skills: "Навыки",
    expectedSalary: "Ожидаемая зарплата",
    completeness: "Заполненность профиля",
    emailVerified: "Подтверждённый e-mail",
    phoneVerified: "Подтверждённый телефон"
  },
  howItWorks: {
    kicker: "Как работает Rabotaj",
    title: "Три шага к новой работе",
    steps: [
      {
        title: "Создай Career Passport",
        text: "Заполни профиль один раз — профессия, навыки, языки, ожидания по зарплате."
      },
      {
        title: "Откликайся за секунды",
        text: "Выбери вакансию и отправь отклик одним кликом, без повторного заполнения форм."
      },
      {
        title: "Отслеживай статус отбора",
        text: "Смотри в реальном времени, на каком этапе твой отклик — от отправки до предложения о работе."
      }
    ]
  },
  verifiedEmployers: {
    kicker: "Verified Employers",
    title: "Мы проверяем работодателей перед публикацией на Rabotaj",
    text: "Каждая компания со значком Verified Employer проходит проверку регистрационных данных и практик найма, поэтому ты можешь откликаться с большей уверенностью.",
    badge1: "Компания проверена",
    badge2: "Прозрачная зарплата",
    badge3: "Быстрый ответ",
    badge4: "Дружелюбна к иностранцам"
  },
  applicationStatus: {
    kicker: "Статус отклика",
    title: "Всегда знай, что происходит с твоим откликом.",
    steps: [
      "Отклик отправлен",
      "Профиль просмотрен",
      "Кандидат отобран",
      "Приглашение на собеседование",
      "Предложение о работе"
    ],
    hired: "Нанят(а)",
    rejected: "Отклонена",
    withdrawnStatus: "Отозвана"
  },
  companies: {
    kicker: "Рекомендуемые компании",
    title: "Проверенные работодатели в Польше и Европе",
    industry: "Отрасль",
    country: "Страна",
    openJobs: "активных вакансий",
    responseTime: "Сред. время ответа"
  },
  remoteAbroad: {
    kicker: "Удалённо и за рубежом",
    title: "Работай откуда угодно — или уезжай работать в Европу",
    remoteTitle: "Удалённая работа",
    remoteText: "Сотни вакансий без переезда — работай из дома на компании в Польше и Европе.",
    abroadTitle: "Работа за рубежом",
    abroadText: "Легальные вакансии в Германии, Нидерландах и других странах ЕС, многие с проживанием.",
    cta: "Смотреть вакансии"
  },
  salary: {
    kicker: "Зарплаты",
    title: "Узнай реальные вилки зарплат",
    text: "Сравни зарплаты на похожих позициях в своём городе и отрасли перед откликом.",
    cta: "Проверить зарплаты"
  },
  employersSection: {
    kicker: "Работодателям",
    title: "Найди людей, которые действительно подходят твоей компании.",
    benefit1: "Быстрая публикация вакансий",
    benefit2: "Простая панель кандидатов",
    benefit3: "Статусы отбора",
    benefit4: "Профиль Verified Employer",
    benefit5: "Базовая аналитика",
    postJob: "Добавить вакансию",
    learnMore: "Узнать о Rabotaj для бизнеса"
  },
  careerCenter: {
    kicker: "Центр карьеры",
    title: "Советы, шаблоны резюме и поддержка в трудоустройстве",
    text: "Практические материалы для тех, кто ищет работу в Польше и Европе — от написания резюме до легализации трудоустройства.",
    cta: "Перейти в центр карьеры"
  },
  newsletter: {
    title: "Новые вакансии прямо на почту",
    text: "Выбери отрасль и локацию — мы сообщим о новых подходящих вакансиях.",
    placeholder: "Твой email адрес",
    cta: "Подписаться"
  },
  footer: {
    tagline: "Работай без границ.",
    forCandidates: "Кандидатам",
    forEmployers: "Работодателям",
    company: "Компания",
    legal: "Правовая информация",
    about: "О нас",
    contact: "Контакты",
    terms: "Условия использования",
    privacy: "Политика конфиденциальности",
    rights: "Все права защищены."
  },
  jobsPage: {
    title: "Вакансии",
    resultsCount: "результатов",
    filtersTitle: "Фильтры",
    sortNewest: "Новые",
    sortSalaryHigh: "Зарплата: по убыванию",
    sortMatch: "Лучшее соответствие",
    filterCountry: "Страна",
    filterCity: "Город",
    filterRemote: "Удалённая работа",
    filterSalary: "Зарплата",
    filterContract: "Тип договора",
    filterExperience: "Опыт",
    filterLanguage: "Рабочий язык",
    filterIndustry: "Отрасль",
    filterVerified: "Только Verified Employer",
    noResults: "Нет вакансий по выбранным критериям.",
    page: "Страница"
  },
  jobDetail: {
    aboutRole: "Описание вакансии",
    responsibilities: "Обязанности",
    requirements: "Требования",
    benefits: "Преимущества",
    process: "Процесс отбора",
    aboutCompany: "О компании",
    similarJobs: "Похожие вакансии",
    contractType: "Форма занятости",
    workModel: "Модель работы",
    location: "Локация",
    salaryLabel: "Зарплата",
    published: "Опубликовано",
    applyModalTitle: "Откликнуться на вакансию",
    messageLabel: "Сообщение (необязательно)",
    expectedSalaryLabel: "Ожидаемая зарплата",
    availabilityLabel: "Доступность с",
    sendApplication: "Отправить отклик",
    alreadyApplied: "Отклик уже отправлен",
    loginToApply: "Войди, чтобы откликнуться",
    loginToSave: "Войди, чтобы сохранить вакансию"
  },
  dashboard: {
    welcome: "С возвращением",
    newMatches: "Новые подходящие вакансии",
    activeApplications: "Активные отклики",
    profileViews: "Просмотры профиля",
    interviews: "Приглашения на собеседования",
    passportCompleteness: "Заполненность Career Passport",
    myApplications: "Твои отклики",
    recommended: "Рекомендовано для тебя",
    tabOverview: "Обзор",
    tabApplications: "Мои отклики",
    tabSaved: "Сохранённые вакансии",
    tabPassport: "Career Passport",
    tabAlerts: "Уведомления",
    tabSettings: "Настройки",
    savedJobsCount: "Сохранённые вакансии",
    noApplications: "У тебя пока нет откликов.",
    noSaved: "Ты пока не сохранил(а) ни одной вакансии.",
    noRecommended: "Пока нет рекомендаций.",
    alertsComingSoon: "Скоро здесь появятся уведомления о новых подходящих вакансиях.",
    settingsTitle: "Настройки аккаунта",
    settingsSaved: "Изменения сохранены",
    withdraw: "Отозвать отклик",
    withdrawn: "Отклик отозван"
  },
  auth: {
    loginTitle: "Войти в Rabotaj",
    registerTitle: "Создать аккаунт на Rabotaj",
    email: "Email адрес",
    password: "Пароль",
    fullName: "Имя и фамилия",
    firstName: "Имя",
    lastName: "Фамилия",
    confirmPassword: "Повторите пароль",
    loginCta: "Войти",
    registerCta: "Создать аккаунт",
    noAccount: "Нет аккаунта?",
    haveAccount: "Уже есть аккаунт?",
    registerLink: "Зарегистрироваться",
    loginLink: "Войти",
    roleQuestion: "Кто ты?",
    roleCandidate: "Ищу работу",
    roleEmployer: "Нанимаю",
    forgotPassword: "Забыли пароль?",
    resetPasswordTitle: "Сбросить пароль",
    resetPasswordIntro: "Укажи email, привязанный к аккаунту — отправим ссылку для установки нового пароля.",
    resetPasswordCta: "Отправить ссылку",
    resetPasswordSuccess: "Если аккаунт существует, мы отправили ссылку для сброса пароля на указанный адрес.",
    updatePasswordTitle: "Установи новый пароль",
    updatePasswordCta: "Сохранить новый пароль",
    updatePasswordSuccess: "Пароль обновлён.",
    registerSuccessCheckEmail: "Проверь почту, чтобы подтвердить аккаунт.",
    backendNotConfigured: "Бэкенд ещё не настроен. Свяжись с администратором сервиса.",
    genericError: "Что-то пошло не так. Попробуй ещё раз.",
    invalidCredentials: "Неверный email или пароль.",
    emailAlreadyRegistered: "Этот адрес email уже зарегистрирован.",
    linkExpired: "Эта ссылка устарела или недействительна. Запроси новую.",
    accountBlocked: "Этот аккаунт заблокирован. Свяжись со службой поддержки."
  },
  toast: {
    jobSaved: "Вакансия сохранена",
    jobUnsaved: "Удалено из сохранённых",
    applicationSent: "Отклик отправлен!",
    languageChanged: "Язык изменён",
    statusUpdated: "Статус отклика обновлён"
  },
  rabotajScore: {
    title: "Rabotaj Score",
    titleMark: "Rabotaj Score™",
    levels: {
      excellent: "Отличная прозрачность",
      good: "Хорошая прозрачность",
      average: "Средняя прозрачность",
      low: "Низкая прозрачность"
    },
    shortDisclaimer:
      "Этот показатель отражает, насколько полна и прозрачна данная вакансия. Он не является оценкой работодателя и не гарантирует трудоустройство.",
    fullDisclaimer:
      "Rabotaj Score оценивает полноту и прозрачность вакансии на основе информации, указанной на платформе. Это не оценка работодателя, не рекомендация и не гарантия условий трудоустройства.",
    tooltipDisclaimer:
      "Этот показатель касается полноты и прозрачности вакансии. Это не оценка работодателя и не гарантия трудоустройства.",
    metCriteriaTitle: "Выполненные критерии",
    missingCriteriaTitle: "Отсутствующая информация",
    improveScore: "Повысить показатель",
    whatToImprove: "Что улучшить, чтобы повысить показатель?",
    howWeCalculate: "Как мы рассчитываем показатель?",
    howWeCalculateIntro:
      "Rabotaj Score оценивает полноту и прозрачность вакансии по шкале 0–100. Каждый критерий основан на информации, предоставленной работодателем, а не на мнениях или оценках пользователей.",
    fillField: "Заполнить",
    points: "баллов",
    liveScoreLabel: "Rabotaj Score в реальном времени",
    companyAvgLabel: "Средний Rabotaj Score активных вакансий",
    companyAvgExplain: "Показатель касается прозрачности вакансий, а не общей оценки работодателя.",
    minScoreFilter: "Минимальный Rabotaj Score",
    sortHighestScore: "Высокий Rabotaj Score",
    criteriaMet: {
      salaryRange: "Указана вилка зарплаты",
      verifiedEmployer: "Компания проверена",
      contractType: "Указан тип договора",
      workModel: "Определена модель работы",
      location: "Указана локация",
      workLanguage: "Указан рабочий язык",
      responsibilities: "Описаны обязанности",
      requirements: "Описаны требования",
      benefits: "Указаны преимущества",
      recruitmentProcess: "Описан процесс отбора",
      expectedResponseTime: "Указано ориентировочное время ответа",
      startDate: "Указана дата начала работы"
    },
    criteriaMissing: {
      salaryRange: "Добавьте вилку зарплаты",
      verifiedEmployer: "Компания ещё не проверена",
      contractType: "Добавьте тип договора",
      workModel: "Определите модель работы",
      location: "Добавьте локацию",
      workLanguage: "Укажите рабочий язык",
      responsibilities: "Опишите обязанности",
      requirements: "Опишите требования",
      benefits: "Добавьте преимущества",
      recruitmentProcess: "Опишите процесс отбора",
      expectedResponseTime: "Укажите время ответа",
      startDate: "Укажите дату начала работы"
    }
  }
};

export default ru;
