import { useData } from '../data/DataProvider';
import type { MessageStatus } from '../types';

function StatusBadge({ status }: { status: MessageStatus }) {
  if (status === 'accepted') return <span className="badge" style={{ background: '#dcfce7', color: '#166534' }}>Zaakceptowano</span>;
  if (status === 'rejected') return <span className="badge" style={{ background: '#fee2e2', color: '#991b1b' }}>Odrzucono</span>;
  return <span className="badge tag-collab">Oczekuje</span>;
}

export default function Messages() {
  const { messages, currentCompany, respondToMessage } = useData();

  const received = messages.filter((m) => m.toCompany === currentCompany.name);
  const sent = messages.filter((m) => m.fromCompany === currentCompany.name);

  return (
    <div>
      <div className="welcome-section">
        <h1>Wiadomości i Networking</h1>
        <p>Nawiązuj relacje biznesowe bez ujawniania prywatnych danych kontaktowych przed akceptacją.</p>
      </div>

      {/* ODEBRANE */}
      <h3 className="card-title"><i className="fa-solid fa-inbox" aria-hidden="true" style={{ marginRight: '8px' }}></i> Skrzynka odbiorcza ({received.length})</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '820px', marginTop: '12px', marginBottom: '32px' }}>
        {received.length === 0 ? (
          <div className="card" style={{ fontSize: '13px', color: 'var(--text-light)' }}>Brak odebranych zapytań.</div>
        ) : (
          received.map((m) => (
            <div key={m.id} className="card" style={{ borderLeft: `4px solid ${m.status === 'pending' ? 'var(--accent-green)' : 'var(--border-color)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', gap: '12px', flexWrap: 'wrap' }}>
                <h4 style={{ fontSize: '15px', color: 'var(--primary-dark)' }}>{m.subject}</h4>
                <StatusBadge status={m.status} />
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-light)', marginBottom: '8px' }}>Od: <strong>{m.fromCompany}</strong> • {m.date}</p>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-main)' }}>{m.body}</p>

              {m.status === 'pending' && (
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button className="btn" onClick={() => respondToMessage(m.id, 'accepted')}>Akceptuj i ujawnij wizytówkę</button>
                  <button className="btn" onClick={() => respondToMessage(m.id, 'rejected')} style={{ background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>Odrzuć</button>
                </div>
              )}

              {m.status === 'accepted' && (
                <div style={{ marginTop: '12px', padding: '12px', background: '#ecfdf5', borderRadius: '8px', border: '1px solid var(--accent-green)', fontSize: '14px' }}>
                  <i className="fa-solid fa-envelope" aria-hidden="true" style={{ color: '#059669', marginRight: '8px' }}></i>{m.contact.email}
                  <span style={{ margin: '0 8px', color: 'var(--border-color)' }}>|</span>
                  <i className="fa-solid fa-phone" aria-hidden="true" style={{ color: '#059669', marginRight: '8px' }}></i>{m.contact.phone}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* WYSŁANE */}
      <h3 className="card-title"><i className="fa-solid fa-paper-plane" aria-hidden="true" style={{ marginRight: '8px' }}></i> Wysłane ({sent.length})</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '820px', marginTop: '12px' }}>
        {sent.length === 0 ? (
          <div className="card" style={{ fontSize: '13px', color: 'var(--text-light)' }}>Nie wysłałeś jeszcze żadnych zapytań. Wejdź w profil firmy w Katalogu i kliknij „Wyślij zapytanie".</div>
        ) : (
          sent.map((m) => (
            <div key={m.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div>
                <h4 style={{ fontSize: '14px', color: 'var(--primary-dark)' }}>{m.subject}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-light)' }}>Do: {m.toCompany} • {m.date}</p>
              </div>
              <StatusBadge status={m.status} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
