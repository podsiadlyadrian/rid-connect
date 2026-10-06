import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useData } from '../data/DataProvider';
import { calculateOverallScore, getScoreColor, getScoreClass } from '../utils/ratingHelpers';

const RatingBar = ({ label, score, prevScore, icon }: { label: string; score: number; prevScore?: number; icon: string }) => {
  const color = getScoreColor(score);

  let trendIndicator = <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>-</span>;
  if (prevScore !== undefined) {
    const diff = score - prevScore;
    if (diff > 0) trendIndicator = <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 'bold' }}><i className="fa-solid fa-arrow-up" aria-hidden="true" style={{ marginRight: '4px' }}></i>{diff}</span>;
    else if (diff < 0) trendIndicator = <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: 'bold' }}><i className="fa-solid fa-arrow-down" aria-hidden="true" style={{ marginRight: '4px' }}></i>{Math.abs(diff)}</span>;
  }

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', fontWeight: 600 }}>
        <span><i className={`fa-solid ${icon}`} aria-hidden="true" style={{ color: 'var(--text-light)', marginRight: '8px' }}></i> {label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {trendIndicator}
          <strong style={{ color, fontSize: '14px' }}>{score}/100</strong>
        </div>
      </div>
      <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color }}></div>
      </div>
    </div>
  );
};

export default function CompanyShowcase() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { companies, currentCompany, sendMessage } = useData();

  const company = companies.find((c) => c.id === Number(id)) ?? companies[0];

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isMsgOpen, setIsMsgOpen] = useState(false);
  const [msgSubject, setMsgSubject] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [msgSent, setMsgSent] = useState(false);

  const overallScore = calculateOverallScore(company.ridRating.current);
  const overallColor = getScoreColor(overallScore);
  const history = company.ridRating.history[0];

  const expiryDate = new Date(company.verificationExpiry || '2030-01-01');
  const today = new Date();
  const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
  const isExpiringSoon = daysLeft > 0 && daysLeft <= 30;
  const isExpired = daysLeft <= 0;

  const isOwnCompany = company.id === currentCompany.id;

  const handleSendMessage = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!msgSubject.trim() || !msgBody.trim()) return;
    sendMessage({ toCompany: company.name, subject: msgSubject.trim(), body: msgBody.trim() });
    setMsgSent(true);
    setMsgSubject('');
    setMsgBody('');
  };

  const closeMsg = (): void => {
    setIsMsgOpen(false);
    setMsgSent(false);
  };

  return (
    <div>
      <button onClick={() => navigate('/directory')} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', marginBottom: '20px', fontSize: '14px' }}>
        <i className="fa-solid fa-arrow-left" aria-hidden="true"></i> Powrót
      </button>

      <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ height: '140px', background: company.coverColor, position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: '-40px', left: '40px', width: '90px', height: '90px', backgroundColor: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', color: 'var(--primary-dark)', border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <i className="fa-solid fa-building" aria-hidden="true"></i>
          </div>
        </div>
        <div style={{ padding: '50px 40px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '26px', color: 'var(--primary-dark)', fontWeight: 700 }}>{company.name}</h1>
              {isExpired ? (
                <span className="badge" style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }}><i className="fa-solid fa-triangle-exclamation" aria-hidden="true" style={{ marginRight: '4px' }}></i> Weryfikacja wygasła</span>
              ) : isExpiringSoon ? (
                <span className="badge" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}><i className="fa-solid fa-clock" aria-hidden="true" style={{ marginRight: '4px' }}></i> Weryfikacja wygasa wkrótce</span>
              ) : (
                company.isVerified && <span className="badge" style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' }}><i className="fa-solid fa-shield-halved" aria-hidden="true" style={{ marginRight: '4px' }}></i> Zweryfikowany Partner RID</span>
              )}
            </div>
            <p style={{ fontSize: '15px', color: 'var(--accent-green)', fontWeight: 500, marginTop: '4px' }}>{company.tagline}</p>
          </div>
          {!isOwnCompany && (
            <button className="btn" onClick={() => setIsMsgOpen(true)}>
              <i className="fa-solid fa-envelope" aria-hidden="true" style={{ marginRight: '8px' }}></i> Wyślij zapytanie
            </button>
          )}
        </div>
      </div>

      <div className="grid-layout" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card"><h3 className="card-title">Kluczowe Usługi</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {company.offerings.map((o) => <div key={o} style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}><i className="fa-solid fa-circle-check" aria-hidden="true" style={{ color: 'var(--accent-green)' }}></i><span style={{ fontSize: '13px', fontWeight: 600 }}>{o}</span></div>)}
            </div>
          </div>
          <div className="card"><h3 className="card-title">O nas</h3><p style={{ lineHeight: '1.7', fontSize: '14px' }}>{company.desc}</p></div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card" style={{ border: '1px solid var(--border-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <h3 className="card-title" style={{ fontSize: '15px', fontWeight: 600, marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
              Weryfikacja Audytorska RID
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: `${overallColor}15`, border: `3px solid ${overallColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', color: overallColor }}>{overallScore}</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>Wynik końcowy</div>
                {company.verificationExpiry && <div style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '2px' }}>Ważne do: {company.verificationExpiry}</div>}
              </div>
            </div>

            <RatingBar label="Środowisko i BDO" score={company.ridRating.current.env} prevScore={history?.scores.env} icon="fa-leaf" />
            <RatingBar label="Zarządzanie Jakością" score={company.ridRating.current.quality} prevScore={history?.scores.quality} icon="fa-medal" />
            <RatingBar label="BHP i Bezpieczeństwo" score={company.ridRating.current.bhp} prevScore={history?.scores.bhp} icon="fa-hard-hat" />
            <RatingBar label="Bezpieczeństwo IT" score={company.ridRating.current.infosec} prevScore={history?.scores.infosec} icon="fa-shield-halved" />

            <button onClick={() => setIsReportOpen(true)} className="btn" style={{ width: '100%', marginTop: '12px', background: '#f8fafc', color: 'var(--primary-dark)', border: '1px solid var(--border-color)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              <i className="fa-solid fa-file-invoice" aria-hidden="true" style={{ color: 'var(--accent-green)', marginRight: '8px' }}></i> Wygeneruj pełny raport
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: wysłanie zapytania */}
      {isMsgOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '16px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '32px' }}>
            {msgSent ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '46px', color: 'var(--accent-green)', marginBottom: '12px' }}><i className="fa-solid fa-circle-check" aria-hidden="true"></i></div>
                <h3 style={{ fontSize: '18px', color: 'var(--primary-dark)', fontWeight: 700 }}>Zapytanie wysłane!</h3>
                <p style={{ color: 'var(--text-light)', fontSize: '13px', marginTop: '6px', marginBottom: '20px' }}>
                  Firma {company.name} otrzyma Twoje zapytanie. Po akceptacji zostaną udostępnione dane kontaktowe. Kopię znajdziesz w „Wiadomości → Wysłane".
                </p>
                <button className="btn" onClick={closeMsg} style={{ width: '100%' }}>Zamknij</button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 className="card-title" style={{ margin: 0 }}>Zapytanie do: {company.name}</h3>
                  <button onClick={closeMsg} aria-label="Zamknij" style={{ background: 'none', border: 'none', fontSize: '20px', color: 'var(--text-light)', cursor: 'pointer' }}><i className="fa-solid fa-xmark" aria-hidden="true"></i></button>
                </div>
                <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Temat</label>
                    <input type="text" required value={msgSubject} onChange={(e) => setMsgSubject(e.target.value)} placeholder="np. Zapytanie o współpracę transportową" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Treść</label>
                    <textarea required rows={4} value={msgBody} onChange={(e) => setMsgBody(e.target.value)} placeholder="Opisz czego dotyczy Twoje zapytanie..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', resize: 'vertical' }}></textarea>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-light)', margin: 0 }}>
                    <i className="fa-solid fa-lock" aria-hidden="true" style={{ marginRight: '4px' }}></i> Twoje dane kontaktowe zostaną ujawnione dopiero po akceptacji zapytania przez odbiorcę.
                  </p>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={closeMsg} className="btn" style={{ background: '#f1f5f9', color: '#475569' }}>Anuluj</button>
                    <button type="submit" className="btn">Wyślij zapytanie</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* MODAL: drukowalny raport (zastępuje atrapę .txt) */}
      {isReportOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '16px', overflowY: 'auto' }}>
          <div className="card print-area" style={{ width: '100%', maxWidth: '640px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--primary-dark)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--primary-dark)' }}><i className="fa-solid fa-leaf" aria-hidden="true" style={{ color: 'var(--accent-green)', marginRight: '8px' }}></i>RID Connect</div>
                <div style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '4px' }}>Raport weryfikacji systemów zarządzania</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--text-light)' }}>
                Data wygenerowania:<br />{today.toISOString().split('T')[0]}
              </div>
            </div>

            <h2 style={{ fontSize: '18px', color: 'var(--primary-dark)', fontWeight: 700 }}>{company.name}</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-light)', marginBottom: '20px' }}>{company.city} • {company.industry}</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--bg-light)', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'white', border: `3px solid ${overallColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', color: overallColor }}>{overallScore}</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary-dark)' }}>Wynik zbiorczy: {overallScore}/100</div>
                <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>{getScoreClass(overallScore)}</div>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: '20px' }}>
              <tbody>
                {[
                  { label: 'Środowisko i BDO', value: company.ridRating.current.env },
                  { label: 'Zarządzanie Jakością (ISO 9001)', value: company.ridRating.current.quality },
                  { label: 'BHP i Bezpieczeństwo', value: company.ridRating.current.bhp },
                  { label: 'Bezpieczeństwo IT', value: company.ridRating.current.infosec },
                ].map((row) => (
                  <tr key={row.label} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px 0', color: 'var(--text-main)' }}>{row.label}</td>
                    <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 700, color: getScoreColor(row.value) }}>{row.value}/100</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p style={{ fontSize: '11px', color: 'var(--text-light)', marginBottom: '20px' }}>
              {company.verificationExpiry ? `Weryfikacja ważna do: ${company.verificationExpiry}.` : 'Firma nie posiada aktywnej weryfikacji RID.'} Dokument wygenerowany automatycznie w systemie RID Connect.
            </p>

            <div className="no-print" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button className="btn" onClick={() => setIsReportOpen(false)} style={{ background: '#f1f5f9', color: '#475569' }}>Zamknij</button>
              <button className="btn" onClick={() => window.print()}><i className="fa-solid fa-print" aria-hidden="true" style={{ marginRight: '8px' }}></i> Drukuj / Zapisz PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
