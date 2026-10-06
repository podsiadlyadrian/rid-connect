import { useState } from 'react';

interface LoginProps {
  onLogin: (email: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email); // Przekazujemy wpisany e-mail do App.tsx
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: 'var(--bg-light)', overflow: 'hidden' }}>
      <div style={{ flex: 1, backgroundColor: 'var(--primary-dark)', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px' }}>
        <div style={{ fontSize: '48px', fontWeight: 700, marginBottom: '24px' }}>
          <i className="fa-solid fa-leaf" style={{ color: 'var(--accent-green)', marginRight: '16px' }}></i>
          RID<span style={{ color: 'var(--accent-green)' }}>Connect</span>
        </div>
        <h2 style={{ fontSize: '32px', marginBottom: '16px', fontWeight: 300 }}>Ekosfera Biznesowa dla Liderów</h2>
        <p style={{ color: '#cbd5e1', fontSize: '14px' }}>Logowanie testowe:<br/><strong>admin@rid.pl</strong> lub <strong>user@rid.pl</strong></p>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
        <div style={{ width: '100%', maxWidth: '400px', padding: '32px' }}>
          <h2 style={{ fontSize: '28px', color: 'var(--primary-dark)', marginBottom: '8px', fontWeight: 600 }}>Witaj ponownie</h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '32px' }}>Zaloguj się do swojego panelu zarządzania.</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Adres e-mail</label>
              <input type="email" required placeholder="np. admin@rid.pl" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Hasło</label>
              <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }} />
            </div>
            <button type="submit" className="btn" style={{ width: '100%', padding: '14px' }}>Zaloguj się</button>
          </form>
        </div>
      </div>
    </div>
  );
}