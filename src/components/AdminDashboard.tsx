export default function AdminDashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="welcome-section" style={{ marginBottom: '0' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#ef4444' }}>Przegląd Systemu (Admin)</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '14px', marginTop: '4px' }}>Witaj w panelu zarządzania platformą RID Connect.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
        <div className="card" style={{ borderTop: '4px solid #3b82f6' }}>
          <h3 style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '8px' }}>Aktywne Firmy (Klienci)</h3>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary-dark)' }}>124</div>
          <div style={{ fontSize: '12px', color: 'var(--accent-green)', marginTop: '8px' }}><i className="fa-solid fa-arrow-trend-up"></i> +12 w tym miesiącu</div>
        </div>
        <div className="card" style={{ borderTop: '4px solid var(--accent-green)' }}>
          <h3 style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '8px' }}>Aktywne Oferty (Giełda)</h3>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary-dark)' }}>45</div>
          <div style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '8px' }}>Oczekuje na moderację: 0</div>
        </div>
        <div className="card" style={{ borderTop: '4px solid #f59e0b' }}>
          <h3 style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: '8px' }}>Propozycje Nowych Kategorii</h3>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary-dark)' }}>3</div>
          <div style={{ fontSize: '12px', color: '#f59e0b', marginTop: '8px', cursor: 'pointer' }}>Przejrzyj zgłoszenia <i className="fa-solid fa-chevron-right"></i></div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Ostatnia Aktywność Użytkowników</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginTop: '16px' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border-color)', color: 'var(--text-light)' }}>
              <th style={{ padding: '12px' }}>Firma</th>
              <th style={{ padding: '12px' }}>Zdarzenie</th>
              <th style={{ padding: '12px' }}>Data</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '12px', fontWeight: 600 }}>Eko-Druk S.A.</td>
              <td style={{ padding: '12px' }}>Dodano nową ofertę na Giełdę (BDO)</td>
              <td style={{ padding: '12px', color: 'var(--text-light)' }}>10 minut temu</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '12px', fontWeight: 600 }}>Bud-Pol Gdynia</td>
              <td style={{ padding: '12px' }}>Zaktualizowano profil publiczny</td>
              <td style={{ padding: '12px', color: 'var(--text-light)' }}>1 godzinę temu</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '12px', fontWeight: 600 }}>Logistyka Pomorze Sp. z o.o.</td>
              <td style={{ padding: '12px' }}>Logowanie do systemu</td>
              <td style={{ padding: '12px', color: 'var(--text-light)' }}>Wczoraj, 14:30</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}