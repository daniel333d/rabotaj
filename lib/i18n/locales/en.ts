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
    gross: "gross"
  },
  nav: {
    jobs: "Jobs",
    companies: "Companies",
    salary: "Salaries",
    careerCenter: "Career Center",
    employers: "For Employers",
    login: "Log in",
    register: "Sign up",
    postJob: "Post a job"
  },
  hero: {
    headline: "Work without borders.",
    subtitle:
      "Find a trusted job in Poland and across Europe. Create one career profile, apply faster and track every stage of recruitment.",
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
    intro: "Freshly posted roles from trusted employers across Poland and Europe.",
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
    title: "We verify employers before they join Rabotaj",
    text: "Every company with a Verified Employer badge has passed a check of its registration data and hiring practices, so you can apply with more confidence.",
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
    ]
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
    abroadText: "Legal job offers in Germany, the Netherlands and other EU countries, many with accommodation included.",
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
    filterRemote: "Remote work",
    filterSalary: "Salary",
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
    benefits: "Benefits",
    process: "Recruitment process",
    aboutCompany: "About the company",
    similarJobs: "Similar jobs",
    contractType: "Employment type",
    workModel: "Work model",
    location: "Location",
    salaryLabel: "Salary",
    published: "Posted"
  },
  dashboard: {
    welcome: "Welcome back",
    newMatches: "New matched jobs",
    activeApplications: "Active applications",
    profileViews: "Profile views",
    interviews: "Interview invitations",
    passportCompleteness: "Career Passport completeness",
    myApplications: "Your applications",
    recommended: "Recommended for you"
  },
  auth: {
    loginTitle: "Log in to Rabotaj",
    registerTitle: "Create your Rabotaj account",
    email: "Email address",
    password: "Password",
    fullName: "Full name",
    loginCta: "Log in",
    registerCta: "Create account",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    registerLink: "Sign up",
    loginLink: "Log in"
  },
  toast: {
    jobSaved: "Job saved",
    jobUnsaved: "Removed from saved",
    applicationSent: "Application sent!",
    languageChanged: "Language changed",
    statusUpdated: "Application status updated"
  }
};

export default en;
