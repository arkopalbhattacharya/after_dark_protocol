import { useState, useEffect } from 'react';
import './index.css';
import { api } from './services/api';
import type { ProtocolLogEntry, CategoryType } from './types';
import { LogForms } from './components/Forms';

function App() {
  const [timeStr, setTimeStr] = useState('');
  const [logs, setLogs] = useState<ProtocolLogEntry[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryType>('AI_EXPERIMENT');
  const [telemetry, setTelemetry] = useState({ totalLogs: 0, categories: {} as Record<string, number> });
  const [title, setTitle] = useState('');
  const [inspectingLogId, setInspectingLogId] = useState<string | null>(null);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

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
              <div className="flex-1 p-0 overflow-y-auto">
                <div className="divide-y divide-surface-container-high/50">
                  {logs.map((log) => (
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
                  {logs.length === 0 && (
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
                <button className="border border-neon-cyan/30 text-neon-cyan font-label-sm hover:bg-neon-cyan/10 transition-colors flex flex-col items-center justify-center gap-1 p-2">
                  <span className="material-symbols-outlined text-[20px]">terminal</span>
                  NEW_TTY
                </button>
                <button className="bg-neon-cyan text-obsidian-base font-label-sm font-bold glitch-hover transition-all flex flex-col items-center justify-center gap-1 p-2">
                  <span className="material-symbols-outlined text-[20px]">warning</span>
                  PANIC
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-outline-variant fixed bottom-0 left-0 w-full px-margin py-1 flex justify-between items-center z-50 h-8 font-label-sm text-label-sm shrink-0">
        <div className="text-on-surface-variant flex items-center gap-2">
          <span className="w-2 h-2 rounded-none bg-terminal-green animate-pulse"></span>
          &copy; 2026 AFTER_DARK_PROTOCOL // DB_SYNC: OK // TIMESTAMP: {timeStr}
        </div>
        <div className="flex gap-4">
          <span className="text-outline">Uptime: 99.9%</span>
          <span className="text-outline">Latency: 14ms</span>
        </div>
      </footer>
    </>
  );
}

export default App;
