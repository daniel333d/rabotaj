import type { Dictionary } from "./pl";

const ua: Dictionary = {
  meta: {
    locale: "ua",
    label: "Українська"
  },
  common: {
    save: "Зберегти",
    saved: "Збережено",
    apply: "Подати заявку",
    applyFast: "Подати заявку за 15 секунд",
    seeMore: "Показати більше",
    seeAll: "Показати всі",
    seeCompany: "Переглянути компанію",
    seeExample: "Переглянути приклад",
    loading: "Завантаження…",
    close: "Закрити",
    filters: "Фільтри",
    clearFilters: "Очистити фільтри",
    showResults: "Показати результати",
    sortBy: "Сортування",
    perMonth: "/ міс.",
    gross: "брутто",
    all: "Всі"
  },
  nav: {
    jobs: "Вакансії",
    companies: "Компанії",
    salary: "Зарплати",
    careerCenter: "Центр кар'єри",
    employers: "Роботодавцям",
    login: "Увійти",
    register: "Створити акаунт",
    postJob: "Додати вакансію",
    dashboard: "Кабінет",
    logout: "Вийти"
  },
  hero: {
    headline: "Працюй без кордонів.",
    subtitle:
      "Знайди роботу в Польщі та по всій Європі. Створи один кар'єрний профіль, подавай заявки швидше та відстежуй кожен етап відбору.",
    positionLabel: "Посада, професія або навичка",
    positionPlaceholder: "напр. Frontend Developer, зварювальник, водій",
    locationLabel: "Місто, країна або віддалено",
    locationPlaceholder: "напр. Варшава, Німеччина, віддалено",
    cta: "Знайти роботу",
    popularLabel: "Популярні запити",
    matchLabel: "Відповідність",
    verifiedEmployer: "Verified Employer",
    interviewInvite: "Запрошення на співбесіду",
    passportPreview: "Career Passport"
  },
  popularSearches: {
    remote: "Віддалена робота",
    noExperience: "Без досвіду",
    accommodation: "З проживанням",
    ukraine: "Для громадян України",
    it: "ІТ",
    production: "Виробництво",
    transport: "Транспорт",
    construction: "Будівництво"
  },
  badges: {
    verifiedEmployer: "Verified Employer",
    salaryDisclosed: "Зарплата вказана",
    remote: "Віддалена робота",
    noCv: "Заявка без резюме",
    respondsFast: "Зазвичай відповідає протягом 2 днів"
  },
  latestJobs: {
    kicker: "Останні вакансії",
    title: "Останні та рекомендовані вакансії",
    intro: "Щойно додані вакансії від компаній, які публікують оголошення у Польщі та Європі.",
    cta: "Переглянути всі вакансії"
  },
  careerPassport: {
    kicker: "Career Passport",
    title: "Один кар'єрний профіль. Усі заявки.",
    text: "Створи цифровий кар'єрний профіль, який використовуватимеш для кожної заявки. Не заповнюй щоразу ті самі форми.",
    createCta: "Створити Career Passport",
    exampleCta: "Переглянути приклад",
    relocation: "Готовність до релокації",
    languages: "Мови",
    skills: "Навички",
    expectedSalary: "Очікувана зарплата",
    completeness: "Заповненість профілю",
    emailVerified: "Підтверджена e-mail адреса",
    phoneVerified: "Підтверджений телефон"
  },
  howItWorks: {
    kicker: "Як працює Rabotaj",
    title: "Три кроки до нової роботи",
    steps: [
      {
        title: "Створи Career Passport",
        text: "Заповни профіль один раз — професія, навички, мови, очікування щодо зарплати."
      },
      {
        title: "Подавай заявки за секунди",
        text: "Обери вакансію та надішли заявку одним кліком, без повторного заповнення форм."
      },
      {
        title: "Відстежуй статус відбору",
        text: "Дивись у реальному часі, на якому етапі твоя заявка — від надсилання до пропозиції роботи."
      }
    ]
  },
  verifiedEmployers: {
    kicker: "Verified Employers",
    title: "Компанії з відзнакою Verified Employer проходять перевірку даних.",
    text: "Перевірка охоплює реєстраційні дані компанії та спосіб публікації умов працевлаштування. Відзнака Verified Employer не є оцінкою роботодавця чи гарантією працевлаштування.",
    badge1: "Компанія перевірена",
    badge2: "Прозора зарплата",
    badge3: "Швидка відповідь",
    badge4: "Дружня до іноземців"
  },
  applicationStatus: {
    kicker: "Статус заявки",
    title: "Завжди знай, що відбувається з твоєю заявкою.",
    steps: [
      "Заявку надіслано",
      "Профіль переглянуто",
      "Кандидата відібрано",
      "Запрошення на співбесіду",
      "Пропозиція роботи"
    ],
    hired: "Найнято",
    rejected: "Відхилено",
    withdrawnStatus: "Відкликано"
  },
  companies: {
    kicker: "Рекомендовані компанії",
    title: "Перевірені роботодавці в Польщі та Європі",
    industry: "Галузь",
    country: "Країна",
    openJobs: "активних вакансій",
    responseTime: "Сер. час відповіді"
  },
  remoteAbroad: {
    kicker: "Віддалена робота та за кордоном",
    title: "Працюй звідусіль — або виїжджай на роботу в Європу",
    remoteTitle: "Віддалена робота",
    remoteText: "Сотні вакансій без переїзду — працюй з дому для компаній у Польщі та Європі.",
    abroadTitle: "Робота за кордоном",
    abroadText: "Вакансії від компаній, які публікують умови працевлаштування в Німеччині, Нідерландах та інших країнах ЄС, багато з проживанням.",
    cta: "Переглянути вакансії"
  },
  salary: {
    kicker: "Зарплати",
    title: "Перевір реальні межі зарплат",
    text: "Порівняй зарплати на подібних посадах у своєму місті та галузі перед тим, як подати заявку.",
    cta: "Перевірити зарплати"
  },
  employersSection: {
    kicker: "Роботодавцям",
    title: "Знайди людей, які справді підходять твоїй компанії.",
    benefit1: "Швидка публікація вакансій",
    benefit2: "Простий кабінет кандидатів",
    benefit3: "Статуси відбору",
    benefit4: "Профіль Verified Employer",
    benefit5: "Базова аналітика",
    postJob: "Додати вакансію",
    learnMore: "Дізнатись про Rabotaj для бізнесу"
  },
  careerCenter: {
    kicker: "Центр кар'єри",
    title: "Поради, шаблони резюме та підтримка у працевлаштуванні",
    text: "Практичні матеріали для тих, хто шукає роботу в Польщі та Європі — від написання резюме до легалізації працевлаштування.",
    cta: "Перейти до центру кар'єри"
  },
  newsletter: {
    title: "Нові вакансії прямо на твою пошту",
    text: "Обери галузь і локацію — ми повідомимо про нові, підходящі вакансії.",
    placeholder: "Твоя електронна адреса",
    cta: "Підписатись"
  },
  footer: {
    tagline: "Працюй без кордонів.",
    forCandidates: "Кандидатам",
    forEmployers: "Роботодавцям",
    company: "Компанія",
    legal: "Правова інформація",
    about: "Про нас",
    contact: "Контакти",
    terms: "Умови користування",
    privacy: "Політика конфіденційності",
    rights: "Усі права захищені."
  },
  jobsPage: {
    title: "Вакансії",
    resultsCount: "результатів",
    filtersTitle: "Фільтри",
    sortNewest: "Найновіші",
    sortSalaryHigh: "Зарплата: спадання",
    sortMatch: "Найкраща відповідність",
    filterCountry: "Країна",
    filterCity: "Місто",
    filterWorkMode: "Модель роботи",
    filterAccommodation: "Проживання",
    filterSalary: "Зарплата",
    filterSalaryAny: "будь-яка",
    filterSalaryFrom: "від",
    filterContract: "Тип договору",
    filterExperience: "Досвід",
    filterLanguage: "Робоча мова",
    filterIndustry: "Галузь",
    filterVerified: "Лише Verified Employer",
    noResults: "Немає вакансій за обраними критеріями.",
    page: "Сторінка"
  },
  jobDetail: {
    aboutRole: "Опис вакансії",
    responsibilities: "Обов'язки",
    requirements: "Вимоги",
    niceToHave: "Буде плюсом",
    benefits: "Переваги",
    process: "Процес відбору",
    aboutCompany: "Про компанію",
    similarJobs: "Схожі вакансії",
    contractType: "Форма зайнятості",
    workModel: "Модель роботи",
    location: "Локація",
    workLanguage: "Робоча мова",
    experienceLevel: "Досвід",
    salaryLabel: "Зарплата",
    published: "Опубліковано",
    applyModalTitle: "Подати заявку на вакансію",
    messageLabel: "Повідомлення (необов'язково)",
    expectedSalaryLabel: "Очікувана зарплата",
    availabilityLabel: "Доступність з",
    sendApplication: "Надіслати заявку",
    alreadyApplied: "Заявку вже подано",
    loginToApply: "Увійди, щоб подати заявку",
    loginToSave: "Увійди, щоб зберегти вакансію"
  },
  dashboard: {
    welcome: "З поверненням",
    newMatches: "Нові підходящі вакансії",
    activeApplications: "Активні заявки",
    profileViews: "Перегляди профілю",
    interviews: "Запрошення на співбесіди",
    passportCompleteness: "Заповненість Career Passport",
    myApplications: "Твої заявки",
    recommended: "Рекомендовано для тебе",
    tabOverview: "Огляд",
    tabApplications: "Мої заявки",
    tabSaved: "Збережені вакансії",
    tabPassport: "Career Passport",
    tabAlerts: "Сповіщення",
    tabSettings: "Налаштування",
    savedJobsCount: "Збережені вакансії",
    noApplications: "У тебе ще немає заявок.",
    noSaved: "Ти ще не зберіг(ла) жодної вакансії.",
    noRecommended: "Поки що немає рекомендацій.",
    alertsComingSoon: "Незабаром тут з'являться сповіщення про нові підходящі вакансії.",
    settingsTitle: "Налаштування акаунта",
    settingsSaved: "Зміни збережено",
    withdraw: "Відкликати заявку",
    withdrawn: "Заявку відкликано",
    demoView: "Демонстраційний режим"
  },
  auth: {
    loginTitle: "Увійти в Rabotaj",
    registerTitle: "Створити акаунт на Rabotaj",
    email: "Електронна адреса",
    password: "Пароль",
    fullName: "Ім'я та прізвище",
    firstName: "Ім'я",
    lastName: "Прізвище",
    confirmPassword: "Повторіть пароль",
    loginCta: "Увійти",
    registerCta: "Створити акаунт",
    noAccount: "Немає акаунта?",
    haveAccount: "Вже маєш акаунт?",
    registerLink: "Зареєструватись",
    loginLink: "Увійти",
    roleQuestion: "Хто ти?",
    roleCandidate: "Шукаю роботу",
    roleEmployer: "Наймаю",
    forgotPassword: "Забув(ла) пароль?",
    resetPasswordTitle: "Скинути пароль",
    resetPasswordIntro: "Вкажи e-mail, пов'язаний з акаунтом — надішлемо посилання для встановлення нового пароля.",
    resetPasswordCta: "Надіслати посилання",
    resetPasswordSuccess: "Якщо акаунт існує, ми надіслали посилання для скидання пароля на вказану адресу.",
    updatePasswordTitle: "Встанови новий пароль",
    updatePasswordCta: "Зберегти новий пароль",
    updatePasswordSuccess: "Пароль оновлено.",
    registerSuccessCheckEmail: "Перевір пошту, щоб підтвердити акаунт.",
    backendNotConfigured: "Бекенд ще не налаштовано. Зв'яжись з адміністратором сервісу.",
    genericError: "Щось пішло не так. Спробуй ще раз.",
    invalidCredentials: "Неправильний e-mail або пароль.",
    emailAlreadyRegistered: "Ця адреса e-mail вже зареєстрована.",
    linkExpired: "Це посилання застаріло або недійсне. Запроси нове.",
    accountBlocked: "Цей акаунт заблоковано. Зв'яжись зі службою підтримки."
  },
  workModel: {
    remote: "Віддалена робота",
    hybrid: "Гібридна робота",
    onsite: "Стаціонарна робота"
  },
  toast: {
    jobSaved: "Вакансію збережено",
    jobUnsaved: "Видалено зі збережених",
    applicationSent: "Заявку надіслано!",
    languageChanged: "Мову змінено",
    statusUpdated: "Статус заявки оновлено"
  },
  rabotajScore: {
    title: "Rabotaj Score",
    titleMark: "Rabotaj Score™",
    levels: {
      excellent: "Відмінна прозорість",
      good: "Добра прозорість",
      average: "Середня прозорість",
      low: "Низька прозорість"
    },
    shortDisclaimer:
      "Цей показник відображає, наскільки повна та прозора ця вакансія. Він не є оцінкою роботодавця і не гарантує працевлаштування.",
    fullDisclaimer:
      "Rabotaj Score оцінює повноту та прозорість вакансії на основі інформації, вказаної на платформі. Це не оцінка роботодавця, не рекомендація і не гарантія умов працевлаштування.",
    tooltipDisclaimer:
      "Цей показник стосується повноти та прозорості вакансії. Це не оцінка роботодавця і не гарантія працевлаштування.",
    metCriteriaTitle: "Виконані критерії",
    missingCriteriaTitle: "Відсутня інформація",
    improveScore: "Підвищити показник",
    whatToImprove: "Що покращити, щоб підвищити показник?",
    howWeCalculate: "Як ми розраховуємо показник?",
    howWeCalculateIntro:
      "Rabotaj Score оцінює повноту та прозорість вакансії за шкалою 0–100. Кожен критерій ґрунтується на інформації, яку надав роботодавець, а не на думках чи оцінках користувачів.",
    fillField: "Заповнити",
    points: "балів",
    liveScoreLabel: "Rabotaj Score в реальному часі",
    companyAvgLabel: "Середній Rabotaj Score активних вакансій",
    companyAvgExplain: "Показник стосується прозорості вакансій, а не загальної оцінки роботодавця.",
    minScoreFilter: "Мінімальний Rabotaj Score",
    sortHighestScore: "Найвищий Rabotaj Score",
    criteriaMet: {
      salaryRange: "Вказано вилку зарплати",
      verifiedEmployer: "Компанію перевірено",
      contractType: "Вказано тип договору",
      workModel: "Визначено модель роботи",
      location: "Вказано локацію",
      workLanguage: "Вказано робочу мову",
      responsibilities: "Описано обов'язки",
      requirements: "Описано вимоги",
      benefits: "Вказано переваги",
      recruitmentProcess: "Описано процес відбору",
      expectedResponseTime: "Вказано орієнтовний час відповіді",
      startDate: "Вказано дату початку роботи"
    },
    criteriaMissing: {
      salaryRange: "Додайте вилку зарплати",
      verifiedEmployer: "Компанію ще не перевірено",
      contractType: "Додайте тип договору",
      workModel: "Визначте модель роботи",
      location: "Додайте локацію",
      workLanguage: "Вкажіть робочу мову",
      responsibilities: "Опишіть обов'язки",
      requirements: "Опишіть вимоги",
      benefits: "Додайте переваги",
      recruitmentProcess: "Опишіть процес відбору",
      expectedResponseTime: "Вкажіть час відповіді",
      startDate: "Вкажіть дату початку роботи"
    }
  },
  legalPages: {
    aboutIntro: "Rabotaj.com — це прототип платформи пошуку роботи для Польщі, України та Центрально-Східної Європи.",
    aboutBody:
      "Ми створюємо Rabotaj.com як місце, де кандидати можуть знайти прозорі вакансії в Польщі та Європі, а роботодавці — знайти кандидатів, готових працювати або переїхати. Ця версія сайту є демонстраційним прототипом — дані вакансій, компаній та акаунтів є прикладовими.",
    contactIntro: "Маєш питання щодо цього прототипу? Напиши нам.",
    contactEmailLabel: "E-mail",
    contactNote: "Це демонстраційна версія — повідомлення з цієї форми нікуди не надсилаються.",
    termsIntro: "Короткий регламент демонстраційної версії Rabotaj.com.",
    termsBody: [
      "Rabotaj.com у поточному вигляді є функціональним прототипом, представленим у демонстраційних цілях.",
      "Вакансії, профілі компаній та облікові записи користувачів, показані на сайті, є прикладовими даними і не є реальними пропозиціями роботи.",
      "Використання форм (реєстрація, подання заявки, додавання вакансії) не створює жодних юридичних чи фінансових зобов'язань."
    ],
    privacyIntro: "Коротка інформація про дані в демонстраційній версії Rabotaj.com.",
    privacyBody: [
      "У демонстраційній версії дані, введені у формах, можуть зберігатися лише локально в браузері (наприклад, збережені вакансії) або, після налаштування бекенду, у базі даних, що використовується для тестування.",
      "Ми не передаємо дані третім особам і не використовуємо їх у маркетингових цілях.",
      "Остаточна, продакшн-версія політики конфіденційності буде опублікована разом із повним запуском сервісу."
    ]
  }
};

export default ua;
