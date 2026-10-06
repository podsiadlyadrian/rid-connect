// =============================================================================
// WARSTWA DANYCH (in-memory) — jedyny punkt styku komponentów z danymi.
// =============================================================================
// Komponenty NIE trzymają już własnych kopii danych — czytają i zmieniają je
// przez useData(). Dzięki temu później wystarczy dopisać SupabaseDataProvider
// implementujący ten sam interfejs DataApi, podmienić go w src/main.tsx i cała
// reszta aplikacji zostaje bez zmian.
//
// UWAGA: to pamięć ulotna — odświeżenie strony resetuje dane (świadome, do czasu
// wpięcia Supabase).

import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type {
  Announcement,
  AnnouncementBadge,
  AnnouncementType,
  CategoryProposal,
  Company,
  CompanyStats,
  KnowledgeEntry,
  Message,
  RatingScores,
} from '../types';
import { newId } from '../utils/id';

// ----------------------------- Interfejs API ---------------------------------

export interface AnnouncementInput {
  type: AnnouncementType;
  badgeClass: AnnouncementBadge;
  categoryName: string;
  title: string;
  content: string;
  icon: string;
}

export interface KnowledgeInput {
  category: string;
  title: string;
  summary: string;
  content: string;
}

export interface MessageInput {
  toCompany: string;
  subject: string;
  body: string;
}

export interface CompanyProfilePatch {
  tagline: string;
  desc: string;
  offerings: string[];
  stats: CompanyStats;
}

export interface DataApi {
  companies: Company[];
  announcements: Announcement[];
  knowledgeEntries: KnowledgeEntry[];
  messages: Message[];
  categoryProposals: CategoryProposal[];
  /** Firma zalogowanego użytkownika (demo: Logistyka Pomorze, id 99). */
  currentCompany: Company;

  updateCompanyProfile(id: number, patch: CompanyProfilePatch): void;
  saveCompanyAudit(id: number, rating: RatingScores, expiry: string): void;

  addAnnouncement(input: AnnouncementInput): void;
  moderateAnnouncement(id: string, decision: 'approved' | 'rejected'): void;

  addKnowledgeEntry(input: KnowledgeInput): void;

  sendMessage(input: MessageInput): void;
  respondToMessage(id: string, decision: 'accepted' | 'rejected'): void;

  addCategoryProposal(name: string): void;
  moderateCategoryProposal(id: string, decision: 'approved' | 'rejected'): void;
}

// ----------------------------- Dane startowe ---------------------------------

const CURRENT_COMPANY_ID = 99;
const today = (): string => new Date().toISOString().split('T')[0];

const seedCompanies: Company[] = [
  {
    id: 1, name: 'Eko-Druk S.A.', city: 'Gdańsk', industry: 'Poligrafia i Opakowania',
    certs: ['ISO 14001', 'BDO', 'FSC'], tagline: 'Ekologia w każdym arkuszu.',
    desc: 'Lider ekologicznych rozwiązań w druku na Pomorzu. Od 15 lat dostarczamy opakowania dla największych eksporterów w regionie.',
    stats: { employees: '120+', projects: '5000+', years: '15' },
    offerings: ['Opakowania biodegradowalne', 'Druk offsetowy', 'Etykiety'], activeAds: 1,
    coverColor: 'linear-gradient(135deg, var(--primary-dark) 0%, #1e293b 100%)',
    isVerified: true, verificationExpiry: '2027-04-15',
    ridRating: {
      current: { env: 92, quality: 85, bhp: 78, infosec: 45 },
      history: [{ date: '2025-04-10', scores: { env: 88, quality: 85, bhp: 70, infosec: 40 } }],
    },
    contact: { email: 'kontakt@eko-druk.pl', phone: '+48 58 300 10 10' },
  },
  {
    id: 2, name: 'Bud-Pol Gdynia', city: 'Gdynia', industry: 'Budownictwo',
    certs: ['ISO 9001', 'ISO 45001'], tagline: 'Budujemy fundamenty pomorskiego przemysłu.',
    desc: 'Generalny wykonawca inwestycji przemysłowych i magazynowych z 20-letnim doświadczeniem.',
    stats: { employees: '250+', projects: '120', years: '22' },
    offerings: ['Hale przemysłowe', 'Modernizacje energetyczne', 'Nadzór inwestorski'], activeAds: 1,
    coverColor: 'linear-gradient(135deg, #111827 0%, #374151 100%)',
    isVerified: true, verificationExpiry: '2026-07-20',
    ridRating: {
      current: { env: 65, quality: 72, bhp: 95, infosec: 30 },
      history: [{ date: '2025-07-15', scores: { env: 60, quality: 75, bhp: 90, infosec: 30 } }],
    },
    contact: { email: 'biuro@bud-pol.pl', phone: '+48 58 620 20 20' },
  },
  {
    id: 3, name: 'Portowe Usługi IT', city: 'Gdańsk', industry: 'IT i Bezpieczeństwo',
    certs: ['ISO 27001'], tagline: 'Bezpieczeństwo systemów morskich.',
    desc: 'Cyberbezpieczeństwo i audyty IT dla firm z sektora morskiego i logistyki.',
    stats: { employees: '40', projects: '300+', years: '10' }, offerings: ['Audyty IT', 'Pentesty'], activeAds: 0,
    coverColor: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
    isVerified: false, verificationExpiry: '',
    ridRating: { current: { env: 0, quality: 0, bhp: 0, infosec: 0 }, history: [] },
    contact: { email: 'kontakt@portowe-it.pl', phone: '+48 58 400 30 30' },
  },
  {
    id: CURRENT_COMPANY_ID, name: 'Logistyka Pomorze Sp. z o.o.', city: 'Gdynia', industry: 'Transport i Logistyka',
    certs: ['ISO 9001', 'ISO 14001'], tagline: 'Bezpieczny transport, zrównoważony rozwój.',
    desc: 'Specjalizujemy się w transporcie z zachowaniem najwyższych standardów środowiskowych.',
    stats: { employees: '85', projects: '1400+', years: '8' },
    offerings: ['Transport drobnicowy', 'Logistyka kontraktowa'], activeAds: 1,
    coverColor: 'linear-gradient(135deg, var(--accent-green) 0%, #065f46 100%)',
    isVerified: true, verificationExpiry: '2027-10-10',
    ridRating: { current: { env: 88, quality: 90, bhp: 82, infosec: 60 }, history: [] },
    contact: { email: 'kontakt@logistyka-pomorze.pl', phone: '+48 58 777 00 00' },
  },
];

const seedAnnouncements: Announcement[] = [
  {
    id: 'ann-1', type: 'env', badgeClass: 'tag-env',
    categoryName: 'Środowisko i BDO • Szukamy współpracy',
    title: 'Poszukujemy odbiorcy makulatury', content: 'Generujemy ok. 2 tony makulatury miesięcznie i szukamy stałego, certyfikowanego odbiorcy z regionu pomorskiego.',
    companyName: 'Eko-Druk S.A.', date: 'Dzisiaj', icon: 'fa-leaf', status: 'approved', createdAt: 1_700_000_300_000,
  },
  {
    id: 'ann-2', type: 'collab', badgeClass: 'tag-collab',
    categoryName: 'Współpraca B2B • Oferujemy usługi',
    title: 'Podwykonawstwo prac budowlanych', content: 'Dysponujemy wolnymi mocami brygady wykończeniowej — podejmiemy współpracę przy inwestycjach magazynowych na Pomorzu.',
    companyName: 'Bud-Pol Gdynia', date: 'Wczoraj', icon: 'fa-handshake', status: 'approved', createdAt: 1_700_000_200_000,
  },
  {
    id: 'ann-3', type: 'collab', badgeClass: 'tag-collab',
    categoryName: 'Współpraca B2B • Szukamy współpracy',
    title: 'Zlecę transport drobnicowy Trójmiasto–Poznań', content: 'Stały ładunek 2–3 palety, 2x w tygodniu. Szukamy przewoźnika z ważną weryfikacją RID.',
    companyName: 'Logistyka Pomorze Sp. z o.o.', date: 'Ważne jeszcze 30 dni', icon: 'fa-handshake', status: 'approved', createdAt: 1_700_000_100_000,
  },
];

const seedKnowledge: KnowledgeEntry[] = [
  {
    id: 'kb-1', category: 'Środowisko', title: 'Zmiany w raportowaniu BDO na rok 2027',
    summary: 'Zmieniają się przepisy dotyczące ewidencji odpadów opakowaniowych. Zobacz, co musisz przygotować.',
    content: 'W związku z nowelizacją ustawy o gospodarce opakowaniami i odpadami opakowaniowymi, od 1 stycznia przedsiębiorcy z województwa pomorskiego będą musieli dostosować swoje systemy ERP do nowych kodów odpadowych. Główne zmiany dotyczą rozszerzonej odpowiedzialności producentów (ROP) oraz nowych stawek opłat produktowych. Rekomendujemy przeprowadzenie audytu wewnętrznego strumienia odpadów do końca trzeciego kwartału bieżącego roku, aby uniknąć kar administracyjnych, które mogą wynosić od 10 000 zł do nawet 1 000 000 zł.',
    date: '2026-06-28', author: 'mgr inż. Aleksandra Sareło (Ekspert ds. Ochrony Środowiska RID)', readTime: '5 min',
  },
  {
    id: 'kb-2', category: 'ISO', title: 'Audyt wewnętrzny - najczęstsze błędy zarządu',
    summary: 'Podsumowanie doświadczeń naszych audytorów z ostatnich 50 certyfikacji ISO 9001.',
    content: 'Analiza ostatnich audytów certyfikujących na Pomorzu wykazała, że najczęstszym błędem najwyższego kierownictwa jest brak formalnego powiązania celów jakościowych ze strategią biznesową firmy (wymóg rozdziału 5.1 normy ISO 9001:2015). Ponadto, często kuleje proces zarządzania ryzykiem i szansami, gdzie rejestry ryzyk są martwymi dokumentami tworzonymi wyłącznie "pod audytora". Prawidłowo prowadzony przegląd zarządzania powinien być kluczowym narzędziem podejmowania decyzji przez prezesów i właścicieli spółek.',
    date: '2026-06-25', author: 'Robert Nowak (Główny Audytor Systemów Zarządzania RID)', readTime: '4 min',
  },
  {
    id: 'kb-3', category: 'BHP', title: 'Bezpieczeństwo pracy przy obsłudze urządzeń HDS',
    summary: 'Nowe instrukcje stanowiskowe i wytyczne dla operatorów dźwigów przeładunkowych.',
    content: 'W odpowiedzi na rosnącą liczbę incydentów w pomorskich centrach logistycznych, Państwowa Inspekcja Pracy zapowiedziała wzmożone kontrole w zakresie uprawnień UDT operatorów HDS oraz stanu technicznego zawiesi. Przypominamy, że każdy pracodawca ma obowiązek udostępnienia aktualnych, dostosowanych do specyfiki zakładu instrukcji BHP. W sekcji dokumentów RID przygotowaliśmy dla Państwa gotowy szablon oceny ryzyka zawodowego dla tego stanowiska do pobrania za darmo w pakiecie Premium.',
    date: '2026-06-15', author: 'inż. Janusz Kasperski (Starszy Inspektor BHP RID)', readTime: '6 min',
  },
];

const seedMessages: Message[] = [
  {
    id: 'msg-1', fromCompany: 'Eko-Druk S.A.', toCompany: 'Logistyka Pomorze Sp. z o.o.',
    subject: 'Zapytanie o transport drobnicowy',
    body: 'Firma Eko-Druk S.A. jest zainteresowana Państwa ofertą transportową. Czy moglibyśmy omówić stałą współpracę przy wywozie palet?',
    status: 'pending', date: 'Dzisiaj', contact: { email: 'kontakt@eko-druk.pl', phone: '+48 58 300 10 10' },
  },
];

const seedProposals: CategoryProposal[] = [
  { id: 'prop-1', name: 'Energia odnawialna', proposedBy: 'Bud-Pol Gdynia', status: 'pending', date: '2026-10-01' },
  { id: 'prop-2', name: 'Gospodarka obiegu zamkniętego', proposedBy: 'Eko-Druk S.A.', status: 'pending', date: '2026-10-03' },
];

// ----------------------------- Context + Provider ----------------------------

const DataContext = createContext<DataApi | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>(seedCompanies);
  const [announcements, setAnnouncements] = useState<Announcement[]>(seedAnnouncements);
  const [knowledgeEntries, setKnowledgeEntries] = useState<KnowledgeEntry[]>(seedKnowledge);
  const [messages, setMessages] = useState<Message[]>(seedMessages);
  const [categoryProposals, setCategoryProposals] = useState<CategoryProposal[]>(seedProposals);

  const currentCompany = useMemo<Company>(
    () => companies.find((c) => c.id === CURRENT_COMPANY_ID) ?? companies[0],
    [companies],
  );

  const api: DataApi = {
    companies,
    announcements,
    knowledgeEntries,
    messages,
    categoryProposals,
    currentCompany,

    updateCompanyProfile(id, patch) {
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, tagline: patch.tagline, desc: patch.desc, offerings: patch.offerings, stats: patch.stats }
            : c,
        ),
      );
    },

    saveCompanyAudit(id, rating, expiry) {
      setCompanies((prev) =>
        prev.map((c) => {
          if (c.id !== id) return c;
          const history = [...c.ridRating.history];
          if (c.isVerified) {
            history.unshift({ date: today(), scores: { ...c.ridRating.current } });
          }
          return { ...c, isVerified: true, verificationExpiry: expiry, ridRating: { current: rating, history } };
        }),
      );
    },

    addAnnouncement(input) {
      const ad: Announcement = {
        id: newId(),
        type: input.type,
        badgeClass: input.badgeClass,
        categoryName: input.categoryName,
        title: input.title,
        content: input.content,
        icon: input.icon,
        companyName: currentCompany.name,
        date: 'Ważne jeszcze 30 dni',
        status: 'pending',
        createdAt: Date.now(),
      };
      setAnnouncements((prev) => [ad, ...prev]);
    },

    moderateAnnouncement(id, decision) {
      setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, status: decision } : a)));
    },

    addKnowledgeEntry(input) {
      const entry: KnowledgeEntry = {
        id: newId(),
        category: input.category,
        title: input.title,
        summary: input.summary,
        content: input.content,
        date: today(),
        author: 'Administrator RID (Wpis Oficjalny)',
        readTime: '3 min',
      };
      setKnowledgeEntries((prev) => [entry, ...prev]);
    },

    sendMessage(input) {
      const msg: Message = {
        id: newId(),
        fromCompany: currentCompany.name,
        toCompany: input.toCompany,
        subject: input.subject,
        body: input.body,
        status: 'pending',
        date: 'Dzisiaj',
        contact: currentCompany.contact,
      };
      setMessages((prev) => [msg, ...prev]);
    },

    respondToMessage(id, decision) {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: decision } : m)));
    },

    addCategoryProposal(name) {
      const proposal: CategoryProposal = {
        id: newId(),
        name,
        proposedBy: currentCompany.name,
        status: 'pending',
        date: today(),
      };
      setCategoryProposals((prev) => [proposal, ...prev]);
    },

    moderateCategoryProposal(id, decision) {
      setCategoryProposals((prev) => prev.map((p) => (p.id === id ? { ...p, status: decision } : p)));
    },
  };

  return <DataContext.Provider value={api}>{children}</DataContext.Provider>;
}

export function useData(): DataApi {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData() musi być użyte wewnątrz <DataProvider>');
  return ctx;
}
