import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useData } from '../data/DataProvider';
import { calculateOverallScore, getScoreColor } from '../utils/ratingHelpers';

export default function CompanyDirectory() {
  const { companies } = useData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') ?? '');

  // Synchronizacja z frazą z wyszukiwarki w nagłówku (?q=...).
  useEffect(() => {
    setSearchTerm(searchParams.get('q') ?? '');
  }, [searchParams]);

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <div className="welcome-section">
        <h1>Katalog Firm B2B</h1>
        <p>Przeglądaj certyfikowane firmy z województwa pomorskiego. Współpracuj z najlepszymi na podstawie twardych danych.</p>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="search-bar" style={{ width: '100%', border: '1px solid var(--border-color)', backgroundColor: 'white' }}>
          <i className="fa-solid fa-magnifying-glass" aria-hidden="true" style={{ color: 'var(--text-light)' }}></i>
          <input type="text" placeholder="Szukaj po nazwie firmy lub branży..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} aria-label="Szukaj firm w katalogu" />
        </div>
      </div>

      {filteredCompanies.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: '14px' }}>
          Brak firm pasujących do zapytania „{searchTerm}".
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          {filteredCompanies.map((company) => {
            let overallScore = 0;
            let scoreColor = 'var(--text-light)';
            if (company.isVerified && company.ridRating?.current) {
              overallScore = calculateOverallScore(company.ridRating.current);
              scoreColor = getScoreColor(overallScore);
            }

            return (
              <div
                key={company.id}
                className="card"
                style={{
                  display: 'flex', flexDirection: 'column', padding: '24px', position: 'relative', overflow: 'hidden',
                  border: company.isVerified ? '2px solid var(--accent-green)' : '1px solid var(--border-color)',
                  boxShadow: company.isVerified ? '0 10px 15px -3px rgba(16, 185, 129, 0.1)' : '0 2px 4px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ paddingRight: '12px' }}>
                    {company.isVerified ? (
                      <span style={{ display: 'inline-block', fontSize: '11px', color: '#166534', background: '#dcfce7', padding: '4px 8px', borderRadius: '6px', marginBottom: '8px', fontWeight: 600, border: '1px solid #bbf7d0' }}>
                        <i className="fa-solid fa-shield-halved" aria-hidden="true" style={{ marginRight: '4px' }}></i> Zweryfikowany Partner
                      </span>
                    ) : (
                      <span style={{ display: 'inline-block', fontSize: '11px', color: 'var(--text-light)', background: 'var(--bg-light)', padding: '4px 8px', borderRadius: '6px', marginBottom: '8px', fontWeight: 600, border: '1px solid var(--border-color)' }}>
                        Brak weryfikacji RID
                      </span>
                    )}

                    <h3 onClick={() => navigate(`/directory/${company.id}`)} style={{ fontSize: '20px', color: 'var(--primary-dark)', marginBottom: '4px', cursor: 'pointer', fontWeight: 700 }}>
                      {company.name}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-light)' }}><i className="fa-solid fa-location-dot" aria-hidden="true" style={{ marginRight: '6px' }}></i>{company.city} • {company.industry}</p>
                  </div>

                  {company.isVerified && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: `${scoreColor}10`, border: `3px solid ${scoreColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: scoreColor, fontSize: '18px' }}>
                        {overallScore}
                      </div>
                      <span style={{ fontSize: '9px', color: 'var(--text-light)', marginTop: '6px', fontWeight: 700, letterSpacing: '0.5px' }}>RID RATING</span>
                    </div>
                  )}
                </div>

                <p style={{ fontSize: '13px', lineHeight: '1.6', flexGrow: 1, marginBottom: '20px', color: 'var(--text-main)' }}>{company.desc}</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                  {company.certs.map((cert) => (
                    <span key={cert} className="badge" style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-main)', border: '1px solid var(--border-color)', fontSize: '11px' }}>
                      <i className="fa-solid fa-award" aria-hidden="true" style={{ color: 'var(--accent-green)', marginRight: '4px' }}></i> {cert}
                    </span>
                  ))}
                </div>

                <button onClick={() => navigate(`/directory/${company.id}`)} className="btn" style={{ width: '100%', fontWeight: 600, padding: '12px', background: company.isVerified ? 'var(--accent-green)' : '#f8fafc', color: company.isVerified ? 'white' : 'var(--text-main)', border: company.isVerified ? 'none' : '1px solid var(--border-color)' }}>
                  Zobacz pełny raport i profil
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
