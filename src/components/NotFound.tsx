import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 24px' }}>
      <div style={{ fontSize: '64px', fontWeight: 800, color: 'var(--accent-green)' }}>404</div>
      <h1 style={{ fontSize: '22px', color: 'var(--primary-dark)', marginTop: '8px', fontWeight: 700 }}>Nie znaleziono strony</h1>
      <p style={{ color: 'var(--text-light)', fontSize: '14px', marginTop: '8px', maxWidth: '420px' }}>
        Podany adres nie istnieje lub został przeniesiony. Wróć do panelu głównego.
      </p>
      <button className="btn" style={{ marginTop: '20px' }} onClick={() => navigate('/')}>
        <i className="fa-solid fa-house" aria-hidden="true" style={{ marginRight: '8px' }}></i> Wróć do pulpitu
      </button>
    </div>
  );
}
