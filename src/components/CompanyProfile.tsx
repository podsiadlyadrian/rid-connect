import { useState } from 'react';
import type { Announcement, Company } from '../App';

interface CompanyProfileProps {
  company: Company;
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
  announcements: Announcement[];
}

export default function CompanyProfile({ company, setCompanies, announcements }: CompanyProfileProps) {
  const myAds = announcements.filter(ad => ad.companyName === company.name);

  const [isEditing, setIsEditing] = useState(false);
  const [editTagline, setEditTagline] = useState(company.tagline);
  const [editDesc, setEditDesc] = useState(company.desc);
  const [editEmployees, setEditEmployees] = useState(company.stats.employees);
  const [editYears, setEditYears] = useState(company.stats.years);
  const [newOffering, setNewOffering] = useState('');
  const [editOfferings, setEditOfferings] = useState<string[]>(company.offerings);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Zapisujemy zmiany globalnie
    setCompanies(prev => prev.map(c => {
      if (c.id === company.id) {
        return {
          ...c, tagline: editTagline, desc: editDesc, offerings: editOfferings,
          stats: { ...c.stats, employees: editEmployees, years: editYears }
        };
      }
      return c;
    }));
    
    setIsEditing(false);
    alert('Twoja wizytówka została zaktualizowana w głównym katalogu RID!');
  };

  return (
    <div>
      <div className="welcome-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1>Zarządzanie Organizacją</h1><p>Zarządzaj profilem B2B firmy {company.name}.</p></div>
        <button className="btn" onClick={() => setIsEditing(!isEditing)}>
          <i className="fa-solid fa-user-gear mr-2"></i> {isEditing ? 'Anuluj edycję' : 'Edytuj wizytówkę B2B'}
        </button>
      </div>

      {isEditing && (
        <div className="card" style={{ border: '2px solid var(--accent-green)', marginBottom: '24px' }}>
          <h3 className="card-title" style={{ color: 'var(--accent-green)' }}>Edytor wizytówki</h3>
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Slogan biznesowy</label>
                <input type="text" value={editTagline} onChange={(e) => setEditTagline(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Lat na rynku</label>
                <input type="text" value={editYears} onChange={(e) => setEditYears(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Pracowników</label>
                <input type="text" value={editEmployees} onChange={(e) => setEditEmployees(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Opis dla partnerów</label>
              <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', resize: 'vertical' }}></textarea>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Produkty / Usługi</label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input type="text" placeholder="Dodaj produkt..." value={newOffering} onChange={(e) => setNewOffering(e.target.value)} style={{ flexGrow: 1, padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
                <button type="button" onClick={() => { if (newOffering.trim()) { setEditOfferings([...editOfferings, newOffering.trim()]); setNewOffering(''); } }} className="btn">+</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {editOfferings.map((o, idx) => (
                  <span key={idx} className="badge" style={{ padding: '6px 12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {o} <i className="fa-solid fa-xmark" onClick={() => setEditOfferings(editOfferings.filter((_, i) => i !== idx))} style={{ color: 'red', cursor: 'pointer' }}></i>
                  </span>
                ))}
              </div>
            </div>
            <button type="submit" className="btn" style={{ alignSelf: 'flex-start' }}>Zapisz globalnie</button>
          </form>
        </div>
      )}

      {/* Podgląd - reszta pozostaje bez zmian */}
      <div className="grid-layout" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <h3 className="card-title">Dane Wizytówki</h3>
            <p style={{ fontSize: '18px', color: 'var(--accent-green)', fontWeight: 600 }}>{company.tagline}</p>
            <p style={{ marginTop: '10px', lineHeight: '1.6' }}>{company.desc}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
              {company.offerings.map(o => (
                <span key={o} className="badge" style={{ background: 'var(--bg-light)', border: '1px solid var(--border-color)' }}>{o}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}