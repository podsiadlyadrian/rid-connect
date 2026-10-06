import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { Company } from '../App';
import { calculateOverallScore, getScoreColor } from '../utils/ratingHelpers';

interface Props {
  companies: Company[];
}

const RatingBar = ({ label, score, prevScore, icon }: { label: string, score: number, prevScore?: number, icon: string }) => {
  const color = getScoreColor(score);
  
  let trendIndicator = <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>-</span>;
  if (prevScore !== undefined) {
    const diff = score - prevScore;
    if (diff > 0) trendIndicator = <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 'bold' }}><i className="fa-solid fa-arrow-up mr-1"></i>{diff}</span>;
    else if (diff < 0) trendIndicator = <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: 'bold' }}><i className="fa-solid fa-arrow-down mr-1"></i>{Math.abs(diff)}</span>;
  }

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', fontWeight: 600 }}>
        <span><i className={`fa-solid ${icon} mr-2`} style={{ color: 'var(--text-light)' }}></i> {label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {trendIndicator}
          <strong style={{ color: color, fontSize: '14px' }}>{score}/100</strong>
        </div>
      </div>
      <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color }}></div>
      </div>
    </div>
  );
};

export default function CompanyShowcase({ companies }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Szukamy firmy w globalnej bazie na podstawie parametru URL
  const company = companies.find(c => c.id === Number(id)) || companies[0];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStage, setModalStage] = useState<'loading' | 'success'>('loading');

  const overallScore = calculateOverallScore(company.ridRating.current);
  const overallColor = getScoreColor(overallScore);

  const expiryDate = new Date(company.verificationExpiry || "2030-01-01");
  const today = new Date(); 
  const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
  const isExpiringSoon = daysLeft > 0 && daysLeft <= 30;
  const isExpired = daysLeft <= 0;

  const handleViewReport = () => {
    setIsModalOpen(true);
    setModalStage('loading');
    setTimeout(() => {
      setModalStage('success');
      const text = `RAPORT WERYFIKACJI SYSTEMÓW RID\n\nFirma: ${company.name}\nZBIORCZY WYNIK: ${overallScore}/100`;
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      window.open(URL.createObjectURL(blob), '_blank');
    }, 1200);
  };

  return (
    <div>
      <button onClick={() => navigate('/directory')} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', marginBottom: '20px', fontSize: '14px' }}><i className="fa-solid fa-arrow-left"></i> Powrót</button>

      <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ height: '140px', background: company.coverColor, position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: '-40px', left: '40px', width: '90px', height: '90px', backgroundColor: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', color: 'var(--primary-dark)', border: '4px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}><i className="fa-solid fa-building"></i></div>
        </div>
        <div style={{ padding: '50px 40px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 style={{ fontSize: '26px', color: 'var(--primary-dark)', fontWeight: 700 }}>{company.name}</h1>
              {isExpired ? (
                <span className="badge" style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }}><i className="fa-solid fa-triangle-exclamation mr-1"></i> Weryfikacja wygasła</span>
              ) : isExpiringSoon ? (
                <span className="badge" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}><i className="fa-solid fa-clock mr-1"></i> Weryfikacja wygasa wkrótce</span>
              ) : (
                company.isVerified && <span className="badge" style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' }}><i className="fa-solid fa-shield-check mr-1"></i> Zweryfikowany Partner RID</span>
              )}
            </div>
            <p style={{ fontSize: '15px', color: 'var(--accent-green)', fontWeight: 500, marginTop: '4px' }}>{company.tagline}</p>
          </div>
        </div>
      </div>

      <div className="grid-layout" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card"><h3 className="card-title">Kluczowe Usługi</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {company.offerings.map(o => <div key={o} style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}><i className="fa-solid fa-circle-check text-emerald-500"></i><span style={{ fontSize: '13px', fontWeight: 600 }}>{o}</span></div>)}
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

            <RatingBar label="Środowisko i BDO" score={company.ridRating.current.env} prevScore={company.ridRating.history?.[0]?.scores.env} icon="fa-leaf" />
            <RatingBar label="Zarządzanie Jakością" score={company.ridRating.current.quality} prevScore={company.ridRating.history?.[0]?.scores.quality} icon="fa-medal" />
            <RatingBar label="BHP i Bezpieczeństwo" score={company.ridRating.current.bhp} prevScore={company.ridRating.history?.[0]?.scores.bhp} icon="fa-hard-hat" />
            <RatingBar label="Bezpieczeństwo IT" score={company.ridRating.current.infosec} prevScore={company.ridRating.history?.[0]?.scores.infosec} icon="fa-shield-halved" />
            
            <button onClick={handleViewReport} className="btn" style={{ width: '100%', marginTop: '12px', background: '#f8fafc', color: 'var(--primary-dark)', border: '1px solid var(--border-color)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              <i className="fa-solid fa-file-invoice mr-2" style={{ color: 'var(--accent-green)' }}></i> Wygeneruj pełny raport
            </button>
          </div>
        </div>
      </div>
      
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div className="card" style={{ width: '100%', maxWidth: '380px', padding: '32px', textAlign: 'center', animation: 'fadeIn 0.2s ease' }}>
            {modalStage === 'loading' ? (
              <>
                <div style={{ fontSize: '40px', color: 'var(--accent-green)', marginBottom: '16px' }}><i className="fa-solid fa-arrows-spin fa-spin"></i></div>
                <h3 style={{ fontSize: '18px', color: 'var(--primary-dark)', fontWeight: 700 }}>Generowanie arkusza...</h3>
              </>
            ) : (
              <>
                <div style={{ fontSize: '46px', color: 'var(--accent-green)', marginBottom: '16px' }}><i className="fa-solid fa-circle-check"></i></div>
                <h3 style={{ fontSize: '18px', color: 'var(--primary-dark)', fontWeight: 700 }}>Raport wygenerowany!</h3>
                <p style={{ color: 'var(--text-light)', fontSize: '13px', marginTop: '6px', marginBottom: '20px' }}>Arkusz audytowy otworzył się w nowej karcie przeglądarki.</p>
                <button className="btn" onClick={() => setIsModalOpen(false)} style={{ width: '100%' }}>Zamknij powiadomienie</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}