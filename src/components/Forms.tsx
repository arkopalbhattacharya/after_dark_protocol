import { useState } from 'react';
import type { CategoryType, AIExperimentPayload, AIExperimentSubType, CaffeineLogPayload, ActivityLogPayload, ActivitySubType, FreeformLogPayload, DutyRosterPayload } from '../types';
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
  if (category === 'DUTY_ROSTER') {
    return <DutyRosterForm onSubmit={onSubmit} />;
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
  const [subType, setSubType] = useState<AIExperimentSubType>('AI_ML_EXPERIMENTATION');

  // 1. ML Experimentation State
  const [mlData, setMlData] = useState({
    modelStack: '',
    experimentNotes: '',
    epochs: 0,
    loss: 0.0,
    outcomeObservation: ''
  });

  // 2. AI Products Trial State
  const [trialData, setTrialData] = useState({
    productName: '',
    targetDevice: '',
    positives: '',
    negatives: '',
    isPaid: false,
    paymentType: 'SUBSCRIPTION' as 'SUBSCRIPTION' | 'ONE_TIME',
    costDetails: '',
    verdict: 'KEEP' as 'KEEP' | 'CAN_IT',
    trialNotes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subType === 'AI_ML_EXPERIMENTATION') {
      onSubmit({
        subType: 'AI_ML_EXPERIMENTATION',
        modelStack: mlData.modelStack,
        experimentNotes: mlData.experimentNotes,
        epochs: mlData.epochs,
        loss: mlData.loss,
        outcomeObservation: mlData.outcomeObservation
      });
    } else {
      onSubmit({
        subType: 'AI_PRODUCTS_TRIALS',
        productName: trialData.productName,
        targetDevice: trialData.targetDevice,
        positives: trialData.positives,
        negatives: trialData.negatives,
        isPaid: trialData.isPaid,
        paymentType: trialData.isPaid ? trialData.paymentType : undefined,
        costDetails: trialData.isPaid ? trialData.costDetails : 'FREE',
        verdict: trialData.verdict,
        trialNotes: trialData.trialNotes
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      {/* Sub-type Toggles */}
      <div>
        <label className="block text-neon-cyan mb-1.5 font-label-sm text-[11px] tracking-wider">EXPERIMENT_SUBTYPE</label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-surface-container-high/40 border border-neon-cyan/30">
          <button
            type="button"
            onClick={() => setSubType('AI_ML_EXPERIMENTATION')}
            className={`py-1.5 px-2 text-xs font-label-sm font-bold transition-all text-center ${
              subType === 'AI_ML_EXPERIMENTATION'
                ? 'bg-neon-cyan text-obsidian-base shadow-[0_0_10px_var(--glow-color)]'
                : 'text-neon-cyan/70 hover:text-neon-cyan hover:bg-neon-cyan/10'
            }`}
          >
            [ AI_ML_EXPERIMENTATION ]
          </button>
          <button
            type="button"
            onClick={() => setSubType('AI_PRODUCTS_TRIALS')}
            className={`py-1.5 px-2 text-xs font-label-sm font-bold transition-all text-center ${
              subType === 'AI_PRODUCTS_TRIALS'
                ? 'bg-neon-cyan text-obsidian-base shadow-[0_0_10px_var(--glow-color)]'
                : 'text-neon-cyan/70 hover:text-neon-cyan hover:bg-neon-cyan/10'
            }`}
          >
            [ AI_PRODUCTS_TRIALS ]
          </button>
        </div>
      </div>

      {/* 1. AI_ML_EXPERIMENTATION Form Fields */}
      {subType === 'AI_ML_EXPERIMENTATION' && (
        <>
          <div>
            <label className="block text-neon-cyan mb-1 font-label-sm">MODEL_STACK</label>
            <input 
              required 
              value={mlData.modelStack} 
              onChange={e => setMlData({...mlData, modelStack: e.target.value})} 
              type="text" 
              className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan" 
              placeholder="e.g. CodeGen-2B / Llama-3-70B" 
            />
          </div>
          <div>
            <label className="block text-neon-cyan mb-1 font-label-sm">EXPERIMENT_NOTES</label>
            <textarea 
              required 
              value={mlData.experimentNotes} 
              onChange={e => setMlData({...mlData, experimentNotes: e.target.value})} 
              className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan h-20"
              placeholder="Hypothesis, dataset details, tuning strategy..."
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-neon-cyan mb-1 font-label-sm">EPOCHS</label>
              <input 
                value={mlData.epochs} 
                onChange={e => setMlData({...mlData, epochs: Number(e.target.value)})} 
                type="number" 
                className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan" 
              />
            </div>
            <div className="flex-1">
              <label className="block text-neon-cyan mb-1 font-label-sm">LOSS</label>
              <input 
                value={mlData.loss} 
                onChange={e => setMlData({...mlData, loss: Number(e.target.value)})} 
                type="number" 
                step="0.01" 
                className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan" 
              />
            </div>
          </div>
          <div>
            <label className="block text-neon-cyan mb-1 font-label-sm">OUTCOME_OBSERVATION</label>
            <input 
              required 
              value={mlData.outcomeObservation} 
              onChange={e => setMlData({...mlData, outcomeObservation: e.target.value})} 
              type="text" 
              className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan" 
              placeholder="Convergence rate, evaluation scores, artifacts..."
            />
          </div>
        </>
      )}

      {/* 2. AI_PRODUCTS_TRIALS Form Fields */}
      {subType === 'AI_PRODUCTS_TRIALS' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-neon-cyan mb-1 font-label-sm">TOOL_PRODUCT_NAME</label>
              <input 
                required 
                value={trialData.productName} 
                onChange={e => setTrialData({...trialData, productName: e.target.value})} 
                type="text" 
                className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan" 
                placeholder="e.g. Cursor IDE, Claude Coworker, Perplexity" 
              />
            </div>
            <div>
              <label className="block text-neon-cyan mb-1 font-label-sm">TARGET_DEVICE</label>
              <input 
                required 
                value={trialData.targetDevice} 
                onChange={e => setTrialData({...trialData, targetDevice: e.target.value})} 
                type="text" 
                className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan" 
                placeholder="e.g. MacBook Pro M3, iPhone 16 Pro, Cloud/Web" 
              />
            </div>
          </div>

          <div>
            <label className="block text-neon-cyan mb-1 font-label-sm">POSITIVES // PROS</label>
            <textarea 
              required 
              value={trialData.positives} 
              onChange={e => setTrialData({...trialData, positives: e.target.value})} 
              className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan h-16"
              placeholder="What worked well? High speed, accuracy, fluid UX..."
            />
          </div>

          <div>
            <label className="block text-neon-cyan mb-1 font-label-sm">NEGATIVES // CONS</label>
            <textarea 
              required 
              value={trialData.negatives} 
              onChange={e => setTrialData({...trialData, negatives: e.target.value})} 
              className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan h-16"
              placeholder="Friction points, hallucinations, bugs, high memory..."
            />
          </div>

          {/* Pricing Model Section */}
          <div className="border border-neon-cyan/30 p-3 bg-surface-container-high/20 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-neon-cyan font-label-sm text-xs">// PRICING_STRUCTURE</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTrialData({...trialData, isPaid: false})}
                  className={`px-3 py-1 text-xs border ${
                    !trialData.isPaid ? 'bg-neon-cyan text-obsidian-base font-bold' : 'border-neon-cyan/30 text-neon-cyan'
                  }`}
                >
                  [ FREE ]
                </button>
                <button
                  type="button"
                  onClick={() => setTrialData({...trialData, isPaid: true})}
                  className={`px-3 py-1 text-xs border ${
                    trialData.isPaid ? 'bg-neon-cyan text-obsidian-base font-bold' : 'border-neon-cyan/30 text-neon-cyan'
                  }`}
                >
                  [ PAID ]
                </button>
              </div>
            </div>

            {trialData.isPaid && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-neon-cyan/20">
                <div>
                  <label className="block text-neon-cyan mb-1 font-label-sm text-[10px]">PAYMENT_TYPE</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setTrialData({...trialData, paymentType: 'SUBSCRIPTION'})}
                      className={`flex-1 py-1 text-xs border ${
                        trialData.paymentType === 'SUBSCRIPTION' ? 'bg-neon-cyan text-obsidian-base font-bold' : 'border-neon-cyan/30 text-neon-cyan'
                      }`}
                    >
                      SUBSCRIPTION
                    </button>
                    <button
                      type="button"
                      onClick={() => setTrialData({...trialData, paymentType: 'ONE_TIME'})}
                      className={`flex-1 py-1 text-xs border ${
                        trialData.paymentType === 'ONE_TIME' ? 'bg-neon-cyan text-obsidian-base font-bold' : 'border-neon-cyan/30 text-neon-cyan'
                      }`}
                    >
                      ONE_TIME
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-neon-cyan mb-1 font-label-sm text-[10px]">COST_DETAILS</label>
                  <input
                    value={trialData.costDetails}
                    onChange={e => setTrialData({...trialData, costDetails: e.target.value})}
                    type="text"
                    placeholder="e.g. $20/month or $99 lifetime"
                    className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-1.5 text-xs outline-none focus:border-neon-cyan"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Verdict Section */}
          <div className="flex justify-between items-center bg-surface-container-high p-3 border border-neon-cyan/30">
            <span className="text-neon-cyan font-label-sm text-xs">FINAL_VERDICT:</span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setTrialData({...trialData, verdict: 'KEEP'})}
                className={`px-4 py-1.5 text-xs font-bold border transition-all ${
                  trialData.verdict === 'KEEP'
                    ? 'bg-neon-cyan text-obsidian-base shadow-[0_0_10px_var(--glow-color)]'
                    : 'border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10'
                }`}
              >
                [ KEEP IT // ADOPT ]
              </button>
              <button
                type="button"
                onClick={() => setTrialData({...trialData, verdict: 'CAN_IT'})}
                className={`px-4 py-1.5 text-xs font-bold border transition-all ${
                  trialData.verdict === 'CAN_IT'
                    ? 'bg-error text-obsidian-base shadow-[0_0_10px_rgba(255,0,51,0.5)]'
                    : 'border-error/30 text-error hover:bg-error/10'
                }`}
              >
                [ CAN IT // PURGE ]
              </button>
            </div>
          </div>

          <div>
            <label className="block text-neon-cyan mb-1 font-label-sm">OPERATIONAL_NOTES (OPTIONAL)</label>
            <input 
              value={trialData.trialNotes} 
              onChange={e => setTrialData({...trialData, trialNotes: e.target.value})} 
              type="text" 
              className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan" 
              placeholder="e.g. Keep installed on MacBook, uninstall from iPhone." 
            />
          </div>
        </>
      )}

      <button type="submit" className="w-full bg-neon-cyan text-obsidian-base font-bold py-2 mt-4 hover:bg-primary-container glitch-hover">
        [ TRANSMIT_LOG // COMMIT ]
      </button>
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
  const [subType, setSubType] = useState<ActivitySubType>('WALK_RUN');

  // Walk / Run state
  const [walkData, setWalkData] = useState({
    walkCompleted: true,
    durationMinutes: 30,
    avgHeartRate: 125,
    activeKcals: 220,
    vo2Max: 45.0,
    routeLocation: '',
    postMoodState: 'Centered'
  });

  // Stairs state
  const [stairsData, setStairsData] = useState({
    stairsClimbed: 500,
    avgHeartRate: 140,
    activeKcals: 180
  });

  // Weight state
  const [weightData, setWeightData] = useState({
    durationMinutes: 45,
    avgHeartRate: 120,
    activeKcals: 300,
    bodyWeightKg: 75.0,
    muscleRatePercent: 40.0,
    bodyFatPercent: 16.5
  });

  // Core state
  const [coreData, setCoreData] = useState({
    durationMinutes: 20,
    activeKcals: 150,
    avgHeartRate: 115
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subType === 'WALK_RUN') {
      onSubmit({
        activitySubType: 'WALK_RUN',
        walkCompleted: walkData.walkCompleted,
        durationMinutes: walkData.durationMinutes,
        avgHeartRate: walkData.avgHeartRate,
        activeKcals: walkData.activeKcals,
        vo2Max: walkData.vo2Max,
        routeLocation: walkData.routeLocation,
        postMoodState: walkData.postMoodState
      });
    } else if (subType === 'STAIRS') {
      onSubmit({
        activitySubType: 'STAIRS',
        stairsClimbed: stairsData.stairsClimbed,
        avgHeartRate: stairsData.avgHeartRate,
        activeKcals: stairsData.activeKcals
      });
    } else if (subType === 'WEIGHT') {
      onSubmit({
        activitySubType: 'WEIGHT',
        durationMinutes: weightData.durationMinutes,
        avgHeartRate: weightData.avgHeartRate,
        activeKcals: weightData.activeKcals,
        bodyWeightKg: weightData.bodyWeightKg,
        muscleRatePercent: weightData.muscleRatePercent,
        bodyFatPercent: weightData.bodyFatPercent
      });
    } else if (subType === 'CORE') {
      onSubmit({
        activitySubType: 'CORE',
        durationMinutes: coreData.durationMinutes,
        activeKcals: coreData.activeKcals,
        avgHeartRate: coreData.avgHeartRate
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      {/* Activity Sub-type Toggles */}
      <div>
        <label className="block text-neon-cyan mb-1.5 font-label-sm text-[11px] tracking-wider">ACTIVITY_SUBTYPE</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-surface-container-high/40 border border-neon-cyan/30">
          <button
            type="button"
            onClick={() => setSubType('WALK_RUN')}
            className={`py-1.5 px-2 text-xs font-label-sm font-bold transition-all text-center ${
              subType === 'WALK_RUN'
                ? 'bg-neon-cyan text-obsidian-base shadow-[0_0_10px_var(--glow-color)]'
                : 'text-neon-cyan/70 hover:text-neon-cyan hover:bg-neon-cyan/10'
            }`}
          >
            [ WALK / RUN ]
          </button>
          <button
            type="button"
            onClick={() => setSubType('STAIRS')}
            className={`py-1.5 px-2 text-xs font-label-sm font-bold transition-all text-center ${
              subType === 'STAIRS'
                ? 'bg-neon-cyan text-obsidian-base shadow-[0_0_10px_var(--glow-color)]'
                : 'text-neon-cyan/70 hover:text-neon-cyan hover:bg-neon-cyan/10'
            }`}
          >
            [ STAIRS ]
          </button>
          <button
            type="button"
            onClick={() => setSubType('WEIGHT')}
            className={`py-1.5 px-2 text-xs font-label-sm font-bold transition-all text-center ${
              subType === 'WEIGHT'
                ? 'bg-neon-cyan text-obsidian-base shadow-[0_0_10px_var(--glow-color)]'
                : 'text-neon-cyan/70 hover:text-neon-cyan hover:bg-neon-cyan/10'
            }`}
          >
            [ WEIGHT ]
          </button>
          <button
            type="button"
            onClick={() => setSubType('CORE')}
            className={`py-1.5 px-2 text-xs font-label-sm font-bold transition-all text-center ${
              subType === 'CORE'
                ? 'bg-neon-cyan text-obsidian-base shadow-[0_0_10px_var(--glow-color)]'
                : 'text-neon-cyan/70 hover:text-neon-cyan hover:bg-neon-cyan/10'
            }`}
          >
            [ CORE ]
          </button>
        </div>
      </div>

      {/* WALK / RUN Form Fields */}
      {subType === 'WALK_RUN' && (
        <>
          <div className="flex justify-between items-center bg-surface-container-high p-3 border border-neon-cyan/30">
            <span className="text-neon-cyan font-label-sm">WALK_COMPLETED?</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setWalkData({ ...walkData, walkCompleted: true })}
                className={`px-3 py-1 border ${
                  walkData.walkCompleted ? 'bg-neon-cyan text-obsidian-base font-bold' : 'border-neon-cyan/30 text-neon-cyan'
                }`}
              >
                YES
              </button>
              <button
                type="button"
                onClick={() => setWalkData({ ...walkData, walkCompleted: false })}
                className={`px-3 py-1 border ${
                  !walkData.walkCompleted ? 'bg-error text-obsidian-base font-bold' : 'border-error/30 text-error'
                }`}
              >
                NO
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-neon-cyan mb-1 font-label-sm">DURATION_MINUTES</label>
              <input
                required
                value={walkData.durationMinutes}
                onChange={e => setWalkData({ ...walkData, durationMinutes: Number(e.target.value) })}
                type="number"
                className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan"
              />
            </div>
            <div>
              <label className="block text-neon-cyan mb-1 font-label-sm">AVG_HEART_RATE (BPM)</label>
              <input
                value={walkData.avgHeartRate}
                onChange={e => setWalkData({ ...walkData, avgHeartRate: Number(e.target.value) })}
                type="number"
                placeholder="e.g. 125"
                className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan"
              />
            </div>
            <div>
              <label className="block text-neon-cyan mb-1 font-label-sm">ACTIVE_KCALS</label>
              <input
                value={walkData.activeKcals}
                onChange={e => setWalkData({ ...walkData, activeKcals: Number(e.target.value) })}
                type="number"
                placeholder="e.g. 220"
                className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan"
              />
            </div>
          </div>

          <div>
            <label className="block text-neon-cyan mb-1 font-label-sm">VO2_MAX (ML/KG/MIN)</label>
            <input
              value={walkData.vo2Max}
              onChange={e => setWalkData({ ...walkData, vo2Max: Number(e.target.value) })}
              type="number"
              step="0.1"
              placeholder="e.g. 45.0"
              className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan"
            />
          </div>

          <div>
            <label className="block text-neon-cyan mb-1 font-label-sm">ROUTE_LOCATION</label>
            <input
              value={walkData.routeLocation}
              onChange={e => setWalkData({ ...walkData, routeLocation: e.target.value })}
              type="text"
              placeholder="e.g. Sector 7 Perimeter Trail"
              className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan"
            />
          </div>

          <div className="relative z-30">
            <label className="block text-neon-cyan mb-1 font-label-sm">POST_MOOD_STATE</label>
            <CustomSelect
              value={walkData.postMoodState}
              onChange={val => setWalkData({ ...walkData, postMoodState: val })}
              options={settings.postMoodStates}
            />
          </div>
        </>
      )}

      {/* STAIRS Form Fields */}
      {subType === 'STAIRS' && (
        <>
          <div>
            <label className="block text-neon-cyan mb-1 font-label-sm">STAIRS_CLIMBED (STEPS)</label>
            <input
              required
              value={stairsData.stairsClimbed}
              onChange={e => setStairsData({ ...stairsData, stairsClimbed: Number(e.target.value) })}
              type="number"
              placeholder="e.g. 500"
              className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-neon-cyan mb-1 font-label-sm">AVG_HEART_RATE (BPM)</label>
              <input
                required
                value={stairsData.avgHeartRate}
                onChange={e => setStairsData({ ...stairsData, avgHeartRate: Number(e.target.value) })}
                type="number"
                placeholder="e.g. 140"
                className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan"
              />
            </div>
            <div>
              <label className="block text-neon-cyan mb-1 font-label-sm">ACTIVE_KCALS</label>
              <input
                required
                value={stairsData.activeKcals}
                onChange={e => setStairsData({ ...stairsData, activeKcals: Number(e.target.value) })}
                type="number"
                placeholder="e.g. 180"
                className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan"
              />
            </div>
          </div>
        </>
      )}

      {/* WEIGHT Form Fields */}
      {subType === 'WEIGHT' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-neon-cyan mb-1 font-label-sm">DURATION_MINUTES</label>
              <input
                required
                value={weightData.durationMinutes}
                onChange={e => setWeightData({ ...weightData, durationMinutes: Number(e.target.value) })}
                type="number"
                className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan"
              />
            </div>
            <div>
              <label className="block text-neon-cyan mb-1 font-label-sm">AVG_HEART_RATE (BPM)</label>
              <input
                required
                value={weightData.avgHeartRate}
                onChange={e => setWeightData({ ...weightData, avgHeartRate: Number(e.target.value) })}
                type="number"
                placeholder="e.g. 120"
                className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan"
              />
            </div>
            <div>
              <label className="block text-neon-cyan mb-1 font-label-sm">ACTIVE_KCALS</label>
              <input
                required
                value={weightData.activeKcals}
                onChange={e => setWeightData({ ...weightData, activeKcals: Number(e.target.value) })}
                type="number"
                placeholder="e.g. 300"
                className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan"
              />
            </div>
          </div>

          <div className="border border-neon-cyan/30 p-3 bg-surface-container-high/20 space-y-3">
            <div className="text-neon-cyan font-label-sm text-xs border-b border-neon-cyan/20 pb-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">monitoring</span>
              <span>// BODY_COMPOSITION_METRICS</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-neon-cyan mb-1 font-label-sm">BODY_WEIGHT (KG)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weightData.bodyWeightKg}
                  onChange={e => setWeightData({ ...weightData, bodyWeightKg: Number(e.target.value) })}
                  placeholder="e.g. 75.0"
                  className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan"
                />
              </div>
              <div>
                <label className="block text-neon-cyan mb-1 font-label-sm">MUSCLE_RATE (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weightData.muscleRatePercent}
                  onChange={e => setWeightData({ ...weightData, muscleRatePercent: Number(e.target.value) })}
                  placeholder="e.g. 40.0"
                  className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan"
                />
              </div>
              <div>
                <label className="block text-neon-cyan mb-1 font-label-sm">BODY_FAT (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weightData.bodyFatPercent}
                  onChange={e => setWeightData({ ...weightData, bodyFatPercent: Number(e.target.value) })}
                  placeholder="e.g. 16.5"
                  className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* CORE Form Fields */}
      {subType === 'CORE' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-neon-cyan mb-1 font-label-sm">DURATION_MINUTES</label>
              <input
                required
                value={coreData.durationMinutes}
                onChange={e => setCoreData({ ...coreData, durationMinutes: Number(e.target.value) })}
                type="number"
                className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan"
              />
            </div>
            <div>
              <label className="block text-neon-cyan mb-1 font-label-sm">ACTIVE_KCALS</label>
              <input
                required
                value={coreData.activeKcals}
                onChange={e => setCoreData({ ...coreData, activeKcals: Number(e.target.value) })}
                type="number"
                placeholder="e.g. 150"
                className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan"
              />
            </div>
            <div>
              <label className="block text-neon-cyan mb-1 font-label-sm">AVG_HEART_RATE (BPM)</label>
              <input
                required
                value={coreData.avgHeartRate}
                onChange={e => setCoreData({ ...coreData, avgHeartRate: Number(e.target.value) })}
                type="number"
                placeholder="e.g. 115"
                className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan"
              />
            </div>
          </div>
        </>
      )}

      <button type="submit" className="w-full bg-neon-cyan text-obsidian-base font-bold py-2 mt-4 hover:bg-primary-container glitch-hover">
        [ TRANSMIT_LOG // COMMIT ]
      </button>
    </form>
  );
}

function DutyRosterForm({ onSubmit }: { onSubmit: (data: DutyRosterPayload) => void }) {
  const [data, setData] = useState<DutyRosterPayload>({
    taskDescription: '',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    assignedOfficer: 'OPERATOR_01',
    deadlineEst: ''
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(data); }} className="space-y-4 font-body-md text-on-surface">
      <div>
        <label className="block text-neon-cyan mb-1 font-label-sm">TASK_DESCRIPTION</label>
        <textarea 
          required 
          value={data.taskDescription} 
          onChange={e => setData({...data, taskDescription: e.target.value})} 
          className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan h-20"
          placeholder="Describe operational duty or mission task..."
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative z-30">
          <label className="block text-neon-cyan mb-1 font-label-sm">STATUS</label>
          <CustomSelect 
            value={data.status} 
            onChange={val => setData({...data, status: val})} 
            options={settings.dutyStatuses} 
          />
        </div>
        <div className="relative z-20">
          <label className="block text-neon-cyan mb-1 font-label-sm">PRIORITY</label>
          <CustomSelect 
            value={data.priority} 
            onChange={val => setData({...data, priority: val})} 
            options={settings.dutyPriorities} 
          />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-neon-cyan mb-1 font-label-sm">ASSIGNED_OFFICER</label>
          <input 
            value={data.assignedOfficer} 
            onChange={e => setData({...data, assignedOfficer: e.target.value})} 
            type="text" 
            className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan" 
            placeholder="e.g. OPERATOR_01" 
          />
        </div>
        <div className="flex-1">
          <label className="block text-neon-cyan mb-1 font-label-sm">DEADLINE_EST</label>
          <input 
            value={data.deadlineEst} 
            onChange={e => setData({...data, deadlineEst: e.target.value})} 
            type="text" 
            className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none focus:border-neon-cyan" 
            placeholder="e.g. 04:00 HRS" 
          />
        </div>
      </div>
      <button type="submit" className="w-full bg-neon-cyan text-obsidian-base font-bold py-2 mt-4 hover:bg-primary-container glitch-hover">
        [ TRANSMIT_LOG // COMMIT ]
      </button>
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
