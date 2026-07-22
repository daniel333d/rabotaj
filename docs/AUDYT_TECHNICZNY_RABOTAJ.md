# Kompleksowy Audyt Techniczny — Rabotaj.com

**Data audytu:** 2026-07-22
**Zakres:** Cały projekt `C:\Users\nowic\OneDrive\Pulpit\rabotaj` (HEAD: `74d1786`, branch `main`)
**Metoda:** Analiza statyczna całego kodu źródłowego (app/, components/, lib/, supabase/, konfiguracja), uruchomienie istniejących narzędzi projektu (`npm test`, `tsc --noEmit`, `eslint`), przegląd migracji SQL i polityk RLS, przegląd historii git.
**Zastrzeżenie metodologiczne:** To audyt statyczny kodu. Nie wdrożono aplikacji na żywo, nie wykonano testów penetracyjnych na działającym środowisku, nie zweryfikowano polityk RLS względem realnej bazy Postgres (sam projekt to potwierdza we własnym `supabase/RLS_TESTING.md` — patrz sekcja 4). Wszystkie wnioski wynikają wyłącznie z czytania kodu; tam gdzie czegoś nie dało się zweryfikować, jest to jawnie zaznaczone.

---

## 1. Executive Summary

Rabotaj.com to jednoosobowy (wspomagany przez AI) prototyp/MVP platformy pracy dla rynku Polska/Ukraina/CEE, zbudowany w Next.js 15 (App Router) + React 19 + TypeScript (strict) + Supabase (Postgres + Auth + RLS). Kod liczy ok. 13 600 linii w 128 plikach `.ts`/`.tsx`, 6 commitów na jednej gałęzi `main`, bez CI/CD.

**Ocena ogólna: projekt jest solidnie zaprojektowaną warstwą danych i autoryzacji ukrytą pod fasadą, która nie jest jeszcze gotowa na realny ruch produkcyjny.** Warstwa `lib/data` / `lib/actions` / `lib/validation` jest konsekwentnie rozdzielona, typowanie TypeScript jest wzorowe (zero `any` w całym drzewie), separacja klienta service-role od klienta publicznego jest wymuszona na poziomie builda (`import "server-only"`), a autoryzacja admina jest sprawdzana po stronie serwera przy każdej akcji. To mocne fundamenty inżynierskie.

Jednocześnie audyt wykrył **jedną krytyczną lukę bezpieczeństwa typu stored XSS**, dostępną bez uwierzytelnienia na publicznej stronie oferty pracy, **całkowity brak warstwy cache'owania** (każde wejście na listę ofert czy szczegóły oferty odpytuje Supabase na żywo, bez limitu wierszy), **brak `robots.txt` i sitemapy** (krytyczne dla platformy, której głównym kanałem pozyskania ruchu ma być SEO), **brak jakiegokolwiek pipeline'u CI/CD** oraz **fakt, że polityki RLS — jedyna faktyczna granica bezpieczeństwa danych między kandydatem, pracodawcą i adminem — nigdy nie zostały uruchomione względem żywej bazy danych**, co sam projekt otwarcie przyznaje w dokumentacji.

Żadne z tych ustaleń nie jest zaskakujące jak na tempo budowy (6 dużych commitów, brak testów integracyjnych) — ale każde z nich musi zostać zamknięte przed jakimkolwiek wejściem na produkcję z realnymi danymi użytkowników.

---

## 2. Mocne strony

- **Zero `any` / `as any` / `as unknown` / `@ts-ignore`** w całym drzewie `app/`, `components/`, `lib/` przy `"strict": true` w `tsconfig.json:11` — rzadko spotykana dyscyplina typowania w projekcie tej wielkości.
- **Twarda granica server/client wymuszona na poziomie builda**: `lib/supabase/admin.ts:1`, `lib/auth/require-admin.ts:1`, `lib/auth/session.ts:1`, wszystkie pliki `lib/data/db-*.ts` zaczynają się od `import "server-only"` — przypadkowy import klucza service-role do bundla klienckiego skutkuje błędem builda, nie tylko konwencją.
- **Autoryzacja admina jest solidna**: `requireAdmin()` (`lib/auth/require-admin.ts`) zawsze odczytuje rolę z sesji serwerowej wywołującego, nigdy z danych podanych przez klienta; każda akcja administracyjna (`lib/actions/admin.ts`) i każdy odczyt danych admina (`lib/data/db-admin.ts`) jest nią opakowany. Eskalacja do roli `admin` jest zablokowana już przy rejestracji (`supabase/migrations/0001_schema.sql:73-77` dopuszcza z metadanych klienta tylko `'employer'`) oraz przy edycji profilu (`profiles_update_own`, `0002_rls.sql:52-54` przypina `role` do wartości sprzed edycji).
- **Brak powierzchni SQL injection**: cały dostęp do danych idzie przez query builder Supabase (parametryzowany); zero surowego SQL, zero `.rpc()` z niesanityzowanym wejściem.
- **RLS jest przemyślane w projekcie (choć niezweryfikowane w praktyni — patrz sekcja 4)**: polityki poprawnie blokują samopublikację ofert przez pracodawcę (`0002_rls.sql:163-170`), wycofanie aplikacji przez kandydata jest podwójnie wymuszone (RLS `WITH CHECK` + trigger na poziomie kolumny, `0002_rls.sql:225-262`), tabele z danymi wrażliwymi (`candidate_profiles` i pochodne) nie mają nigdzie `USING (true)`.
- **Walidacja wejścia przez Zod jest konsekwentna**: niemal każda akcja serwera w `lib/actions/*.ts` waliduje `FormData` przez odpowiedni schemat w `lib/validation/*.ts` przed zapisem do bazy (jedyny wyjątek: `updateAccountSettingsAction`, patrz sekcja 10).
- **53/53 testów przechodzi, `tsc --noEmit` i `eslint .` czyste** (zweryfikowane uruchomieniem podczas audytu) — to, co jest testowane, jest testowane poprawnie.
- **Dokumentacja README jest zgodna ze stanem faktycznym kodu** — rzadkość; skrypty, struktura katalogów i ograniczenia (jawnie przyznany brak weryfikacji RLS) są opisane trafnie.
- Poprawne użycie `next/font` z podzbiorami znaków cyrylicy (`Inter`, `app/layout.tsx:2,11-20`) — świadome uwzględnienie rynku ukraińskiego/rosyjskojęzycznego.
- Dobra dyscyplina semantycznego HTML i ARIA (nawigacja, role menu, `aria-pressed`, `aria-expanded`) w komponentach takich jak `components/layout/Navbar.tsx`, `components/jobs/JobCard.tsx`.
- Poprawna implementacja danych strukturalnych schema.org `JobPosting` (`lib/seo/job-posting.ts`) — dobrze dobrane pola pod Google Rich Results (choć to samo miejsce jest wektorem krytycznej luki XSS, patrz sekcja 4).

---

## 3. Krytyczne problemy (priorytety)

> **Aktualizacja 2026-07-22 (po audycie):** pozycje #1–#3 (wszystkie CRITICAL) zostały naprawione na żądanie użytkownika tego samego dnia, a następnie na wyraźną prośbę naprawiono też pozycję #4 (open redirect, HIGH) — patrz kolumna Status. Weryfikacja: `tsc --noEmit`, `eslint .`, `npm test` (53/53) i `npm run build` przechodzą czysto po każdej turze zmian. Pozostałe pozycje (#5 i niżej) są wciąż otwarte.

| # | Priorytet | Problem | Lokalizacja | Status |
|---|---|---|---|---|
| 1 | **CRITICAL** | Stored XSS przez wstrzyknięcie do JSON-LD — nieautoryzowany atakujący (pracodawca) może wstrzyknąć wykonywalny JS widoczny dla każdego odwiedzającego stronę oferty | `app/jobs/[slug]/page.tsx:102`, `lib/seo/job-posting.ts:20` | ✅ Naprawione — dodano `serializeJsonLd()` (`lib/seo/job-posting.ts`) escapujące `<`/`>`/`&` przed serializacją do `dangerouslySetInnerHTML` |
| 2 | **CRITICAL** | Brak jakiejkolwiek warstwy cache'owania — każde żądanie do stron publicznych (lista ofert, szczegóły oferty, szczegóły firmy) trafia na żywo do Supabase, bez `revalidate`/`unstable_cache`/limitu wierszy | `lib/data/db-jobs.ts:13-34`, cały `app/jobs/*`, `app/companies/*` | ✅ Naprawione — publiczne odczyty (`getPublishedJobs`, `getPublishedJobBySlug`, `getCompanyBySlugFromDb`, `getAllCompaniesFromDb`) owinięte w `unstable_cache` (60s, tagi `jobs`/`companies`) przez nowy `lib/supabase/public.ts` (klient bez cookies); akcje admina (`approveJobAction`, `rejectJobAction`, `verifyCompanyAction`) wywołują `revalidateTag` dla natychmiastowej inwalidacji |
| 3 | **CRITICAL** | Brak `robots.txt` i sitemapy — dla platformy zależnej od SEO to fundamentalna luka w wykrywalności treści przez wyszukiwarki | brak `app/robots.ts`, `app/sitemap.ts`, `public/robots.txt` | ✅ Naprawione — dodano `app/robots.ts` i `app/sitemap.ts` (strony statyczne + oferty publikowane + firmy, z fallbackiem na dane demo) |
| 4 | **HIGH** | Open redirect w callbacku uwierzytelniania — parametr `next` z query stringa był przekazywany do przekierowania bez walidacji same-origin | `app/auth/callback/route.ts:26-28` | ✅ Naprawione — dodano `isSafeRedirectPath()` (`lib/auth/redirect.ts`), wymaga ścieżki zaczynającej się od pojedynczego `/`, bez `//`, `/\` ani `://`; callback (`app/auth/callback/route.ts`) używa go jako strażnika zamiast bezwarunkowego `if (next)` |
| 4 | **HIGH** | Open redirect w callbacku uwierzytelniania — parametr `next` z query stringa jest przekazywany do przekierowania bez walidacji same-origin (potwierdzone niezależnie przez dwa odrębne przebiegi analizy, w tym test parsera URL wykazujący realny scenariusz phishingowy) | `app/auth/callback/route.ts:26-28` |
| 5 | **HIGH** | Polityki RLS — jedyna granica bezpieczeństwa między danymi kandydata, pracodawcy i admina — nigdy nie zostały wykonane względem żywej bazy Postgres; własna dokumentacja projektu (`RLS_TESTING.md`) ma wszystkie pozycje checklisty odznaczone jako niewykonane | `supabase/RLS_TESTING.md:1-97` |
| 6 | **HIGH** | Brak jakiegokolwiek pipeline'u CI/CD — brak `.github/workflows`, brak `vercel.json`, brak automatycznej bramki testów/typecheck/lint przed mergem lub deployem | cały projekt |
| 7 | **HIGH** | 11 statycznych stron (about, terms, privacy, contact, career-center, employers, salary…) jest wymuszonych na `"use client"` przez architekturę i18n, co strukturalnie uniemożliwia im posiadanie własnych metadanych SEO (`generateMetadata` nie działa w plikach client) | `lib/i18n/context.tsx:1`, `app/about/page.tsx:1` i 10 analogicznych |
| 8 | **HIGH** | i18n nie ma rozwiązania po stronie serwera/URL — Google zaindeksuje wyłącznie polską wersję każdej strony, mimo że produkt celuje w rynek CEE/Ukraina wielojęzycznie | `lib/i18n/context.tsx:36-43` |
| 9 | **HIGH** | Pokrycie testami dotyczy wyłącznie czystej logiki w `lib/` (~53 testy) — zero testów dla komponentów (48 plików), tras (30), Server Actions (5 plików, ~776 linii), warstwy danych (6 plików, ~838 linii) i middleware | `lib/**/*.test.ts` vs reszta repo |
| 10 | **HIGH** | Filtrowanie i paginacja listy ofert odbywają się w całości po stronie klienta na pełnym zbiorze danych pobranym z serwera — realne ryzyko skalowalności wraz ze wzrostem liczby ofert | `lib/data/db-jobs.ts:13-21` (brak `.limit()`), `app/jobs/JobsPageClient.tsx:13,34-40`, `lib/filters.ts:52-93` |
| 11 | **MEDIUM** | Zablokowanie użytkownika (`is_blocked`) nie unieważnia aktywnej sesji — działa dopiero przy kolejnym logowaniu, nie jest też egzekwowane przez RLS | `supabase/migrations/0002_rls.sql` (brak polityki dot. `is_blocked`), `lib/actions/auth.ts:91-96` |
| 12 | **MEDIUM** | Brak rate limitingu / CAPTCHA na logowaniu, rejestracji i resetowaniu hasła — ochrona przed brute-force/enumeracją opiera się wyłącznie na domyślnych, niemożliwych do zweryfikowania z poziomu kodu limitach Supabase Auth | `lib/actions/auth.ts` |
| 13 | **MEDIUM** | Brak nagłówków bezpieczeństwa (CSP, X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy) — brak jakiejkolwiek warstwy defense-in-depth, która ograniczyłaby skutki znaleziska #1 | `next.config.ts` (pusta konfiguracja), `middleware.ts` |

Pełna lista ustaleń niższego priorytetu (LOW) znajduje się w odpowiednich sekcjach tematycznych poniżej.

---

## 4. Bezpieczeństwo

### 4.1 CRITICAL — Stored XSS przez wstrzyknięcie do JSON-LD

`app/jobs/[slug]/page.tsx:102` renderuje:
```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
```
gdzie `jsonLd.description` (`lib/seo/job-posting.ts:20`, wartość `job.description || job.responsibilities.join(" ")`) to tekst kontrolowany przez pracodawcę, walidowany jedynie limitem długości (`lib/validation/job.ts:35`, `max(4000)`), bez żadnych ograniczeń co do dozwolonych znaków. `JSON.stringify` **nie ucieka** znaków `<` ani `/`. Pracodawca, którego oferta zostanie zatwierdzona (`approveJobAction`, `lib/actions/admin.ts:22` — brak sanityzacji HTML w ścieżce zatwierdzania), może umieścić w opisie sekwencję `</script><script>...złośliwy JS...</script>`, wychodząc poza tag JSON-LD i wstrzykując wykonywalny skrypt widoczny dla **każdego, w tym niezalogowanego** odwiedzającego stronę oferty. To jedyne wystąpienie `dangerouslySetInnerHTML`/`innerHTML` w całym kodzie — cała pozostała treść generowana przez użytkowników jest renderowana bezpiecznie jako zwykły tekst React (`components/jobs/JobDetailView.tsx:103,189`, `components/companies/CompanyDetailView.tsx:70`).

Nie jest to złagodzone przez RLS (to błąd renderowania, nie dostępu do danych) ani przez żaden inny mechanizm — brak CSP (patrz 4.4) oznacza brak jakiejkolwiek drugiej linii obrony.

### 4.2 HIGH — Open redirect w `app/auth/callback/route.ts`

```ts
if (next) {
  return NextResponse.redirect(`${origin}${next}`);
}
```
Parametr `next` (linie 26-28) pochodzi wprost z query stringa, bez walidacji formatu/allowlisty. Test parsera URL potwierdza, że `next=%40evil.com` (zakodowane `@evil.com`) przekształca `${origin}${next}` w `https://rabotaj.com@evil.com`, co przeglądarki interpretują jako host `evil.com` (rabotaj.com staje się odrzuconym userinfo). Ponieważ wystarczy, by parametr `code` poprawnie się wymienił (atakujący może użyć własnego kodu z własnej rejestracji/resetu hasła), da się zbudować link `https://rabotaj.com/auth/callback?code=<własny-kod>&next=%40evil-phish.example`, który zaczyna się na prawdziwej domenie rabotaj.com, ale przekierowuje na domenę atakującego — klasyczny wektor phishingowy. Wymaga poprawki polegającej na wymuszeniu, by `next` zaczynało się od `/` i nie zawierało `//` ani `@`.

**✅ Naprawione 2026-07-22**: `lib/auth/redirect.ts` zyskał `isSafeRedirectPath()`, które odrzuca wartości niezaczynające się od pojedynczego `/` oraz zawierające `//`, `/\` lub `://`; `app/auth/callback/route.ts` przekierowuje na `next` tylko po przejściu tej walidacji. Zweryfikowane `tsc --noEmit`/`eslint .`/`npm test`/`npm run build`.

### 4.3 HIGH — Polityki RLS nigdy niezweryfikowane na żywej bazie

RLS jest włączone na wszystkich 13 tabelach i każda ma co najmniej jedną politykę — nie znaleziono tabeli bez polityk (co blokowałoby cały dostęp) ani z wyłączonym RLS. Projekt zawiera dobrze przemyślaną checklistę testową (`supabase/RLS_TESTING.md`, ~25 pozycji pokrywających 46 instrukcji `create policy`), ale **żadna pozycja nie jest odznaczona** — plik sam przyznaje: *"nie było możliwe uruchomienie automatycznych testów polityk w tym środowisku (brak Docker/Supabase CLI), więc [ta checklista] to kolejny krok przed zaufaniem RLS w produkcji"*. To jedyna faktyczna granica bezpieczeństwa oddzielająca dane kandydata, pracodawcy i admina — analiza statyczna kodu SQL (wykonana w ramach tego audytu) wygląda solidnie, ale **nie zastępuje uruchomienia względem realnego Postgresa**.

### 4.4 MEDIUM — Brak nagłówków bezpieczeństwa / CSP

`next.config.ts` to pusty szkielet (brak `headers()`), `middleware.ts` dotyka wyłącznie ciasteczka sesji Supabase. Brak CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, `Referrer-Policy` gdziekolwiek w kodzie. Odpowiednio skonfigurowany CSP (np. `script-src` bez `unsafe-inline`) byłby drugą linią obrony, która ograniczyłaby skutki luki opisanej w 4.1.

### 4.5 MEDIUM — Brak rate limitingu / CAPTCHA

Zero wystąpień logiki rate-limitingu w całym repo (`lib/actions/auth.ts` — `loginAction`, `registerAction`, `requestPasswordResetAction`). Ochrona przed brute force / credential stuffing / spamowaniem rejestracji opiera się wyłącznie na domyślnych limitach platformy Supabase Auth, których nie da się zweryfikować z poziomu kodu źródłowego.

### 4.6 MEDIUM — Zablokowanie użytkownika nie unieważnia aktywnej sesji

`blockUserAction` (`lib/actions/admin.ts:45-50`) ustawia `profiles.is_blocked=true` przez klienta service-role, ale żadna polityka RLS w `0002_rls.sql` nie odwołuje się do `is_blocked`, a jedynym miejscem egzekwowania blokady jest `loginAction` (`lib/actions/auth.ts:91-96`) — czyli moment **kolejnego** logowania. Użytkownik z już aktywną sesją (ciasteczko access/refresh token) zachowuje pełny dostęp objęty RLS aż do naturalnego wygaśnięcia/odświeżenia tokenu i próby ponownego logowania. Osłabia to funkcję blokady w każdym scenariuszu wymagającym natychmiastowej reakcji (np. blokowanie użytkownika w trakcie nadużycia).

### 4.7 LOW — Enumeracja e-maili przy rejestracji

`lib/actions/auth.ts:56-58` zwraca odrębny komunikat `"email-already-registered"`, umożliwiając atakującemu enumerację zarejestrowanych adresów. Dla kontrastu logowanie (`"invalid-credentials"`) i reset hasła (nigdy nie ujawnia istnienia konta) są obsłużone poprawnie.

### 4.8 LOW — `updateAccountSettingsAction` pomija warstwę walidacji Zod

`lib/actions/candidate.ts:237-254` — jedyna akcja w całym kodzie, która nie przechodzi przez schemat Zod, tylko ręczne przycinanie/sprawdzanie niepustości. Brak limitu długości (inne schematy mają np. `.max(80)`), `preferredLanguage` nie jest ograniczone do znanej listy lokalizacji. Niewielkie ryzyko jakości danych, nie jest bezpośrednio eksploatowalne poza nadmiarowo długimi wierszami w bazie.

### 4.9 Zweryfikowane jako bezpieczne (brak ustaleń)

- **CSRF**: jedyny route handler w projekcie jest metodą GET (`app/auth/callback/route.ts`); brak nadpisania `experimental.serverActions.allowedOrigins` — wbudowana ochrona Next.js (weryfikacja nagłówka Origin) pozostaje nienaruszona.
- **SSRF**: brak jakiegokolwiek server-side `fetch()` przyjmującego URL/host podany przez użytkownika.
- **Path traversal / upload plików**: funkcja uploadu plików nie istnieje w ogóle w obecnym kodzie.
- **CORS**: Supabase wywoływane po stronie klienta wyłącznie kluczem `anon`, zgodnie z modelem zaufania opartym na RLS.
- **Sekrety**: tylko trzy zmienne środowiskowe w całej aplikacji (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — jawnie publiczne, oraz `SUPABASE_SERVICE_ROLE_KEY`, poprawnie zabezpieczony importem `server-only` w `lib/supabase/admin.ts:1`). `.gitignore` wyklucza wszystkie `.env*` poza `.env.example`. Brak twardo zakodowanych kluczy w źródłach.
- **Eskalacja uprawnień do roli admin**: zablokowana zarówno na poziomie rejestracji (funkcja `handle_new_user` w migracji), jak i edycji profilu (polityka RLS).

---

## 5. Architektura

Struktura katalogów jest czytelna i konsekwentnie stosowana: `app/` (30 tras), `components/` (48 plików, 9 podfolderów tematycznych), `lib/` podzielone na `actions/` (Server Actions), `data/` (odczyty), `validation/` (schematy Zod), `auth/`, `supabase/`, `i18n/`, `seo/`, `demo/`. Granica server/client jest wymuszona na poziomie builda przez `import "server-only"` w kluczowych plikach (patrz sekcja 2).

**Ustalenia:**

- **MEDIUM — naruszenie warstwy danych**: `app/jobs/[slug]/page.tsx:84-92` instancjonuje klienta Supabase bezpośrednio wewnątrz komponentu strony i wykonuje surowe zapytania do tabel `applications` i `saved_jobs`, zamiast korzystać z funkcji w `lib/data`. To jedyne miejsce, w którym plik trasy przekracza deklarowaną granicę architektoniczną.
- **MEDIUM — middleware nie stanowi siatki bezpieczeństwa dla autoryzacji tras**: `middleware.ts` wyłącznie odświeża sesję (`supabase.auth.getUser()`, linia 29) i nie wykonuje żadnego bramkowania dostępu ani przekierowań. Ochrona tras jest zaimplementowana punktowo w każdej sekcji (`app/admin/layout.tsx:18-20`, `app/employer/layout.tsx:17-20`, `app/dashboard/page.tsx:16-18`) — poprawnie i bezpiecznie w sprawdzonych miejscach, ale bez centralnego mechanizmu każda nowa chroniona trasa musi pamiętać o dodaniu własnego zabezpieczenia.
- **LOW — niespójność w organizacji danych demonstracyjnych**: `lib/data/jobs.ts` (1034 linie, z czego ok. 985 to zahardkodowana tablica `jobs: Job[]`) znajduje się w folderze przeznaczonym na "prawdziwą" warstwę danych, podczas gdy `lib/demo/dashboard-demo-data.ts` jest poprawnie wydzielony osobno — brak spójnej zasady, gdzie mają trafiać dane fikcyjne.
- Brak wykrytych zależności cyklicznych w przeanalizowanej próbce grafu importów.
- Podział `lib/data` (odczyt) / `lib/actions` (zapis + `"use server"`) / `lib/validation` (Zod) jest realnie przestrzegany — grep w poszukiwaniu bezpośrednich importów `@supabase/*` w `app/`/`components/` nie zwrócił trafień poza wspomnianym wyjątkiem.

---

## 6. Wydajność

### 6.1 CRITICAL — Brak jakiejkolwiek warstwy cache'owania

Grep całego repozytorium w poszukiwaniu `revalidatePath`, `revalidateTag`, `unstable_cache`, React `cache()` oraz `fetch(..., {next:{...}})` wykazał, że **jedynym mechanizmem jest `revalidatePath`**, używany wyłącznie wewnątrz Server Actions do odświeżania paneli po mutacji. Ponieważ cały odczyt danych idzie przez klienta Supabase, a nie przez `fetch`, natywny Data Cache Next.js nigdy się nie aktywuje. Każde wejście na listę ofert, szczegóły oferty czy szczegóły firmy to żywe zapytanie do Supabase, bez żadnej warstwy pośredniej.

- `app/jobs/[slug]/page.tsx:12` i `app/companies/[slug]/page.tsx:8` definiują `generateStaticParams()`, ale zwracają wyłącznie zbiory demonstracyjne (`lib/data/jobs.ts`, `lib/data/companies.ts`) — nigdy realne sluggi z bazy. Ponieważ `dynamicParams` domyślnie ma wartość `true`, każda prawdziwa strona oferty/firmy jest renderowana dynamicznie przy każdym żądaniu.
- `lib/data/db-jobs.ts:65-71` (`getSimilarPublishedJobs()`) wywołuje ponownie `getPublishedJobs()` — pełne pobranie **wszystkich** opublikowanych ofert — tylko po to, by w pamięci wyfiltrować 3 "podobne" oferty. Efekt: dwa pełne pobrania tabeli ofert na każde wejście na stronę szczegółów oferty zamiast jednego celowanego zapytania.

### 6.2 HIGH — Filtrowanie/paginacja wyłącznie po stronie klienta

`lib/data/db-jobs.ts:13-21` (`getPublishedJobs()`) nie zawiera żadnego `.limit()`/`.range()` — pobiera całą tabelę opublikowanych ofert wraz z dołączonymi danymi firmy i umiejętności przy każdym wejściu na `/jobs`. `app/jobs/JobsPageClient.tsx:13,34-40` implementuje paginację (`PAGE_SIZE = 6`) i filtrowanie/sortowanie (`lib/filters.ts`) w całości w przeglądarce, na pełnej tablicy przesłanej z serwera. Wraz ze wzrostem liczby ofert oznacza to wysyłanie całego zbioru danych do przeglądarki przy każdej wizycie oraz liniowe filtrowanie po stronie klienta — brak jakiejkolwiek paginacji/filtrowania na poziomie zapytań SQL.

Podobnie `lib/data/db-jobs.ts:89-101` (`getAllCompaniesFromDb()`) pobiera wszystkie firmy wraz z wszystkimi ich ofertami bez limitu.

### 6.3 MEDIUM — Statystyki admina pobierają pełne wiersze zamiast agregacji

`lib/data/db-admin.ts:22-27` (`getAdminStats()`) pobiera **wszystkie** wiersze `profiles`, `companies` i `jobs`, po czym liczy je przez `.filter().length` w JS — w przeciwieństwie do zapytania o `applications` w tej samej funkcji, które poprawnie używa `{count: "exact", head: true}`. Wzorzec jest niespójny: `getAdminJobs`/`getAdminUsers` oraz rekomendowane oferty w `lib/data/db-candidate.ts:41-45` poprawnie stosują `.limit(...)`.

### 6.4 MEDIUM — Middleware wykonuje zewnętrzne wywołanie sieciowe przy każdym żądaniu

`middleware.ts:34-36` obejmuje swoim matcherem praktycznie wszystkie trasy (wyłączając jedynie zasoby statyczne Next i kilka rozszerzeń graficznych) — w tym publiczne strony dla anonimowych odwiedzających. Po skonfigurowaniu Supabase, middleware zawsze wywołuje `supabase.auth.getUser()` (linia 29), co zgodnie z dokumentacją Supabase wykonuje zapytanie sieciowe do serwera Auth przy **każdym** żądaniu — także dla niezalogowanych użytkowników przeglądających publiczne listy ofert. To zalecany wzorzec SSR Supabase, ale w połączeniu z brakiem cache'owania (6.1) oznacza, że każde odsłonięcie strony płaci koszt zewnętrznego round-tripu sieciowego przed renderowaniem.

### 6.5 Elementy bez zastrzeżeń

- Konfiguracja TypeScript jest czysta i restrykcyjna (`strict: true`, brak nadpisań osłabiających).
- `next/font` używane poprawnie (self-hosted, brak zewnętrznych linków do Google Fonts).
- Zapytania panelu pracodawcy/kandydata (`lib/data/db-employer.ts`, `lib/data/db-candidate.ts:24-52`) są poprawnie skopowane do `user_id`/`company_id` i zrównoleglone przez `Promise.all` — brak wzorca N+1 w pętli.
- Brak obecnie użycia `next/image` ani `<img>` — nie stanowi to obecnie defektu, ponieważ produkt nie ma jeszcze prawdziwych obrazów (logo firm to inicjały generowane w CSS), ale `next.config.ts` nie ma skonfigurowanego `images.remotePatterns`, co będzie wymagało uzupełnienia, gdy realne obrazy zostaną dodane.
- Brak `next/dynamic` w całym kodzie — duże komponenty klienckie (`JobWizard.tsx` 461 linii, `PublicJobWizard.tsx` 482 linie, `CareerPassportEditor.tsx` 347 linii) są ładowane w całości zamiast leniwie, mimo że naturalnie nadają się do code-splittingu.

---

## 7. Skalowalność

Ściśle powiązane z sekcją 6 — te same ustalenia dotyczą zdolności produktu do obsłużenia rosnącej liczby ofert/użytkowników:

- **Brak paginacji/filtrowania na poziomie bazy danych** dla ofert i firm (6.2) — to główne ryzyko skalowalności w projekcie. Przy tysiącach ofert każde wejście na `/jobs` oznaczałoby przesłanie całego zbioru do przeglądarki.
- **Brak indeksu pełnotekstowego** (GIN/tsvector) w schemacie (`supabase/migrations/0001_schema.sql`) — logiczna konsekwencja tego, że wyszukiwanie odbywa się dziś w całości w JavaScripcie, a nie w SQL.
- Schemat bazy jest poza tym dobrze znormalizowany (3NF), z indeksami na kluczach obcych i trafnym indeksem złożonym `jobs_status_published_at_idx` dopasowanym do rzeczywistego zapytania listującego (`lib/data/db-jobs.ts:17-21`).
- **LOW — brak kolumn soft-delete**: wszystkie kaskadowe usunięcia (`on delete cascade`) są twarde. Usunięcie firmy kaskadowo niszczy oferty → aplikacje → historię zdarzeń aplikacji, mimo że schemat celowo zabezpiecza tę historię triggerem (`log_application_status_change()`, `0001_schema.sql:292-325`) — brak kolumny `deleted_at` gdziekolwiek.
- **LOW — reguła `end_date` wymagana przy `is_current=false` jest egzekwowana tylko w Zod** (`lib/validation/candidate.ts:42-45`), nie jako ograniczenie CHECK w bazie — każdy bezpośredni zapis do bazy (klient service-role, panel admina, przyszły skrypt migracyjny) może stworzyć niespójny wiersz.
- Middleware wykonujące zapytanie sieciowe przy każdym żądaniu (6.4) będzie skalować koszt liniowo z ruchem — przy dużym ruchu to punkt, w którym warto rozważyć buforowanie sesji.

---

## 8. SEO

### 8.1 CRITICAL — Brak `robots.txt` i sitemapy

Potwierdzony brak `app/robots.ts`, `app/sitemap.ts`, `public/robots.txt`, `public/sitemap.xml`. Dla platformy ogłoszeniowej, której podstawową wartością jest organiczne odkrywanie ofert (`jobs/[slug]`) i firm (`companies/[slug]`) przez wyszukiwarki, to fundamentalna i łatwa do naprawienia luka — bez sitemapy wyszukiwarki muszą odkrywać strony dynamiczne wyłącznie przez śledzenie linków.

### 8.2 HIGH — Statyczne strony marketingowe nie mogą mieć własnych metadanych

11 stron (`about`, `career-center`, `contact`, `employers`, `login`, `privacy`, `register`, `reset-password`, `salary`, `terms`, `update-password`) jest oznaczonych `"use client"` wyłącznie dlatego, że `lib/i18n/context.tsx` (kontekst React, linia 1: `"use client"`) wymaga przeglądarki — każdy komponent wywołujący `useI18n()` musi być kliencki. Next.js zabrania eksportu `metadata`/`generateMetadata` w plikach `"use client"`, więc strony te **strukturalnie nie mogą** mieć własnych, unikalnych tytułów/opisów pod SEO i dziedziczą generyczne polskie metadane z layoutu głównego (`app/layout.tsx:22-26`) niezależnie od treści. Dotyczy to dokładnie tych stron, które powinny mieć unikalne, zorientowane na słowa kluczowe tytuły (`about`, `salary`, `career-center`, `employers`).

### 8.3 HIGH — i18n bez rozwiązania po stronie serwera/URL

Lokalizacja jest wyłącznie stanem klienckim, domyślnie `"pl"` przy każdym renderze serwerowym (`lib/i18n/context.tsx:36`), hydrowana z `localStorage` dopiero po zamontowaniu komponentu (linie 38-43). Brak routingu opartego o URL (np. `/en/jobs`), brak negocjacji `Accept-Language`, brak tagów `hreflang` — Google zaindeksuje wyłącznie polską wersję każdej strony, mimo że produkt celuje w Ukrainę i szerszy region CEE wielojęzycznie.

### 8.4 MEDIUM — Niespójne metadane na trasach dynamicznych

`app/jobs/[slug]/page.tsx:33-57` i `app/companies/[slug]/page.tsx:29-45` mają pełne `generateMetadata` (tytuł, opis, canonical, Open Graph). `app/profile/[slug]/page.tsx:12-18` ma jedynie tytuł/opis — brak canonical i Open Graph, niespójnie względem analogicznych tras dynamicznych.

### 8.5 Pozostałe ustalenia

- **LOW**: brak metadanych Twitter Card gdziekolwiek w kodzie.
- **LOW**: brak `metadataBase` w `app/layout.tsx` — obecnie nieistotne (brak skonfigurowanych obrazów OG), ale zabraknie go w momencie dodania obrazów.
- **Mocna strona**: `lib/seo/job-posting.ts:12-67` implementuje poprawnie ustrukturyzowane dane schema.org `JobPosting` (tytuł, opis, `datePosted`, `validThrough`, typ zatrudnienia, organizacja zatrudniająca, lokalizacja, warunkowo `jobLocationType: "TELECOMMUTE"` i `baseSalary`) — solidna implementacja pod Google Rich Results (choć to samo miejsce jest wektorem luki opisanej w 4.1).

---

## 9. UX/UI

- **Semantyka HTML**: dobra dyscyplina — `<nav>` ×6, jeden `<header>`, jeden `<footer>`, `<section>` ×25, `<article>` ×3, `<aside>` ×5, jeden `<main>` w całej aplikacji (`app/layout.tsx:38`). Przy rozmiarze projektu 433 wystąpienia `<div>` nie stanowią "div-soup" — komponenty konsekwentnie sięgają najpierw po element semantyczny.
- **ARIA**: szeroko i poprawnie stosowane — `aria-hidden` na ok. 130 ikonach dekoracyjnych, `aria-label` na przyciskach ikonowych, `aria-expanded`/`aria-haspopup`/`role="menu"` w menu użytkownika (`components/layout/Navbar.tsx:168-195`), `aria-pressed` na przełącznikach (`JobCard.tsx:123`, `SaveButton.tsx:67,93`), `aria-modal`/`aria-labelledby` w modalu aplikowania (`ApplyButton.tsx:132-133`).
- **Formularze**: 36 elementów `<label>`, poprawny wzorzec niejawnego powiązania (label opakowujący input) tam, gdzie brak `htmlFor`/`id` — dostępne bez naruszeń.
- **LOW/MEDIUM — responsywność tabletowa praktycznie nieobecna**: prefiks `sm:` użyty 171×, `lg:` 58×, ale `md:` zaledwie **1×**, `xl:`/`2xl:` **0×** w całym kodzie. Strategia responsywna skacze z układu mobilnego wprost do `lg:` (1024px) — widoki tabletowe (768–1024px) dostają albo ciasny układ mobilny, albo pełny układ desktopowy, bez pośredniego traktowania.
- **LOW**: brak atrybutów `alt` w całym kodzie (0 wystąpień next/image i `<img>`) — nie stanowi to obecnie defektu, bo logo firm to generowane inicjały oznaczone `aria-hidden="true"` z sąsiadującym tekstem nazwy, ale nie ma ustalonej konwencji na przyszłość, gdy pojawią się prawdziwe zdjęcia/logo.
- i18n wpływa negatywnie także na UX: pierwsza wizyta zawsze pokazuje polską treść niezależnie od preferencji przeglądarki, a przełączenie języka wymaga wcześniejszej interakcji użytkownika (patrz sekcja 8.3).

---

## 10. Jakość kodu

- **MEDIUM — duplikacja: `JobWizard.tsx` (461 linii) i `PublicJobWizard.tsx` (482 linie)** to dwa niezależnie utrzymywane, wieloetapowe kreatory ofert pracy o niemal identycznej strukturze (maszyna stanów kroków, panel boczny z Rabotaj Score na żywo, w dużej mierze te same pola), ale bez współdzielonej implementacji. Różne źródła typów (`JobWizard` korzysta z typów wygenerowanych z bazy, `PublicJobWizard` z luźniejszych typów `string`) i różny zestaw pól — ok. 940 linii łącznie, ryzyko rozjazdu logiki przy przyszłych zmianach.
- **MEDIUM — duplikacja widoków admina**: `app/admin/companies/page.tsx`, `app/admin/jobs/page.tsx`, `app/admin/users/page.tsx` każdorazowo ręcznie powtarzają identyczny wrapper wiersza tabeli, własne mapy etykiet i niemal identyczną logikę stanu pustego/ładowania — brak wspólnego komponentu `List`/`DataTable` w `components/ui/` mimo trzykrotnego powtórzenia dokładnie tego samego wzorca.
- **LOW/MEDIUM — niespójne/nieobecne logowanie błędów**: w całym kodzie non-test istnieje dokładnie **jedno** wywołanie `console.error` (`lib/actions/jobs.ts:87`). Pozostałe ścieżki zapisu (`lib/actions/auth.ts`, `candidate.ts`, `employer.ts`) zamieniają błąd na nieprzezroczysty string `"generic-error"` bez logowania po stronie serwera. Ścieżki odczytu w `lib/data/db-jobs.ts`, `db-candidate.ts`, `db-employer.ts` w większości w ogóle nie sprawdzają pola `error` z odpowiedzi Supabase — nieudane zapytanie (błąd RLS, dryf schematu) cicho renderuje się jako "brak danych" bez żadnego śladu w logach. To realna luka operacyjna: awarie backendu mogą pozostać niezauważone.
- **LOW — architektoniczna niekonsekwencja i18n**: `lib/rabotaj-score.ts:2,153` importuje bezpośrednio polski słownik (`import pl from "@/lib/i18n/locales/pl"`) i ustawia `result.label` na jego podstawie — pole to jest jednak nigdzie faktycznie nieużywane (komponenty `RabotajScore.tsx`/`RabotajScoreDetails.tsx` poprawnie pobierają etykietę z żywego kontekstu i18n) — martwy kod, a zarazem potencjalna pułapka na przyszłość. Panel admina nie jest zinternacjonalizowany w ogóle (twarde polskie stringi w `app/admin/jobs/page.tsx:5-13`, `app/admin/users/page.tsx:4`).
- **LOW — komponent `LocalApplyButton`** (ścieżka demo bez backendu) ma zahardkodowany polski string `"Wysyłanie…"` (`components/jobs/ApplyButton.tsx:236`) zamiast korzystać z `t`.
- Tylko jedno wystąpienie `eslint-disable` w całym repo (uzasadnione, `components/jobs/ApplyButton.tsx:63`), zero `@ts-ignore`/`@ts-expect-error`, zero znaczników `TODO`/`FIXME`/`HACK`/`XXX` w śledzonym kodzie źródłowym.
- Nie znaleziono martwych komponentów wśród sprawdzonej próbki — wszystkie były gdzieś importowane i renderowane.
- **LOW**: nieużywana zależność `clsx` (`package.json:16`) — funkcja `cn()` w `lib/utils.ts` korzysta wyłącznie z `tailwind-merge`.
- **LOW**: BOM (Byte Order Mark) na początku `lib/actions/candidate.ts:1` przed dyrektywą `"use server"` — kosmetyczny błąd higieny plików, funkcjonalnie nieszkodliwy.

---

## 11. Dług techniczny

- Grep całego repozytorium (poza `node_modules`) w poszukiwaniu `TODO|FIXME|HACK|XXX|@ts-ignore|@ts-expect-error|eslint-disable` zwrócił dokładnie **jedno** trafienie — uzasadniony `eslint-disable-next-line` w `ApplyButton.tsx:63`. Zaskakująco niski dług "markerowy" jak na projekt tej wielkości.
- **LOW**: pięć domyślnych plików SVG wygenerowanych przez `create-next-app` (`public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`) pozostaje nieużywanych nigdzie w `app/`/`components/`/`lib/` — pozostałość po szkielecie projektu.
- **LOW**: nieużywana zależność `clsx` (patrz sekcja 10).
- Ciekawostka historyczna, nie aktualny dług: pierwszy commit (`adf62c9`) zawierał `AGENTS.md`/`CLAUDE.md`, usunięte w kolejnym commicie — brak dziś jakichkolwiek osieroconych plików z tego okresu.
- Główny, strukturalny dług techniczny to **nie** rozrzucone znaczniki w kodzie, lecz brakujące elementy całych warstw: brak CI/CD, brak testów poza czystą logiką `lib/`, brak warstwy cache, brak nagłówków bezpieczeństwa, brak monitoringu błędów (brak Sentry lub odpowiednika w zależnościach) — to dług "systemowy", droższy do spłacenia niż pojedyncze `TODO`.

---

## 12. Co poprawić natychmiast

*(patrz też: PLAN NAPRAWCZY — ETAP 1, poniżej)*

1. Naprawić stored XSS w JSON-LD (`app/jobs/[slug]/page.tsx:102`) — sanityzacja `__html` lub bezpieczne escapowanie sekwencji `</script>` przed serializacją.
2. Naprawić open redirect w `app/auth/callback/route.ts:26-28` — walidacja `next` względem tej samej domeny (start od `/`, brak `//`, brak `@`).
3. Wykonać checklistę `supabase/RLS_TESTING.md` względem realnej/testowej instancji Postgres, zanim jakiekolwiek prawdziwe dane trafią do bazy.
4. Dodać podstawowe nagłówki bezpieczeństwa (CSP, X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy) w `next.config.ts`.
5. Dodać rate limiting/CAPTCHA na `loginAction`, `registerAction`, `requestPasswordResetAction`.
6. Zweryfikować (poza tym audytem, kontynuacja poprzedniego audytu IP z 2026-07-16), czy klucz `SUPABASE_SERVICE_ROLE_KEY` odczytany wówczas z `.env.local` został zrotowany — status nieznany na dzień dzisiejszy.

## 13. Co poprawić przed premierą

*(patrz też: PLAN NAPRAWCZY — ETAP 2, poniżej)*

1. Dodać `app/robots.ts` i `app/sitemap.ts`.
2. Ujednolicić metadane na `app/profile/[slug]` względem pozostałych tras dynamicznych.
3. Wdrożyć pipeline CI/CD z bramką typecheck + lint + test przed mergem/deployem.
4. Dodać paginację/filtrowanie po stronie bazy danych dla listy ofert (`lib/data/db-jobs.ts`).
5. Wdrożyć warstwę cache'owania (ISR/`revalidate` lub `unstable_cache`) dla stron publicznych ofert/firm.
6. Naprawić natychmiastowe unieważnianie sesji przy blokadzie użytkownika (`is_blocked`).
7. Rozszerzyć pokrycie testami o Server Actions, warstwę danych i kluczowe komponenty.
8. Rozwiązać architekturę i18n tak, by przynajmniej `<html lang>` i metadane były poprawne server-side (docelowo: routing oparty o URL/locale).
9. Dodać integrację monitoringu błędów (np. Sentry) — obecnie żadna nie istnieje.

## 14. Co można odłożyć

*(patrz też: PLAN NAPRAWCZY — ETAP 3/4, poniżej)*

1. Refaktoryzacja duplikacji `JobWizard`/`PublicJobWizard` do współdzielonego komponentu.
2. Wydzielenie wspólnego komponentu listy/tabeli dla widoków admina.
3. Code-splitting (`next/dynamic`) dla dużych komponentów klienckich (kreatory, edytor).
4. Ograniczenie CHECK w bazie dla reguły `end_date`/`is_current`.
5. Strategia soft-delete dla ofert/aplikacji zachowująca ślad audytowy.
6. Agregujące zapytania `count` zamiast pełnego pobierania wierszy w statystykach admina.
7. Ustalenie konwencji `next/image`/`alt` na moment wprowadzenia realnych obrazów (logo, zdjęcia profilowe).
8. Indeks pełnotekstowy (GIN/tsvector) w miarę wzrostu liczby ofert.
9. Usunięcie drobnego długu: nieużywana zależność `clsx`, martwe pliki SVG, BOM w `candidate.ts`.
10. Rozważenie dedykowanego frameworka i18n (np. `next-intl`) zamiast własnego kontekstu, w miarę skalowania na kolejne rynki.

---

## 15. Ocena projektu

| Kategoria | Ocena (1–10) | Uzasadnienie |
|---|---|---|
| **Architektura** | **6/10** | Czysty podział `lib/data`/`lib/actions`/`lib/validation`, wymuszona granica server/client na poziomie builda, solidna separacja uprawnień admina. Obniżają ocenę: jedno naruszenie warstwy danych, middleware bez roli siatki bezpieczeństwa, brak CI/CD egzekwującego architekturę, architektura i18n wymuszająca niepotrzebne komponenty klienckie. |
| **Frontend** | **6/10** | Wzorowy TypeScript (zero `any`), poprawne użycie Server Actions/`useActionState`, dobre komponenty `ui/`. Obniżają ocenę: znacząca duplikacja (kreatory, listy admina), zero code-splittingu, wymuszone `"use client"` na stronach statycznych. |
| **Backend** | **6/10** | Solidna warstwa danych, konsekwentna walidacja Zod, dobrze zaprojektowane RLS z poprawnymi wzorcami `WITH CHECK`, brak surowego SQL. Obniżają ocenę: RLS nigdy niezweryfikowane na żywej bazie, luka w unieważnianiu sesji przy blokadzie, ciche pochłanianie błędów odczytu, brak rate limitingu. |
| **Bezpieczeństwo** | **4/10** | Krytyczna, realnie eksploatowalna luka stored XSS dostępna bez uwierzytelnienia, plus open redirect — to poważne ustalenia, które same w sobie dyskwalifikują produkcyjną gotowość mimo dobrych fundamentów (autoryzacja admina, brak SQL injection, poprawne sekrety). Dodatkowo brak nagłówków bezpieczeństwa i rate limitingu. |
| **SEO** | **3/10** | Brak `robots.txt`/sitemapy to poważny błąd dla platformy zależnej od ruchu organicznego. Architektura i18n strukturalnie blokuje metadane na 11 stronach i uniemożliwia indeksację jakiegokolwiek języka poza polskim. Jedynym mocnym punktem jest poprawna implementacja JSON-LD `JobPosting`. |
| **UX** | **6/10** | Dobra semantyka HTML i dyscyplina ARIA, dostępne formularze. Obniża ocenę: praktycznie nieobecny układ tabletowy (`md:` użyty raz), niespójne doświadczenie językowe przy pierwszej wizycie. |
| **Performance** | **3/10** | Całkowity brak warstwy cache'owania, nieograniczone zapytania pobierające całe tabele, middleware wykonujące zewnętrzne wywołanie sieciowe przy każdym żądaniu (także dla anonimowych odwiedzających). Fonty i TypeScript są mocną stroną, ale nie równoważą tych ustaleń. |
| **Skalowalność** | **3/10** | Filtrowanie/paginacja list ofert w całości po stronie klienta na pełnym zbiorze danych, brak indeksu pełnotekstowego, statystyki admina pobierające pełne wiersze zamiast agregacji. Schemat bazy jest dobrze znormalizowany, ale warstwa zapytań nie jest gotowa na wzrost skali. |
| **Czytelność kodu** | **7/10** | Bardzo czysty, dobrze nazwany kod, minimalny dług "markerowy", restrykcyjny TypeScript bez ucieczek. Obniżają ocenę: powtarzalność (kreatory, listy admina) i niespójne wzorce obsługi błędów. |
| **Gotowość produkcyjna** | **3/10** | Brak CI/CD, testy pokrywają poniżej 10% kodu (wyłącznie czysta logika), aktywna krytyczna luka bezpieczeństwa, niezweryfikowane RLS, brak monitoringu błędów, brak nagłówków bezpieczeństwa, brak rate limitingu. Projekt sprawdza się jako demonstrowalny MVP/prototyp, ale nie jest gotowy na realny ruch produkcyjny ani realne dane użytkowników bez zamknięcia ustaleń CRITICAL/HIGH powyżej. |

---

## PLAN NAPRAWCZY

### ETAP 1 — Natychmiast (przed jakąkolwiek ekspozycją na realne dane/ruch)

1. Naprawić stored XSS w serializacji JSON-LD (`app/jobs/[slug]/page.tsx:102`).
2. Naprawić open redirect w `app/auth/callback/route.ts:26-28`.
3. Wykonać pełną checklistę `supabase/RLS_TESTING.md` na żywej/testowej instancji Postgres.
4. Dodać nagłówki bezpieczeństwa (CSP, X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy) w `next.config.ts`.
5. Dodać rate limiting/CAPTCHA do logowania, rejestracji i resetu hasła.
6. Zweryfikować status rotacji `SUPABASE_SERVICE_ROLE_KEY` (kontynuacja ustalenia z audytu IP z 2026-07-16).

### ETAP 2 — Przed premierą

1. Dodać `robots.txt` i `sitemap.ts`.
2. Ujednolicić metadane SEO na wszystkich trasach dynamicznych (`profile/[slug]`).
3. Wdrożyć CI/CD (typecheck + lint + test jako bramka przed mergem/deployem).
4. Przenieść paginację/filtrowanie ofert na poziom zapytań do bazy danych.
5. Wdrożyć cache'owanie stron publicznych (ISR/`revalidate`/`unstable_cache`).
6. Naprawić natychmiastowe unieważnianie sesji przy blokadzie użytkownika.
7. Rozszerzyć pokrycie testami na Server Actions, warstwę danych, middleware i kluczowe komponenty.
8. Rozwiązać architekturę i18n tak, by `<html lang>` i metadane odzwierciedlały język treści server-side.
9. Wdrożyć monitoring błędów/observability (np. Sentry) i ujednolicić logowanie błędów w warstwie danych.

### ETAP 3 — Po premierze

1. Zrefaktoryzować duplikację `JobWizard`/`PublicJobWizard` do wspólnego komponentu.
2. Wydzielić wspólny komponent listy/tabeli dla paneli admina.
3. Wprowadzić code-splitting (`next/dynamic`) dla dużych komponentów klienckich.
4. Dodać ograniczenie CHECK w bazie dla reguły `end_date`/`is_current`.
5. Zaprojektować strategię soft-delete zachowującą ślad audytowy dla ofert/aplikacji.
6. Zastąpić pełne pobieranie wierszy w statystykach admina zapytaniami agregującymi (`count`).
7. Wzmocnić middleware jako dodatkową siatkę bezpieczeństwa dla autoryzacji tras (defense-in-depth wobec kontroli per-route).

### ETAP 4 — Długoterminowo

1. Wprowadzić indeks pełnotekstowy (GIN/tsvector) w miarę wzrostu wolumenu ofert.
2. Ustalić konwencje `next/image`/`alt` przed wprowadzeniem realnych obrazów (logo firm, zdjęcia profilowe) — dziś nieużywane, ale będzie to potrzebne.
3. Rozważyć migrację na dedykowany framework i18n (np. `next-intl`) wraz z routingiem opartym o locale, w miarę ekspansji na kolejne rynki CEE.
4. Uporządkować drobny dług: usunąć nieużywaną zależność `clsx`, martwe pliki SVG ze scaffoldingu, BOM w `lib/actions/candidate.ts`.
5. Przy projektowaniu przyszłego modułu AI (JobeeBot) — rozszerzyć istniejący wzorzec `requireAdmin()`/Zod/RLS zamiast tworzyć nową ścieżkę uprawnień; przed ekspozycją jakiegokolwiek endpointu opartego o LLM wdrożyć rate limiting (obecnie nieobecny w całej aplikacji) jako kontrolę kosztów i nadużyć.

---

*Audyt wykonany metodą analizy statycznej kodu źródłowego. Nie stanowi certyfikacji bezpieczeństwa ani testu penetracyjnego środowiska produkcyjnego. Wszystkie cytowane numery linii odnoszą się do stanu repozytorium na commit `74d1786`.*
