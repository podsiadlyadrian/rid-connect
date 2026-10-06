// Wspólne typy domenowe RID Connect.
// Wyniesione z App.tsx, żeby były jednym źródłem prawdy dla całej aplikacji
// oraz dla przyszłej warstwy Supabase.

export type Role = 'admin' | 'user';

export interface User {
  email: string;
  role: Role;
}

export interface RatingScores {
  env: number;
  quality: number;
  bhp: number;
  infosec: number;
}

export interface RatingHistoryEntry {
  date: string;
  scores: RatingScores;
}

export interface RidRating {
  current: RatingScores;
  history: RatingHistoryEntry[];
}

export interface CompanyContact {
  email: string;
  phone: string;
}

export interface CompanyStats {
  employees: string;
  projects: string;
  years: string;
}

export interface Company {
  id: number;
  name: string;
  city: string;
  industry: string;
  certs: string[];
  tagline: string;
  desc: string;
  stats: CompanyStats;
  offerings: string[];
  activeAds: number;
  coverColor: string;
  isVerified: boolean;
  verificationExpiry: string;
  ridRating: RidRating;
  contact: CompanyContact;
}

export type AnnouncementType = 'env' | 'collab' | 'bhp';
export type AnnouncementBadge = 'tag-env' | 'tag-collab';
export type AnnouncementStatus = 'pending' | 'approved' | 'rejected';

export interface Announcement {
  id: string;
  type: AnnouncementType;
  badgeClass: AnnouncementBadge;
  categoryName: string;
  title: string;
  content: string;
  companyName: string;
  date: string;
  icon: string;
  status: AnnouncementStatus;
  createdAt: number;
}

export interface KnowledgeEntry {
  id: string;
  category: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  author: string;
  readTime: string;
}

export type MessageStatus = 'pending' | 'accepted' | 'rejected';

export interface Message {
  id: string;
  fromCompany: string;
  toCompany: string;
  subject: string;
  body: string;
  status: MessageStatus;
  date: string;
  // Dane kontaktowe nadawcy — ujawniane odbiorcy dopiero po akceptacji.
  contact: CompanyContact;
}

export type ProposalStatus = 'pending' | 'approved' | 'rejected';

export interface CategoryProposal {
  id: string;
  name: string;
  proposedBy: string;
  status: ProposalStatus;
  date: string;
}
