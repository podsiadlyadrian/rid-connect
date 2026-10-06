import { useNavigate } from 'react-router-dom';
import { useData } from '../data/DataProvider';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { companies, announcements, categoryProposals } = useData();

  const approvedAds = announcements.filter((a) => a.status === 'approved').length;
  const pendingAds = announcements.filter((a) => a.status === 'pending').length;
  const pendingProposals = categoryProposals.filter((p) => p.status === 'pending').length;

  const recent = [...announcements].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="welcome-section" style={{ marginBottom: '0' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#ef4444' }}>Przegląd Systemu (Admin)</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '14px', marginTop: '4px' }}>Witaj w panelu zarządzania platformą RID Connect.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
        <div className="card" style={{ borderTop: '4px solid #3b82f6' }}>
          <h3 style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '8px' }}>Firmy w systemie</h3>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary-dark)' }}>{companies.length}</div>
          <div style={{ fontSize: '12px', color: 'var(--accent-green)', marginTop: '8px' }}>
            <i className="fa-solid fa-circle-check" aria-hidden="true"></i> {companies.filter((c) => c.isVerified).length} zweryfikowanych
          </div>
        </div>
        <div className="card" style={{ borderTop: '4px solid var(--accent-green)' }}>
          <h3 style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '8px' }}>Aktywne Oferty (Giełda)</h3>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary-dark)' }}>{approvedAds}</div>
          <div style={{ fontSize: '12px', color: pendingAds > 0 ? '#f59e0b' : 'var(--text-light)', marginTop: '8px', cursor: pendingAds > 0 ? 'pointer' : 'default' }} onClick={() => pendingAds > 0 && navigate('/admin/ads')}>
            Oczekuje na moderację: {pendingAds}{pendingAds > 0 && <i className="fa-solid fa-chevron-right" aria-hidden="true" style={{ marginLeft: '4px' }}></i>}
          </div>
        </div>
        <div className="card" style={{ borderTop: '4px solid #f59e0b' }}>
          <h3 style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '8px' }}>Propozycje Nowych Kategorii</h3>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary-dark)' }}>{pendingProposals}</div>
          <div style={{ fontSize: '12px', color: '#f59e0b', marginTop: '8px', cursor: 'pointer' }} onClick={() => navigate('/admin/ads')}>
            Przejrzyj zgłoszenia <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
          </div>
        </div>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <h3 className="card-title">Ostatnia aktywność na Giełdzie</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginTop: '16px', minWidth: '560px' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border-color)', color: 'var(--text-light)' }}>
              <th style={{ padding: '12px' }}>Firma</th>
              <th style={{ padding: '12px' }}>Ogłoszenie</th>
              <th style={{ padding: '12px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((ad) => (
              <tr key={ad.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px', fontWeight: 600 }}>{ad.companyName}</td>
                <td style={{ padding: '12px' }}>{ad.title}</td>
                <td style={{ padding: '12px' }}>
                  {ad.status === 'approved' && <span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>Zatwierdzone</span>}
                  {ad.status === 'pending' && <span className="badge" style={{ background: '#fef3c7', color: '#92400e' }}>Oczekuje</span>}
                  {ad.status === 'rejected' && <span className="badge" style={{ background: '#fee2e2', color: '#991b1b' }}>Odrzucone</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
