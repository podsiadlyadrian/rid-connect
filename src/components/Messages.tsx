export default function Messages() {
  return (
    <div>
      <div className="welcome-section">
        <h1>Wiadomości i Networking</h1>
        <p>Nawiązuj relacje biznesowe bez ujawniania prywatnych adresów e-mail przed akceptacją.</p>
      </div>
      <div className="card" style={{ maxWidth: '800px' }}>
        <h3 className="card-title">Skrzynka Odbiorcza</h3>
        <div className="ad-item" style={{ backgroundColor: 'var(--bg-light)', padding: '16px', borderRadius: '8px', border: '1px solid var(--accent-green)' }}>
          <div className="ad-icon" style={{ backgroundColor: 'white', color: 'var(--accent-green)' }}><i className="fa-solid fa-envelope"></i></div>
          <div className="ad-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h4>Eko-Druk S.A. wysyła zapytanie</h4>
              <span className="badge tag-collab">Nowe</span>
            </div>
            <p>Firma Eko-Druk S.A. jest zainteresowana Twoją ofertą transportową. Czy chcesz udostępnić swoje dane kontaktowe?</p>
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
              <button className="btn">Akceptuj i wyślij wizytówkę</button>
              <button className="btn" style={{ background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>Odrzuć</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}