import { useState } from 'react';
import type { CategoryType, AIExperimentPayload, CaffeineLogPayload, ActivityLogPayload, FreeformLogPayload } from '../types';
import settings from '../config/settings.json';

interface FormsProps {
  category: CategoryType;
  onSubmit: (payload: any) => void;
}

export function LogForms({ category, onSubmit }: FormsProps) {
  if (category === 'AI_EXPERIMENT') {
    return <AIExperimentForm onSubmit={onSubmit} />;
  }
  if (category === 'CAFFEINE_LOG') {
    return <CaffeineForm onSubmit={onSubmit} />;
  }
  if (category === 'ACTIVITY_LOG') {
    return <ActivityForm onSubmit={onSubmit} />;
  }
  return <FreeformForm onSubmit={onSubmit} />;
}

function CustomSelect({ value, onChange, options, placeholder = "Select..." }: { value: string, onChange: (val: string) => void, options: string[], placeholder?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full font-body-md text-on-surface">
      <div 
        className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none cursor-pointer flex justify-between items-center hover:border-neon-cyan transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value || placeholder}</span>
        <span className="material-symbols-outlined text-[16px]">{isOpen ? 'expand_less' : 'expand_more'}</span>
      </div>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface-container-high border border-neon-cyan/50 shadow-[0_0_15px_rgba(30,220,224,0.1)] z-50 max-h-48 overflow-y-auto">
            {options.map(opt => (
              <div 
                key={opt} 
                className={`p-2 cursor-pointer hover:bg-neon-cyan/20 hover:text-neon-cyan transition-colors ${value === opt ? 'bg-neon-cyan/10 border-l-2 border-neon-cyan' : 'border-l-2 border-transparent'}`}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
              >
                {opt}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function AIExperimentForm({ onSubmit }: { onSubmit: (data: AIExperimentPayload) => void }) {
  const [data, setData] = useState<AIExperimentPayload>({
    modelStack: '',
    experimentNotes: '',
    epochs: 0,
    loss: 0.0,
    outcomeObservation: ''
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(data); }} className="space-y-4 font-body-md text-on-surface">
      <div>
        <label className="block text-neon-cyan mb-1 font-label-sm">MODEL_STACK</label>
        <input required value={data.modelStack} onChange={e => setData({...data, modelStack: e.target.value})} type="text" className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan" placeholder="e.g. CodeGen-2B" />
      </div>
      <div>
        <label className="block text-neon-cyan mb-1 font-label-sm">EXPERIMENT_NOTES</label>
        <textarea required value={data.experimentNotes} onChange={e => setData({...data, experimentNotes: e.target.value})} className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan h-20"></textarea>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-neon-cyan mb-1 font-label-sm">EPOCHS</label>
          <input value={data.epochs} onChange={e => setData({...data, epochs: Number(e.target.value)})} type="number" className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan" />
        </div>
        <div className="flex-1">
          <label className="block text-neon-cyan mb-1 font-label-sm">LOSS</label>
          <input value={data.loss} onChange={e => setData({...data, loss: Number(e.target.value)})} type="number" step="0.01" className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan" />
        </div>
      </div>
      <div>
        <label className="block text-neon-cyan mb-1 font-label-sm">OUTCOME_OBSERVATION</label>
        <input required value={data.outcomeObservation} onChange={e => setData({...data, outcomeObservation: e.target.value})} type="text" className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan" />
      </div>
      <button type="submit" className="w-full bg-neon-cyan text-obsidian-base font-bold py-2 mt-4 hover:bg-primary-container glitch-hover">[ TRANSMIT_LOG // COMMIT ]</button>
    </form>
  );
}

function CaffeineForm({ onSubmit }: { onSubmit: (data: CaffeineLogPayload) => void }) {
  const [data, setData] = useState<CaffeineLogPayload>({
    beanOrigin: '',
    brewMethod: '',
    liked: true,
    flavorProfile: ''
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(data); }} className="space-y-4 font-body-md text-on-surface">
      <div>
        <label className="block text-neon-cyan mb-1 font-label-sm">BEAN_ORIGIN</label>
        <input required value={data.beanOrigin} onChange={e => setData({...data, beanOrigin: e.target.value})} type="text" className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan" />
      </div>
      <div>
        <label className="block text-neon-cyan mb-1 font-label-sm">BREW_METHOD</label>
        <CustomSelect 
          value={data.brewMethod} 
          onChange={val => setData({...data, brewMethod: val})} 
          options={settings.brewMethods} 
          placeholder="Select Method" 
        />
      </div>
      <div className="flex gap-4 items-center mt-2">
        <label className="text-neon-cyan font-label-sm">VERDICT</label>
        <button type="button" onClick={() => setData({...data, liked: true})} className={`px-4 py-1 border ${data.liked ? 'bg-neon-cyan text-obsidian-base font-bold' : 'border-neon-cyan/30 text-neon-cyan'}`}>[ LIKED ]</button>
        <button type="button" onClick={() => setData({...data, liked: false})} className={`px-4 py-1 border ${!data.liked ? 'bg-error text-obsidian-base font-bold' : 'border-error/30 text-error'}`}>[ DISLIKED ]</button>
      </div>
      <div>
        <label className="block text-neon-cyan mb-1 font-label-sm mt-4">FLAVOR_PROFILE</label>
        <input required value={data.flavorProfile} onChange={e => setData({...data, flavorProfile: e.target.value})} type="text" className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan" placeholder="Acidity, Body, Notes..." />
      </div>
      <button type="submit" className="w-full bg-neon-cyan text-obsidian-base font-bold py-2 mt-4 hover:bg-primary-container glitch-hover">[ TRANSMIT_LOG // COMMIT ]</button>
    </form>
  );
}

function ActivityForm({ onSubmit }: { onSubmit: (data: ActivityLogPayload) => void }) {
  const [data, setData] = useState<ActivityLogPayload>({
    walkCompleted: true,
    durationMinutes: 30,
    postMoodState: 'Centered',
    routeLocation: ''
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(data); }} className="space-y-4 font-body-md text-on-surface">
      <div className="flex justify-between items-center bg-surface-container-high p-3 border border-neon-cyan/30">
        <span className="text-neon-cyan font-label-sm">WALK_COMPLETED?</span>
        <div className="flex gap-2">
          <button type="button" onClick={() => setData({...data, walkCompleted: true})} className={`px-3 py-1 border ${data.walkCompleted ? 'bg-neon-cyan text-obsidian-base' : 'border-neon-cyan/30 text-neon-cyan'}`}>YES</button>
          <button type="button" onClick={() => setData({...data, walkCompleted: false})} className={`px-3 py-1 border ${!data.walkCompleted ? 'bg-error text-obsidian-base' : 'border-error/30 text-error'}`}>NO</button>
        </div>
      </div>
      <div>
        <label className="block text-neon-cyan mb-1 font-label-sm">DURATION_MINUTES</label>
        <input required value={data.durationMinutes} onChange={e => setData({...data, durationMinutes: Number(e.target.value)})} type="number" className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan" />
      </div>
      <div>
        <label className="block text-neon-cyan mb-1 font-label-sm">ROUTE_LOCATION</label>
        <input value={data.routeLocation} onChange={e => setData({...data, routeLocation: e.target.value})} type="text" className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan" />
      </div>
      <div className="relative z-30">
        <label className="block text-neon-cyan mb-1 font-label-sm">POST_MOOD_STATE</label>
        <CustomSelect 
          value={data.postMoodState} 
          onChange={val => setData({...data, postMoodState: val})} 
          options={settings.postMoodStates} 
        />
      </div>
      <button type="submit" className="w-full bg-neon-cyan text-obsidian-base font-bold py-2 mt-4 hover:bg-primary-container glitch-hover">[ TRANSMIT_LOG // COMMIT ]</button>
    </form>
  );
}

function FreeformForm({ onSubmit }: { onSubmit: (data: FreeformLogPayload) => void }) {
  const [data, setData] = useState<FreeformLogPayload>({
    rawContent: ''
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(data); }} className="space-y-4 font-body-md text-on-surface h-full flex flex-col">
      <div className="flex-1">
        <textarea required value={data.rawContent} onChange={e => setData({...data, rawContent: e.target.value})} className="w-full h-full min-h-[150px] bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan font-mono" placeholder="ENTER RAW TEXT BUFFER..."></textarea>
      </div>
      <button type="submit" className="w-full bg-neon-cyan text-obsidian-base font-bold py-2 mt-4 hover:bg-primary-container glitch-hover">[ TRANSMIT_LOG // COMMIT ]</button>
    </form>
  );
}
