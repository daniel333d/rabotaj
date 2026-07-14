export type Company = {
  slug: string;
  name: string;
  initials: string;
  color: string;
  industry: string;
  country: string;
  city: string;
  openJobs: number;
  responseTime: string;
  verified: boolean;
  salaryDisclosed: boolean;
  respondsFast: boolean;
  foreignerFriendly: boolean;
  description: string;
  size: string;
  founded: number;
};

export const companies: Company[] = [
  {
    slug: "technova",
    name: "TechNova",
    initials: "TN",
    color: "#2563EB",
    industry: "IT i technologia",
    country: "Polska",
    city: "Warszawa",
    openJobs: 8,
    responseTime: "1 dzień",
    verified: true,
    salaryDisclosed: true,
    respondsFast: true,
    foreignerFriendly: true,
    description:
      "TechNova buduje produkty cyfrowe dla klientów w Polsce i Europie Zachodniej. Zespoły produktowe pracują w modelu hybrydowym z biurami w Warszawie i Wrocławiu.",
    size: "120-250 pracowników",
    founded: 2016
  },
  {
    slug: "nordcargo",
    name: "NordCargo",
    initials: "NC",
    color: "#16A36A",
    industry: "Transport i logistyka",
    country: "Polska",
    city: "Gdańsk",
    openJobs: 14,
    responseTime: "2 dni",
    verified: true,
    salaryDisclosed: true,
    respondsFast: true,
    foreignerFriendly: true,
    description:
      "NordCargo obsługuje międzynarodowy transport drogowy i morski na trasach Polska–Skandynawia–Europa Zachodnia. Zatrudnia kierowców, spedytorów i pracowników magazynowych.",
    size: "300-500 pracowników",
    founded: 2005
  },
  {
    slug: "workline-europe",
    name: "WorkLine Europe",
    initials: "WE",
    color: "#0B1220",
    industry: "Agencja zatrudnienia",
    country: "Niemcy",
    city: "Berlin",
    openJobs: 21,
    responseTime: "1 dzień",
    verified: true,
    salaryDisclosed: true,
    respondsFast: true,
    foreignerFriendly: true,
    description:
      "WorkLine Europe pośredniczy w legalnym zatrudnieniu obywateli Polski i Ukrainy w Niemczech i Holandii, zapewniając zakwaterowanie i wsparcie formalne od pierwszego dnia.",
    size: "50-120 pracowników",
    founded: 2012
  },
  {
    slug: "baltic-manufacturing",
    name: "Baltic Manufacturing",
    initials: "BM",
    color: "#667085",
    industry: "Produkcja przemysłowa",
    country: "Polska",
    city: "Gdynia",
    openJobs: 11,
    responseTime: "3 dni",
    verified: true,
    salaryDisclosed: true,
    respondsFast: false,
    foreignerFriendly: true,
    description:
      "Baltic Manufacturing produkuje komponenty metalowe dla przemysłu morskiego i motoryzacyjnego. Zakład w Gdyni zatrudnia operatorów CNC, spawaczy i pracowników produkcji.",
    size: "500-800 pracowników",
    founded: 1998
  },
  {
    slug: "brightdesk",
    name: "BrightDesk",
    initials: "BD",
    color: "#2563EB",
    industry: "IT i technologia",
    country: "Polska",
    city: "Kraków",
    openJobs: 5,
    responseTime: "1 dzień",
    verified: true,
    salaryDisclosed: true,
    respondsFast: true,
    foreignerFriendly: true,
    description:
      "BrightDesk tworzy oprogramowanie SaaS dla działów HR w firmach średniej wielkości w Europie Środkowej. Praca w pełni zdalna lub hybrydowa z biura w Krakowie.",
    size: "40-80 pracowników",
    founded: 2019
  },
  {
    slug: "primehome-retail",
    name: "PrimeHome Retail",
    initials: "PR",
    color: "#16A36A",
    industry: "Handel i sprzedaż",
    country: "Polska",
    city: "Poznań",
    openJobs: 9,
    responseTime: "2 dni",
    verified: true,
    salaryDisclosed: true,
    respondsFast: true,
    foreignerFriendly: false,
    description:
      "PrimeHome Retail zarządza siecią salonów wyposażenia wnętrz w Polsce. Zespoły sprzedaży pracują w oparciu o jasny system prowizyjny i regularne szkolenia produktowe.",
    size: "200-400 pracowników",
    founded: 2009
  },
  {
    slug: "greenfields-logistics",
    name: "GreenFields Logistics",
    initials: "GL",
    color: "#0891B2",
    industry: "Transport i logistyka",
    country: "Holandia",
    city: "Rotterdam",
    openJobs: 5,
    responseTime: "3 dni",
    verified: true,
    salaryDisclosed: true,
    respondsFast: false,
    foreignerFriendly: true,
    description:
      "GreenFields Logistics obsługuje centra dystrybucyjne dla klientów e-commerce w Beneluksie, zatrudniając pracowników magazynowych, kierowców i specjalistów ds. logistyki.",
    size: "150-300 pracowników",
    founded: 2011
  },
  {
    slug: "alpine-precision",
    name: "Alpine Precision",
    initials: "AP",
    color: "#7C3AED",
    industry: "Produkcja przemysłowa",
    country: "Czechy",
    city: "Praga",
    openJobs: 4,
    responseTime: "3 dni",
    verified: false,
    salaryDisclosed: true,
    respondsFast: false,
    foreignerFriendly: true,
    description:
      "Alpine Precision produkuje precyzyjne komponenty dla przemysłu motoryzacyjnego w Europie Środkowej, zatrudniając operatorów CNC, techników jakości i inżynierów procesu.",
    size: "80-150 pracowników",
    founded: 2007
  }
];

export function getCompanyBySlug(slug: string) {
  return companies.find((company) => company.slug === slug);
}
