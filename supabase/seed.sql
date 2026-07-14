-- Rabotaj.com — demo seed data
-- NOT run automatically anywhere (no build/deploy step calls this file).
-- Intended for a local Supabase instance (`supabase start` + `supabase db reset`)
-- or a fresh remote dev project. Run manually, e.g.:
--   psql "$DATABASE_URL" -f supabase/seed.sql
-- Demo login password for every seeded account: Password123!
--
-- This inserts directly into auth.users/auth.identities to satisfy the
-- profiles -> auth.users foreign key. The exact required auth.users columns
-- can vary slightly between Supabase versions — if this errors on your
-- project, compare against `\d auth.users` and adjust accordingly.

-- =========================================================================
-- Demo auth users (8 employers, 2 candidates) -> profiles auto-created by
-- the handle_new_user trigger from raw_user_meta_data.
-- =========================================================================

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
) values
  ('00000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'employer.technova@example.com', crypt('Password123!', gen_salt('bf')), now(), now(), '{"provider":"email","providers":["email"]}', '{"role":"employer","first_name":"Anna","last_name":"Wisniewska"}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'employer.nordcargo@example.com', crypt('Password123!', gen_salt('bf')), now(), now(), '{"provider":"email","providers":["email"]}', '{"role":"employer","first_name":"Marek","last_name":"Nowicki"}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated', 'employer.workline@example.com', crypt('Password123!', gen_salt('bf')), now(), now(), '{"provider":"email","providers":["email"]}', '{"role":"employer","first_name":"Julia","last_name":"Schmidt"}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000004', 'authenticated', 'authenticated', 'employer.baltic@example.com', crypt('Password123!', gen_salt('bf')), now(), now(), '{"provider":"email","providers":["email"]}', '{"role":"employer","first_name":"Piotr","last_name":"Kowalczyk"}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000005', 'authenticated', 'authenticated', 'employer.brightdesk@example.com', crypt('Password123!', gen_salt('bf')), now(), now(), '{"provider":"email","providers":["email"]}', '{"role":"employer","first_name":"Kasia","last_name":"Zielinska"}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000006', 'authenticated', 'authenticated', 'employer.primehome@example.com', crypt('Password123!', gen_salt('bf')), now(), now(), '{"provider":"email","providers":["email"]}', '{"role":"employer","first_name":"Tomasz","last_name":"Lewandowski"}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000007', 'authenticated', 'authenticated', 'employer.greenfields@example.com', crypt('Password123!', gen_salt('bf')), now(), now(), '{"provider":"email","providers":["email"]}', '{"role":"employer","first_name":"Sanne","last_name":"de Vries"}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'a0000000-0000-0000-0000-000000000008', 'authenticated', 'authenticated', 'employer.alpine@example.com', crypt('Password123!', gen_salt('bf')), now(), now(), '{"provider":"email","providers":["email"]}', '{"role":"employer","first_name":"Petr","last_name":"Novak"}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'b0000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'candidate.demo@example.com', crypt('Password123!', gen_salt('bf')), now(), now(), '{"provider":"email","providers":["email"]}', '{"role":"candidate","first_name":"Ola","last_name":"Kaminska"}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'b0000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'candidate.demo2@example.com', crypt('Password123!', gen_salt('bf')), now(), now(), '{"provider":"email","providers":["email"]}', '{"role":"candidate","first_name":"Ivan","last_name":"Petrenko"}', now(), now(), '', '', '', '')
on conflict (id) do nothing;

insert into auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
)
select
  gen_random_uuid(), u.id::text, u.id,
  jsonb_build_object('sub', u.id::text, 'email', u.email),
  'email', now(), now(), now()
from auth.users u
where u.id in (
  'a0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000003','a0000000-0000-0000-0000-000000000004',
  'a0000000-0000-0000-0000-000000000005','a0000000-0000-0000-0000-000000000006',
  'a0000000-0000-0000-0000-000000000007','a0000000-0000-0000-0000-000000000008',
  'b0000000-0000-0000-0000-000000000001','b0000000-0000-0000-0000-000000000002'
)
on conflict do nothing;

-- =========================================================================
-- companies
-- =========================================================================

insert into companies (id, owner_user_id, name, slug, description, industry, website, country, city, employee_count, founded_year, verified, average_response_days) values
  ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'TechNova', 'technova', 'TechNova buduje produkty cyfrowe dla klientów w Polsce i Europie Zachodniej.', 'IT i technologia', 'https://technova.example.com', 'Polska', 'Warszawa', '120-250 pracowników', 2016, true, 1),
  ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'NordCargo', 'nordcargo', 'NordCargo obsługuje międzynarodowy transport drogowy i morski na trasach Polska-Skandynawia.', 'Transport i logistyka', 'https://nordcargo.example.com', 'Polska', 'Gdańsk', '300-500 pracowników', 2005, true, 2),
  ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'WorkLine Europe', 'workline-europe', 'WorkLine Europe pośredniczy w legalnym zatrudnieniu obywateli Polski i Ukrainy w Niemczech.', 'Agencja zatrudnienia', 'https://workline.example.com', 'Niemcy', 'Berlin', '50-120 pracowników', 2012, false, 1),
  ('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004', 'Baltic Manufacturing', 'baltic-manufacturing', 'Baltic Manufacturing produkuje komponenty metalowe dla przemysłu morskiego i motoryzacyjnego.', 'Produkcja przemysłowa', 'https://balticmanufacturing.example.com', 'Polska', 'Gdynia', '500-800 pracowników', 1998, true, 3),
  ('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000005', 'BrightDesk', 'brightdesk', 'BrightDesk tworzy oprogramowanie SaaS dla działów HR w firmach średniej wielkości.', 'IT i technologia', 'https://brightdesk.example.com', 'Polska', 'Kraków', '40-80 pracowników', 2019, true, 1),
  ('c0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000006', 'PrimeHome Retail', 'primehome-retail', 'PrimeHome Retail zarządza siecią salonów wyposażenia wnętrz w Polsce.', 'Handel i sprzedaż', 'https://primehome.example.com', 'Polska', 'Poznań', '200-400 pracowników', 2009, true, 2),
  ('c0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000007', 'GreenFields Logistics', 'greenfields-logistics', 'GreenFields Logistics obsługuje centra dystrybucyjne dla klientów e-commerce w Beneluksie.', 'Transport i logistyka', 'https://greenfields.example.com', 'Holandia', 'Rotterdam', '150-300 pracowników', 2011, true, 3),
  ('c0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000008', 'Alpine Precision', 'alpine-precision', 'Alpine Precision produkuje precyzyjne komponenty dla przemysłu motoryzacyjnego w Europie Środkowej.', 'Produkcja przemysłowa', 'https://alpineprecision.example.com', 'Czechy', 'Praga', '80-150 pracowników', 2007, false, 3)
on conflict (id) do nothing;

-- =========================================================================
-- jobs (32 total — published, spread across every Rabotaj Score band)
-- =========================================================================

insert into jobs (
  id, company_id, slug, title, description, responsibilities, requirements, nice_to_have, benefits,
  country, city, work_mode, contract_type, experience_level, work_language,
  salary_min, salary_max, salary_currency, salary_period, recruitment_process,
  response_time_days, start_date, accommodation_provided, no_experience_required,
  status, published_at
) values
  ('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'senior-frontend-developer-technova', 'Senior Frontend Developer', 'Dołącz do zespołu produktowego TechNova i współtwórz platformę dla klientów korporacyjnych w Europie.',
   ARRAY['Rozwój aplikacji React/Next.js','Code review i jakość kodu','Optymalizacja wydajności'], ARRAY['Min. 4 lata z React','Bardzo dobra znajomość TypeScript','Angielski B2+'], ARRAY['Doświadczenie z Next.js App Router'], ARRAY['Elastyczne godziny pracy','Budżet szkoleniowy 4000 zł','Prywatna opieka medyczna'],
   'Polska', 'Warszawa', 'hybrid', 'b2b', 'senior', 'polski / angielski', 18000, 24000, 'PLN', 'month', ARRAY['Rozmowa z rekruterem','Zadanie techniczne','Rozmowa z zespołem','Oferta'],
   2, current_date, false, false, 'published', now() - interval '3 days'),

  ('d0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'backend-developer-node-technova', 'Backend Developer (Node.js)', 'Zespół backendowy TechNova pracujący nad skalowalną platformą B2B.',
   ARRAY['Projektowanie API REST','Optymalizacja zapytań SQL','Współpraca z DevOps'], ARRAY['Min. 3 lata z Node.js','Dobra znajomość PostgreSQL'], ARRAY['Docker, CI/CD'], ARRAY['Elastyczne godziny pracy','Budżet szkoleniowy'],
   'Polska', 'Wrocław', 'hybrid', 'b2b', 'mid', 'polski / angielski', 14000, 19000, 'PLN', 'month', ARRAY['Rozmowa z rekruterem','Zadanie techniczne','Oferta'],
   null, current_date, false, false, 'published', now() - interval '10 days'),

  ('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'specjalista-rekrutacji-it-technova', 'Specjalista ds. rekrutacji IT', 'Pełny proces rekrutacji na stanowiska techniczne w rosnących zespołach produktowych.',
   ARRAY['Prowadzenie procesów rekrutacyjnych','Sourcing kandydatów','Współpraca z hiring managerami'], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Elastyczne godziny pracy','Prywatna opieka medyczna'],
   'Polska', 'Warszawa', 'hybrid', 'employment', 'mid', 'polski / angielski', null, null, 'PLN', 'month', ARRAY['Rozmowa z People Team','Case study','Oferta'],
   null, null, false, false, 'published', now() - interval '20 days'),

  ('d0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000002', 'kierowca-c-e-nordcargo', 'Kierowca C+E', 'Transport międzynarodowy na trasach Polska-Skandynawia. Nowoczesna flota, stałe trasy.',
   ARRAY['Transport towarów Polska-Skandynawia','Dbałość o pojazd i ładunek','Dokumentacja przewozowa'], ARRAY['Prawo jazdy kat. C+E','Karta kierowcy','Min. 2 lata doświadczenia'], ARRAY[]::text[], ARRAY['Nowoczesna flota','Diety zgodne z przepisami','Prywatna opieka medyczna'],
   'Polska', 'Gdańsk', 'onsite', 'employment', 'mid', 'polski / angielski', 7500, 10500, 'PLN', 'month', ARRAY[]::text[],
   2, null, false, false, 'published', now() - interval '4 days'),

  ('d0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000002', 'magazynier-zakwaterowanie-nordcargo', 'Magazynier z zakwaterowaniem', 'Centrum logistyczne w Gdańsku. Zapewniamy bezpłatne zakwaterowanie i transport na pierwszą zmianę.',
   ARRAY['Kompletacja i pakowanie zamówień','Rozładunek i załadunek towaru','Obsługa skanera magazynowego'], ARRAY[]::text[], ARRAY['Uprawnienia na wózek widłowy'], ARRAY['Bezpłatne zakwaterowanie','Transport z miejsca zakwaterowania'],
   'Polska', 'Gdańsk', 'onsite', 'temporary', 'no_experience', 'polski / ukraiński', 4800, 6200, 'PLN', 'month', ARRAY[]::text[],
   2, current_date, true, true, 'published', now() - interval '1 days'),

  ('d0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000003', 'pracownik-produkcji-berlin-workline', 'Pracownik produkcji z zakwaterowaniem (Niemcy)', 'Zakład przemysłowy w okolicach Berlina. Legalne zatrudnienie, zakwaterowanie zapewnione.',
   ARRAY['Praca przy linii produkcyjnej','Kontrola jakości wyrobów','Przestrzeganie zasad BHP'], ARRAY['Gotowość do wyjazdu i pracy zmianowej'], ARRAY['Podstawowa znajomość niemieckiego'], ARRAY['Zakwaterowanie zapewnione','Transport z Polski','Wsparcie formalne'],
   'Niemcy', 'Berlin', 'onsite', 'employment', 'no_experience', 'polski / niemiecki', 2400, 2900, 'EUR', 'month', ARRAY['Rozmowa telefoniczna','Kompletacja dokumentów','Wyjazd i wdrożenie'],
   2, current_date, true, true, 'published', now() - interval '6 days'),

  ('d0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000003', 'kelner-berlin-workline', 'Kelner/Kelnerka (Niemcy, zakwaterowanie)', 'Personel sali dla sieci restauracji w Berlinie. Zakwaterowanie zapewnione.',
   ARRAY['Obsługa gości przy stoliku','Przyjmowanie zamówień'], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Zakwaterowanie zapewnione','Napiwki'],
   'Niemcy', 'Berlin', 'onsite', 'employment', 'no_experience', 'polski / niemiecki', null, null, 'EUR', 'month', ARRAY[]::text[],
   null, null, true, true, 'published', now() - interval '15 days'),

  ('d0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000003', 'opiekun-osob-starszych-hamburg-workline', 'Opiekun/ka osób starszych (Niemcy)', 'Legalna opieka nad osobami starszymi w Hamburgu, pełne wsparcie formalne.',
   ARRAY['Codzienna opieka nad podopiecznym','Pomoc w czynnościach higienicznych','Towarzyszenie na wizytach'], ARRAY['Podstawowa znajomość niemieckiego'], ARRAY['Doświadczenie w opiece'], ARRAY['Zakwaterowanie zapewnione','Wsparcie formalne'],
   'Niemcy', 'Hamburg', 'onsite', 'employment', 'no_experience', 'polski / niemiecki', 2000, 2400, 'EUR', 'month', ARRAY['Rozmowa telefoniczna','Wyjazd i wdrożenie'],
   2, current_date, true, true, 'published', now() - interval '8 days'),

  ('d0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000004', 'operator-cnc-baltic', 'Operator CNC', 'Zakład produkcyjny w Gdyni, nowoczesny park maszynowy, praca zmianowa.',
   ARRAY['Obsługa obrabiarek CNC','Kontrola jakości elementów','Konserwacja maszyn'], ARRAY['Min. 2 lata doświadczenia z CNC','Czytanie rysunku technicznego'], ARRAY[]::text[], ARRAY['Umowa o pracę','Premia frekwencyjna'],
   'Polska', 'Gdynia', 'onsite', 'employment', 'mid', 'polski', 6500, 8200, 'PLN', 'month', ARRAY['Rozmowa z HR','Test praktyczny'],
   3, null, false, false, 'published', now() - interval '5 days'),

  ('d0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000004', 'spawacz-mig-mag-baltic', 'Spawacz MIG/MAG', 'Produkcja komponentów dla przemysłu morskiego, stabilny zespół.',
   ARRAY['Spawanie konstrukcji stalowych','Kontrola jakości spoin'], ARRAY['Uprawnienia spawalnicze MIG/MAG','Min. 3 lata doświadczenia'], ARRAY[]::text[], ARRAY[]::text[],
   'Polska', 'Gdynia', 'onsite', 'employment', 'mid', 'polski', null, null, 'PLN', 'month', ARRAY[]::text[],
   null, null, false, false, 'published', now() - interval '18 days'),

  ('d0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000004', 'monter-konstrukcji-stalowych-baltic', 'Monter konstrukcji stalowych', 'Zespół realizujący projekty dla przemysłu morskiego i budowlanego.',
   ARRAY['Montaż konstrukcji stalowych','Praca zgodnie z BHP'], ARRAY['Podstawowe doświadczenie w montażu'], ARRAY['Uprawnienia do pracy na wysokości'], ARRAY[]::text[],
   'Polska', 'Gdynia', 'onsite', 'employment', 'junior', 'polski', null, null, 'PLN', 'month', ARRAY['Rozmowa z kierownikiem budowy'],
   null, null, false, false, 'published', now() - interval '22 days'),

  ('d0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000004', 'kontroler-jakosci-baltic', 'Kontroler Jakości', 'Kontrola jakości wyrobów gotowych w zakładzie produkcyjnym w Gdyni.',
   ARRAY['Kontrola jakości wyrobów','Dokumentowanie odchyleń','Współpraca z produkcją'], ARRAY['Doświadczenie w kontroli jakości','Znajomość norm ISO'], ARRAY[]::text[], ARRAY['Umowa o pracę','Premia jakościowa'],
   'Polska', 'Gdynia', 'onsite', 'employment', 'junior', 'polski', 5500, 7000, 'PLN', 'month', ARRAY['Rozmowa z działem jakości','Test praktyczny','Oferta'],
   3, null, false, false, 'published', now() - interval '2 days'),

  ('d0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000005', 'ux-ui-designer-brightdesk', 'UX/UI Designer', 'Zespół produktowy nad platformą SaaS dla działów HR. Praca w pełni zdalna.',
   ARRAY['Projektowanie interfejsów','Badania użyteczności','Rozwój design systemu'], ARRAY['Min. 3 lata doświadczenia','Bardzo dobra znajomość Figma'], ARRAY['Portfolio SaaS/B2B'], ARRAY['Praca w pełni zdalna','Budżet na sprzęt'],
   'Polska', 'Kraków', 'remote', 'b2b', 'mid', 'polski / angielski', 12000, 17000, 'PLN', 'month', ARRAY['Rozmowa wstępna','Przegląd portfolio','Oferta'],
   2, null, false, false, 'published', now() - interval '7 days'),

  ('d0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000005', 'product-designer-remote-brightdesk', 'Product Designer (praca zdalna)', 'Senior Product Designer do w pełni zdalnego zespołu, platforma SaaS dla klientów w Europie i USA.',
   ARRAY['Prowadzenie projektów produktowych','Mentoring młodszych projektantów'], ARRAY['Min. 5 lat doświadczenia'], ARRAY[]::text[], ARRAY[]::text[],
   'Polska', 'Zdalnie', 'remote', 'b2b', 'senior', 'angielski', null, null, 'PLN', 'month', ARRAY[]::text[],
   null, null, false, false, 'published', now() - interval '25 days'),

  ('d0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000005', 'frontend-developer-react-brightdesk', 'Frontend Developer (React)', 'Rozwój interfejsu głównego produktu SaaS BrightDesk, praca zdalna z opcją hybrydową.',
   ARRAY['Rozwój komponentów React','Współpraca z zespołem designu','Testy jednostkowe'], ARRAY['Min. 2 lata z React','Znajomość TypeScript'], ARRAY['Next.js'], ARRAY['Praca zdalna','Elastyczne godziny','Budżet na sprzęt'],
   'Polska', 'Kraków', 'remote', 'b2b', 'mid', 'polski / angielski', 13000, 18000, 'PLN', 'month', ARRAY['Rozmowa z rekruterem','Zadanie techniczne','Oferta'],
   2, current_date, false, false, 'published', now() - interval '1 days'),

  ('d0000000-0000-0000-0000-000000000016', 'c0000000-0000-0000-0000-000000000006', 'specjalista-sprzedazy-primehome', 'Specjalista ds. sprzedaży', 'Salon wyposażenia wnętrz w Poznaniu, jasny system prowizyjny.',
   ARRAY['Obsługa klientów w salonie','Doradztwo produktowe','Realizacja celów sprzedażowych'], ARRAY[]::text[], ARRAY['Prawo jazdy kat. B'], ARRAY[]::text[],
   'Polska', 'Poznań', 'onsite', 'employment', 'junior', 'polski', 5200, 7800, 'PLN', 'month', ARRAY['Rozmowa z kierownikiem salonu','Dzień próbny'],
   2, null, false, false, 'published', now() - interval '9 days'),

  ('d0000000-0000-0000-0000-000000000017', 'c0000000-0000-0000-0000-000000000006', 'kierowca-dostawca-b-primehome', 'Kierowca-dostawca kat. B', 'Dostawy mebli i wyposażenia wnętrz na terenie Poznania i okolic.',
   ARRAY['Dostawa zamówień do klientów','Montaż podstawowy mebli'], ARRAY[]::text[], ARRAY['Znajomość Poznania i okolic'], ARRAY['Elastyczny grafik','Paliwo pokryte przez firmę'],
   'Polska', 'Poznań', 'onsite', 'mandate', 'no_experience', 'polski', 4500, 5800, 'PLN', 'month', ARRAY[]::text[],
   null, null, false, true, 'published', now() - interval '12 days'),

  ('d0000000-0000-0000-0000-000000000018', 'c0000000-0000-0000-0000-000000000006', 'kierownik-salonu-primehome', 'Kierownik Salonu Sprzedaży', 'Zarządzanie zespołem salonu sprzedaży wyposażenia wnętrz w Poznaniu.',
   ARRAY['Zarządzanie zespołem sprzedaży','Odpowiedzialność za wyniki salonu','Rekrutacja i wdrażanie pracowników'], ARRAY['Min. 3 lata w zarządzaniu zespołem','Doświadczenie w handlu detalicznym'], ARRAY[]::text[], ARRAY['Premia od wyników','Prywatna opieka medyczna'],
   'Polska', 'Poznań', 'onsite', 'employment', 'senior', 'polski', 8000, 11000, 'PLN', 'month', ARRAY['Rozmowa z regionalnym managerem','Case study','Oferta'],
   2, null, false, false, 'published', now() - interval '3 days'),

  ('d0000000-0000-0000-0000-000000000019', 'c0000000-0000-0000-0000-000000000007', 'magazynier-rotterdam-greenfields', 'Magazynier', 'Centrum dystrybucyjne w Rotterdamie dla klientów e-commerce.',
   ARRAY['Kompletacja zamówień','Obsługa skanera','Załadunek i rozładunek'], ARRAY['Podstawowa znajomość angielskiego lub niderlandzkiego'], ARRAY[]::text[], ARRAY['Zakwaterowanie zapewnione','Transport do pracy'],
   'Holandia', 'Rotterdam', 'onsite', 'employment', 'no_experience', 'angielski / niderlandzki', 2100, 2500, 'EUR', 'month', ARRAY['Rozmowa online','Wyjazd i wdrożenie'],
   3, current_date, true, true, 'published', now() - interval '4 days'),

  ('d0000000-0000-0000-0000-000000000020', 'c0000000-0000-0000-0000-000000000007', 'spedytor-miedzynarodowy-greenfields', 'Spedytor Międzynarodowy', 'Koordynacja transportu międzynarodowego w regionie Beneluksu.',
   ARRAY['Planowanie tras transportowych','Kontakt z przewoźnikami','Dokumentacja celna'], ARRAY['Min. 2 lata w spedycji','Bardzo dobry angielski'], ARRAY[]::text[], ARRAY['Prywatna opieka medyczna'],
   'Holandia', 'Rotterdam', 'hybrid', 'employment', 'mid', 'angielski', 2800, 3400, 'EUR', 'month', ARRAY[]::text[],
   3, null, false, false, 'published', now() - interval '11 days'),

  ('d0000000-0000-0000-0000-000000000021', 'c0000000-0000-0000-0000-000000000007', 'kierowca-c-e-holandia-greenfields', 'Kierowca C+E (Holandia)', 'Transport krajowy i międzynarodowy na terenie Beneluksu, zakwaterowanie zapewnione.',
   ARRAY['Transport towarów w regionie Beneluksu','Dbałość o pojazd'], ARRAY[]::text[], ARRAY['Podstawowy angielski'], ARRAY['Zakwaterowanie zapewnione','Nowoczesna flota'],
   'Holandia', 'Rotterdam', 'onsite', 'employment', 'mid', 'angielski / polski', null, null, 'EUR', 'month', ARRAY['Rozmowa telefoniczna','Weryfikacja uprawnień'],
   null, null, true, false, 'published', now() - interval '16 days'),

  ('d0000000-0000-0000-0000-000000000022', 'c0000000-0000-0000-0000-000000000007', 'koordynator-logistyki-greenfields', 'Koordynator Logistyki', 'Nadzór nad operacjami magazynowymi i transportowymi centrum dystrybucyjnego.',
   ARRAY['Nadzór nad operacjami magazynowymi','Optymalizacja procesów logistycznych'], ARRAY['Min. 4 lata w logistyce'], ARRAY[]::text[], ARRAY[]::text[],
   'Holandia', 'Rotterdam', 'hybrid', 'employment', 'senior', 'angielski', null, null, 'EUR', 'month', ARRAY[]::text[],
   null, null, false, false, 'published', now() - interval '28 days'),

  ('d0000000-0000-0000-0000-000000000023', 'c0000000-0000-0000-0000-000000000007', 'analityk-lancucha-dostaw-greenfields', 'Analityk Łańcucha Dostaw', 'Analiza i optymalizacja procesów łańcucha dostaw dla klientów e-commerce.',
   ARRAY['Analiza danych logistycznych','Raportowanie KPI','Rekomendacje usprawnień'], ARRAY['Min. 2 lata w analizie danych','Excel/SQL'], ARRAY[]::text[], ARRAY['Praca zdalna'],
   'Holandia', 'Rotterdam', 'remote', 'employment', 'mid', 'angielski', null, null, 'EUR', 'month', ARRAY[]::text[],
   null, current_date, false, false, 'published', now() - interval '6 days'),

  ('d0000000-0000-0000-0000-000000000024', 'c0000000-0000-0000-0000-000000000008', 'operator-maszyn-cnc-alpine', 'Operator Maszyn CNC', 'Precyzyjna produkcja komponentów motoryzacyjnych w Pradze.',
   ARRAY['Obsługa maszyn CNC','Kontrola wymiarowa'], ARRAY['Min. 2 lata doświadczenia z CNC'], ARRAY['Znajomość angielskiego'], ARRAY['Premia jakościowa','Posiłki pracownicze'],
   'Czechy', 'Praga', 'onsite', 'employment', 'mid', 'czeski / angielski', 45000, 58000, 'CZK', 'month', ARRAY['Rozmowa z HR','Test praktyczny'],
   3, null, false, false, 'published', now() - interval '5 days'),

  ('d0000000-0000-0000-0000-000000000025', 'c0000000-0000-0000-0000-000000000008', 'technik-jakosci-alpine', 'Technik Jakości', 'Kontrola jakości precyzyjnych komponentów motoryzacyjnych.',
   ARRAY['Kontrola jakości komponentów','Dokumentacja wyników pomiarów'], ARRAY['Doświadczenie w kontroli jakości'], ARRAY[]::text[], ARRAY[]::text[],
   'Czechy', 'Praga', 'onsite', 'employment', 'mid', 'czeski / angielski', null, null, 'CZK', 'month', ARRAY[]::text[],
   null, null, false, false, 'published', now() - interval '19 days'),

  ('d0000000-0000-0000-0000-000000000026', 'c0000000-0000-0000-0000-000000000008', 'inzynier-procesu-alpine', 'Inżynier Procesu', 'Optymalizacja procesów produkcyjnych w zakładzie precyzyjnej obróbki metali.',
   ARRAY['Optymalizacja procesów produkcyjnych','Wdrażanie usprawnień'], ARRAY[]::text[], ARRAY['Six Sigma'], ARRAY['Prywatna opieka medyczna'],
   'Czechy', 'Praga', 'hybrid', 'employment', 'senior', 'angielski', 60000, 75000, 'CZK', 'month', ARRAY[]::text[],
   null, null, false, false, 'published', now() - interval '14 days'),

  ('d0000000-0000-0000-0000-000000000027', 'c0000000-0000-0000-0000-000000000008', 'slusarz-narzedziowy-alpine', 'Ślusarz Narzędziowy', 'Wytwarzanie i konserwacja form i narzędzi produkcyjnych.',
   ARRAY['Wytwarzanie i naprawa narzędzi','Konserwacja form produkcyjnych'], ARRAY['Min. 3 lata doświadczenia jako ślusarz narzędziowy'], ARRAY[]::text[], ARRAY['Premia jakościowa','Posiłki pracownicze','Odzież robocza'],
   'Czechy', 'Praga', 'onsite', 'employment', 'mid', 'czeski', 42000, 52000, 'CZK', 'month', ARRAY['Rozmowa z brygadzistą','Test praktyczny','Oferta'],
   3, current_date, false, false, 'published', now() - interval '2 days'),

  ('d0000000-0000-0000-0000-000000000028', 'c0000000-0000-0000-0000-000000000001', 'qa-engineer-technova', 'QA Engineer', 'Zapewnienie jakości platformy dla klientów korporacyjnych, testy manualne i automatyczne.',
   ARRAY['Projektowanie scenariuszy testowych','Testy regresji','Automatyzacja testów E2E'], ARRAY['Min. 2 lata w testowaniu oprogramowania','Znajomość Playwright lub Cypress'], ARRAY[]::text[], ARRAY['Elastyczne godziny pracy','Budżet szkoleniowy','Prywatna opieka medyczna'],
   'Polska', 'Warszawa', 'hybrid', 'employment', 'mid', 'polski / angielski', 9000, 13000, 'PLN', 'month', ARRAY['Rozmowa z rekruterem','Zadanie techniczne','Oferta'],
   2, current_date, false, false, 'published', now() - interval '1 days'),

  ('d0000000-0000-0000-0000-000000000029', 'c0000000-0000-0000-0000-000000000001', 'devops-engineer-technova', 'DevOps Engineer', 'Utrzymanie i rozwój infrastruktury chmurowej platformy TechNova.',
   ARRAY['Zarządzanie infrastrukturą CI/CD','Monitoring i observability','Automatyzacja wdrożeń'], ARRAY['Min. 4 lata jako DevOps/SRE','Doświadczenie z Kubernetes'], ARRAY['AWS lub GCP'], ARRAY[]::text[],
   'Polska', 'Wrocław', 'remote', 'b2b', 'senior', 'angielski', 17000, 23000, 'PLN', 'month', ARRAY[]::text[],
   2, null, false, false, 'published', now() - interval '13 days'),

  ('d0000000-0000-0000-0000-000000000030', 'c0000000-0000-0000-0000-000000000002', 'spedytor-nordcargo', 'Spedytor', 'Koordynacja transportu drogowego na trasach Polska-Skandynawia.',
   ARRAY['Planowanie tras','Kontakt z kierowcami i klientami','Dokumentacja przewozowa'], ARRAY['Min. 1 rok w spedycji','Angielski komunikatywny'], ARRAY[]::text[], ARRAY['Prywatna opieka medyczna','Premie kwartalne'],
   'Polska', 'Gdańsk', 'hybrid', 'employment', 'junior', 'polski / angielski', 6000, 8500, 'PLN', 'month', ARRAY['Rozmowa z kierownikiem spedycji','Oferta'],
   2, current_date, false, false, 'published', now() - interval '1 days'),

  ('d0000000-0000-0000-0000-000000000031', 'c0000000-0000-0000-0000-000000000002', 'mechanik-floty-nordcargo', 'Mechanik Floty', 'Serwis i przeglądy floty pojazdów ciężarowych NordCargo.',
   ARRAY['Przeglądy techniczne pojazdów','Diagnostyka usterek'], ARRAY['Uprawnienia mechanika samochodowego'], ARRAY[]::text[], ARRAY[]::text[],
   'Polska', 'Gdańsk', 'onsite', 'employment', 'mid', 'polski', null, null, 'PLN', 'month', ARRAY[]::text[],
   null, null, false, false, 'published', now() - interval '21 days'),

  ('d0000000-0000-0000-0000-000000000032', 'c0000000-0000-0000-0000-000000000003', 'sortownia-monachium-workline', 'Pracownik Sortowni (Niemcy)', 'Sortownia paczek w Monachium, praca zmianowa, zakwaterowanie zapewnione.',
   ARRAY['Sortowanie i skanowanie przesyłek','Załadunek i rozładunek'], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Zakwaterowanie zapewnione','Transport z Polski'],
   'Niemcy', 'Monachium', 'onsite', 'temporary', 'no_experience', 'polski / niemiecki', 2200, 2600, 'EUR', 'month', ARRAY['Rozmowa telefoniczna','Wyjazd i wdrożenie'],
   2, current_date, true, true, 'published', now() - interval '3 days')
on conflict (id) do nothing;

-- =========================================================================
-- job_skills
-- =========================================================================

insert into job_skills (job_id, skill_name, required) values
  ('d0000000-0000-0000-0000-000000000001', 'React', true), ('d0000000-0000-0000-0000-000000000001', 'TypeScript', true), ('d0000000-0000-0000-0000-000000000001', 'Next.js', false),
  ('d0000000-0000-0000-0000-000000000002', 'Node.js', true), ('d0000000-0000-0000-0000-000000000002', 'PostgreSQL', true), ('d0000000-0000-0000-0000-000000000002', 'Docker', false),
  ('d0000000-0000-0000-0000-000000000003', 'Rekrutacja IT', true), ('d0000000-0000-0000-0000-000000000003', 'LinkedIn Recruiter', false),
  ('d0000000-0000-0000-0000-000000000004', 'Prawo jazdy kat. C+E', true), ('d0000000-0000-0000-0000-000000000004', 'Trasy międzynarodowe', false),
  ('d0000000-0000-0000-0000-000000000005', 'Obsługa wózka widłowego', false), ('d0000000-0000-0000-0000-000000000005', 'Kompletacja zamówień', true),
  ('d0000000-0000-0000-0000-000000000009', 'Obsługa CNC', true), ('d0000000-0000-0000-0000-000000000009', 'Czytanie rysunku technicznego', true),
  ('d0000000-0000-0000-0000-000000000010', 'Spawanie MIG/MAG', true),
  ('d0000000-0000-0000-0000-000000000013', 'Figma', true), ('d0000000-0000-0000-0000-000000000013', 'Design systems', false), ('d0000000-0000-0000-0000-000000000013', 'Badania UX', false),
  ('d0000000-0000-0000-0000-000000000015', 'React', true), ('d0000000-0000-0000-0000-000000000015', 'TypeScript', true),
  ('d0000000-0000-0000-0000-000000000024', 'Obsługa CNC', true), ('d0000000-0000-0000-0000-000000000024', 'Kontrola wymiarowa', false),
  ('d0000000-0000-0000-0000-000000000028', 'Playwright', false), ('d0000000-0000-0000-0000-000000000028', 'Testowanie oprogramowania', true),
  ('d0000000-0000-0000-0000-000000000029', 'Kubernetes', true), ('d0000000-0000-0000-0000-000000000029', 'CI/CD', true)
on conflict do nothing;

-- =========================================================================
-- Sample candidate data + one application, to exercise the full flow
-- =========================================================================

insert into candidate_profiles (user_id, professional_title, summary, expected_salary_min, expected_salary_max, salary_currency, preferred_work_mode, relocation_ready, availability_date, profile_completion, email_verified, phone_verified, public_slug, is_public) values
  ('b0000000-0000-0000-0000-000000000001', 'Frontend Developer', 'Frontend developer z 3-letnim doświadczeniem w React i TypeScript, otwarta na pracę zdalną i hybrydową.', 12000, 17000, 'PLN', 'hybrid', true, current_date, 85, true, false, 'ola-kaminska', true),
  ('b0000000-0000-0000-0000-000000000002', 'Kierowca zawodowy kat. C+E', 'Kierowca z doświadczeniem w transporcie międzynarodowym, gotowy do wyjazdu za granicę.', 7000, 10000, 'PLN', 'onsite', true, current_date, 60, true, false, 'ivan-petrenko', false)
on conflict (user_id) do nothing;

insert into candidate_skills (user_id, skill_name, level, years_experience) values
  ('b0000000-0000-0000-0000-000000000001', 'React', 'advanced', 3),
  ('b0000000-0000-0000-0000-000000000001', 'TypeScript', 'intermediate', 2)
on conflict do nothing;

insert into candidate_languages (user_id, language_code, level) values
  ('b0000000-0000-0000-0000-000000000001', 'pl', 'native'),
  ('b0000000-0000-0000-0000-000000000001', 'en', 'B2')
on conflict do nothing;

insert into applications (job_id, candidate_user_id, employer_user_id, status, message, expected_salary, availability_date) values
  ('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'shortlisted', 'Z chęcią dołączę do zespołu TechNova, mam doświadczenie z podobnymi projektami.', 20000, current_date)
on conflict do nothing;
