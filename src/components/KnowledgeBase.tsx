import { useState } from 'react';
import type { User } from '../App';

interface KnowledgeEntry {
  id: number;
  category: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  author: string;
  readTime: string;
}

export default function KnowledgeBase({ user }: { user: User }) {
  // Rozszerzona baza wpisów o autora, czas czytania, zajawkę i pełną treść
  const [entries, setEntries] = useState<KnowledgeEntry[]>(
    [
      { 
        id: 1, 
        category: 'Środowisko', 
        title: 'Zmiany w raportowaniu BDO na rok 2027', 
        summary: 'Zmieniają się przepisy dotyczące ewidencji odpadów opakowaniowych. Zobacz, co musisz przygotować.',
        content: 'W związku z nowelizacją ustawy o gospodarce opakowaniami i odpadami opakowaniowymi, od 1 stycznia przedsiębiorcy z województwa pomorskiego będą musieli dostosować swoje systemy ERP do nowych kodów odpadowych. Główne zmiany dotyczą rozszerzonej odpowiedzialności producentów (ROP) oraz nowych stawek opłat produktowych. Rekomendujemy przeprowadzenie audytu wewnętrznego strumienia odpadów do końca trzeciego kwartału bieżącego roku, aby uniknąć kar administracyjnych, które mogą wynosić od 10 000 zł do nawet 1 000 000 zł.', 
        date: '2026-06-28',
        author: 'mgr inż. Aleksandra Sareło (Ekspert ds. Ochrony Środowiska RID)',
        readTime: '5 min'
      },
      { 
        id: 2, 
        category: 'ISO', 
        title: 'Audyt wewnętrzny - najczęstsze błędy zarządu', 
        summary: 'Podsumowanie doświadczeń naszych audytorów z ostatnich 50 certyfikacji ISO 9001.',
        content: 'Analiza ostatnich audytów certyfikujących na Pomorzu wykazała, że najczęstszym błędem najwyższego kierownictwa jest brak formalnego powiązania celów jakościowych ze strategią biznesową firmy (wymóg rozdziału 5.1 normy ISO 9001:2015). Ponadto, często kuleje proces zarządzania ryzykiem i szansami, gdzie rejestry ryzyk są martwymi dokumentami tworzonymi wyłącznie "pod audytora". Prawidłowo prowadzony przegląd zarządzania powinien być kluczowym narzędziem podejmowania decyzji przez prezesów i właścicieli spółek.', 
        date: '2026-06-25',
        author: 'Robert Nowak (Główny Audytor Systemów Zarządzania RID)',
        readTime: '4 min'
      },
      { 
        id: 3, 
        category: 'BHP', 
        title: 'Bezpieczeństwo pracy przy obsłudze urządzeń HDS', 
        summary: 'Nowe instrukcje stanowiskowe i wytyczne dla operatorów dźwigów przeładunkowych.',
        content: 'W odpowiedzi na rosnącą liczbę incydentów w pomorskich centrach logistycznych, Państwowa Inspekcja Pracy zapowiedziała wzmożone kontrole w zakresie uprawnień UDT operatorów HDS oraz stanu technicznego zawiesi. Przypominamy, że każdy pracodawca ma obowiązek udostępnienia aktualnych, dostosowanych do specyfiki zakładu instrukcji BHP. W sekcji dokumentów RID przygotowaliśmy dla Państwa gotowy szablon oceny ryzyka zawodowego dla tego stanowiska do pobrania za darmo w pakiecie Premium.', 
        date: '2026-06-15',
        author: 'inż. Janusz Kasperski (Starszy Inspektor BHP RID)',
        readTime: '6 min'
      },
    ]
  );

  const [favCategories, setFavCategories] = useState<string[]>(['Środowisko']);
  const [readEntries, setReadEntries] = useState<number[]>([]);
  const [likedEntries, setLikedEntries] = useState<number[]>([]); // Stan dla polubionych wpisów
  const [activeFilter, setActiveFilter] = useState('Wszystkie');
  
  // Stan przechowujący aktualnie przeglądany wpis szczegółowy (null = lista)
  const [selectedEntry, setSelectedEntry] = useState<KnowledgeEntry | null>(null);

  // Stany formularza dodawania wpisu przez Admina
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCat, setNewCat] = useState('Środowisko');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');

  const toggleCategoryFav = (cat: string) => {
    setFavCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const toggleLikeEntry = (id: number) => {
    setLikedEntries(prev => prev.includes(id) ? prev.filter(eId => eId !== id) : [...prev, id]);
  };

  const handleOpenEntry = (entry: KnowledgeEntry) => {
    setSelectedEntry(entry);
    if (!readEntries.includes(entry.id)) {
      setReadEntries([...readEntries, entry.id]);
    }
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: KnowledgeEntry = { 
      id: Date.now(), 
      category: newCat, 
      title: newTitle, 
      summary: newSummary,
      content: newContent, 
      date: new Date().toISOString().split('T')[0],
      author: 'Administrator RID (Wpis Oficjalny)',
      readTime: '3 min'
    };
    setEntries([entry, ...entries]);
    setIsAdding(false);
    setNewTitle(''); setNewSummary(''); setNewContent('');
  };

  const categories = ['Środowisko', 'ISO', 'BHP'];
  const filteredEntries = entries.filter(e => activeFilter === 'Wszystkie' || e.category === activeFilter);
  const forYouEntries = entries.filter(e => favCategories.includes(e.category));

  return (
    <div>
      {/* -------------------- WIDOK SZCZEGÓŁOWY WPISU -------------------- */}
      {selectedEntry ? (
        <div className="card" style={{ animation: 'fadeIn 0.2s ease', maxWidth: '900px' }}>
          <button 
            onClick={() => setSelectedEntry(null)} 
            style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', marginBottom: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <i className="fa-solid fa-arrow-left"></i> Powrót do bazy wiedzy
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <span className="badge tag-env" style={{ background: 'var(--primary-dark)', color: 'white' }}>{selectedEntry.category}</span>
              <h1 style={{ fontSize: '26px', color: 'var(--primary-dark)', marginTop: '12px', fontWeight: 700, lineHeight: '1.3' }}>{selectedEntry.title}</h1>
              
              <div style={{ display: 'flex', gap: '16px', color: 'var(--text-light)', fontSize: '13px', marginTop: '12px', flexWrap: 'wrap' }}>
                <span><i className="fa-regular fa-calendar mr-1"></i> Data: {selectedEntry.date}</span>
                <span><i className="fa-regular fa-clock mr-1"></i> Czas czytania: {selectedEntry.readTime}</span>
                <span><i className="fa-regular fa-user mr-1"></i> Autor: <strong>{selectedEntry.author}</strong></span>
              </div>
            </div>
          </div>

          <div style={{ lineHeight: '1.8', color: 'var(--text-main)', fontSize: '15px', padding: '24px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', marginBottom: '24px', textAlign: 'justify' }}>
            <p style={{ fontWeight: 500, marginBottom: '16px', color: 'var(--primary-dark)' }}>{selectedEntry.summary}</p>
            <p>{selectedEntry.content}</p>
          </div>

          {/* AKCJE NA WPISIE: Polubienie, Przesłanie na e-mail */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => toggleLikeEntry(selectedEntry.id)} 
              className="btn" 
              style={{ background: likedEntries.includes(selectedEntry.id) ? '#ef4444' : '#f1f5f9', color: likedEntries.includes(selectedEntry.id) ? 'white' : 'var(--text-main)' }}
            >
              <i className="fa-solid fa-thumbs-up mr-2"></i>
              {likedEntries.includes(selectedEntry.id) ? 'Wpis polubiony!' : 'Polub ten wpis'}
            </button>
            
            <button 
              onClick={() => alert(`Artykuł "${selectedEntry.title}" wraz z pełnym opracowaniem prawnym został pomyślnie wysłany na Twój adres e-mail: ${user.email}`)} 
              className="btn" 
              style={{ background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
            >
              <i className="fa-solid fa-paper-plane mr-2"></i> Prześlij na mój e-mail
            </button>
          </div>
        </div>
      ) : (
        /* -------------------- WIDOK LISTY WPISÓW -------------------- */
        <div>
          <div className="welcome-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

          {/* PANEL ADMINISTRATORA: Dodawanie wpisu */}
          {isAdding && user.role === 'admin' && (
            <div className="card" style={{ border: '2px solid var(--accent-green)', marginBottom: '24px', animation: 'fadeIn 0.2s ease' }}>
              <h3 className="card-title"><i className="fa-solid fa-pen-nib"></i> Publikacja nowego opracowania prawnego</h3>
              <form onSubmit={handleAddEntry} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Tytuł opracowania</label>
                    <input type="text" placeholder="np. Nowelizacja Kodeksu Pracy w Pomorskiem" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Kategoria normatywna</label>
                    <select value={newCat} onChange={(e) => setNewCat(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'white' }}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Krótkie podsumowanie / Zajawka (bold)</label>
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

          {/* PASEK FILTROWANIA I OBSERWOWANIA KATEGORII */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '13px', marginBottom: '12px', color: 'var(--text-light)' }}>Twoje kategorie (kliknij gwiazdkę, aby spersonalizować sekcję "Rekomendowane"):</h4>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={() => setActiveFilter('Wszystkie')} className="btn" style={{ background: activeFilter === 'Wszystkie' ? 'var(--primary-dark)' : '#f1f5f9', color: activeFilter === 'Wszystkie' ? 'white' : 'var(--text-main)' }}>Wszystkie</button>
              {categories.map(cat => (
                <div key={cat} style={{ display: 'flex', gap: '2px' }}>
                  <button onClick={() => setActiveFilter(cat)} className="btn" style={{ background: activeFilter === cat ? 'var(--primary-dark)' : '#f1f5f9', color: activeFilter === cat ? 'white' : 'var(--text-main)', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>{cat}</button>
                  <button onClick={() => toggleCategoryFav(cat)} className="btn" style={{ background: favCategories.includes(cat) ? 'var(--accent-green)' : '#cbd5e1', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
                    <i className={favCategories.includes(cat) ? "fa-solid fa-star" : "fa-regular fa-star"} style={{ color: 'white' }}></i>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SEKCJA 1: Rekomendowane (Wpisy z obserwowanych kategorii) */}
          {favCategories.length > 0 && activeFilter === 'Wszystkie' && (
            <div style={{ marginBottom: '32px' }}>
              <h3 className="card-title" style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fa-solid fa-sparkles"></i> Rekomendowane (Twoje interesy)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px', marginTop: '16px' }}>
                {forYouEntries.map(entry => (
                  <div key={entry.id} onClick={() => handleOpenEntry(entry)}>
                    <EntryCard entry={entry} isRead={readEntries.includes(entry.id)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEKCJA 2: Wszystkie wpisy bazowe */}
          <h3 className="card-title"><i className="fa-solid fa-list"></i> {activeFilter === 'Wszystkie' ? 'Wszystkie opracowania merytoryczne' : `Kategoria: ${activeFilter}`}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px', marginTop: '16px' }}>
            {filteredEntries.map(entry => (
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

// Komponent karty pojedynczego wpisu
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
        {isRead ? 'Przeczytane' : 'Czytaj pełne opracowanie'} <i className="fa-solid fa-chevron-right" style={{ fontSize: '10px' }}></i>
      </div>
    </div>
  );
}