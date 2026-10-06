import { useState } from 'react';
import type { Company } from '../App';

interface AdminCompaniesProps {
  companies: Company[];
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
}

export default function AdminCompanies({ companies, setCompanies }: AdminCompaniesProps) {
  // Pracujemy bezpośrednio na globalnej bazie firm (props), dzięki czemu
  // zapisane audyty są natychmiast widoczne w Katalogu i na profilach.

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [tempRating, setTempRating] = useState({ env: 0, quality: 0, bhp: 0, infosec: 0 });
  const [tempExpiry, setTempExpiry] = useState("");

  const openEditModal = (company: Company) => {
    setEditingCompany(company);
    setTempRating(company.ridRating.current);
    
    // Domyślnie proponujemy datę ważności za rok od dzisiaj, jeśli brak
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    setTempExpiry(company.verificationExpiry || nextYear.toISOString().split('T')[0]);
    
    setIsModalOpen(true);
  };

  const handleSaveRating = (e: React.FormEvent) => {
    e.preventDefault();
    
    setCompanies(companies.map(c => {
      if (c.id === editingCompany.id) {
        // Archiwizujemy obecną ocenę do historii przed nadpisaniem (jeśli to nowa ocena)
        const newHistory = [...c.ridRating.history];
        if (c.isVerified) {
          newHistory.unshift({
            date: new Date().toISOString().split('T')[0],
            scores: { ...c.ridRating.current }
          });
        }
        
        return { 
          ...c, 
          isVerified: true, 
          verificationExpiry: tempExpiry,
          ridRating: {
            current: tempRating,
            history: newHistory
          }
        };
      }
      return c;
    }));
    setIsModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="welcome-section" style={{ marginBottom: '0' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#ef4444' }}>Zarządzanie Weryfikacją RID</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '14px', marginTop: '4px' }}>Aktualizuj wyniki audytów, nadzoruj trendy i wyznaczaj daty ważności certyfikacji.</p>
      </div>

      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border-color)', color: 'var(--text-light)' }}>
              <th style={{ padding: '12px' }}>Firma</th>
              <th style={{ padding: '12px' }}>Branża</th>
              <th style={{ padding: '12px' }}>Status / Ważność</th>
              <th style={{ padding: '12px' }}>Śr. Ocena</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {companies.map(company => {
              const overall = company.isVerified ? Math.round((company.ridRating.current.env + company.ridRating.current.quality + company.ridRating.current.bhp + company.ridRating.current.infosec) / 4) : 0;
              return (
                <tr key={company.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px', fontWeight: 600, color: 'var(--primary-dark)' }}>{company.name}</td>
                  <td style={{ padding: '12px' }}>{company.industry}</td>
                  <td style={{ padding: '12px' }}>
                    {company.isVerified 
                      ? <div>
                          <span className="badge" style={{ background: '#dcfce7', color: '#166534', marginBottom: '4px', display: 'inline-block' }}><i className="fa-solid fa-shield-check"></i> Zweryfikowano</span> 
                          <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>Do: {company.verificationExpiry}</div>
                        </div>
                      : <span className="badge" style={{ background: '#f1f5f9', color: 'var(--text-light)' }}>Brak weryfikacji</span>}
                  </td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: overall >= 80 ? 'var(--accent-green)' : (overall >= 50 ? '#f59e0b' : '#ef4444') }}>
                    {company.isVerified ? `${overall} / 100` : '-'}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <button onClick={() => openEditModal(company)} className="btn" style={{ fontSize: '12px', padding: '6px 12px' }}>Audyt & Historia</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: '700px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', animation: 'fadeIn 0.2s ease' }}>
            
            {/* LEWA STRONA: Formularz nowej oceny */}
            <div>
              <h3 className="card-title" style={{ marginBottom: '8px' }}>Nowy Audyt / Rating</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '16px' }}>Firma: <strong>{editingCompany?.name}</strong>.</p>
              
              <form onSubmit={handleSaveRating} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}><i className="fa-solid fa-leaf mr-2 text-emerald-500"></i> Środowisko i BDO (0-100)</label>
                  <input type="number" min="0" max="100" value={tempRating.env} onChange={(e) => setTempRating({...tempRating, env: Number(e.target.value)})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}><i className="fa-solid fa-medal mr-2 text-blue-500"></i> Zarządzanie Jakością (0-100)</label>
                  <input type="number" min="0" max="100" value={tempRating.quality} onChange={(e) => setTempRating({...tempRating, quality: Number(e.target.value)})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}><i className="fa-solid fa-hard-hat mr-2 text-amber-500"></i> BHP i Bezpieczeństwo (0-100)</label>
                  <input type="number" min="0" max="100" value={tempRating.bhp} onChange={(e) => setTempRating({...tempRating, bhp: Number(e.target.value)})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}><i className="fa-solid fa-shield-halved mr-2 text-indigo-500"></i> Bezpieczeństwo IT (0-100)</label>
                  <input type="number" min="0" max="100" value={tempRating.infosec} onChange={(e) => setTempRating({...tempRating, infosec: Number(e.target.value)})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
                </div>
                
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '8px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}><i className="fa-regular fa-calendar mr-2"></i> Data ważności weryfikacji</label>
                  <input type="date" required value={tempExpiry} onChange={(e) => setTempExpiry(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn" style={{ background: '#f1f5f9', color: '#475569', flex: 1 }}>Anuluj</button>
                  <button type="submit" className="btn" style={{ background: '#ef4444', flex: 1 }}>Zapisz oceny</button>
                </div>
              </form>
            </div>

            {/* PRAWA STRONA: Historia ocen */}
            <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '24px' }}>
              <h3 className="card-title" style={{ marginBottom: '16px' }}><i className="fa-solid fa-clock-rotate-left mr-2"></i> Historia Audytów</h3>
              {editingCompany?.ridRating.history.length === 0 ? (
                <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>Brak wcześniejszych audytów dla tej firmy.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
                  {editingCompany?.ridRating.history.map((hist: any, idx: number) => {
                    const histAvg = Math.round((hist.scores.env + hist.scores.quality + hist.scores.bhp + hist.scores.infosec) / 4);
                    return (
                      <div key={idx} style={{ padding: '12px', background: 'var(--bg-light)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 600, fontSize: '13px' }}>
                          <span>Data: {hist.date}</span>
                          <span style={{ color: 'var(--primary-dark)' }}>Średnia: {histAvg}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '11px', color: 'var(--text-light)' }}>
                          <div>Środowisko: {hist.scores.env}</div>
                          <div>Jakość: {hist.scores.quality}</div>
                          <div>BHP: {hist.scores.bhp}</div>
                          <div>InfoSec: {hist.scores.infosec}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}