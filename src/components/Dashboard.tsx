import { useData } from '../data/DataProvider';
import { calculateOverallScore, getScoreClass, getScoreColor } from '../utils/ratingHelpers';

export default function Dashboard() {
  const { currentCompany: company, announcements } = useData();

  const myAds = announcements.filter((ad) => ad.companyName === company.name);
  const overallScore = calculateOverallScore(company.ridRating.current);
  const statusClass = getScoreClass(overallScore);
  const scoreColor = getScoreColor(overallScore);
  const lastAuditDate = company.ridRating.history[0]?.date;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="welcome-section" style={{ marginBottom: '0' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--primary-dark)' }}>Pulpit Menedżerski</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '14px', marginTop: '4px' }}>Centrum dowodzenia i wgląd w status Twojej organizacji w systemie RID.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* LEWY BLOK */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary-dark) 0%, #1e293b 100%)', color: 'white', padding: '24px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '8px', fontWeight: 600 }}>Witaj ponownie, Janie!</h2>
            <p style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: '1.5', marginBottom: '16px' }}>
              Twoja wizytówka firmowa <strong>{company.name}</strong> jest aktywna w Katalogu RID. Masz obecnie{' '}
              <strong>{myAds.filter((a) => a.status === 'approved').length}</strong> aktywnych ogłoszeń na Giełdzie Ofert.
            </p>
            <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-green)', border: '1px solid var(--accent-green)', padding: '6px 12px', display: 'inline-block', width: 'fit-content' }}>
              <i className="fa-solid fa-circle-check" aria-hidden="true" style={{ marginRight: '4px' }}></i> Profil kompletny
            </span>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 className="card-title" style={{ fontSize: '15px', marginBottom: '16px', fontWeight: 600 }}>
              <i className="fa-solid fa-bullhorn" aria-hidden="true" style={{ color: 'var(--accent-green)', marginRight: '8px' }}></i> Twoje ogłoszenia ({myAds.length})
            </h3>
            {myAds.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>Nie masz jeszcze ogłoszeń na Giełdzie Ofert.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {myAds.map((ad) => (
                  <div key={ad.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
                    <div>
                      <h4 style={{ fontSize: '13px', color: 'var(--primary-dark)', fontWeight: 600 }}>{ad.title}</h4>
                      <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>{ad.categoryName}</span>
                    </div>
                    {ad.status === 'approved' ? (
                      <span className="badge" style={{ background: '#ecfdf5', color: '#065f46', fontSize: '10px' }}>Aktywne</span>
                    ) : ad.status === 'pending' ? (
                      <span className="badge" style={{ background: '#fef3c7', color: '#92400e', fontSize: '10px' }}>Oczekuje</span>
                    ) : (
                      <span className="badge" style={{ background: '#fee2e2', color: '#991b1b', fontSize: '10px' }}>Odrzucone</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* PRAWY BLOK: Rating */}
        <div className="card" style={{ border: '2px solid var(--accent-green)', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 className="card-title" style={{ fontSize: '15px', marginBottom: '4px', fontWeight: 600 }}>Twój RID Rating</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-light)', marginBottom: '16px' }}>Bieżąca ocena audytorska Twojego przedsiębiorstwa.</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', background: 'var(--bg-light)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'white', border: `3px solid ${scoreColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 'bold', color: scoreColor, flexShrink: 0 }}>
                {overallScore}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary-dark)' }}>Skuteczność ISO</div>
                <div style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '2px' }}>Status: {statusClass}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px dashed var(--border-color)' }}>
                <span style={{ color: 'var(--text-light)' }}><i className="fa-solid fa-leaf" aria-hidden="true" style={{ marginRight: '8px' }}></i> Środowisko i BDO</span>
                <strong style={{ color: 'var(--primary-dark)' }}>{company.ridRating.current.env}/100</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px dashed var(--border-color)' }}>
                <span style={{ color: 'var(--text-light)' }}><i className="fa-solid fa-medal" aria-hidden="true" style={{ marginRight: '8px' }}></i> Jakość (ISO 9001)</span>
                <strong style={{ color: 'var(--primary-dark)' }}>{company.ridRating.current.quality}/100</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px dashed var(--border-color)' }}>
                <span style={{ color: 'var(--text-light)' }}><i className="fa-solid fa-hard-hat" aria-hidden="true" style={{ marginRight: '8px' }}></i> BHP i Bezpieczeństwo</span>
                <strong style={{ color: 'var(--primary-dark)' }}>{company.ridRating.current.bhp}/100</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px dashed var(--border-color)' }}>
                <span style={{ color: 'var(--text-light)' }}><i className="fa-solid fa-shield-halved" aria-hidden="true" style={{ marginRight: '8px' }}></i> Bezpieczeństwo IT</span>
                <strong style={{ color: 'var(--primary-dark)' }}>{company.ridRating.current.infosec}/100</strong>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-light)', textAlign: 'center', marginTop: '20px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
            {lastAuditDate ? `Ostatnia aktualizacja audytu: ${lastAuditDate}` : 'Brak zarejestrowanej historii audytów'}
            {company.verificationExpiry && ` • Ważny do: ${company.verificationExpiry}`}
          </div>
        </div>
      </div>

      {/* ALERTY REGULACYJNE (treść przykładowa) */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 className="card-title" style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>
          <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" style={{ color: '#f59e0b', marginRight: '8px' }}></i> Najważniejsze alerty regulacyjne dla Twojej branży
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fef3c7' }}>
            <span className="badge" style={{ background: '#fef3c7', color: '#92400e', fontSize: '10px' }}>Środowisko</span>
            <h4 style={{ fontSize: '13px', marginTop: '6px', color: '#92400e', fontWeight: 600 }}>Nowe sprawozdania komunalne BDO</h4>
            <p style={{ fontSize: '12px', color: '#b45309', marginTop: '4px', lineHeight: '1.4' }}>Sprawdź oficjalne wytyczne w Bazie Wiedzy RID.</p>
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
