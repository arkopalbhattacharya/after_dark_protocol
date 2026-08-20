import { useState, useEffect } from 'react';
import './index.css';
import { api } from './services/api';
import type { ProtocolLogEntry, CategoryType } from './types';
import { LogForms } from './components/Forms';
import settings from './config/settings.json';

function App() {
  const [timeStr, setTimeStr] = useState('');
  const [logs, setLogs] = useState<ProtocolLogEntry[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryType>('AI_EXPERIMENT');
  const [telemetry, setTelemetry] = useState({ totalLogs: 0, categories: {} as Record<string, number> });
  const [title, setTitle] = useState('');
  const [inspectingLogId, setInspectingLogId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<CategoryType | 'ALL'>('ALL');
  const [isLocked, setIsLocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [isTtyOpen, setIsTtyOpen] = useState(false);
  const [ttyMessages, setTtyMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'SYSTEM INITIALIZED. AWAITING INPUT.' }
  ]);
  const [ttyInput, setTtyInput] = useState('');
  const [isTtyLoading, setIsTtyLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(new Date().toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const loadData = async () => {
    const fetchedLogs = await api.getLogs();
    setLogs(fetchedLogs);
    const tel = await api.getTelemetry();
    setTelemetry(tel);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFormSubmit = async (payload: any) => {
    if (!title) {
      alert("TITLE IS REQUIRED");
      return;
    }
    const entry: ProtocolLogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      category: activeCategory,
      title: title,
      payload: payload
    };
    
    await api.saveLog(entry);
    setTitle('');
    await loadData();
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "after_dark_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (isLocked) {
    return (
      <>
        <div className="scanlines"></div>
        <div className="fixed inset-0 z-50 bg-[#050000] flex flex-col items-center justify-center font-body-md">
          <div className="text-[#ff0033] text-center mb-8">
            <span className="material-symbols-outlined text-[100px] animate-pulse">warning</span>
            <h1 className="text-4xl md:text-6xl font-black tracking-widest mt-4" style={{ textShadow: '0 0 20px rgba(255,0,51,0.8)' }}>TERMINAL LOCKED</h1>
            <p className="text-label-lg mt-2 tracking-widest">CRITICAL ALERT // UNAUTHORIZED ACCESS DETECTED</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <label className="text-[#ff0033] font-label-sm tracking-widest">ENTER OVERRIDE PIN</label>
            <input 
              type="password" 
              autoFocus
              value={pinInput}
              onChange={(e) => {
                const val = e.target.value;
                setPinInput(val);
                if (val === settings.overridePin) {
                  setIsLocked(false);
                  setPinInput('');
                }
              }}
              className="bg-[#1a0000] border-2 border-[#ff0033] text-[#ff0033] text-center text-3xl tracking-[0.5em] p-4 outline-none focus:shadow-[0_0_30px_rgba(255,0,51,0.6)] w-80 font-mono"
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="scanlines"></div>
      
      {/* TopAppBar */}
      <header className="bg-surface-container-low border-b border-outline-variant shadow-[0_0_12px_rgba(30,220,224,0.15)] flex justify-between items-center w-full px-margin py-2 h-16 shrink-0 z-30 relative">
        <div className="font-headline-lg text-[26px] md:text-3xl font-black amber-text tracking-tighter flex items-center gap-3">
          <span className="material-symbols-outlined text-[28px] md:text-[34px]" style={{ fontVariationSettings: "'FILL' 1" }}>terminal</span>
          AFTER_DARK_PROTOCOL_V1.0
        </div>
        <nav className="hidden md:flex gap-6">
          <button onClick={() => setActiveCategory('AI_EXPERIMENT')} className={`font-label-lg hover:text-neon-cyan hover:bg-surface-variant/20 transition-all px-2 py-1 flex items-center gap-2 ${activeCategory === 'AI_EXPERIMENT' ? 'text-neon-cyan bg-surface-variant/20' : 'text-on-surface-variant'}`}>
            <span className="material-symbols-outlined text-[16px]">science</span>
            AI_LAB
          </button>
          <button onClick={() => setActiveCategory('CAFFEINE_LOG')} className={`font-label-lg hover:text-neon-cyan hover:bg-surface-variant/20 transition-all px-2 py-1 flex items-center gap-2 ${activeCategory === 'CAFFEINE_LOG' ? 'text-neon-cyan bg-surface-variant/20' : 'text-on-surface-variant'}`}>
            <span className="material-symbols-outlined text-[16px]">local_cafe</span>
            CAFFEINE
          </button>
          <button onClick={() => setActiveCategory('ACTIVITY_LOG')} className={`font-label-lg hover:text-neon-cyan hover:bg-surface-variant/20 transition-all px-2 py-1 flex items-center gap-2 ${activeCategory === 'ACTIVITY_LOG' ? 'text-neon-cyan bg-surface-variant/20' : 'text-on-surface-variant'}`}>
            <span className="material-symbols-outlined text-[16px]">list_alt</span>
            BIOMETRICS
          </button>
          <button onClick={() => setActiveCategory('FREEFORM_LOG')} className={`font-label-lg hover:text-neon-cyan hover:bg-surface-variant/20 transition-all px-2 py-1 flex items-center gap-2 ${activeCategory === 'FREEFORM_LOG' ? 'text-neon-cyan bg-surface-variant/20' : 'text-on-surface-variant'}`}>
            <span className="material-symbols-outlined text-[16px]">edit_document</span>
            FREEFORM
          </button>
        </nav>
        <div className="flex items-center gap-4 text-neon-cyan">
          <span className="font-label-sm border border-neon-cyan/50 px-2 py-1 text-neon-cyan glow-text shadow-[0_0_10px_rgba(30,220,224,0.3)]">ONLINE // STANDALONE_NODE</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative z-20 mb-8">
        {/* Main Content Area (Bento Grid) */}
        <main className="flex-1 overflow-y-auto p-gutter md:p-margin">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(150px,auto)] h-full">
            
            {/* Primary Data Entry Terminal (Spans 2 cols, 2 rows) */}
            <div className="terminal-panel terminal-panel-active md:col-span-2 md:row-span-2 flex flex-col">
              <div className="terminal-header font-label-sm text-label-sm text-neon-cyan">
                <span>[SYS_CMD_IN] // ROOT</span>
                <span>SCHEMA: {activeCategory}</span>
              </div>
              <div className="flex-1 p-panel-padding flex flex-col overflow-y-auto">
                <div className="mb-4">
                  <label className="block text-neon-cyan font-label-sm mb-1">LOG_TITLE</label>
                  <div className="flex items-center border-b border-neon-cyan/30 pb-1">
                    <span className="text-neon-cyan mr-2 font-bold">&gt;</span>
                    <input autoFocus value={title} onChange={e => setTitle(e.target.value)} className="bg-transparent border-none outline-none focus:ring-0 text-neon-cyan flex-1 font-body-md p-0" placeholder="ENTER TITLE..." type="text" />
                    <span className="blinking-cursor"></span>
                  </div>
                </div>
                
                <LogForms category={activeCategory} onSubmit={handleFormSubmit} />
              </div>
            </div>

            {/* Recent Logs (Spans 1 col, 2 rows) */}
            <div className="terminal-panel amber-panel lg:col-span-1 md:row-span-2 flex flex-col">
              <div className="terminal-header font-label-sm text-label-sm text-amber-warn/70">
                <span>REC_LOGS</span>
                <span>DB_SYNC: OK</span>
              </div>
              <div className="flex border-b border-amber-warn/30 text-[9px] font-label-sm text-amber-warn/50">
                <button 
                  onClick={() => setFilterCategory('ALL')} 
                  className={`flex-1 py-1 hover:bg-amber-warn/10 transition-colors ${filterCategory === 'ALL' ? 'bg-amber-warn/20 text-amber-warn font-bold' : ''}`}
                >ALL</button>
                <button 
                  onClick={() => setFilterCategory('AI_EXPERIMENT')} 
                  className={`flex-1 py-1 hover:bg-amber-warn/10 transition-colors border-l border-amber-warn/30 ${filterCategory === 'AI_EXPERIMENT' ? 'bg-amber-warn/20 text-amber-warn font-bold' : ''}`}
                >AI</button>
                <button 
                  onClick={() => setFilterCategory('CAFFEINE_LOG')} 
                  className={`flex-1 py-1 hover:bg-amber-warn/10 transition-colors border-l border-amber-warn/30 ${filterCategory === 'CAFFEINE_LOG' ? 'bg-amber-warn/20 text-amber-warn font-bold' : ''}`}
                >CAFE</button>
                <button 
                  onClick={() => setFilterCategory('ACTIVITY_LOG')} 
                  className={`flex-1 py-1 hover:bg-amber-warn/10 transition-colors border-l border-amber-warn/30 ${filterCategory === 'ACTIVITY_LOG' ? 'bg-amber-warn/20 text-amber-warn font-bold' : ''}`}
                >BIO</button>
                <button 
                  onClick={() => setFilterCategory('FREEFORM_LOG')} 
                  className={`flex-1 py-1 hover:bg-amber-warn/10 transition-colors border-l border-amber-warn/30 ${filterCategory === 'FREEFORM_LOG' ? 'bg-amber-warn/20 text-amber-warn font-bold' : ''}`}
                >FREE</button>
              </div>
              <div className="flex-1 p-0 overflow-y-auto">
                <div className="divide-y divide-surface-container-high/50">
                  {logs.filter(log => filterCategory === 'ALL' || log.category === filterCategory).map((log) => (
                    <div key={log.id} onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)} className="px-3 py-2 hover:bg-surface-variant/20 cursor-pointer group flex flex-col">
                      <div className="flex justify-between items-start">
                        <div className="font-label-sm text-label-sm text-amber-warn mb-1 group-hover:amber-text transition-all">{log.category}</div>
                      </div>
                      <div className="text-sm truncate text-on-surface-variant font-bold">{log.title}</div>
                      
                      {expandedLogId === log.id && (
                        <div className="mt-2 text-xs border-t border-amber-warn/30 pt-2 space-y-2">
                          {Object.entries(log.payload).map(([key, value]) => (
                            <div key={key} className="flex flex-col">
                              <span className="text-amber-warn/70 uppercase text-[10px]">{key}</span>
                              <span className="text-on-surface-variant break-words">{String(value)}</span>
                            </div>
                          ))}
                          <button 
                            onClick={(e) => { e.stopPropagation(); setInspectingLogId(inspectingLogId === log.id ? null : log.id) }} 
                            className="mt-3 w-full bg-neon-cyan text-obsidian-base font-bold py-1 hover:bg-primary-container transition-colors uppercase text-[10px]"
                          >
                            [ {inspectingLogId === log.id ? 'HIDE' : 'VIEW'} RAW JSON ]
                          </button>
                          {inspectingLogId === log.id && (
                            <pre className="mt-2 p-2 bg-obsidian-elevated border border-neon-cyan/30 text-[10px] text-neon-cyan overflow-x-auto whitespace-pre-wrap">
                              {JSON.stringify(log.payload, null, 2)}
                            </pre>
                          )}
                        </div>
                      )}
                      
                      <div className="text-[10px] text-outline mt-1 text-right">{new Date(log.timestamp).toLocaleString()}</div>
                    </div>
                  ))}
                  {logs.filter(log => filterCategory === 'ALL' || log.category === filterCategory).length === 0 && (
                    <div className="px-3 py-4 text-center text-amber-warn/50 font-label-sm">NO RECORDS FOUND</div>
                  )}
                </div>
              </div>
            </div>

            {/* System Stats (Spans 1 col, 1 row) */}
            <div className="terminal-panel lg:col-span-1 flex flex-col">
              <div className="terminal-header font-label-sm text-label-sm text-outline">
                <span>TELEMETRY_PILLS</span>
                <span>SYS: ACTIVE</span>
              </div>
              <div className="flex-1 p-panel-padding flex flex-col justify-center gap-4">
                <div>
                  <div className="flex justify-between font-label-sm text-label-sm mb-1 text-on-surface-variant">
                    <span>TOTAL_LOGS</span>
                    <span className="text-neon-cyan">{telemetry.totalLogs}</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container flex gap-[2px]">
                    {Array.from({length: 10}).map((_, i) => (
                       <div key={i} className={`h-full ${i < Math.min(telemetry.totalLogs, 10) ? 'bg-neon-cyan' : 'bg-surface-container-high'} w-[10%]`}></div>
                    ))}
                  </div>
                </div>
                <div>
                   <div className="text-on-surface-variant font-label-sm text-[10px] mb-2 border-b border-surface-container-high pb-1">CATEGORY_BREAKDOWN</div>
                   <div className="grid grid-cols-2 gap-2 text-[10px] font-label-sm">
                      <div className="flex justify-between text-outline"><span>AI_LAB</span> <span className="text-neon-cyan">{telemetry.categories['AI_EXPERIMENT'] || 0}</span></div>
                      <div className="flex justify-between text-outline"><span>CAFFEINE</span> <span className="text-neon-cyan">{telemetry.categories['CAFFEINE_LOG'] || 0}</span></div>
                      <div className="flex justify-between text-outline"><span>BIOMETRICS</span> <span className="text-neon-cyan">{telemetry.categories['ACTIVITY_LOG'] || 0}</span></div>
                      <div className="flex justify-between text-outline"><span>FREEFORM</span> <span className="text-neon-cyan">{telemetry.categories['FREEFORM_LOG'] || 0}</span></div>
                   </div>
                </div>
              </div>
            </div>

            {/* Quick Actions (Spans 1 col, 1 row) */}
            <div className="terminal-panel lg:col-span-1 flex flex-col">
              <div className="terminal-header font-label-sm text-label-sm text-outline">
                <span>CMD_LINKS</span>
                <span>EXEC</span>
              </div>
              <div className="flex-1 p-panel-padding grid grid-cols-2 gap-2">
                <button onClick={handleExportJSON} className="border border-neon-cyan/30 text-neon-cyan font-label-sm hover:bg-neon-cyan/10 transition-colors flex flex-col items-center justify-center gap-1 p-2">
                  <span className="material-symbols-outlined text-[20px]">data_object</span>
                  EXPORT_JSON
                </button>
                <button onClick={() => { localStorage.removeItem('after_dark_logs'); loadData(); }} className="border border-neon-cyan/30 text-neon-cyan font-label-sm hover:bg-neon-cyan/10 transition-colors flex flex-col items-center justify-center gap-1 p-2">
                  <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
                  PURGE_DB
                </button>
                <button 
                  onClick={() => setIsTtyOpen(!isTtyOpen)}
                  className="bg-neon-cyan text-obsidian-base font-label-sm font-bold glitch-hover transition-all flex flex-col items-center justify-center gap-1 p-2"
                >
                  <span className="material-symbols-outlined text-[20px]">terminal</span>
                  NEW_TTY
                </button>
                <button 
                  onClick={() => setIsLocked(true)}
                  className="bg-[#ff0033] text-[#05070a] font-label-sm font-bold glitch-hover transition-all flex flex-col items-center justify-center gap-1 p-2"
                >
                  <span className="material-symbols-outlined text-[20px]">warning</span>
                  PANIC
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-amber-warn/80 pt-1 pb-1 px-[100px] flex justify-between items-start text-[10px] text-[#05070a] font-bold font-mono z-30 relative bg-[#cc8e00] shrink-0 h-8">
        <div className="flex gap-4">
          <span>{timeStr} SYS_TIME</span>
          <span>MEM: 640K OK</span>
        </div>
        <div className="flex gap-4">
          <span className="animate-pulse">NET_UPLINK: ACTIVE</span>
          <span>Latency: 14ms</span>
        </div>
      </footer>
      {/* TTY Slide-out Panel */}
      <div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 w-[60%] h-[30vh] bg-[#05070a] border-t border-l border-r border-neon-cyan/50 shadow-[0_0_20px_rgba(30,220,224,0.3)] z-40 transition-transform duration-300 ease-in-out flex flex-col font-mono text-[11px] ${isTtyOpen ? 'translate-y-0' : 'translate-y-[calc(100%+32px)]'}`}
      >
        <div className="flex justify-between items-center bg-neon-cyan/10 border-b border-neon-cyan/30 px-3 py-1 text-neon-cyan font-bold tracking-wider">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[14px]">terminal</span>
            <span>TTY_SESS_01</span>
          </div>
          <button onClick={() => setIsTtyOpen(false)} className="hover:text-amber-warn transition-colors material-symbols-outlined text-[14px]">
            close
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
          {ttyMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] whitespace-pre-wrap ${msg.role === 'user' ? 'text-amber-warn text-right' : 'text-neon-cyan'}`}>
                <span className="opacity-50 text-[9px] mr-2">[{msg.role === 'user' ? 'USR' : 'SYS'}]</span>
                {msg.content}
              </div>
            </div>
          ))}
          {isTtyLoading && (
            <div className="text-neon-cyan animate-pulse">
              <span className="opacity-50 text-[9px] mr-2">[SYS]</span> PROCESSING...
            </div>
          )}
        </div>
        
        <form 
          className="border-t border-neon-cyan/30 p-2 flex items-center gap-2 bg-[#05070a]"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!ttyInput.trim() || isTtyLoading) return;
            
            const newMsgs = [...ttyMessages, { role: 'user' as const, content: ttyInput }];
            setTtyMessages(newMsgs);
            setTtyInput('');
            setIsTtyLoading(true);
            
            try {
              const reply = await api.sendTtyMessage(newMsgs);
              setTtyMessages([...newMsgs, { role: 'assistant', content: reply }]);
            } catch (err) {
              setTtyMessages([...newMsgs, { role: 'assistant', content: 'ERR: COMMUNICATION_FAILURE' }]);
            } finally {
              setIsTtyLoading(false);
            }
          }}
        >
          <span className="text-neon-cyan font-bold">{'>'}</span>
          <input 
            type="text" 
            value={ttyInput}
            onChange={(e) => setTtyInput(e.target.value)}
            className="flex-1 bg-transparent outline-none text-neon-cyan placeholder-neon-cyan/30"
            placeholder="ENTER COMMAND..."
            autoFocus={isTtyOpen}
          />
        </form>
      </div>
    </>
  );
}

export default App;
