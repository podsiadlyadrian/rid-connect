import type { Announcement, Company } from '../App';
import { calculateOverallScore } from '../utils/ratingHelpers';

interface DashboardProps {
  company: Company;
  announcements: Announcement[];
}

export default function Dashboard({ company, announcements }: DashboardProps) {
  const myAds = announcements.filter(ad => ad.companyName === company.name);
  const overallScore = calculateOverallScore(company.ridRating.current);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="welcome-section" style={{ marginBottom: '0' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--primary-dark)' }}>Pulpit Menedżerski</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '14px', marginTop: '4px' }}>Centrum dowodzenia i wgląd w status Twojej organizacji w systemie RID.</p>
      </div>

      {/* Poprawiony Grid layout zapobiegający rozjeżdżaniu */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* LEWY BLOK: Informacje o firmie i ogłoszenia */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary-dark) 0%, #1e293b 100%)', color: 'white', padding: '24px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '8px', fontWeight: 600 }}>Witaj ponownie, Janie!</h2>
            <p style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: '1.5', marginBottom: '16px' }}>
              Twoja wizytówka firmowa jest aktywna w Katalogu. W tym miesiącu Twój profil wyświetliło <strong>42 partnerów biznesowych</strong> z województwa pomorskiego.
            </p>
            <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-green)', border: '1px solid var(--accent-green)', padding: '6px 12px', display: 'inline-block', width: 'fit-content' }}>
              <i className="fa-solid fa-circle-check mr-1"></i> Profil 100% kompletny
            </span>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 className="card-title" style={{ fontSize: '15px', marginBottom: '16px', fontWeight: 600 }}><i className="fa-solid fa-bullhorn text-emerald-500 mr-2"></i> Twoje aktywne oferty ({myAds.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myAds.map(ad => (
                <div key={ad.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <h4 style={{ fontSize: '13px', color: 'var(--primary-dark)', fontWeight: 600 }}>{ad.title}</h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>{ad.categoryName}</span>
                  </div>
                  <span className="badge" style={{ background: '#ecfdf5', color: '#065f46', fontSize: '10px' }}>Aktywne</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PRAWY BLOK: Rating Twojej Firmy */}
        <div className="card" style={{ border: '2px solid var(--accent-green)', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 className="card-title" style={{ fontSize: '15px', marginBottom: '4px', fontWeight: 600 }}>Twój RID Rating</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-light)', marginBottom: '16px' }}>Bieżąca ocena audytorska Twojego przedsiębiorstwa.</p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', background: 'var(--bg-light)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'white', border: '3px solid var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 'bold', color: 'var(--accent-green)', flexShrink: 0 }}>
                {overallScore}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary-dark)' }}>Skuteczność ISO</div>
                <div style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '2px' }}>Status: Klasa A (Lider regionalny)</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px dashed var(--border-color)' }}>
                <span style={{ color: 'var(--text-light)' }}><i className="fa-solid fa-leaf mr-2"></i> Środowisko i BDO</span>
                <strong style={{ color: 'var(--primary-dark)' }}>{company.ridRating.env}/100</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px dashed var(--border-color)' }}>
                <span style={{ color: 'var(--text-light)' }}><i className="fa-solid fa-medal mr-2"></i> Jakość (ISO 9001)</span>
                <strong style={{ color: 'var(--primary-dark)' }}>{company.ridRating.quality}/100</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px dashed var(--border-color)' }}>
                <span style={{ color: 'var(--text-light)' }}><i className="fa-solid fa-hard-hat mr-2"></i> BHP i Bezpieczeństwo</span>
                <strong style={{ color: 'var(--primary-dark)' }}>{company.ridRating.bhp}/100</strong>
              </div>
            </div>
          </div>
          
          <div style={{ fontSize: '11px', color: 'var(--text-light)', textAlign: 'center', marginTop: '20px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
            Ostatnia aktualizacja audytu: Czerwiec 2026
          </div>
        </div>
      </div>

      {/* ALERTY REGULACYJNE */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 className="card-title" style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}><i className="fa-solid fa-triangle-exclamation text-amber-500 mr-2"></i> Najważniejsze alerty regulacyjne dla Twojej branży</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fef3c7' }}>
            <span className="badge" style={{ background: '#fef3c7', color: '#92400e', fontSize: '10px' }}>Środowisko</span>
            <h4 style={{ fontSize: '13px', marginTop: '6px', color: '#92400e', fontWeight: 600 }}>Nowe sprawozdania komunalne BDO</h4>
            <p style={{ fontSize: '12px', color: '#b45309', marginTop: '4px', lineHeight: '1.4' }}>Termin złożenia mija za 14 dni. Sprawdź oficjalne wytyczne w Bazie Wiedzy RID.</p>
          </div>
          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span className="badge" style={{ background: '#e2e8f0', color: 'var(--text-main)', fontSize: '10px' }}>ISO 14001</span>
            <h4 style={{ fontSize: '13px', marginTop: '6px', fontWeight: 600 }}>Weryfikacja aspektów środowiskowych</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '4px', lineHeight: '1.4' }}>Twój dedykowany audytor RID zaktualizował arkusz oceny celów i zadań.</p>
          </div>
        </div>
      </div>
    </div>
  );
}