export type WorkModel = "remote" | "hybrid" | "onsite";
export type ContractType = "Umowa o pracę" | "B2B" | "Umowa zlecenie" | "Praca tymczasowa";
export type ExperienceLevel = "Bez doświadczenia" | "Junior" | "Mid" | "Senior";

export type Job = {
  slug: string;
  title: string;
  companySlug: string;
  city: string;
  country: string;
  workModel: WorkModel;
  contractType: ContractType;
  experience: ExperienceLevel;
  industry: string;
  language: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  skills: string[];
  publishedAt: string;
  matchPercent: number;
  verifiedEmployer: boolean;
  salaryDisclosed: boolean;
  remote: boolean;
  noCv: boolean;
  respondsFast: boolean;
  accommodation: boolean;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  process: string[];
  /** Free-text expected response time from the employer, e.g. "Zwykle w ciągu 2 dni roboczych". Optional — feeds Rabotaj Score. */
  expectedResponseTime?: string;
  /** Free-text start date or availability, e.g. "Od zaraz". Optional — feeds Rabotaj Score. */
  startDate?: string;
};

export const jobs: Job[] = [
  {
    slug: "senior-frontend-developer-technova",
    title: "Senior Frontend Developer",
    companySlug: "technova",
    city: "Warszawa",
    country: "Polska",
    workModel: "hybrid",
    contractType: "B2B",
    experience: "Senior",
    industry: "IT",
    language: "polski / angielski",
    salaryMin: 18000,
    salaryMax: 24000,
    currency: "PLN",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    publishedAt: "2026-07-08",
    matchPercent: 92,
    verifiedEmployer: true,
    salaryDisclosed: true,
    remote: false,
    noCv: false,
    respondsFast: true,
    accommodation: false,
    description:
      "Dołącz do zespołu produktowego TechNova i współtwórz platformę wykorzystywaną przez klientów korporacyjnych w całej Europie. Pracujesz w modelu hybrydowym z biura w Warszawie, w zespole 6 frontend developerów.",
    responsibilities: [
      "Rozwój i utrzymanie aplikacji React/Next.js dla klientów korporacyjnych",
      "Współpraca z zespołem UX/UI przy wdrażaniu nowych komponentów",
      "Code review i dbanie o jakość kodu w zespole",
      "Optymalizacja wydajności aplikacji"
    ],
    requirements: [
      "Min. 4 lata komercyjnego doświadczenia z React",
      "Bardzo dobra znajomość TypeScript",
      "Doświadczenie z Next.js App Router",
      "Znajomość języka angielskiego na poziomie B2+"
    ],
    benefits: [
      "Elastyczne godziny pracy",
      "Budżet szkoleniowy 4000 zł rocznie",
      "Prywatna opieka medyczna",
      "Karta sportowa"
    ],
    process: [
      "Rozmowa telefoniczna z rekruterem (20 min)",
      "Zadanie techniczne do wykonania w domu",
      "Rozmowa techniczna z zespołem",
      "Oferta"
    ],
    expectedResponseTime: "Zwykle w ciągu 2 dni roboczych",
    startDate: "Od zaraz"
  },
  {
    slug: "operator-cnc-baltic-manufacturing",
    title: "Operator CNC",
    companySlug: "baltic-manufacturing",
    city: "Gdynia",
    country: "Polska",
    workModel: "onsite",
    contractType: "Umowa o pracę",
    experience: "Mid",
    industry: "Produkcja",
    language: "polski",
    salaryMin: 6500,
    salaryMax: 8200,
    currency: "PLN",
    skills: ["Obsługa CNC", "Czytanie rysunku technicznego", "Kontrola jakości"],
    publishedAt: "2026-07-09",
    matchPercent: 88,
    verifiedEmployer: true,
    salaryDisclosed: true,
    remote: false,
    noCv: true,
    respondsFast: false,
    accommodation: false,
    description:
      "Baltic Manufacturing poszukuje operatora obrabiarek CNC do zakładu produkcyjnego w Gdyni. Praca zmianowa, przy nowoczesnym parku maszynowym, w stabilnym zespole produkcyjnym.",
    responsibilities: [
      "Obsługa i nadzór nad pracą obrabiarek CNC",
      "Kontrola jakości wykonywanych elementów",
      "Podstawowa konserwacja maszyn",
      "Dokumentowanie wyników produkcji"
    ],
    requirements: [
      "Doświadczenie w obsłudze obrabiarek CNC min. 2 lata",
      "Umiejętność czytania rysunku technicznego",
      "Gotowość do pracy w systemie zmianowym",
      "Dokładność i systematyczność"
    ],
    benefits: [
      "Stabilne zatrudnienie na umowę o pracę",
      "Premia frekwencyjna",
      "Dofinansowanie posiłków",
      "Pakiet socjalny"
    ],
    process: [
      "Rozmowa z działem HR",
      "Test praktyczny na hali produkcyjnej",
      "Decyzja w ciągu 3 dni roboczych"
    ],
    expectedResponseTime: "Zwykle w ciągu 3 dni roboczych"
  },
  {
    slug: "kierowca-c-e-nordcargo",
    title: "Kierowca C+E",
    companySlug: "nordcargo",
    city: "Gdańsk",
    country: "Polska",
    workModel: "onsite",
    contractType: "Umowa o pracę",
    experience: "Mid",
    industry: "Transport",
    language: "polski / angielski",
    salaryMin: 7500,
    salaryMax: 10500,
    currency: "PLN",
    skills: ["Prawo jazdy kat. C+E", "Karta kierowcy", "Trasy międzynarodowe"],
    publishedAt: "2026-07-10",
    matchPercent: 85,
    verifiedEmployer: true,
    salaryDisclosed: true,
    remote: false,
    noCv: true,
    respondsFast: true,
    accommodation: false,
    description:
      "NordCargo zatrudni kierowców kategorii C+E do transportu międzynarodowego na trasach Polska–Skandynawia. Nowoczesna flota, stałe trasy, wsparcie logistyczne 24/7.",
    responsibilities: [
      "Transport towarów na trasach międzynarodowych Polska–Skandynawia",
      "Dbałość o powierzony pojazd i ładunek",
      "Prowadzenie dokumentacji przewozowej",
      "Kontakt z dyspozytorem"
    ],
    requirements: [
      "Prawo jazdy kat. C+E",
      "Aktualna karta kierowcy i kwalifikacja wstępna",
      "Min. 2 lata doświadczenia w transporcie międzynarodowym",
      "Podstawowa znajomość języka angielskiego"
    ],
    benefits: [
      "Nowoczesna flota pojazdów (do 2 lat)",
      "Diety zgodne z przepisami",
      "Stałe trasy — powroty co 2 tygodnie",
      "Prywatna opieka medyczna"
    ],
    process: []
  },
  {
    slug: "specjalista-ds-sprzedazy-primehome",
    title: "Specjalista ds. sprzedaży",
    companySlug: "primehome-retail",
    city: "Poznań",
    country: "Polska",
    workModel: "onsite",
    contractType: "Umowa o pracę",
    experience: "Junior",
    industry: "Sprzedaż",
    language: "polski",
    salaryMin: 5200,
    salaryMax: 7800,
    currency: "PLN",
    skills: ["Obsługa klienta", "Negocjacje", "Sprzedaż stacjonarna"],
    publishedAt: "2026-07-07",
    matchPercent: 79,
    verifiedEmployer: true,
    salaryDisclosed: true,
    remote: false,
    noCv: true,
    respondsFast: true,
    accommodation: false,
    description:
      "PrimeHome Retail poszukuje specjalisty ds. sprzedaży do salonu wyposażenia wnętrz w Poznaniu. Praca z klientem indywidualnym, jasny system prowizyjny, pełne wdrożenie produktowe.",
    responsibilities: [
      "Obsługa klientów w salonie sprzedaży",
      "Doradztwo w doborze produktów wyposażenia wnętrz",
      "Realizacja indywidualnych i zespołowych celów sprzedażowych",
      "Dbałość o ekspozycję produktów"
    ],
    requirements: [],
    benefits: [],
    process: [
      "Rozmowa z kierownikiem salonu",
      "Dzień próbny",
      "Oferta zatrudnienia"
    ]
  },
  {
    slug: "magazynier-z-zakwaterowaniem-nordcargo",
    title: "Magazynier z zakwaterowaniem",
    companySlug: "nordcargo",
    city: "Gdańsk",
    country: "Polska",
    workModel: "onsite",
    contractType: "Praca tymczasowa",
    experience: "Bez doświadczenia",
    industry: "Logistyka",
    language: "polski / ukraiński",
    salaryMin: 4800,
    salaryMax: 6200,
    currency: "PLN",
    skills: ["Obsługa wózka widłowego", "Kompletacja zamówień"],
    publishedAt: "2026-07-11",
    matchPercent: 81,
    verifiedEmployer: false,
    salaryDisclosed: true,
    remote: false,
    noCv: true,
    respondsFast: true,
    accommodation: true,
    description:
      "NordCargo zatrudni magazynierów do nowoczesnego centrum logistycznego w Gdańsku. Zapewniamy bezpłatne zakwaterowanie w pobliżu zakładu oraz transport na pierwszą zmianę.",
    responsibilities: [
      "Kompletacja i pakowanie zamówień",
      "Rozładunek i załadunek towaru",
      "Obsługa skanera magazynowego",
      "Dbałość o porządek na magazynie"
    ],
    requirements: [],
    benefits: [
      "Bezpłatne zakwaterowanie w pobliżu zakładu",
      "Transport z miejsca zakwaterowania",
      "Możliwość przejścia na umowę stałą",
      "Premie za frekwencję"
    ],
    process: []
  },
  {
    slug: "ux-ui-designer-brightdesk",
    title: "UX/UI Designer",
    companySlug: "brightdesk",
    city: "Kraków",
    country: "Polska",
    workModel: "remote",
    contractType: "B2B",
    experience: "Mid",
    industry: "IT",
    language: "polski / angielski",
    salaryMin: 12000,
    salaryMax: 17000,
    currency: "PLN",
    skills: ["Figma", "Design systems", "Badania UX"],
    publishedAt: "2026-07-06",
    matchPercent: 90,
    verifiedEmployer: true,
    salaryDisclosed: true,
    remote: true,
    noCv: false,
    respondsFast: true,
    accommodation: false,
    description:
      "BrightDesk poszukuje UX/UI Designera do zespołu produktowego pracującego nad platformą SaaS dla działów HR. Praca w pełni zdalna, z okazjonalnymi wyjazdami integracyjnymi do biura w Krakowie.",
    responsibilities: [
      "Projektowanie interfejsów aplikacji webowej",
      "Prowadzenie badań użyteczności z użytkownikami",
      "Rozwój i utrzymanie design systemu",
      "Ścisła współpraca z zespołem frontend"
    ],
    requirements: [
      "Min. 3 lata doświadczenia w projektowaniu produktów cyfrowych",
      "Bardzo dobra znajomość Figma",
      "Portfolio z projektami SaaS/B2B",
      "Znajomość podstaw badań UX"
    ],
    benefits: [
      "Praca w pełni zdalna",
      "Elastyczne godziny pracy",
      "Budżet na sprzęt i narzędzia",
      "Coroczny wyjazd integracyjny zespołu"
    ],
    process: [
      "Rozmowa wstępna z Head of Design",
      "Przegląd portfolio",
      "Zadanie projektowe",
      "Oferta"
    ]
  },
  {
    slug: "magazynier-produkcyjny-niemcy-workline",
    title: "Pracownik produkcji z zakwaterowaniem (Niemcy)",
    companySlug: "workline-europe",
    city: "Berlin",
    country: "Niemcy",
    workModel: "onsite",
    contractType: "Umowa o pracę",
    experience: "Bez doświadczenia",
    industry: "Produkcja",
    language: "polski / niemiecki",
    salaryMin: 2400,
    salaryMax: 2900,
    currency: "EUR",
    skills: ["Praca fizyczna", "Praca zmianowa"],
    publishedAt: "2026-07-05",
    matchPercent: 76,
    verifiedEmployer: true,
    salaryDisclosed: true,
    remote: false,
    noCv: true,
    respondsFast: true,
    accommodation: true,
    description:
      "WorkLine Europe rekrutuje pracowników produkcji do zakładu przemysłowego w okolicach Berlina. Legalne zatrudnienie, zakwaterowanie zapewnione, wsparcie formalne od pierwszego dnia.",
    responsibilities: [
      "Praca przy linii produkcyjnej",
      "Kontrola jakości wyrobów",
      "Pakowanie i przygotowanie towaru do wysyłki",
      "Przestrzeganie zasad BHP"
    ],
    requirements: [
      "Brak wymaganego doświadczenia",
      "Gotowość do wyjazdu i pracy zmianowej",
      "Podstawowa znajomość języka niemieckiego lub angielskiego mile widziana",
      "Aktualny paszport lub dowód osobisty"
    ],
    benefits: [],
    process: []
  },
  {
    slug: "spawacz-mig-mag-baltic-manufacturing",
    title: "Spawacz MIG/MAG",
    companySlug: "baltic-manufacturing",
    city: "Gdynia",
    country: "Polska",
    workModel: "onsite",
    contractType: "Umowa o pracę",
    experience: "Mid",
    industry: "Produkcja",
    language: "polski",
    salaryMin: 6800,
    salaryMax: 9000,
    currency: "PLN",
    skills: ["Spawanie MIG/MAG", "Czytanie dokumentacji technicznej"],
    publishedAt: "2026-07-04",
    matchPercent: 83,
    verifiedEmployer: true,
    salaryDisclosed: false,
    remote: false,
    noCv: true,
    respondsFast: false,
    accommodation: false,
    description:
      "Baltic Manufacturing poszukuje doświadczonego spawacza MIG/MAG do produkcji komponentów dla przemysłu morskiego. Praca w stabilnym, doświadczonym zespole.",
    responsibilities: [
      "Spawanie elementów konstrukcji stalowych metodą MIG/MAG",
      "Kontrola jakości spoin",
      "Współpraca z działem jakości",
      "Dbałość o narzędzia i stanowisko pracy"
    ],
    requirements: [
      "Uprawnienia spawalnicze MIG/MAG",
      "Min. 3 lata doświadczenia zawodowego",
      "Umiejętność czytania dokumentacji technicznej",
      "Dokładność i dbałość o jakość"
    ],
    benefits: [],
    process: []
  },
  {
    slug: "backend-developer-node-technova",
    title: "Backend Developer (Node.js)",
    companySlug: "technova",
    city: "Wrocław",
    country: "Polska",
    workModel: "hybrid",
    contractType: "B2B",
    experience: "Mid",
    industry: "IT",
    language: "polski / angielski",
    salaryMin: 14000,
    salaryMax: 19000,
    currency: "PLN",
    skills: ["Node.js", "PostgreSQL", "Docker", "REST API"],
    publishedAt: "2026-07-03",
    matchPercent: 87,
    verifiedEmployer: true,
    salaryDisclosed: true,
    remote: false,
    noCv: false,
    respondsFast: true,
    accommodation: false,
    description:
      "Dołącz do zespołu backendowego TechNova pracującego nad skalowalną platformą B2B. Praca hybrydowa z biura we Wrocławiu, nowoczesny stos technologiczny.",
    responsibilities: [
      "Projektowanie i rozwój API REST",
      "Optymalizacja zapytań do bazy danych",
      "Współpraca z zespołem DevOps przy wdrożeniach",
      "Udział w planowaniu architektury systemu"
    ],
    requirements: [
      "Min. 3 lata doświadczenia z Node.js",
      "Dobra znajomość PostgreSQL",
      "Doświadczenie z Docker",
      "Znajomość zasad projektowania API"
    ],
    benefits: ["Elastyczne godziny pracy", "Budżet szkoleniowy", "Prywatna opieka medyczna", "Karta sportowa"],
    process: ["Rozmowa z rekruterem", "Zadanie techniczne", "Rozmowa z zespołem", "Oferta"],
    startDate: "Od zaraz"
  },
  {
    slug: "kierowca-kat-b-dostawca-primehome",
    title: "Kierowca-dostawca kat. B",
    companySlug: "primehome-retail",
    city: "Poznań",
    country: "Polska",
    workModel: "onsite",
    contractType: "Umowa zlecenie",
    experience: "Bez doświadczenia",
    industry: "Transport",
    language: "polski",
    salaryMin: 4500,
    salaryMax: 5800,
    currency: "PLN",
    skills: ["Prawo jazdy kat. B", "Obsługa klienta"],
    publishedAt: "2026-07-09",
    matchPercent: 74,
    verifiedEmployer: true,
    salaryDisclosed: true,
    remote: false,
    noCv: true,
    respondsFast: true,
    accommodation: false,
    description:
      "PrimeHome Retail poszukuje kierowcy-dostawcy do realizacji dostaw mebli i wyposażenia wnętrz na terenie Poznania i okolic.",
    responsibilities: [
      "Dostawa zamówień do klientów indywidualnych",
      "Wnoszenie i montaż podstawowy dostarczanych mebli",
      "Kontakt z klientem podczas dostawy",
      "Dbałość o powierzony pojazd"
    ],
    requirements: [],
    benefits: ["Elastyczny grafik", "Paliwo i eksploatacja pokryte przez firmę", "Premie za terminowość"],
    process: []
  },
  {
    slug: "kelner-kelnerka-berlin-workline",
    title: "Kelner/Kelnerka (Niemcy, zakwaterowanie)",
    companySlug: "workline-europe",
    city: "Berlin",
    country: "Niemcy",
    workModel: "onsite",
    contractType: "Umowa o pracę",
    experience: "Bez doświadczenia",
    industry: "Gastronomia",
    language: "polski / niemiecki",
    salaryMin: 2200,
    salaryMax: 2700,
    currency: "EUR",
    skills: ["Obsługa gościa", "Praca zespołowa"],
    publishedAt: "2026-07-02",
    matchPercent: 71,
    verifiedEmployer: false,
    salaryDisclosed: false,
    remote: false,
    noCv: true,
    respondsFast: true,
    accommodation: true,
    description:
      "WorkLine Europe rekrutuje personel sali dla sieci restauracji w Berlinie. Zakwaterowanie zapewnione, praca legalna na podstawie umowy niemieckiej.",
    responsibilities: [
      "Obsługa gości przy stoliku",
      "Przyjmowanie zamówień i serwowanie dań",
      "Dbałość o standard obsługi",
      "Współpraca z zespołem kuchni"
    ],
    requirements: [
      "Brak wymaganego doświadczenia",
      "Podstawowa znajomość niemieckiego lub angielskiego",
      "Miła aparycja i komunikatywność",
      "Gotowość do pracy zmianowej, także w weekendy"
    ],
    benefits: ["Zakwaterowanie zapewnione", "Napiwki", "Wsparcie formalne", "Posiłki pracownicze"],
    process: []
  },
  {
    slug: "specjalista-hr-technova",
    title: "Specjalista ds. rekrutacji IT",
    companySlug: "technova",
    city: "Warszawa",
    country: "Polska",
    workModel: "hybrid",
    contractType: "Umowa o pracę",
    experience: "Mid",
    industry: "HR",
    language: "polski / angielski",
    salaryMin: 8500,
    salaryMax: 11500,
    currency: "PLN",
    skills: ["Rekrutacja IT", "LinkedIn Recruiter", "Employer branding"],
    publishedAt: "2026-07-01",
    matchPercent: 78,
    verifiedEmployer: false,
    salaryDisclosed: false,
    remote: false,
    noCv: false,
    respondsFast: true,
    accommodation: false,
    description:
      "TechNova poszukuje specjalisty ds. rekrutacji IT, który odpowiadać będzie za pełny proces rekrutacji na stanowiska techniczne w rosnących zespołach produktowych.",
    responsibilities: [
      "Prowadzenie procesów rekrutacyjnych na stanowiska IT",
      "Aktywne poszukiwanie kandydatów (sourcing)",
      "Współpraca z hiring managerami",
      "Dbałość o doświadczenie kandydata"
    ],
    requirements: [],
    benefits: ["Elastyczne godziny pracy", "Prywatna opieka medyczna", "Budżet szkoleniowy", "Karta sportowa"],
    process: ["Rozmowa z People Team", "Case study rekrutacyjny", "Rozmowa z zespołem", "Oferta"]
  },
  {
    slug: "monter-konstrukcji-stalowych-baltic",
    title: "Monter konstrukcji stalowych",
    companySlug: "baltic-manufacturing",
    city: "Gdynia",
    country: "Polska",
    workModel: "onsite",
    contractType: "Umowa o pracę",
    experience: "Junior",
    industry: "Budownictwo",
    language: "polski",
    salaryMin: 5800,
    salaryMax: 7400,
    currency: "PLN",
    skills: ["Montaż konstrukcji", "Praca na wysokości", "BHP"],
    publishedAt: "2026-06-30",
    matchPercent: 69,
    verifiedEmployer: true,
    salaryDisclosed: false,
    remote: false,
    noCv: true,
    respondsFast: false,
    accommodation: false,
    description:
      "Baltic Manufacturing zatrudni montera konstrukcji stalowych do zespołu realizującego projekty dla przemysłu morskiego i budowlanego.",
    responsibilities: [
      "Montaż konstrukcji stalowych na podstawie dokumentacji",
      "Praca zgodnie z zasadami BHP",
      "Współpraca z brygadzistą i zespołem montażowym",
      "Dbałość o narzędzia i sprzęt"
    ],
    requirements: [
      "Uprawnienia do pracy na wysokości mile widziane",
      "Podstawowe doświadczenie w montażu konstrukcji",
      "Dyspozycyjność i dobra kondycja fizyczna",
      "Aktualne badania BHP"
    ],
    benefits: [],
    process: ["Rozmowa z kierownikiem budowy", "Weryfikacja uprawnień", "Oferta zatrudnienia"]
  },
  {
    slug: "product-designer-remote-brightdesk",
    title: "Product Designer (praca zdalna)",
    companySlug: "brightdesk",
    city: "Zdalnie",
    country: "Polska",
    workModel: "remote",
    contractType: "B2B",
    experience: "Senior",
    industry: "IT",
    language: "angielski",
    salaryMin: 15000,
    salaryMax: 21000,
    currency: "PLN",
    skills: ["Figma", "Product design", "Design systems", "Prototypowanie"],
    publishedAt: "2026-06-29",
    matchPercent: 94,
    verifiedEmployer: false,
    salaryDisclosed: false,
    remote: true,
    noCv: false,
    respondsFast: true,
    accommodation: false,
    description:
      "BrightDesk poszukuje Senior Product Designera do w pełni zdalnego zespołu pracującego nad platformą SaaS dla klientów w Europie i USA.",
    responsibilities: [
      "Prowadzenie projektów produktowych od koncepcji po wdrożenie",
      "Rozwój i utrzymanie design systemu",
      "Mentoring młodszych projektantów",
      "Bliska współpraca z Product Managerem"
    ],
    requirements: [
      "Min. 5 lat doświadczenia w projektowaniu produktów cyfrowych",
      "Portfolio projektów SaaS",
      "Bardzo dobra znajomość języka angielskiego",
      "Doświadczenie w pracy zdalnej i asynchronicznej"
    ],
    benefits: [],
    process: []
  }
];

export function getJobBySlug(slug: string) {
  return jobs.find((job) => job.slug === slug);
}

export function getSimilarJobs(job: Job, limit = 3) {
  return jobs
    .filter((candidate) => candidate.slug !== job.slug && candidate.industry === job.industry)
    .slice(0, limit);
}
