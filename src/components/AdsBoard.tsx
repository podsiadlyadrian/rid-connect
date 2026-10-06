import { useState } from 'react';
import type { Announcement } from '../App';

interface AdsBoardProps {
  subscriptions: string[];
  toggleSubscription: (id: string) => void;
  announcements: Announcement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
}

export default function AdsBoard({ subscriptions, toggleSubscription, announcements, setAnnouncements }: AdsBoardProps) {
  const [mainTab, setMainTab] = useState<'szukam' | 'oferuje' | 'wszystkie'>('wszystkie');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'urgent'>('newest');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Stany formularza ogłoszenia
  const [newType, setNewType] = useState('Szukam współpracy (Zlecę)'); // PODSTAWOWY PARAMETR NA GÓRZE
  const [newCategory, setNewCategory] = useState<string>('collab'); 
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [suggestedCategory, setSuggestedCategory] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  const [favorites, setFavorites] = useState<number[]>([]);
  const [revealedContacts, setRevealedContacts] = useState<number[]>([]);
  const [selectedAd, setSelectedAd] = useState<Announcement | null>(null);

  const processAds = (adsList: Announcement[]) => {
    let result = adsList.filter(ad => 
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      ad.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (mainTab === 'szukam') {
      result = result.filter(ad => ad.categoryName.includes('Szukam') || ad.categoryName.includes('Zlecę'));
    } else if (mainTab === 'oferuje') {
      result = result.filter(ad => ad.categoryName.includes('Oferuj'));
    }

    if (activeCategoryFilter !== 'all') {
      result = result.filter(ad => ad.type === activeCategoryFilter);
    }

    if (sortBy === 'newest') {
      result.sort((a, b) => b.id - a.id);
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => a.id - b.id);
    }
    return result;
  };

  const subscribedAds = processAds(announcements.filter(ad => subscriptions.includes(ad.type)));
  const otherAds = processAds(announcements.filter(ad => !subscriptions.includes(ad.type)));

  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    let icon = 'fa-handshake';
    let badgeClass: 'tag-env' | 'tag-collab' = 'tag-collab';
    let categoryName = 'Współpraca B2B';
    let finalCategoryType = newCategory;

    if (newCategory === 'suggest') {
      if (!suggestedCategory.trim()) return;
      categoryName = `Oczekuje: ${suggestedCategory}`;
      finalCategoryType = 'collab';
    } else if (newCategory === 'env') {
      icon = 'fa-leaf'; badgeClass = 'tag-env'; categoryName = 'Środowisko i BDO';
    } else if (newCategory === 'bhp') {
      icon = 'fa-hard-hat'; badgeClass = 'tag-env'; categoryName = 'BHP - Audyty';
    }

    const newAd: Announcement = {
      id: Date.now(),
      type: finalCategoryType as 'env' | 'collab' | 'bhp',
      badgeClass: badgeClass,
      categoryName: `${categoryName} • ${newType} ${isUrgent ? '🔥 PILNE' : ''}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      companyName: 'Logistyka Pomorze Sp. z o.o.',
      date: 'Ważne jeszcze 30 dni',
      icon: icon
    };

    setAnnouncements([newAd, ...announcements]);
    setNewTitle(''); setNewContent(''); setSuggestedCategory(''); setNewCategory('collab'); setIsUrgent(false);
    setIsModalOpen(false);
  };

  return (
    <div>
      {selectedAd ? (
        <div className="card" style={{ animation: 'fadeIn 0.2s ease', maxWidth: '900px' }}>
          <button onClick={() => setSelectedAd(null)} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-arrow-left"></i> Powrót do giełdy
          </button>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <span className={`badge ${selectedAd.badgeClass}`}>{selectedAd.categoryName}</span>
                <button className="sub-btn" onClick={() => setFavorites(prev => prev.includes(selectedAd.id) ? prev.filter(id => id !== selectedAd.id) : [...prev, selectedAd.id])} style={{ fontSize: '24px' }}>
                  <i className={favorites.includes(selectedAd.id) ? "fa-solid fa-bookmark text-amber-500" : "fa-regular fa-bookmark"}></i>
                </button>
              </div>
              <h2 style={{ fontSize: '24px', color: 'var(--primary-dark)', marginTop: '12px', fontWeight: 700 }}>{selectedAd.title}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
                <span style={{ fontSize: '14px' }}>Wystawił: <strong>{selectedAd.companyName}</strong></span>
                <span className="badge" style={{ background: '#dcfce7', color: '#166534' }}><i className="fa-solid fa-shield-check mr-1"></i> Zweryfikowano RID</span>
              </div>
            </div>
          </div>

          <p style={{ lineHeight: '1.8', color: 'var(--text-main)', padding: '24px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
            {selectedAd.content}
          </p>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {revealedContacts.includes(selectedAd.id) ? (
              <div style={{ padding: '12px', background: '#ecfdf5', borderRadius: '8px', fontSize: '14px', border: '1px solid var(--accent-green)', width: '100%' }}>
                <i className="fa-solid fa-envelope text-emerald-600 mr-2"></i> kontakt@firma.pl | <i className="fa-solid fa-phone text-emerald-600 mr-2"></i> +48 58 777 00 00
              </div>
            ) : (
              <button className="btn" onClick={() => setRevealedContacts([...revealedContacts, selectedAd.id])}>Odkryj dane kontaktowe</button>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="welcome-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>Giełda Ofert B2B</h1>
              <p>Wyszukuj kontrakty i partnerów z Pomorza. Wszystkie ogłoszenia są aktywne przez 30 dni.</p>
            </div>
            <button className="btn" onClick={() => setIsModalOpen(true)}>+ Dodaj ogłoszenie</button>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'var(--white)', padding: '6px', borderRadius: '10px', border: '1px solid var(--border-color)', width: 'fit-content' }}>
            <button onClick={() => setMainTab('wszystkie')} className="btn" style={{ background: mainTab === 'wszystkie' ? 'var(--primary-dark)' : 'transparent', color: mainTab === 'wszystkie' ? 'white' : 'var(--text-main)', boxShadow: 'none' }}>Wszystkie</button>
            <button onClick={() => setMainTab('szukam')} className="btn" style={{ background: mainTab === 'szukam' ? '#3b82f6' : 'transparent', color: mainTab === 'szukam' ? 'white' : 'var(--text-main)', boxShadow: 'none' }}>Szukam</button>
            <button onClick={() => setMainTab('oferuje')} className="btn" style={{ background: mainTab === 'oferuje' ? 'var(--accent-green)' : 'transparent', color: mainTab === 'oferuje' ? 'white' : 'var(--text-main)', boxShadow: 'none' }}>Oferuję</button>
          </div>

          <div className="card" style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="search-bar" style={{ width: '100%', backgroundColor: 'var(--bg-light)', border: '1px solid var(--border-color)' }}>
              <i className="fa-solid fa-magnifying-glass"></i>
              <input type="text" placeholder="Filtruj po słowach kluczowych..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { id: 'all', label: 'Wszystkie kategorie' },
                  { id: 'collab', label: 'Współpraca B2B' },
                  { id: 'env', label: 'Środowisko i BDO' },
                  { id: 'bhp', label: 'BHP - Audyty' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategoryFilter(cat.id)}
                    className="btn"
                    style={{ fontSize: '12px', padding: '6px 12px', boxShadow: 'none', background: activeCategoryFilter === cat.id ? 'var(--primary-dark)' : '#f1f5f9', color: activeCategoryFilter === cat.id ? 'white' : 'var(--text-main)' }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>Sortuj:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                  style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'white', fontSize: '12px' }}
                >
                  <option value="newest">Najnowsze</option>
                  <option value="oldest">Najstarsze</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid-layout">
            <div className="card" style={{ alignSelf: 'start' }}>
              <h3 className="card-title"><i className="fa-solid fa-bell" style={{ color: 'var(--accent-green)' }}></i> Alerty Branżowe</h3>
              <div className="category-item"><span>Współpraca B2B</span><button className={`sub-btn ${subscriptions.includes('collab') ? 'active' : 'inactive'}`} onClick={() => toggleSubscription('collab')}><i className="fa-solid fa-bell"></i></button></div>
              <div className="category-item"><span>Środowisko i BDO</span><button className={`sub-btn ${subscriptions.includes('env') ? 'active' : 'inactive'}`} onClick={() => toggleSubscription('env')}><i className="fa-solid fa-bell"></i></button></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="card" style={{ borderLeft: '4px solid var(--accent-green)' }}>
                <h3 className="card-title">Wybrane dla Ciebie</h3>
                {subscribedAds.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>Brak ogłoszeń w obserwowanych kategoriach. Włącz alerty branżowe lub zmień filtry.</p>
                ) : (
                  subscribedAds.map(ad => (
                    <div key={ad.id} className="ad-item" onClick={() => setSelectedAd(ad)} style={{ cursor: 'pointer' }}>
                      <div className="ad-icon"><i className={`fa-solid ${ad.icon}`}></i></div>
                      <div className="ad-content">
                        <h4>{ad.title}</h4>
                        <p>{ad.content.substring(0, 80)}...</p>
                        <span className="ad-meta">{ad.companyName} • {ad.date}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {otherAds.length > 0 && (
                <div className="card">
                  <h3 className="card-title">Pozostałe ogłoszenia</h3>
                  {otherAds.map(ad => (
                    <div key={ad.id} className="ad-item" onClick={() => setSelectedAd(ad)} style={{ cursor: 'pointer' }}>
                      <div className="ad-icon"><i className={`fa-solid ${ad.icon}`}></i></div>
                      <div className="ad-content">
                        <h4>{ad.title}</h4>
                        <p>{ad.content.substring(0, 80)}...</p>
                        <span className="ad-meta">{ad.companyName} • {ad.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DODAWANIA OFERTY: PARAMETR "SZUKAM / OFERUJĘ" NA SAMYM GÓRZE */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div className="card" style={{ width: '100%', maxWidth: '520px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="card-title" style={{ margin: 0 }}><i className="fa-solid fa-bullhorn text-emerald-500 mr-2"></i> Nowa oferta na giełdzie</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', color: 'var(--text-light)', cursor: 'pointer' }}><i className="fa-solid fa-xmark"></i></button>
            </div>

            <form onSubmit={handleCreateAd} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* KROK 1: GŁÓWNY PARAMETR WYZNACZAJĄCY CEL */}
              <div style={{ background: 'var(--bg-light)', padding: '14px', borderRadius: '8px', border: '1px solid var(--accent-green)' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--primary-dark)' }}>
                  1. Podstawowy cel ogłoszenia:
                </label>
                <select value={newType} onChange={(e) => setNewType(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--accent-green)', background: 'white', fontWeight: 600, color: 'var(--primary-dark)', outline: 'none' }}>
                  <option>Szukamy współpracy (Zlecę projekt/pracę)</option>
                  <option>Szukamy pracownika / eksperta</option>
                  <option>Oferujemy usługi (Zaoferuj pomoc/podwykonawstwo)</option>
                  <option>Oferujemy gotowe produkty</option>
                </select>
              </div>

              {/* KROK 2: BRANŻA */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>2. Wybierz branżę / kategorię główną</label>
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'white' }}>
                  <option value="collab">Współpraca B2B</option>
                  <option value="env">Środowisko i BDO</option>
                  <option value="bhp">BHP - Audyty</option>
                  <option value="suggest">Inna (Zaproponuj nową dla admina...)</option>
                </select>
              </div>

              {newCategory === 'suggest' && (
                <div style={{ padding: '12px', background: '#ecfdf5', borderRadius: '6px', border: '1px solid var(--accent-green)' }}>
                  <input type="text" required placeholder="Wpisz nazwę nowej kategorii..." value={suggestedCategory} onChange={(e) => setSuggestedCategory(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>3. Tytuł</label>
                <input type="text" required placeholder="np. Zlecę transport kruszywa z Gdańska" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>4. Treść szczegółowa</label>
                <textarea required rows={4} placeholder="Szczegóły zlecenia lub oferty..." value={newContent} onChange={(e) => setNewContent(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', resize: 'none' }}></textarea>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn" style={{ background: '#f1f5f9', color: '#475569' }}>Anuluj</button>
                <button type="submit" className="btn">Opublikuj ofertę</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}