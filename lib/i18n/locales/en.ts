import type { Dictionary } from "./pl";

const en: Dictionary = {
  meta: {
    locale: "en",
    label: "English"
  },
  common: {
    save: "Save",
    saved: "Saved",
    apply: "Apply",
    applyFast: "Apply in 15 seconds",
    seeMore: "See more",
    seeAll: "See all",
    seeCompany: "View company",
    seeExample: "View example",
    loading: "Loading…",
    close: "Close",
    filters: "Filters",
    clearFilters: "Clear filters",
    showResults: "Show results",
    sortBy: "Sort",
    perMonth: "/ month",
    gross: "gross",
    all: "All"
  },
  nav: {
    jobs: "Jobs",
    companies: "Companies",
    salary: "Salaries",
    careerCenter: "Career Center",
    employers: "For Employers",
    login: "Log in",
    register: "Sign up",
    postJob: "Post a job",
    dashboard: "Dashboard",
    logout: "Log out"
  },
  hero: {
    headline: "Work without borders.",
    subtitle:
      "Find a job in Poland and across Europe. Create one career profile, apply faster and track every stage of recruitment.",
    positionLabel: "Job title, profession or skill",
    positionPlaceholder: "e.g. Frontend Developer, welder, driver",
    locationLabel: "City, country or remote",
    locationPlaceholder: "e.g. Warsaw, Germany, remote",
    cta: "Find a job",
    popularLabel: "Popular searches",
    matchLabel: "Match",
    verifiedEmployer: "Verified Employer",
    interviewInvite: "Interview invitation",
    passportPreview: "Career Passport"
  },
  popularSearches: {
    remote: "Remote work",
    noExperience: "No experience",
    accommodation: "With accommodation",
    ukraine: "For Ukrainians",
    it: "IT",
    production: "Manufacturing",
    transport: "Transport",
    construction: "Construction"
  },
  badges: {
    verifiedEmployer: "Verified Employer",
    salaryDisclosed: "Salary disclosed",
    remote: "Remote work",
    noCv: "No CV required",
    respondsFast: "Usually responds within 2 days"
  },
  latestJobs: {
    kicker: "Latest jobs",
    title: "Latest and featured jobs",
    intro: "Freshly posted roles from companies publishing job listings across Poland and Europe.",
    cta: "See all jobs"
  },
  careerPassport: {
    kicker: "Career Passport",
    title: "One career profile. Every application.",
    text: "Build a digital career profile you can reuse for every application. Stop filling in the same forms again and again.",
    createCta: "Create Career Passport",
    exampleCta: "View example",
    relocation: "Open to relocation",
    languages: "Languages",
    skills: "Skills",
    expectedSalary: "Expected salary",
    completeness: "Profile completeness",
    emailVerified: "Verified email",
    phoneVerified: "Verified phone"
  },
  howItWorks: {
    kicker: "How Rabotaj works",
    title: "Three steps to a new job",
    steps: [
      {
        title: "Create your Career Passport",
        text: "Fill in your profile once — profession, skills, languages, salary expectations."
      },
      {
        title: "Apply in seconds",
        text: "Pick a job and send your application with one click, without filling forms again."
      },
      {
        title: "Track your recruitment status",
        text: "See live where your application stands — from submission to job offer."
      }
    ]
  },
  verifiedEmployers: {
    kicker: "Verified Employers",
    title: "Companies with the Verified Employer badge go through a data check.",
    text: "The check covers the company's registration data and how it publishes employment terms. The Verified Employer badge is not an employer rating or a guarantee of employment.",
    badge1: "Company verified",
    badge2: "Salary transparent",
    badge3: "Fast response",
    badge4: "Foreigner-friendly"
  },
  applicationStatus: {
    kicker: "Application status",
    title: "Always know what's happening with your application.",
    steps: [
      "Application sent",
      "Profile viewed",
      "Candidate shortlisted",
      "Interview invitation",
      "Job offer"
    ],
    hired: "Hired",
    rejected: "Rejected",
    withdrawnStatus: "Withdrawn"
  },
  companies: {
    kicker: "Featured companies",
    title: "Trusted employers in Poland and Europe",
    industry: "Industry",
    country: "Country",
    openJobs: "open roles",
    responseTime: "Avg. response time"
  },
  remoteAbroad: {
    kicker: "Remote & abroad",
    title: "Work from anywhere — or move abroad for work",
    remoteTitle: "Remote work",
    remoteText: "Hundreds of jobs with no relocation needed — work from home for companies across Poland and Europe.",
    abroadTitle: "Work abroad",
    abroadText: "Job offers from companies that publish their employment terms in Germany, the Netherlands and other EU countries, many with accommodation included.",
    cta: "Browse jobs"
  },
  salary: {
    kicker: "Salaries",
    title: "Check real salary ranges",
    text: "Compare pay for similar roles in your city and industry before you apply.",
    cta: "Check salaries"
  },
  employersSection: {
    kicker: "For employers",
    title: "Find people who truly fit your company.",
    benefit1: "Fast job posting",
    benefit2: "Simple candidate dashboard",
    benefit3: "Recruitment statuses",
    benefit4: "Verified Employer profile",
    benefit5: "Basic analytics",
    postJob: "Post a job",
    learnMore: "Discover Rabotaj for business"
  },
  careerCenter: {
    kicker: "Career Center",
    title: "Guides, CV templates and recruitment support",
    text: "Practical resources for people looking for work in Poland and Europe — from writing a CV to legal employment.",
    cta: "Go to career center"
  },
  newsletter: {
    title: "New jobs straight to your inbox",
    text: "Choose your industry and location — we'll notify you about new, matching jobs.",
    placeholder: "Your email address",
    cta: "Subscribe"
  },
  footer: {
    tagline: "Work without borders.",
    forCandidates: "For candidates",
    forEmployers: "For employers",
    company: "Company",
    legal: "Legal",
    about: "About us",
    contact: "Contact",
    terms: "Terms of service",
    privacy: "Privacy policy",
    rights: "All rights reserved."
  },
  jobsPage: {
    title: "Jobs",
    resultsCount: "results",
    filtersTitle: "Filters",
    sortNewest: "Newest",
    sortSalaryHigh: "Salary: high to low",
    sortMatch: "Best match",
    filterCountry: "Country",
    filterCity: "City",
    filterWorkMode: "Work model",
    filterAccommodation: "Accommodation",
    filterSalary: "Salary",
    filterSalaryAny: "any",
    filterSalaryFrom: "from",
    filterContract: "Contract type",
    filterExperience: "Experience",
    filterLanguage: "Work language",
    filterIndustry: "Industry",
    filterVerified: "Verified Employer only",
    noResults: "No jobs match the selected criteria.",
    page: "Page"
  },
  jobDetail: {
    aboutRole: "About the role",
    responsibilities: "Responsibilities",
    requirements: "Requirements",
    niceToHave: "Nice to have",
    benefits: "Benefits",
    process: "Recruitment process",
    aboutCompany: "About the company",
    similarJobs: "Similar jobs",
    contractType: "Employment type",
    workModel: "Work model",
    location: "Location",
    workLanguage: "Work language",
    experienceLevel: "Experience",
    salaryLabel: "Salary",
    published: "Posted",
    applyModalTitle: "Apply for this job",
    messageLabel: "Message (optional)",
    expectedSalaryLabel: "Expected salary",
    availabilityLabel: "Available from",
    sendApplication: "Send application",
    alreadyApplied: "Already applied",
    loginToApply: "Log in to apply",
    loginToSave: "Log in to save this job"
  },
  dashboard: {
    welcome: "Welcome back",
    newMatches: "New matched jobs",
    activeApplications: "Active applications",
    profileViews: "Profile views",
    interviews: "Interview invitations",
    passportCompleteness: "Career Passport completeness",
    myApplications: "Your applications",
    recommended: "Recommended for you",
    tabOverview: "Overview",
    tabApplications: "My applications",
    tabSaved: "Saved jobs",
    tabPassport: "Career Passport",
    tabAlerts: "Alerts",
    tabSettings: "Settings",
    savedJobsCount: "Saved jobs",
    noApplications: "You don't have any applications yet.",
    noSaved: "You haven't saved any jobs yet.",
    noRecommended: "No recommendations yet.",
    alertsComingSoon: "Email alerts about new matching jobs will appear here soon.",
    settingsTitle: "Account settings",
    settingsSaved: "Changes saved",
    withdraw: "Withdraw application",
    withdrawn: "Application withdrawn",
    demoView: "Demo view"
  },
  auth: {
    loginTitle: "Log in to Rabotaj",
    registerTitle: "Create your Rabotaj account",
    email: "Email address",
    password: "Password",
    fullName: "Full name",
    firstName: "First name",
    lastName: "Last name",
    confirmPassword: "Confirm password",
    loginCta: "Log in",
    registerCta: "Create account",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    registerLink: "Sign up",
    loginLink: "Log in",
    roleQuestion: "Who are you?",
    roleCandidate: "I'm looking for a job",
    roleEmployer: "I'm hiring",
    forgotPassword: "Forgot your password?",
    resetPasswordTitle: "Reset your password",
    resetPasswordIntro: "Enter the email address linked to your account — we'll send you a link to set a new password.",
    resetPasswordCta: "Send reset link",
    resetPasswordSuccess: "If an account exists, we've sent a password reset link to that email address.",
    updatePasswordTitle: "Set a new password",
    updatePasswordCta: "Save new password",
    updatePasswordSuccess: "Your password has been updated.",
    registerSuccessCheckEmail: "Check your inbox to confirm your account.",
    backendNotConfigured: "The backend isn't configured yet. Please contact the site administrator.",
    genericError: "Something went wrong. Please try again.",
    invalidCredentials: "Invalid email or password.",
    emailAlreadyRegistered: "This email address is already registered.",
    linkExpired: "This link has expired or is invalid. Please request a new one.",
    accountBlocked: "This account has been blocked. Please contact support."
  },
  workModel: {
    remote: "Remote work",
    hybrid: "Hybrid work",
    onsite: "On-site work"
  },
  toast: {
    jobSaved: "Job saved",
    jobUnsaved: "Removed from saved",
    applicationSent: "Application sent!",
    languageChanged: "Language changed",
    statusUpdated: "Application status updated"
  },
  rabotajScore: {
    title: "Rabotaj Score",
    titleMark: "Rabotaj Score™",
    levels: {
      excellent: "Excellent transparency",
      good: "Good transparency",
      average: "Average transparency",
      low: "Low transparency"
    },
    shortDisclaimer:
      "This score shows how complete and transparent this job posting is. It does not rate the employer or guarantee employment.",
    fullDisclaimer:
      "Rabotaj Score rates the completeness and transparency of a job posting based on the information provided on the platform. It is not an employer rating, a recommendation, or a guarantee of employment terms.",
    tooltipDisclaimer:
      "This score relates to the completeness and transparency of the posting. It is not an employer rating or a guarantee of employment.",
    metCriteriaTitle: "Criteria met",
    missingCriteriaTitle: "Missing information",
    improveScore: "Improve score",
    whatToImprove: "What to improve to increase the score?",
    howWeCalculate: "How do we calculate this score?",
    howWeCalculateIntro:
      "Rabotaj Score rates the completeness and transparency of a job posting on a 0–100 scale. Every criterion is based on information provided by the employer — not user opinions or ratings.",
    fillField: "Fill in",
    points: "pts",
    liveScoreLabel: "Live Rabotaj Score",
    companyAvgLabel: "Average Rabotaj Score of active listings",
    companyAvgExplain: "This score relates to job posting transparency, not an overall employer rating.",
    minScoreFilter: "Minimum Rabotaj Score",
    sortHighestScore: "Highest Rabotaj Score",
    criteriaMet: {
      salaryRange: "Salary range provided",
      verifiedEmployer: "Company has been verified",
      contractType: "Contract type provided",
      workModel: "Work model specified",
      location: "Location provided",
      workLanguage: "Work language provided",
      responsibilities: "Responsibilities described",
      requirements: "Requirements described",
      benefits: "Benefits provided",
      recruitmentProcess: "Recruitment process described",
      expectedResponseTime: "Expected response time provided",
      startDate: "Start date provided"
    },
    criteriaMissing: {
      salaryRange: "Add a salary range",
      verifiedEmployer: "Company has not been verified yet",
      contractType: "Add a contract type",
      workModel: "Specify a work model",
      location: "Add a location",
      workLanguage: "Provide the work language",
      responsibilities: "Describe the responsibilities",
      requirements: "Describe the requirements",
      benefits: "Add benefits",
      recruitmentProcess: "Describe the recruitment process",
      expectedResponseTime: "Specify the response time",
      startDate: "Provide the start date"
    }
  },
  legalPages: {
    aboutIntro: "Rabotaj.com is a job platform prototype for Poland, Ukraine and Central/Eastern Europe.",
    aboutBody:
      "We're building Rabotaj.com as a place where candidates can find transparent job listings across Poland and Europe, and employers can reach candidates ready to work or relocate. This version of the site is a demo prototype — job, company and account data is sample data.",
    contactIntro: "Questions about this prototype? Get in touch.",
    contactEmailLabel: "Email",
    contactNote: "This is a demo version — messages sent from this form don't reach any team.",
    termsIntro: "A short terms summary for the demo version of Rabotaj.com.",
    termsBody: [
      "Rabotaj.com in its current form is a functional prototype presented for demonstration purposes.",
      "Job listings, company profiles and user accounts shown in the site are sample data and do not represent real job offers.",
      "Using the forms (registration, applying, posting a job) does not create any legal or financial obligation."
    ],
    privacyIntro: "A short privacy summary for the demo version of Rabotaj.com.",
    privacyBody: [
      "In the demo version, data entered in forms may be stored only locally in your browser (e.g. saved jobs) or, once a backend is configured, in a database used for testing purposes.",
      "We don't share data with third parties or use it for marketing purposes.",
      "The final, production privacy policy will be published alongside the full launch of the service."
    ]
  }
};

export default en;
