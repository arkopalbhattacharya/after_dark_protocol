import { useState, useEffect } from 'react';
import type { NewsArticle, NewsSourceId } from '../types/news';
import { NEWS_SOURCES } from '../data/initialNewsData';
import { exportNewsArticleToPng } from '../utils/exportNewsImage';

interface UniversalNewsPaneProps {
  articles: NewsArticle[];
  isMinimized: boolean;
  onToggleMinimize: () => void;
  isHeightExpanded?: boolean;
  onToggleHeightExpand?: () => void;
  isOffline?: boolean;
  isLoading?: boolean;
}

export function UniversalNewsPane({
  articles,
  isMinimized,
  onToggleMinimize,
  isHeightExpanded = false,
  onToggleHeightExpand,
  isOffline = false,
  isLoading = false
}: UniversalNewsPaneProps) {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | NewsSourceId>('ALL');
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);
  const [isPopupModalOpen, setIsPopupModalOpen] = useState(false);
  const [readArticleIds, setReadArticleIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('after_dark_read_news');
      return saved ? new Set(JSON.parse(saved)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  // Format date and time strictly in 12-hour format (e.g., "Aug 22, 5:45:10 PM")
  const format12HourDateTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const datePart = date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      });
      const timePart = date.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      return `${datePart}, ${timePart}`;
    } catch {
      return isoString;
    }
  };

  const markAsRead = (id: string) => {
    setReadArticleIds((prev) => {
      const updated = new Set(prev);
      updated.add(id);
      try {
        localStorage.setItem('after_dark_read_news', JSON.stringify(Array.from(updated)));
      } catch (err) {
        console.warn('Failed to save read news state:', err);
      }
      return updated;
    });
  };

  const handleArticleClick = (id: string) => {
    markAsRead(id);
    setExpandedArticleId((prev) => (prev === id ? null : id));
  };

  const filteredArticles = articles.filter(
    (a) => selectedFilter === 'ALL' || a.sourceId === selectedFilter
  );

  // Close popup modal on ESC key
  useEffect(() => {
    if (!isPopupModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPopupModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPopupModalOpen]);

  return (
    <>
      <div
        className={`terminal-panel amber-panel flex flex-col transition-all duration-300 ${
          isMinimized ? 'h-auto shrink-0' : 'h-full flex-1 min-h-0'
        }`}
      >
        {/* Terminal Header Bar */}
        <div className="terminal-header font-label-sm text-label-sm text-amber-warn/80 flex justify-between items-center select-none bg-surface-container-high/40 px-3 py-1.5 border-b border-amber-warn/30">
          <div className="flex items-center gap-2 truncate">
            <span className="material-symbols-outlined text-[15px] text-amber-warn animate-pulse">
              satellite_alt
            </span>
            <span className="font-mono font-black tracking-wider text-amber-warn truncate text-xs md:text-sm">
              [THE_SOCIAL_JETWORKS]
            </span>
          </div>

          {/* Action buttons: Height/Maximize [ ▲ ] / [ ▼ ], Zoom [ + ], Minimize/Restore [ − ] / [ ◻ ] */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Height / Maximize Toggle */}
            {onToggleHeightExpand && (
              <button
                type="button"
                onClick={onToggleHeightExpand}
                className="text-xs font-mono font-black text-amber-warn hover:bg-amber-warn/20 px-1.5 py-0.5 border border-amber-warn/40 transition-colors cursor-pointer flex items-center justify-center"
                title={
                  isMinimized
                    ? "UNMINIMIZE & MAXIMIZE NEWS WIRE PANE (65%)"
                    : isHeightExpanded
                    ? "RESTORE HEIGHT (35% NEWS // 65% LOGS)"
                    : "MAXIMIZE HEIGHT (65% NEWS // 35% LOGS)"
                }
              >
                {isHeightExpanded && !isMinimized ? '[ ▼ ]' : '[ ▲ ]'}
              </button>
            )}

            {/* Zoom / Full-screen Popup Modal Button */}
            <button
              type="button"
              onClick={() => setIsPopupModalOpen(true)}
              className="text-xs font-mono font-black text-amber-warn hover:bg-amber-warn/20 px-1.5 py-0.5 border border-amber-warn/40 transition-colors cursor-pointer flex items-center justify-center"
              title="ZOOM // OPEN FULL NEWS WIRE POPUP"
            >
              [ + ]
            </button>

            {/* Minimize / Restore Button */}
            <button
              type="button"
              onClick={onToggleMinimize}
              className="text-xs font-mono font-black text-amber-warn hover:bg-amber-warn/20 px-1.5 py-0.5 border border-amber-warn/40 transition-colors cursor-pointer flex items-center justify-center"
              title={isMinimized ? "RESTORE NEWS WIRE PANE" : "MINIMIZE NEWS WIRE PANE"}
            >
              [ − ]
            </button>
          </div>
        </div>

        {/* Pane Body (Hidden when minimized) */}
        {!isMinimized && (
          <>
            {/* Source Filter Tabs */}
            <div className="flex border-b border-amber-warn/30 text-[10px] md:text-[11px] font-mono text-amber-warn/70 select-none bg-[#140b02]/60 overflow-x-auto">
              <button
                onClick={() => setSelectedFilter('ALL')}
                className={`flex-1 min-w-[50px] py-1.5 px-2 hover:bg-amber-warn/10 transition-colors text-center truncate ${
                  selectedFilter === 'ALL'
                    ? 'bg-amber-warn/20 text-amber-warn font-black border-b-2 border-amber-warn'
                    : ''
                }`}
              >
                ALL ({articles.length})
              </button>

              {NEWS_SOURCES.map((source) => {
                const count = articles.filter((a) => a.sourceId === source.id).length;
                return (
                  <button
                    key={source.id}
                    onClick={() => setSelectedFilter(source.id)}
                    className={`flex-1 min-w-[70px] py-1.5 px-2 hover:bg-amber-warn/10 transition-colors border-l border-amber-warn/20 text-center truncate ${
                      selectedFilter === source.id
                        ? 'bg-amber-warn/20 text-amber-warn font-black border-b-2 border-amber-warn'
                        : ''
                    }`}
                    title={`${source.name} — ${source.description}`}
                  >
                    {source.code} ({count})
                  </button>
                );
              })}
            </div>

            {/* Sub-wire Telemetry Info */}
            <div className="px-3 py-1 bg-[#100701]/90 border-b border-amber-warn/20 text-[9.5px] font-mono text-amber-warn/70 flex justify-between items-center select-none">
              <div className="flex items-center gap-1.5">
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-[#ff0033] animate-pulse' : 'bg-[#33ff00] animate-ping'}`}></span>
                <span className={`tracking-wider font-bold ${isOffline ? 'text-[#ff4d6d]' : 'text-amber-warn/80'}`}>
                  {isOffline ? 'FEED: QUANTUM_CARRIER_OFFLINE // AIRGAP_ENFORCED' : 'FEED: LIVE_SUPABASE_ORBITAL_WIRE'}
                </span>
              </div>
              <span className="text-[9px] opacity-75 font-mono">
                {isOffline ? '[ERR_NO_CARRIER]' : '[DB: SUPABASE_LIVE]'}
              </span>
            </div>

            {/* Main Content Area: Offline Warning vs Loading vs Article Feed */}
            {isOffline ? (
              <div className="flex-1 p-4 md:p-6 flex flex-col justify-center items-center text-center font-mono overflow-y-auto bg-[#0a0401]/95 select-none space-y-3">
                <div className="w-10 h-10 border border-[#ff4d6d]/60 flex items-center justify-center bg-[#ff0033]/10 text-[#ff4d6d] animate-pulse shadow-[0_0_15px_rgba(255,0,51,0.25)]">
                  <span className="material-symbols-outlined text-[24px]">signal_wifi_off</span>
                </div>

                <div className="text-xs md:text-sm font-black text-[#ff4d6d] tracking-widest leading-snug">
                  [ ⚠️ QUANTUM_CARRIER_DE-SYNC // SUB-SPACE COMM-LINK SEVERED ]
                </div>

                <div className="text-[10px] md:text-[10.5px] text-amber-warn/80 max-w-md leading-relaxed border-t border-b border-amber-warn/30 py-2.5 px-3 bg-[#120601] space-y-1 text-left w-full shadow-inner">
                  <p className="text-amber-warn font-bold">&gt;&gt;&gt; SATELLITE DISH ARRAY: OFFLINE [ERR_NULL_TRANSPONDER_HANDSHAKE]</p>
                  <p>&gt;&gt;&gt; SUB-ETHER RELAYS 01-08: UNREACHABLE (SECTOR FLUX ANOMALY)</p>
                  <p className="text-[#ff4d6d] font-bold">&gt;&gt;&gt; PROTOCOL: LOCAL_AIRGAP_ENFORCED // REMOTE_WIRE_BLOCKED</p>
                </div>

                <p className="text-[11px] text-amber-warn/70 max-w-sm leading-relaxed">
                  THE ORBITAL NEWS FEED CANNOT PENETRATE THIS SHIELDED VACUUM CHAMBER. ESTABLISH MAINFRAME CARRIER SIGNAL (ONLINE AUTH) TO DECRYPT INCOMING TELEMETRY.
                </p>

                <div className="text-[9.5px] text-amber-warn/50 tracking-widest animate-pulse font-mono">
                  [ STATUS: RETRYING_HYPERLANE_BEACON... ]
                </div>
              </div>
            ) : isLoading ? (
              <div className="flex-1 p-6 flex flex-col justify-center items-center text-center font-mono text-xs text-amber-warn/70 space-y-2">
                <div className="w-6 h-6 border-2 border-amber-warn border-t-transparent animate-spin"></div>
                <span className="tracking-widest animate-pulse font-bold">[ SYNCING_SUPABASE_ORBITAL_WIRE... ]</span>
              </div>
            ) : (
              /* Scrollable Article Feed */
              <div className="flex-1 p-0 overflow-y-auto">
                <div className="divide-y divide-amber-warn/20">
                  {filteredArticles.map((article) => {
                    const isExpanded = expandedArticleId === article.id;
                    const isRead = readArticleIds.has(article.id);
                    const formattedTime = format12HourDateTime(article.timestamp);

                    return (
                      <div
                        key={article.id}
                        onClick={() => handleArticleClick(article.id)}
                        className={`px-3.5 py-3 hover:bg-amber-warn/10 cursor-pointer group flex flex-col transition-all ${
                          isRead ? 'opacity-90' : 'bg-amber-warn/5'
                        }`}
                      >
                        {/* Top Row: Planet & Urgency Tag & TAPE_IT Button */}
                        <div className="flex justify-between items-center text-[10px] md:text-[10.5px] font-mono mb-1.5">
                          <div className="flex items-center gap-1.5">
                            {!isRead && (
                              <span className="w-2 h-2 rounded-full bg-amber-warn shadow-[0_0_6px_var(--glow-secondary)]"></span>
                            )}
                            <span className="font-bold text-amber-warn group-hover:amber-text tracking-wider truncate max-w-[170px]">
                              {article.planetOrSector}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 font-mono">
                            {article.urgency === 'FLASH' && (
                              <span className="px-1.5 py-0.5 bg-[#ff0033]/20 border border-[#ff0033]/60 text-[#ff4d6d] font-black text-[9px] tracking-widest animate-pulse">
                                FLASH
                              </span>
                            )}
                            {article.urgency === 'CRITICAL' && (
                              <span className="px-1.5 py-0.5 bg-[#ffb703]/20 border border-[#ffb703]/60 text-[#ffb703] font-black text-[9px] tracking-widest">
                                CRITICAL
                              </span>
                            )}
                            {article.urgency === 'ODDITY' && (
                              <span className="px-1.5 py-0.5 bg-[#b83bf5]/20 border border-[#b83bf5]/60 text-[#df9ffb] font-black text-[9px] tracking-widest">
                                ODDITY
                              </span>
                            )}
                            <span className="text-[9.5px] text-amber-warn/60 font-mono px-1.5 py-0.5 border border-amber-warn/30">
                              {article.tag}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                exportNewsArticleToPng(article);
                              }}
                              className="px-1.5 py-0.5 bg-transparent text-amber-warn/80 hover:text-amber-warn hover:bg-amber-warn/15 font-mono font-bold text-[9px] tracking-wider border border-amber-warn/50 hover:border-amber-warn transition-all flex items-center justify-center cursor-pointer ml-0.5"
                              title="EXPORT NEWS CARD AS PNG (TAPE_IT)"
                            >
                              [ TAPE_IT ]
                            </button>
                          </div>
                        </div>

                        {/* Headline */}
                        <div className="text-[13.5px] md:text-[14px] font-bold font-mono text-on-surface group-hover:text-amber-warn transition-colors leading-snug line-clamp-2">
                          {article.headline}
                        </div>

                        {/* Expandable Body */}
                        {isExpanded ? (
                          <div className="mt-2.5 text-xs font-mono text-on-surface-variant border-t border-amber-warn/25 pt-2.5 space-y-2.5 animate-fade-in">
                            <p className="leading-relaxed text-[12.5px] md:text-[13px] text-amber-warn/95 bg-[#0f0701]/95 p-3 border border-amber-warn/40 shadow-inner">
                              {article.content}
                            </p>
                            <div className="flex justify-between items-center text-[10px] md:text-[10.5px] text-outline pt-1 font-mono">
                              <span>WIRE: {article.authorOrWire || 'SOLAR_DISPATCH'}</span>
                              <span className="font-bold text-amber-warn/90">{formattedTime}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center text-[11px] md:text-[11.5px] text-outline mt-1.5 font-mono">
                            <span className="truncate opacity-80 max-w-[200px]">
                              {article.content.slice(0, 55)}...
                            </span>
                            <span className="shrink-0 font-bold text-amber-warn/80 text-[10.5px]">{formattedTime}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {filteredArticles.length === 0 && (
                    <div className="px-3 py-8 text-center text-amber-warn/50 font-label-sm text-xs font-mono">
                      &gt; NO WIRE DISPATCHES RECORDED IN SECTOR
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Full-Screen Cyberpunk Popup Modal */}
      {isPopupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in font-mono">
          <div className="fixed inset-0" onClick={() => setIsPopupModalOpen(false)}></div>

          <div className="relative z-10 w-full max-w-4xl max-h-[85vh] bg-[#0c0501] border-2 border-amber-warn text-amber-warn shadow-[0_0_40px_rgba(255,183,3,0.3),inset_0_0_20px_rgba(255,183,3,0.1)] flex flex-col overflow-hidden">
            {/* Scanline overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,183,3,0.15)_2px,rgba(255,183,3,0.15)_4px)] z-20"></div>

            {/* Modal Header */}
            <div className="bg-[#1a0c02] border-b-2 border-amber-warn px-4 py-3 flex justify-between items-center text-xs md:text-sm tracking-widest font-black select-none z-30">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-amber-warn animate-pulse">
                  satellite_alt
                </span>
                <span className="text-amber-warn">
                  [THE_SOCIAL_JETWORKS // FULL_ORBITAL_WIRE_MATRIX]
                </span>
              </div>
              <button
                onClick={() => setIsPopupModalOpen(false)}
                className="px-2.5 py-1 border border-amber-warn bg-transparent text-amber-warn hover:bg-amber-warn hover:text-[#0c0501] font-black transition-all text-xs cursor-pointer"
              >
                [X] ESC
              </button>
            </div>

            {/* Modal Sub-header & Filter Tabs */}
            <div className="bg-[#140801] border-b border-amber-warn/30 px-4 py-2 flex flex-wrap justify-between items-center gap-2 z-30">
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                <button
                  onClick={() => setSelectedFilter('ALL')}
                  className={`px-3 py-1 border transition-colors ${
                    selectedFilter === 'ALL'
                      ? 'bg-amber-warn text-[#0c0501] font-black border-amber-warn'
                      : 'border-amber-warn/40 text-amber-warn/80 hover:bg-amber-warn/20'
                  }`}
                >
                  ALL ({articles.length})
                </button>
                {NEWS_SOURCES.map((source) => {
                  const count = articles.filter((a) => a.sourceId === source.id).length;
                  return (
                    <button
                      key={source.id}
                      onClick={() => setSelectedFilter(source.id)}
                      className={`px-3 py-1 border transition-colors ${
                        selectedFilter === source.id
                          ? 'bg-amber-warn text-[#0c0501] font-black border-amber-warn'
                          : 'border-amber-warn/40 text-amber-warn/80 hover:bg-amber-warn/20'
                      }`}
                    >
                      {source.code} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Feed Body */}
            <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(85vh-120px)] space-y-4 z-30 flex-1">
              {isOffline ? (
                <div className="py-12 flex flex-col justify-center items-center text-center font-mono space-y-4 select-none">
                  <div className="w-12 h-12 border border-[#ff4d6d]/60 flex items-center justify-center bg-[#ff0033]/10 text-[#ff4d6d] animate-pulse shadow-[0_0_20px_rgba(255,0,51,0.3)]">
                    <span className="material-symbols-outlined text-[30px]">signal_wifi_off</span>
                  </div>

                  <div className="text-sm md:text-base font-black text-[#ff4d6d] tracking-widest leading-snug">
                    [ ⚠️ QUANTUM_CARRIER_DE-SYNC // SUB-SPACE COMM-LINK SEVERED ]
                  </div>

                  <div className="text-xs text-amber-warn/80 max-w-lg leading-relaxed border border-amber-warn/30 py-3 px-4 bg-[#120601] space-y-1.5 text-left w-full shadow-inner">
                    <p className="text-amber-warn font-bold">&gt;&gt;&gt; SATELLITE DISH ARRAY: OFFLINE [ERR_NULL_TRANSPONDER_HANDSHAKE]</p>
                    <p>&gt;&gt;&gt; SUB-ETHER RELAYS 01-08: UNREACHABLE (SECTOR FLUX ANOMALY)</p>
                    <p className="text-[#ff4d6d] font-bold">&gt;&gt;&gt; PROTOCOL: LOCAL_AIRGAP_ENFORCED // REMOTE_WIRE_BLOCKED</p>
                  </div>

                  <p className="text-xs text-amber-warn/70 max-w-md leading-relaxed">
                    THE ORBITAL NEWS FEED CANNOT PENETRATE THIS SHIELDED VACUUM CHAMBER. ESTABLISH MAINFRAME CARRIER SIGNAL (ONLINE AUTH) TO DECRYPT INCOMING TELEMETRY.
                  </p>

                  <div className="text-[10px] text-amber-warn/50 tracking-widest animate-pulse font-mono pt-2">
                    [ STATUS: RETRYING_HYPERLANE_BEACON... ]
                  </div>
                </div>
              ) : (
                filteredArticles.map((article) => {
                const formattedTime = format12HourDateTime(article.timestamp);
                const isRead = readArticleIds.has(article.id);

                return (
                  <div
                    key={article.id}
                    onClick={() => markAsRead(article.id)}
                    className="p-4 border border-amber-warn/30 bg-[#140801]/90 hover:border-amber-warn hover:bg-[#1a0a01] transition-all flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        {!isRead && (
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-warn shadow-[0_0_8px_var(--glow-secondary)]"></span>
                        )}
                        <span className="font-black text-amber-warn tracking-wider text-sm">
                          {article.planetOrSector}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {article.urgency === 'FLASH' && (
                          <span className="px-2 py-0.5 bg-[#ff0033]/20 border border-[#ff0033]/60 text-[#ff4d6d] font-black text-[10px] tracking-widest animate-pulse">
                            FLASH
                          </span>
                        )}
                        {article.urgency === 'CRITICAL' && (
                          <span className="px-2 py-0.5 bg-[#ffb703]/20 border border-[#ffb703]/60 text-[#ffb703] font-black text-[10px] tracking-widest">
                            CRITICAL
                          </span>
                        )}
                        {article.urgency === 'ODDITY' && (
                          <span className="px-2 py-0.5 bg-[#b83bf5]/20 border border-[#b83bf5]/60 text-[#df9ffb] font-black text-[10px] tracking-widest">
                            ODDITY
                          </span>
                        )}
                        <span className="px-2 py-0.5 border border-amber-warn/30 text-[10px] text-amber-warn/70">
                          {article.tag}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            exportNewsArticleToPng(article);
                          }}
                          className="px-2.5 py-0.5 bg-transparent text-amber-warn/80 hover:text-amber-warn hover:bg-amber-warn/15 font-mono font-bold text-[10px] tracking-wider border border-amber-warn/50 hover:border-amber-warn transition-all flex items-center justify-center cursor-pointer"
                          title="EXPORT NEWS CARD AS PNG (TAPE_IT)"
                        >
                          [ TAPE_IT ]
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base font-black text-on-surface text-amber-warn leading-snug">
                      {article.headline}
                    </h3>

                    <p className="text-[13px] text-on-surface-variant text-amber-warn/95 leading-relaxed bg-[#0c0501]/80 p-3 border border-amber-warn/20">
                      {article.content}
                    </p>

                    <div className="flex justify-between items-center text-xs text-outline pt-1 text-amber-warn/60">
                      <span>WIRE: {article.authorOrWire || 'SOLAR_DISPATCH'}</span>
                      <span className="font-bold text-amber-warn/80">{formattedTime}</span>
                    </div>
                  </div>
                );
              })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
