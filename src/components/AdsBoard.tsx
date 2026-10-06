import { useState } from 'react';
import { useData } from '../data/DataProvider';
import type { Announcement, AnnouncementBadge, AnnouncementType } from '../types';

const CATEGORY_FILTERS: { id: string; label: string }[] = [
  { id: 'all', label: 'Wszystkie kategorie' },
  { id: 'collab', label: 'Współpraca B2B' },
  { id: 'env', label: 'Środowisko i BDO' },
  { id: 'bhp', label: 'BHP - Audyty' },
];

export default function AdsBoard() {
  const { announcements, companies, currentCompany, addAnnouncement, addCategoryProposal } = useData();

  const [subscriptions, setSubscriptions] = useState<string[]>(['env', 'collab']);
  const toggleSubscription = (id: string): void =>
    setSubscriptions((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const [mainTab, setMainTab] = useState<'szukam' | 'oferuje' | 'wszystkie'>('wszystkie');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Formularz ogłoszenia
  const [newType, setNewType] = useState('Szukamy współpracy (Zlecę projekt/pracę)');
  const [newCategory, setNewCategory] = useState<string>('collab');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [suggestedCategory, setSuggestedCategory] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  const [favorites, setFavorites] = useState<string[]>([]);
  const [revealedContacts, setRevealedContacts] = useState<string[]>([]);
  const [selectedAd, setSelectedAd] = useState<Announcement | null>(null);

  // Widoczne dla użytkownika: zatwierdzone + własne (także oczekujące na moderację).
  const visible = announcements.filter(
    (ad) => ad.status === 'approved' || ad.companyName === currentCompany.name,
  );

  const processAds = (adsList: Announcement[]): Announcement[] => {
    let result = adsList.filter(
      (ad) =>
        ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.companyName.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (mainTab === 'szukam') {
      result = result.filter((ad) => ad.categoryName.includes('Szukam') || ad.categoryName.includes('Zlecę'));
    } else if (mainTab === 'oferuje') {
      result = result.filter((ad) => ad.categoryName.includes('Oferuj'));
    }

    if (activeCategoryFilter !== 'all') {
      result = result.filter((ad) => ad.type === activeCategoryFilter);
    }

    result = [...result].sort((a, b) => (sortBy === 'newest' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt));
    return result;
  };

  const subscribedAds = processAds(visible.filter((ad) => subscriptions.includes(ad.type)));
  const otherAds = processAds(visible.filter((ad) => !subscriptions.includes(ad.type)));

  const handleCreateAd = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    let icon = 'fa-handshake';
    let badgeClass: AnnouncementBadge = 'tag-collab';
    let categoryName = 'Współpraca B2B';
    let finalCategoryType: AnnouncementType = newCategory as AnnouncementType;

    if (newCategory === 'suggest') {
      if (!suggestedCategory.trim()) return;
      categoryName = `Oczekuje: ${suggestedCategory.trim()}`;
      finalCategoryType = 'collab';
      addCategoryProposal(suggestedCategory.trim()); // trafia do kolejki admina
    } else if (newCategory === 'env') {
      icon = 'fa-leaf'; badgeClass = 'tag-env'; categoryName = 'Środowisko i BDO';
    } else if (newCategory === 'bhp') {
      icon = 'fa-hard-hat'; badgeClass = 'tag-env'; categoryName = 'BHP - Audyty';
    }

    addAnnouncement({
      type: finalCategoryType,
      badgeClass,
      categoryName: `${categoryName} • ${newType}${isUrgent ? ' 🔥 PILNE' : ''}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      icon,
    });

    setNewTitle(''); setNewContent(''); setSuggestedCategory(''); setNewCategory('collab'); setIsUrgent(false);
    setIsModalOpen(false);
  };

  const renderAd = (ad: Announcement) => (
    <div key={ad.id} className="ad-item" onClick={() => setSelectedAd(ad)} style={{ cursor: 'pointer' }}>
      <div className="ad-icon"><i className={`fa-solid ${ad.icon}`} aria-hidden="true"></i></div>
      <div className="ad-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
          <h4>{ad.title}</h4>
          {ad.status === 'pending' && <span className="badge" style={{ background: '#fef3c7', color: '#92400e', fontSize: '10px', height: 'fit-content' }}>Oczekuje</span>}
        </div>
        <p>{ad.content.substring(0, 80)}...</p>
        <span className="ad-meta">{ad.companyName} • {ad.date}</span>
      </div>
    </div>
  );

  const selectedAdCompany = selectedAd ? companies.find((c) => c.name === selectedAd.companyName) : undefined;

  return (
    <div>
      {selectedAd ? (
        <div className="card" style={{ animation: 'fadeIn 0.2s ease', maxWidth: '900px' }}>
          <button onClick={() => setSelectedAd(null)} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-arrow-left" aria-hidden="true"></i> Powrót do giełdy
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <span className={`badge ${selectedAd.badgeClass}`}>{selectedAd.categoryName}</span>
                <button className="sub-btn" aria-label="Dodaj do zapisanych" onClick={() => setFavorites((prev) => (prev.includes(selectedAd.id) ? prev.filter((id) => id !== selectedAd.id) : [...prev, selectedAd.id]))} style={{ fontSize: '24px' }}>
                  <i className={favorites.includes(selectedAd.id) ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'} aria-hidden="true" style={{ color: favorites.includes(selectedAd.id) ? '#f59e0b' : undefined }}></i>
                </button>
              </div>
              <h2 style={{ fontSize: '24px', color: 'var(--primary-dark)', marginTop: '12px', fontWeight: 700 }}>{selectedAd.title}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '14px' }}>Wystawił: <strong>{selectedAd.companyName}</strong></span>
                <span className="badge" style={{ background: '#dcfce7', color: '#166534' }}><i className="fa-solid fa-shield-halved" aria-hidden="true" style={{ marginRight: '4px' }}></i> Zweryfikowano RID</span>
              </div>
            </div>
          </div>

          <p style={{ lineHeight: '1.8', color: 'var(--text-main)', padding: '24px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
            {selectedAd.content}
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {revealedContacts.includes(selectedAd.id) ? (
              <div style={{ padding: '12px', background: '#ecfdf5', borderRadius: '8px', fontSize: '14px', border: '1px solid var(--accent-green)', width: '100%' }}>
                <i className="fa-solid fa-envelope" aria-hidden="true" style={{ color: '#059669', marginRight: '8px' }}></i> {selectedAdCompany?.contact.email ?? 'kontakt@firma.pl'}
                <span style={{ margin: '0 8px', color: 'var(--border-color)' }}>|</span>
                <i className="fa-solid fa-phone" aria-hidden="true" style={{ color: '#059669', marginRight: '8px' }}></i> {selectedAdCompany?.contact.phone ?? '+48 58 000 00 00'}
              </div>
            ) : (
              <button className="btn" onClick={() => setRevealedContacts([...revealedContacts, selectedAd.id])}>Odkryj dane kontaktowe</button>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="welcome-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1>Giełda Ofert B2B</h1>
              <p>Wyszukuj kontrakty i partnerów z Pomorza. Wszystkie ogłoszenia są aktywne przez 30 dni.</p>
            </div>
            <button className="btn" onClick={() => setIsModalOpen(true)}>+ Dodaj ogłoszenie</button>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'var(--white)', padding: '6px', borderRadius: '10px', border: '1px solid var(--border-color)', width: 'fit-content', flexWrap: 'wrap' }}>
            <button onClick={() => setMainTab('wszystkie')} className="btn" style={{ background: mainTab === 'wszystkie' ? 'var(--primary-dark)' : 'transparent', color: mainTab === 'wszystkie' ? 'white' : 'var(--text-main)', boxShadow: 'none' }}>Wszystkie</button>
            <button onClick={() => setMainTab('szukam')} className="btn" style={{ background: mainTab === 'szukam' ? '#3b82f6' : 'transparent', color: mainTab === 'szukam' ? 'white' : 'var(--text-main)', boxShadow: 'none' }}>Szukam</button>
            <button onClick={() => setMainTab('oferuje')} className="btn" style={{ background: mainTab === 'oferuje' ? 'var(--accent-green)' : 'transparent', color: mainTab === 'oferuje' ? 'white' : 'var(--text-main)', boxShadow: 'none' }}>Oferuję</button>
          </div>

          <div className="card" style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="search-bar" style={{ width: '100%', backgroundColor: 'var(--bg-light)', border: '1px solid var(--border-color)' }}>
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
              <input type="text" placeholder="Filtruj po słowach kluczowych..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} aria-label="Filtruj ogłoszenia" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {CATEGORY_FILTERS.map((cat) => (
                  <button key={cat.id} onClick={() => setActiveCategoryFilter(cat.id)} className="btn" style={{ fontSize: '12px', padding: '6px 12px', boxShadow: 'none', background: activeCategoryFilter === cat.id ? 'var(--primary-dark)' : '#f1f5f9', color: activeCategoryFilter === cat.id ? 'white' : 'var(--text-main)' }}>
                    {cat.label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label htmlFor="ads-sort" style={{ fontSize: '12px', color: 'var(--text-light)' }}>Sortuj:</label>
                <select id="ads-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'white', fontSize: '12px' }}>
                  <option value="newest">Najnowsze</option>
                  <option value="oldest">Najstarsze</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid-layout">
            <div className="card" style={{ alignSelf: 'start' }}>
              <h3 className="card-title"><i className="fa-solid fa-bell" aria-hidden="true" style={{ color: 'var(--accent-green)' }}></i> Alerty Branżowe</h3>
              <div className="category-item"><span>Współpraca B2B</span><button className={`sub-btn ${subscriptions.includes('collab') ? 'active' : 'inactive'}`} aria-label="Przełącz alerty: Współpraca B2B" onClick={() => toggleSubscription('collab')}><i className="fa-solid fa-bell" aria-hidden="true"></i></button></div>
              <div className="category-item"><span>Środowisko i BDO</span><button className={`sub-btn ${subscriptions.includes('env') ? 'active' : 'inactive'}`} aria-label="Przełącz alerty: Środowisko i BDO" onClick={() => toggleSubscription('env')}><i className="fa-solid fa-bell" aria-hidden="true"></i></button></div>
              <div className="category-item"><span>BHP - Audyty</span><button className={`sub-btn ${subscriptions.includes('bhp') ? 'active' : 'inactive'}`} aria-label="Przełącz alerty: BHP" onClick={() => toggleSubscription('bhp')}><i className="fa-solid fa-bell" aria-hidden="true"></i></button></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="card" style={{ borderLeft: '4px solid var(--accent-green)' }}>
                <h3 className="card-title">Wybrane dla Ciebie</h3>
                {subscribedAds.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--text-light)' }}>Brak ogłoszeń w obserwowanych kategoriach. Włącz alerty branżowe lub zmień filtry.</p>
                ) : (
                  subscribedAds.map(renderAd)
                )}
              </div>

              {otherAds.length > 0 && (
                <div className="card">
                  <h3 className="card-title">Pozostałe ogłoszenia</h3>
                  {otherAds.map(renderAd)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DODAWANIA OFERTY */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)', padding: '16px', overflowY: 'auto' }}>
          <div className="card" style={{ width: '100%', maxWidth: '520px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="card-title" style={{ margin: 0 }}><i className="fa-solid fa-bullhorn" aria-hidden="true" style={{ color: 'var(--accent-green)', marginRight: '8px' }}></i> Nowa oferta na giełdzie</h3>
              <button onClick={() => setIsModalOpen(false)} aria-label="Zamknij" style={{ background: 'none', border: 'none', fontSize: '20px', color: 'var(--text-light)', cursor: 'pointer' }}><i className="fa-solid fa-xmark" aria-hidden="true"></i></button>
            </div>

            <form onSubmit={handleCreateAd} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'var(--bg-light)', padding: '14px', borderRadius: '8px', border: '1px solid var(--accent-green)' }}>
                <label htmlFor="ad-goal" style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--primary-dark)' }}>1. Podstawowy cel ogłoszenia:</label>
                <select id="ad-goal" value={newType} onChange={(e) => setNewType(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--accent-green)', background: 'white', fontWeight: 600, color: 'var(--primary-dark)', outline: 'none' }}>
                  <option>Szukamy współpracy (Zlecę projekt/pracę)</option>
                  <option>Szukamy pracownika / eksperta</option>
                  <option>Oferujemy usługi (Zaoferuj pomoc/podwykonawstwo)</option>
                  <option>Oferujemy gotowe produkty</option>
                </select>
              </div>

              <div>
                <label htmlFor="ad-cat" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>2. Wybierz branżę / kategorię główną</label>
                <select id="ad-cat" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'white' }}>
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
                <label htmlFor="ad-title" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>3. Tytuł</label>
                <input id="ad-title" type="text" required placeholder="np. Zlecę transport kruszywa z Gdańska" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
              </div>

              <div>
                <label htmlFor="ad-content" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>4. Treść szczegółowa</label>
                <textarea id="ad-content" required rows={4} placeholder="Szczegóły zlecenia lub oferty..." value={newContent} onChange={(e) => setNewContent(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', resize: 'none' }}></textarea>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                <input type="checkbox" checked={isUrgent} onChange={(e) => setIsUrgent(e.target.checked)} /> Oznacz jako pilne 🔥
              </label>

              <p style={{ fontSize: '11px', color: 'var(--text-light)', margin: 0 }}>
                <i className="fa-solid fa-circle-info" aria-hidden="true" style={{ marginRight: '4px' }}></i> Ogłoszenie trafi do moderacji RID i pojawi się publicznie po zatwierdzeniu.
              </p>

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
