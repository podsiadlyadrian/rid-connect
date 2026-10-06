import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AdsBoard from './components/AdsBoard';
import KnowledgeBase from './components/KnowledgeBase';
import CompanyProfile from './components/CompanyProfile';
import Messages from './components/Messages';
import CompanyDirectory from './components/CompanyDirectory';
import CompanyShowcase from './components/CompanyShowcase';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import AdminCompanies from './components/AdminCompanies';

// ----------------- TYPY DANYCH -----------------
export interface Announcement {
  id: number; type: 'env' | 'collab' | 'bhp'; badgeClass: 'tag-env' | 'tag-collab';
  categoryName: string; title: string; content: string; companyName: string; date: string; icon: string;
}

export interface User {
  email: string; role: 'admin' | 'user';
}

export interface RidRating {
  current: { env: number; quality: number; bhp: number; infosec: number };
  history: { date: string; scores: { env: number; quality: number; bhp: number; infosec: number } }[];
}

export interface Company {
  id: number; name: string; city: string; industry: string; certs: string[];
  tagline: string; desc: string; stats: { employees: string; projects: string; years: string };
  offerings: string[]; activeAds: number; coverColor: string;
  isVerified: boolean; verificationExpiry: string; ridRating: RidRating;
}

// ----------------- GŁÓWNY LAYOUT -----------------
function MainLayout({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [subscriptions, setSubscriptions] = useState<string[]>(['env', 'collab']);
  const navigate = useNavigate();

  // GLOBALNA BAZA FIRM - To rozwiązuje Twój błąd (przekazuje dane do AdminCompanies i Katalogu)
  const [companies, setCompanies] = useState<Company[]>([
    { 
      id: 1, name: "Eko-Druk S.A.", city: "Gdańsk", industry: "Poligrafia i Opakowania", 
      certs: ["ISO 14001", "BDO", "FSC"], tagline: "Ekologia w każdym arkuszu.", 
      desc: "Lider ekologicznych rozwiązań w druku na Pomorzu. Od 15 lat dostarczamy opakowania dla największych eksporterów w regionie.", 
      stats: { employees: "120+", projects: "5000+", years: "15" }, 
      offerings: ["Opakowania biodegradowalne", "Druk offsetowy", "Etykiety"], activeAds: 1, 
      coverColor: 'linear-gradient(135deg, var(--primary-dark) 0%, #1e293b 100%)', 
      isVerified: true, verificationExpiry: "2027-04-15",
      ridRating: { 
        current: { env: 92, quality: 85, bhp: 78, infosec: 45 },
        history: [{ date: "2025-04-10", scores: { env: 88, quality: 85, bhp: 70, infosec: 40 } }]
      }
    },
    { 
      id: 2, name: "Bud-Pol Gdynia", city: "Gdynia", industry: "Budownictwo", 
      certs: ["ISO 9001", "ISO 45001"], tagline: "Budujemy fundamenty pomorskiego przemysłu.", 
      desc: "Generalny wykonawca inwestycji przemysłowych i magazynowych z 20-letnim doświadczeniem.", 
      stats: { employees: "250+", projects: "120", years: "22" }, 
      offerings: ["Hale przemysłowe", "Modernizacje energetyczne", "Nadzór inwestorski"], activeAds: 1, 
      coverColor: 'linear-gradient(135deg, #111827 0%, #374151 100%)', 
      isVerified: true, verificationExpiry: "2026-07-20",
      ridRating: { 
        current: { env: 65, quality: 72, bhp: 95, infosec: 30 },
        history: [{ date: "2025-07-15", scores: { env: 60, quality: 75, bhp: 90, infosec: 30 } }]
      }
    },
    { 
      id: 3, name: "Portowe Usługi IT", city: "Gdańsk", industry: "IT i Bezpieczeństwo", 
      certs: ["ISO 27001"], tagline: "Bezpieczeństwo systemów morskich.", 
      desc: "Cyberbezpieczeństwo i audyty IT dla firm z sektora morskiego i logistyki.", 
      stats: { employees: "40", projects: "300+", years: "10" }, offerings: ["Audyty IT", "Pentesty"], activeAds: 0, 
      coverColor: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', 
      isVerified: false, verificationExpiry: "",
      ridRating: { current: { env: 0, quality: 0, bhp: 0, infosec: 0 }, history: [] }
    },
    { 
      id: 99, name: "Logistyka Pomorze Sp. z o.o.", city: "Gdynia", industry: "Transport i Logistyka", 
      certs: ["ISO 9001", "ISO 14001"], tagline: "Bezpieczny transport, zrównoważony rozwój.", 
      desc: "Specjalizujemy się w transporcie z zachowaniem najwyższych standardów środowiskowych.", 
      stats: { employees: "85", projects: "1400+", years: "8" }, 
      offerings: ["Transport drobnicowy", "Logistyka kontraktowa"], activeAds: 1, 
      coverColor: 'linear-gradient(135deg, var(--accent-green) 0%, #065f46 100%)', 
      isVerified: true, verificationExpiry: "2027-10-10",
      ridRating: { current: { env: 88, quality: 90, bhp: 82, infosec: 60 }, history: [] }
    }
  ]);

  const myCompany = companies.find(c => c.id === 99) || companies[0];

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: 1, type: 'env', badgeClass: 'tag-env', categoryName: 'Środowisko i BDO • Szukamy współpracy', title: 'Poszukujemy odbiorcy makulatury', content: 'Generujemy ok. 2 tony makulatury miesięcznie.', companyName: 'Eko-Druk S.A.', date: 'Dzisiaj', icon: 'fa-leaf' },
  ]);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <aside className="sidebar">
        <div className="logo-area"><i className="fa-solid fa-leaf"></i> RID<span>Connect</span></div>
        
        <nav className="nav-menu" style={{ flexGrow: 1 }}>
          {user.role === 'admin' ? (
            <>
              <div style={{ padding: '0 24px', fontSize: '11px', color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 'bold' }}>Panel Administratora</div>
              <NavLink to="/admin" className="nav-item"><i className="fa-solid fa-gauge-high"></i> Przegląd Systemu</NavLink>
              <NavLink to="/admin/companies" className="nav-item"><i className="fa-solid fa-ranking-star"></i> Firmy i Ratingi RID</NavLink>
              <NavLink to="/knowledge" className="nav-item"><i className="fa-solid fa-book-open"></i> Baza Wiedzy (Publikuj)</NavLink>
              <NavLink to="/ads" className="nav-item"><i className="fa-solid fa-bullhorn"></i> Giełda Ofert (Moderacja)</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/dashboard" className="nav-item"><i className="fa-solid fa-house"></i> Pulpit Główny</NavLink>
              <NavLink to="/knowledge" className="nav-item"><i className="fa-solid fa-book-open"></i> Baza Wiedzy RID</NavLink>
              <NavLink to="/ads" className="nav-item"><i className="fa-solid fa-bullhorn"></i> Giełda Ofert B2B</NavLink>
              <NavLink to="/directory" className="nav-item"><i className="fa-solid fa-address-book"></i> Katalog Firm</NavLink>
              <NavLink to="/messages" className="nav-item"><i className="fa-solid fa-envelope"></i> Wiadomości</NavLink>
            </>
          )}
        </nav>

        <nav className="nav-menu" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {user.role === 'user' && (
            <NavLink to="/profile" className="nav-item"><i className="fa-solid fa-building"></i> Profil Firmy</NavLink>
          )}
          <button className="nav-item" style={{ width: '100%' }} onClick={() => { onLogout(); navigate('/login'); }}><i className="fa-solid fa-arrow-right-from-bracket"></i> Wyloguj</button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="search-bar"><i className="fa-solid fa-magnifying-glass"></i><input type="text" placeholder="Szukaj w systemie..." /></div>
          <div className="user-profile">
            <div className="user-info">
              <h4>{user.role === 'admin' ? 'Administrator RID' : 'Jan Kowalski'}</h4>
              <p>{user.role === 'admin' ? 'Centrala RID' : myCompany.name}</p>
            </div>
            <div className="avatar" style={{ background: user.role === 'admin' ? '#ef4444' : 'var(--accent-green)' }}>
              {user.role === 'admin' ? 'AD' : 'JK'}
            </div>
          </div>
        </header>

        <div className="dashboard-container">
          <Routes>
            <Route path="/" element={<Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />} />
            
            {/* PRZEKAZANIE DANYCH FIRM - Rozwiązanie błędu "undefined" */}
            <Route path="/dashboard" element={<Dashboard company={myCompany} announcements={announcements} />} />
            <Route path="/directory" element={<CompanyDirectory companies={companies} />} />
            <Route path="/directory/:id" element={<CompanyShowcase companies={companies} />} />
            <Route path="/profile" element={<CompanyProfile company={myCompany} setCompanies={setCompanies} announcements={announcements} />} />
            
            <Route path="/messages" element={<Messages />} />
            <Route path="/knowledge" element={<KnowledgeBase user={user} />} />
            <Route path="/ads" element={<AdsBoard subscriptions={subscriptions} toggleSubscription={(id) => setSubscriptions(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])} announcements={announcements} setAnnouncements={setAnnouncements} />} />
            
            {user.role === 'admin' && (
              <>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/companies" element={<AdminCompanies companies={companies} setCompanies={setCompanies} />} />
              </>
            )}
          </Routes>
        </div>
      </main>
    </div>
  );
}

// ----------------- GŁÓWNA APLIKACJA -----------------
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  return (
    <Router basename="/ridconnect">
      <Routes>
        <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace /> : <Login onLogin={(email) => setUser({ email, role: email === 'admin@rid.pl' ? 'admin' : 'user' })} />} />
        <Route path="/*" element={user ? <MainLayout user={user} onLogout={() => setUser(null)} /> : <Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}