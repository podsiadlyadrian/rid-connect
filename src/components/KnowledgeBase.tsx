import { useState } from 'react';
import type { KnowledgeEntry, User } from '../types';
import { useData } from '../data/DataProvider';

export default function KnowledgeBase({ user }: { user: User }) {
  const { knowledgeEntries: entries, addKnowledgeEntry } = useData();

  const [favCategories, setFavCategories] = useState<string[]>(['Środowisko']);
  const [readEntries, setReadEntries] = useState<string[]>([]);
  const [likedEntries, setLikedEntries] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState('Wszystkie');
  const [selectedEntry, setSelectedEntry] = useState<KnowledgeEntry | null>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCat, setNewCat] = useState('Środowisko');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');

  const toggleCategoryFav = (cat: string): void =>
    setFavCategories((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));

  const toggleLikeEntry = (id: string): void =>
    setLikedEntries((prev) => (prev.includes(id) ? prev.filter((eId) => eId !== id) : [...prev, id]));

  const handleOpenEntry = (entry: KnowledgeEntry): void => {
    setSelectedEntry(entry);
    if (!readEntries.includes(entry.id)) setReadEntries([...readEntries, entry.id]);
  };

  const handleAddEntry = (e: React.FormEvent): void => {
    e.preventDefault();
    addKnowledgeEntry({ category: newCat, title: newTitle, summary: newSummary, content: newContent });
    setIsAdding(false);
    setNewTitle(''); setNewSummary(''); setNewContent('');
  };

  const categories = ['Środowisko', 'ISO', 'BHP'];
  const filteredEntries = entries.filter((e) => activeFilter === 'Wszystkie' || e.category === activeFilter);
  const forYouEntries = entries.filter((e) => favCategories.includes(e.category));

  return (
    <div>
      {selectedEntry ? (
        <div className="card" style={{ animation: 'fadeIn 0.2s ease', maxWidth: '900px' }}>
          <button onClick={() => setSelectedEntry(null)} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', marginBottom: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-arrow-left" aria-hidden="true"></i> Powrót do bazy wiedzy
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <span className="badge tag-env" style={{ background: 'var(--primary-dark)', color: 'white' }}>{selectedEntry.category}</span>
              <h1 style={{ fontSize: '26px', color: 'var(--primary-dark)', marginTop: '12px', fontWeight: 700, lineHeight: '1.3' }}>{selectedEntry.title}</h1>
              <div style={{ display: 'flex', gap: '16px', color: 'var(--text-light)', fontSize: '13px', marginTop: '12px', flexWrap: 'wrap' }}>
                <span><i className="fa-regular fa-calendar" aria-hidden="true" style={{ marginRight: '4px' }}></i> Data: {selectedEntry.date}</span>
                <span><i className="fa-regular fa-clock" aria-hidden="true" style={{ marginRight: '4px' }}></i> Czas czytania: {selectedEntry.readTime}</span>
                <span><i className="fa-regular fa-user" aria-hidden="true" style={{ marginRight: '4px' }}></i> Autor: <strong>{selectedEntry.author}</strong></span>
              </div>
            </div>
          </div>

          <div style={{ lineHeight: '1.8', color: 'var(--text-main)', fontSize: '15px', padding: '24px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', marginBottom: '24px', textAlign: 'justify' }}>
            <p style={{ fontWeight: 500, marginBottom: '16px', color: 'var(--primary-dark)' }}>{selectedEntry.summary}</p>
            <p>{selectedEntry.content}</p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={() => toggleLikeEntry(selectedEntry.id)} className="btn" style={{ background: likedEntries.includes(selectedEntry.id) ? '#ef4444' : '#f1f5f9', color: likedEntries.includes(selectedEntry.id) ? 'white' : 'var(--text-main)' }}>
              <i className="fa-solid fa-thumbs-up" aria-hidden="true" style={{ marginRight: '8px' }}></i>
              {likedEntries.includes(selectedEntry.id) ? 'Wpis polubiony!' : 'Polub ten wpis'}
            </button>
            <button onClick={() => alert(`Artykuł "${selectedEntry.title}" został wysłany na Twój adres e-mail: ${user.email}`)} className="btn" style={{ background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
              <i className="fa-solid fa-paper-plane" aria-hidden="true" style={{ marginRight: '8px' }}></i> Prześlij na mój e-mail
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="welcome-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1>Baza Wiedzy RID</h1>
              <p>Oficjalne opracowania i aktualności prawne dla najwyższego kierownictwa firm.</p>
            </div>
            {user.role === 'admin' && (
              <button className="btn" onClick={() => setIsAdding(!isAdding)} style={{ background: 'var(--primary-dark)' }}>
                {isAdding ? 'Anuluj' : '+ Dodaj nowy wpis RID'}
              </button>
            )}
          </div>

          {isAdding && user.role === 'admin' && (
            <div className="card" style={{ border: '2px solid var(--accent-green)', marginBottom: '24px', animation: 'fadeIn 0.2s ease' }}>
              <h3 className="card-title"><i className="fa-solid fa-pen-nib" aria-hidden="true"></i> Publikacja nowego opracowania prawnego</h3>
              <form onSubmit={handleAddEntry} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Tytuł opracowania</label>
                    <input type="text" placeholder="np. Nowelizacja Kodeksu Pracy w Pomorskiem" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Kategoria normatywna</label>
                    <select value={newCat} onChange={(e) => setNewCat(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'white' }}>
                      {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Krótkie podsumowanie / Zajawka</label>
                  <input type="text" placeholder="Wpisz jednozdaniowe, kluczowe podsumowanie zmian biznesowych..." value={newSummary} onChange={(e) => setNewSummary(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Pełna treść artykułu i wytyczne merytoryczne</label>
                  <textarea placeholder="Wpisz pełne analizy prawne, obowiązki przedsiębiorcy i rekomendacje..." value={newContent} onChange={(e) => setNewContent(e.target.value)} required rows={5} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', resize: 'vertical' }}></textarea>
                </div>
                <button type="submit" className="btn" style={{ alignSelf: 'flex-start', padding: '10px 24px' }}>Opublikuj oficjalny wpis</button>
              </form>
            </div>
          )}

          <div className="card" style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '13px', marginBottom: '12px', color: 'var(--text-light)' }}>Twoje kategorie (kliknij gwiazdkę, aby spersonalizować sekcję „Rekomendowane"):</h4>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={() => setActiveFilter('Wszystkie')} className="btn" style={{ background: activeFilter === 'Wszystkie' ? 'var(--primary-dark)' : '#f1f5f9', color: activeFilter === 'Wszystkie' ? 'white' : 'var(--text-main)' }}>Wszystkie</button>
              {categories.map((cat) => (
                <div key={cat} style={{ display: 'flex', gap: '2px' }}>
                  <button onClick={() => setActiveFilter(cat)} className="btn" style={{ background: activeFilter === cat ? 'var(--primary-dark)' : '#f1f5f9', color: activeFilter === cat ? 'white' : 'var(--text-main)', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>{cat}</button>
                  <button onClick={() => toggleCategoryFav(cat)} className="btn" aria-label={`Obserwuj kategorię ${cat}`} style={{ background: favCategories.includes(cat) ? 'var(--accent-green)' : '#cbd5e1', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
                    <i className={favCategories.includes(cat) ? 'fa-solid fa-star' : 'fa-regular fa-star'} aria-hidden="true" style={{ color: 'white' }}></i>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {favCategories.length > 0 && activeFilter === 'Wszystkie' && forYouEntries.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h3 className="card-title" style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i> Rekomendowane (Twoje interesy)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', marginTop: '16px' }}>
                {forYouEntries.map((entry) => (
                  <div key={entry.id} onClick={() => handleOpenEntry(entry)}>
                    <EntryCard entry={entry} isRead={readEntries.includes(entry.id)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <h3 className="card-title"><i className="fa-solid fa-list" aria-hidden="true"></i> {activeFilter === 'Wszystkie' ? 'Wszystkie opracowania merytoryczne' : `Kategoria: ${activeFilter}`}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', marginTop: '16px' }}>
            {filteredEntries.map((entry) => (
              <div key={entry.id} onClick={() => handleOpenEntry(entry)}>
                <EntryCard entry={entry} isRead={readEntries.includes(entry.id)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EntryCard({ entry, isRead }: { entry: KnowledgeEntry; isRead: boolean }) {
  return (
    <div className="card" style={{ borderLeft: isRead ? '4px solid #cbd5e1' : '4px solid var(--accent-green)', position: 'relative', cursor: 'pointer', transition: '0.2s', opacity: isRead ? 0.8 : 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {!isRead && <span style={{ position: 'absolute', top: '15px', right: '15px', width: '10px', height: '10px', background: 'var(--accent-green)', borderRadius: '50%' }}></span>}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
        <span className="badge tag-env" style={{ background: '#f1f5f9', color: 'var(--text-light)', fontSize: '10px' }}>{entry.category}</span>
        <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>{entry.date}</span>
      </div>
      <h4 style={{ fontSize: '15px', marginBottom: '8px', fontWeight: 600, color: isRead ? 'var(--text-light)' : 'var(--primary-dark)', flexGrow: 0 }}>{entry.title}</h4>
      <p style={{ fontSize: '13px', color: 'var(--text-light)', lineHeight: '1.4', flexGrow: 1 }}>{entry.summary}</p>
      <div style={{ marginTop: '16px', fontSize: '12px', fontWeight: 600, color: isRead ? '#94a3b8' : 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
        {isRead ? 'Przeczytane' : 'Czytaj pełne opracowanie'} <i className="fa-solid fa-chevron-right" aria-hidden="true" style={{ fontSize: '10px' }}></i>
      </div>
    </div>
  );
}
