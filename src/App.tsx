import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import type { User } from './types';
import { useData } from './data/DataProvider';
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
import AdminAds from './components/AdminAds';
import NotFound from './components/NotFound';

// ----------------------------- GŁÓWNY LAYOUT ---------------------------------
function MainLayout({ user, onLogout }: { user: User; onLogout: () => void }) {
  const navigate = useNavigate();
  const { currentCompany, messages } = useData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');

  const pendingMessages = messages.filter(
    (m) => m.toCompany === currentCompany.name && m.status === 'pending',
  ).length;

  const closeSidebar = (): void => setSidebarOpen(false);

  const handleSearch = (e: React.FormEvent): void => {
    e.preventDefault();
    const term = headerSearch.trim();
    navigate(term ? `/directory?q=${encodeURIComponent(term)}` : '/directory');
    closeSidebar();
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh', overflow: 'hidden' }}>
      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} aria-hidden="true" />}

      <aside className={sidebarOpen ? 'sidebar open' : 'sidebar'}>
        <div className="logo-area"><i className="fa-solid fa-leaf" aria-hidden="true"></i> RID<span>Connect</span></div>

        <nav className="nav-menu" style={{ flexGrow: 1 }} onClick={closeSidebar}>
          {user.role === 'admin' ? (
            <>
              <div className="nav-section-label">Panel Administratora</div>
              <NavLink to="/admin" className="nav-item"><i className="fa-solid fa-gauge-high" aria-hidden="true"></i> Przegląd Systemu</NavLink>
              <NavLink to="/admin/companies" className="nav-item"><i className="fa-solid fa-ranking-star" aria-hidden="true"></i> Firmy i Ratingi RID</NavLink>
              <NavLink to="/admin/ads" className="nav-item"><i className="fa-solid fa-bullhorn" aria-hidden="true"></i> Giełda Ofert (Moderacja)</NavLink>
              <NavLink to="/knowledge" className="nav-item"><i className="fa-solid fa-book-open" aria-hidden="true"></i> Baza Wiedzy (Publikuj)</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/dashboard" className="nav-item"><i className="fa-solid fa-house" aria-hidden="true"></i> Pulpit Główny</NavLink>
              <NavLink to="/knowledge" className="nav-item"><i className="fa-solid fa-book-open" aria-hidden="true"></i> Baza Wiedzy RID</NavLink>
              <NavLink to="/ads" className="nav-item"><i className="fa-solid fa-bullhorn" aria-hidden="true"></i> Giełda Ofert B2B</NavLink>
              <NavLink to="/directory" className="nav-item"><i className="fa-solid fa-address-book" aria-hidden="true"></i> Katalog Firm</NavLink>
              <NavLink to="/messages" className="nav-item">
                <i className="fa-solid fa-envelope" aria-hidden="true"></i> Wiadomości
                {pendingMessages > 0 && <span className="nav-badge">{pendingMessages}</span>}
              </NavLink>
            </>
          )}
        </nav>

        <nav className="nav-menu" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {user.role === 'user' && (
            <NavLink to="/profile" className="nav-item" onClick={closeSidebar}><i className="fa-solid fa-building" aria-hidden="true"></i> Profil Firmy</NavLink>
          )}
          <button className="nav-item" style={{ width: '100%' }} onClick={() => { onLogout(); navigate('/login'); }}>
            <i className="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i> Wyloguj
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="header">
          <button className="hamburger" aria-label="Przełącz menu" onClick={() => setSidebarOpen((v) => !v)}>
            <i className="fa-solid fa-bars" aria-hidden="true"></i>
          </button>
          <form className="search-bar" onSubmit={handleSearch} role="search">
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
            <input type="text" placeholder="Szukaj firm w systemie..." value={headerSearch} onChange={(e) => setHeaderSearch(e.target.value)} aria-label="Szukaj firm" />
          </form>
          <div className="user-profile">
            <div className="user-info">
              <h4>{user.role === 'admin' ? 'Administrator RID' : 'Jan Kowalski'}</h4>
              <p>{user.role === 'admin' ? 'Centrala RID' : currentCompany.name}</p>
            </div>
            <div className="avatar" style={{ background: user.role === 'admin' ? '#ef4444' : 'var(--accent-green)' }}>
              {user.role === 'admin' ? 'AD' : 'JK'}
            </div>
          </div>
        </header>

        <div className="dashboard-container">
          <Routes>
            <Route path="/" element={<Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/directory" element={<CompanyDirectory />} />
            <Route path="/directory/:id" element={<CompanyShowcase />} />
            <Route path="/profile" element={<CompanyProfile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/knowledge" element={<KnowledgeBase user={user} />} />
            <Route path="/ads" element={<AdsBoard />} />
            {user.role === 'admin' && (
              <>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/companies" element={<AdminCompanies />} />
                <Route path="/admin/ads" element={<AdminAds />} />
              </>
            )}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

// ----------------------------- GŁÓWNA APLIKACJA ------------------------------
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  return (
    <Router basename="/ridconnect">
      <Routes>
        <Route
          path="/login"
          element={
            user
              ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
              : <Login onLogin={(email) => setUser({ email, role: email === 'admin@rid.pl' ? 'admin' : 'user' })} />
          }
        />
        <Route path="/*" element={user ? <MainLayout user={user} onLogout={() => setUser(null)} /> : <Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
