import { useData } from '../data/DataProvider';

export default function AdminAds() {
  const { announcements, categoryProposals, moderateAnnouncement, moderateCategoryProposal } = useData();

  const pendingAds = announcements.filter((a) => a.status === 'pending');
  const pendingProposals = categoryProposals.filter((p) => p.status === 'pending');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="welcome-section" style={{ marginBottom: '0' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#ef4444' }}>Moderacja Giełdy Ofert</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '14px', marginTop: '4px' }}>Zatwierdzaj ogłoszenia i rozpatruj propozycje nowych kategorii.</p>
      </div>

      {/* OGŁOSZENIA DO MODERACJI */}
      <div className="card">
        <h3 className="card-title"><i className="fa-solid fa-bullhorn" aria-hidden="true" style={{ marginRight: '8px' }}></i> Ogłoszenia oczekujące ({pendingAds.length})</h3>
        {pendingAds.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>Brak ogłoszeń oczekujących na moderację.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
            {pendingAds.map((ad) => (
              <div key={ad.id} style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <span className={`badge ${ad.badgeClass}`} style={{ fontSize: '10px' }}>{ad.categoryName}</span>
                  <h4 style={{ fontSize: '15px', color: 'var(--primary-dark)', margin: '8px 0 4px' }}>{ad.title}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-light)', lineHeight: '1.5' }}>{ad.content}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '6px' }}>Wystawił: <strong>{ad.companyName}</strong></p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button className="btn" onClick={() => moderateAnnouncement(ad.id, 'approved')}>Zatwierdź</button>
                  <button className="btn" onClick={() => moderateAnnouncement(ad.id, 'rejected')} style={{ background: 'transparent', color: '#ef4444', border: '1px solid #fecaca' }}>Odrzuć</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PROPOZYCJE KATEGORII */}
      <div className="card">
        <h3 className="card-title"><i className="fa-solid fa-tags" aria-hidden="true" style={{ marginRight: '8px' }}></i> Propozycje nowych kategorii ({pendingProposals.length})</h3>
        {pendingProposals.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>Brak propozycji do rozpatrzenia.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
            {pendingProposals.map((p) => (
              <div key={p.id} style={{ padding: '12px 16px', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <h4 style={{ fontSize: '14px', color: 'var(--primary-dark)' }}>{p.name}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>Zgłosił: {p.proposedBy} • {p.date}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn" onClick={() => moderateCategoryProposal(p.id, 'approved')}>Zatwierdź</button>
                  <button className="btn" onClick={() => moderateCategoryProposal(p.id, 'rejected')} style={{ background: 'transparent', color: '#ef4444', border: '1px solid #fecaca' }}>Odrzuć</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
