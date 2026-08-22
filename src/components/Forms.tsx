import { useState, useEffect } from 'react';
import type {
  CategoryType,
  AIExperimentPayload,
  AIExperimentSubType,
  CaffeineLogPayload,
  ActivityLogPayload,
  ActivitySubType,
  FreeformLogPayload,
  DutyRosterPayload,
  FlowTelemetryPayload,
  IncidentPostmortemPayload,
  IntelSynapsePayload,
  HomelabRigPayload,
  ReleaseRadarPayload,
  HibernationLogPayload,
  ChemStackPayload,
  RationIntelPayload,
  MoodSpectrumPayload,
  StillnessIntervalPayload,
  ChronoSprintPayload,
  DailyFrogPayload,
  QuadrantMatrixPayload,
  BlockedQueuePayload,
  InterstitialJotPayload,
  DawnDuskStandupPayload,
  NeuralScratchpadPayload,
  FiveMinuteIgnitionPayload,
  DailyCadenceChecklistPayload,
  CadenceChecklistItem,
  CreditBurnPayload,
  ScreenTelemetryPayload,
  SonicChroniclePayload,
  VirtualArenaPayload,
  CommsLinkPayload,
  MicroTriumphsPayload
} from '../types';
import settings from '../config/settings.json';

interface FormsProps {
  category: CategoryType;
  onSubmit: (payload: any) => void;
}

export function LogForms({ category, onSubmit }: FormsProps) {
  switch (category) {
    // CYBER_OPS
    case 'AI_EXPERIMENT':
      return <AIExperimentForm onSubmit={onSubmit} />;
    case 'FLOW_TELEMETRY':
      return <FlowTelemetryForm onSubmit={onSubmit} />;
    case 'INCIDENT_POSTMORTEM':
      return <IncidentPostmortemForm onSubmit={onSubmit} />;
    case 'INTEL_SYNAPSE':
      return <IntelSynapseForm onSubmit={onSubmit} />;
    case 'HOMELAB_RIG':
      return <HomelabRigForm onSubmit={onSubmit} />;
    case 'RELEASE_RADAR':
      return <ReleaseRadarForm onSubmit={onSubmit} />;

    // VITALS
    case 'CAFFEINE_LOG':
      return <CaffeineForm onSubmit={onSubmit} />;
    case 'ACTIVITY_LOG':
      return <ActivityForm onSubmit={onSubmit} />;
    case 'HIBERNATION_LOG':
      return <HibernationLogForm onSubmit={onSubmit} />;
    case 'CHEM_STACK':
      return <ChemStackForm onSubmit={onSubmit} />;
    case 'RATION_INTEL':
      return <RationIntelForm onSubmit={onSubmit} />;
    case 'MOOD_SPECTRUM':
      return <MoodSpectrumForm onSubmit={onSubmit} />;
    case 'STILLNESS_INTERVAL':
      return <StillnessIntervalForm onSubmit={onSubmit} />;

    // PRODUCTIVITY
    case 'DUTY_ROSTER':
      return <DutyRosterForm onSubmit={onSubmit} />;
    case 'CHRONO_SPRINT':
      return <ChronoSprintForm onSubmit={onSubmit} />;
    case 'DAILY_FROG':
      return <DailyFrogForm onSubmit={onSubmit} />;
    case 'QUADRANT_MATRIX':
      return <QuadrantMatrixForm onSubmit={onSubmit} />;
    case 'BLOCKED_QUEUE':
      return <BlockedQueueForm onSubmit={onSubmit} />;
    case 'INTERSTITIAL_JOT':
      return <InterstitialJotForm onSubmit={onSubmit} />;
    case 'DAWN_DUSK_STANDUP':
      return <DawnDuskStandupForm onSubmit={onSubmit} />;
    case 'NEURAL_SCRATCHPAD':
      return <NeuralScratchpadForm onSubmit={onSubmit} />;
    case 'FIVE_MINUTE_IGNITION':
      return <FiveMinuteIgnitionForm onSubmit={onSubmit} />;
    case 'DAILY_CADENCE_CHECKLIST':
      return <DailyCadenceChecklistForm onSubmit={onSubmit} />;
    case 'FREEFORM_LOG':
      return <FreeformForm onSubmit={onSubmit} />;

    // SKY_LIFE
    case 'CREDIT_BURN':
      return <CreditBurnForm onSubmit={onSubmit} />;
    case 'SCREEN_TELEMETRY':
      return <ScreenTelemetryForm onSubmit={onSubmit} />;
    case 'SONIC_CHRONICLE':
      return <SonicChronicleForm onSubmit={onSubmit} />;
    case 'VIRTUAL_ARENA':
      return <VirtualArenaForm onSubmit={onSubmit} />;
    case 'COMMS_LINK':
      return <CommsLinkForm onSubmit={onSubmit} />;
    case 'MICRO_TRIUMPHS':
      return <MicroTriumphsForm onSubmit={onSubmit} />;

    default:
      return <FreeformForm onSubmit={onSubmit} />;
  }
}

// -------------------------------------------------------------
// REUSABLE UI PRIMITIVES
// -------------------------------------------------------------

function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select...'
}: {
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[] | string[];
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const normalizedOptions = options.map((opt) =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

  const selectedOption = normalizedOptions.find((o) => o.value === value);

  return (
    <div className="relative w-full font-body-md text-on-surface">
      <div
        className="w-full bg-surface-container-high border border-neon-cyan/30 text-neon-cyan p-2 outline-none cursor-pointer flex justify-between items-center hover:border-neon-cyan transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <span className="material-symbols-outlined text-[16px]">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface-container-high border border-neon-cyan/50 shadow-[0_0_15px_rgba(30,220,224,0.1)] z-50 max-h-48 overflow-y-auto">
            {normalizedOptions.map((opt) => (
              <div
                key={opt.value}
                className={`p-2 cursor-pointer hover:bg-neon-cyan/20 hover:text-neon-cyan transition-colors truncate ${
                  value === opt.value
                    ? 'bg-neon-cyan/10 border-l-2 border-neon-cyan text-neon-cyan font-bold'
                    : 'border-l-2 border-transparent'
                }`}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// MICRO-TIMER WIDGET COMPONENT
// -------------------------------------------------------------

function MicroTimer({
  initialSeconds = 1500,
  mode = 'COUNTDOWN',
  onTimeUpdate,
  label = 'CHRONO_TIMER'
}: {
  initialSeconds?: number;
  mode?: 'COUNTDOWN' | 'STOPWATCH';
  onTimeUpdate?: (secondsElapsedOrRemaining: number) => void;
  label?: string;
}) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const next = mode === 'COUNTDOWN' ? Math.max(prev - 1, 0) : prev + 1;
          if (onTimeUpdate) onTimeUpdate(next);
          if (mode === 'COUNTDOWN' && next === 0) {
            setIsRunning(false);
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, mode, onTimeUpdate]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className="p-2.5 border border-neon-cyan/40 bg-[#021814]/80 text-neon-cyan font-mono my-2 flex flex-wrap items-center justify-between gap-2 shadow-[0_0_10px_rgba(30,220,224,0.15)]">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-[16px] text-neon-cyan animate-pulse">timer</span>
        <span className="text-[10px] font-black tracking-widest text-neon-cyan/80">[{label}]</span>
        <span className="text-sm md:text-base font-black tracking-widest font-mono text-neon-cyan bg-[#020d04] px-2 py-0.5 border border-neon-cyan/50 shadow-inner">
          {formatted}
        </span>
      </div>

      <div className="flex items-center gap-1 text-[10px]">
        <button
          type="button"
          onClick={() => setIsRunning(!isRunning)}
          className={`px-2 py-0.5 border font-bold transition-all cursor-pointer ${
            isRunning
              ? 'bg-[#ff0033]/20 border-[#ff0033] text-[#ff4d6d] animate-pulse'
              : 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-[#020d04]'
          }`}
        >
          {isRunning ? '[ PAUSE ]' : '[ START ]'}
        </button>

        <button
          type="button"
          onClick={() => {
            setIsRunning(false);
            setSeconds(initialSeconds);
            if (onTimeUpdate) onTimeUpdate(initialSeconds);
          }}
          className="px-2 py-0.5 border border-neon-cyan/40 bg-transparent text-neon-cyan/80 hover:bg-neon-cyan/20 font-bold cursor-pointer"
        >
          [ RESET ]
        </button>

        {mode === 'COUNTDOWN' && (
          <>
            <button
              type="button"
              onClick={() => {
                setSeconds(300);
                if (onTimeUpdate) onTimeUpdate(300);
              }}
              className="px-1.5 py-0.5 border border-neon-cyan/30 text-[9px] hover:bg-neon-cyan/20 cursor-pointer"
            >
              5M
            </button>
            <button
              type="button"
              onClick={() => {
                setSeconds(1500);
                if (onTimeUpdate) onTimeUpdate(1500);
              }}
              className="px-1.5 py-0.5 border border-neon-cyan/30 text-[9px] hover:bg-neon-cyan/20 cursor-pointer"
            >
              25M
            </button>
            <button
              type="button"
              onClick={() => {
                setSeconds(3000);
                if (onTimeUpdate) onTimeUpdate(3000);
              }}
              className="px-1.5 py-0.5 border border-neon-cyan/30 text-[9px] hover:bg-neon-cyan/20 cursor-pointer"
            >
              50M
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// =============================================================
// 1. CYBER_OPS FORMS
// =============================================================

function AIExperimentForm({ onSubmit }: { onSubmit: (data: AIExperimentPayload) => void }) {
  const [subType, setSubType] = useState<AIExperimentSubType>('AI_ML_EXPERIMENTATION');

  const [mlData, setMlData] = useState({
    modelStack: '',
    experimentNotes: '',
    epochs: 0,
    loss: 0.0,
    outcomeObservation: ''
  });

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
        costDetails: trialData.isPaid ? trialData.costDetails : undefined,
        verdict: trialData.verdict,
        trialNotes: trialData.trialNotes
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      <div className="flex border-b border-neon-cyan/30 text-xs font-mono mb-4">
        <button
          type="button"
          onClick={() => setSubType('AI_ML_EXPERIMENTATION')}
          className={`flex-1 py-1.5 transition-colors cursor-pointer ${
            subType === 'AI_ML_EXPERIMENTATION'
              ? 'bg-neon-cyan/20 text-neon-cyan font-bold border-b-2 border-neon-cyan'
              : 'text-on-surface-variant hover:bg-surface-variant/20'
          }`}
        >
          [ ML_EXPERIMENT ]
        </button>
        <button
          type="button"
          onClick={() => setSubType('AI_PRODUCTS_TRIALS')}
          className={`flex-1 py-1.5 transition-colors border-l border-neon-cyan/30 cursor-pointer ${
            subType === 'AI_PRODUCTS_TRIALS'
              ? 'bg-neon-cyan/20 text-neon-cyan font-bold border-b-2 border-neon-cyan'
              : 'text-on-surface-variant hover:bg-surface-variant/20'
          }`}
        >
          [ PRODUCT_TRIAL ]
        </button>
      </div>

      {subType === 'AI_ML_EXPERIMENTATION' ? (
        <>
          <div>
            <label className="block text-neon-cyan font-label-sm mb-1">MODEL_STACK</label>
            <input
              type="text"
              value={mlData.modelStack}
              onChange={(e) => setMlData({ ...mlData, modelStack: e.target.value })}
              className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
              placeholder="e.g. PyTorch, LLaMA-3 8B, LoRA, CUDA 12.2"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-neon-cyan font-label-sm mb-1">EPOCHS</label>
              <input
                type="number"
                value={mlData.epochs}
                onChange={(e) => setMlData({ ...mlData, epochs: parseInt(e.target.value) || 0 })}
                className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
              />
            </div>
            <div>
              <label className="block text-neon-cyan font-label-sm mb-1">LOSS_METRIC</label>
              <input
                type="number"
                step="0.0001"
                value={mlData.loss}
                onChange={(e) => setMlData({ ...mlData, loss: parseFloat(e.target.value) || 0 })}
                className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-neon-cyan font-label-sm mb-1">EXPERIMENT_NOTES</label>
            <textarea
              value={mlData.experimentNotes}
              onChange={(e) => setMlData({ ...mlData, experimentNotes: e.target.value })}
              className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none h-20"
              placeholder="Hypothesis, dataset changes, learning rate schedule..."
            ></textarea>
          </div>
          <div>
            <label className="block text-neon-cyan font-label-sm mb-1">OUTCOME_OBSERVATION</label>
            <input
              type="text"
              value={mlData.outcomeObservation}
              onChange={(e) => setMlData({ ...mlData, outcomeObservation: e.target.value })}
              className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
              placeholder="e.g. Converged at step 4200 with 0.12 val loss"
            />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-neon-cyan font-label-sm mb-1">PRODUCT_NAME</label>
              <input
                type="text"
                value={trialData.productName}
                onChange={(e) => setTrialData({ ...trialData, productName: e.target.value })}
                className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
                placeholder="e.g. Cursor, Claude 3.5 Sonnet, Perplexity"
                required
              />
            </div>
            <div>
              <label className="block text-neon-cyan font-label-sm mb-1">TARGET_DEVICE</label>
              <input
                type="text"
                value={trialData.targetDevice}
                onChange={(e) => setTrialData({ ...trialData, targetDevice: e.target.value })}
                className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
                placeholder="e.g. Mac M3 Max, Linux Rig"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-neon-cyan font-label-sm mb-1">POSITIVES</label>
              <textarea
                value={trialData.positives}
                onChange={(e) => setTrialData({ ...trialData, positives: e.target.value })}
                className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none h-16"
                placeholder="Key strengths..."
              ></textarea>
            </div>
            <div>
              <label className="block text-neon-cyan font-label-sm mb-1">NEGATIVES</label>
              <textarea
                value={trialData.negatives}
                onChange={(e) => setTrialData({ ...trialData, negatives: e.target.value })}
                className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none h-16"
                placeholder="Pain points / latency..."
              ></textarea>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-neon-cyan font-label-sm mb-1">VERDICT</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTrialData({ ...trialData, verdict: 'KEEP' })}
                  className={`flex-1 py-1.5 border text-xs font-mono font-bold cursor-pointer ${
                    trialData.verdict === 'KEEP'
                      ? 'bg-[#33ff00]/20 border-[#33ff00] text-[#33ff00]'
                      : 'border-outline-variant text-outline'
                  }`}
                >
                  [ KEEP ]
                </button>
                <button
                  type="button"
                  onClick={() => setTrialData({ ...trialData, verdict: 'CAN_IT' })}
                  className={`flex-1 py-1.5 border text-xs font-mono font-bold cursor-pointer ${
                    trialData.verdict === 'CAN_IT'
                      ? 'bg-[#ff0033]/20 border-[#ff0033] text-[#ff4d6d]'
                      : 'border-outline-variant text-outline'
                  }`}
                >
                  [ CAN_IT ]
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-4">
              <input
                type="checkbox"
                id="isPaid"
                checked={trialData.isPaid}
                onChange={(e) => setTrialData({ ...trialData, isPaid: e.target.checked })}
                className="accent-neon-cyan w-4 h-4 cursor-pointer"
              />
              <label htmlFor="isPaid" className="text-neon-cyan font-mono text-xs cursor-pointer">
                PAID_SERVICE
              </label>
            </div>
          </div>
        </>
      )}

      <button
        type="submit"
        className="w-full bg-neon-cyan text-obsidian-base font-bold py-2 hover:bg-primary-container transition-colors uppercase font-mono tracking-widest mt-4 cursor-pointer shadow-[0_0_12px_rgba(30,220,224,0.3)]"
      >
        [ COMMIT AI TELEMETRY ]
      </button>
    </form>
  );
}

function FlowTelemetryForm({ onSubmit }: { onSubmit: (data: FlowTelemetryPayload) => void }) {
  const [targetModule, setTargetModule] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [flowDepth, setFlowDepth] = useState<'SURFACE' | 'MODERATE' | 'DEEP_VOID' | 'TRANSCENDENT'>('DEEP_VOID');
  const [interruptCount, setInterruptCount] = useState(0);
  const [soundtrack, setSoundtrack] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      durationMinutes,
      targetModule,
      flowDepth,
      interruptCount,
      soundtrack,
      sessionNotes
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      <MicroTimer
        mode="STOPWATCH"
        label="FLOW_STOPWATCH"
        initialSeconds={durationMinutes * 60}
        onTimeUpdate={(sec) => setDurationMinutes(Math.round(sec / 60))}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">TARGET_MODULE</label>
          <input
            type="text"
            value={targetModule}
            onChange={(e) => setTargetModule(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
            placeholder="e.g. auth-worker, rust-indexer"
            required
          />
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">DURATION (MINUTES)</label>
          <input
            type="number"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 0)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">FLOW_DEPTH</label>
        <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
          {(['SURFACE', 'MODERATE', 'DEEP_VOID', 'TRANSCENDENT'] as const).map((depth) => (
            <button
              key={depth}
              type="button"
              onClick={() => setFlowDepth(depth)}
              className={`py-1.5 border truncate text-center cursor-pointer ${
                flowDepth === depth
                  ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan font-bold shadow-[0_0_8px_var(--glow-color)]'
                  : 'border-outline-variant text-outline hover:border-neon-cyan/40'
              }`}
            >
              {depth}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">INTERRUPT_COUNT</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={interruptCount}
              onChange={(e) => setInterruptCount(parseInt(e.target.value) || 0)}
              className="flex-1 bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
            />
            <button
              type="button"
              onClick={() => setInterruptCount((prev) => prev + 1)}
              className="px-2.5 py-2 border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/20 text-xs font-mono font-bold cursor-pointer"
            >
              +1 PING
            </button>
          </div>
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">SOUNDTRACK / FREQ</label>
          <input
            type="text"
            value={soundtrack}
            onChange={(e) => setSoundtrack(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
            placeholder="e.g. Master Boot Record, 432Hz Ambient"
          />
        </div>
      </div>

      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">SESSION_NOTES</label>
        <textarea
          value={sessionNotes}
          onChange={(e) => setSessionNotes(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none h-20"
          placeholder="Code architecture breakthroughs, refactored components..."
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full bg-neon-cyan text-obsidian-base font-bold py-2 hover:bg-primary-container transition-colors uppercase font-mono tracking-widest shadow-[0_0_12px_rgba(30,220,224,0.3)] cursor-pointer"
      >
        [ COMMIT FLOW TELEMETRY ]
      </button>
    </form>
  );
}

function IncidentPostmortemForm({ onSubmit }: { onSubmit: (data: IncidentPostmortemPayload) => void }) {
  const [anomalyName, setAnomalyName] = useState('');
  const [severity, setSeverity] = useState<'LOW' | 'HAZARD' | 'SYSTEM_CRITICAL'>('HAZARD');
  const [rootCauseType, setRootCauseType] = useState<IncidentPostmortemPayload['rootCauseType']>('ASYNC_RACE');
  const [timeToFixMinutes, setTimeToFixMinutes] = useState(30);
  const [resolutionSnippet, setResolutionSnippet] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      anomalyName,
      severity,
      rootCauseType,
      resolutionSnippet,
      timeToFixMinutes
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">ANOMALY_NAME</label>
        <input
          type="text"
          value={anomalyName}
          onChange={(e) => setAnomalyName(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
          placeholder="e.g. Supabase IPv6 DNS Drop, Off-by-one in Buffer"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">SEVERITY</label>
          <div className="flex gap-1.5">
            {(['LOW', 'HAZARD', 'SYSTEM_CRITICAL'] as const).map((sev) => (
              <button
                key={sev}
                type="button"
                onClick={() => setSeverity(sev)}
                className={`flex-1 py-1.5 border text-xs font-mono font-bold truncate cursor-pointer ${
                  severity === sev
                    ? sev === 'SYSTEM_CRITICAL'
                      ? 'bg-[#ff0033]/20 border-[#ff0033] text-[#ff4d6d] animate-pulse'
                      : sev === 'HAZARD'
                      ? 'bg-[#ffb703]/20 border-[#ffb703] text-[#ffb703]'
                      : 'bg-[#33ff00]/20 border-[#33ff00] text-[#33ff00]'
                    : 'border-outline-variant text-outline'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">TIME_TO_FIX (MINUTES)</label>
          <input
            type="number"
            value={timeToFixMinutes}
            onChange={(e) => setTimeToFixMinutes(parseInt(e.target.value) || 0)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">ROOT_CAUSE_TYPE</label>
        <CustomSelect
          value={rootCauseType}
          onChange={(v) => setRootCauseType(v as any)}
          options={['LOGIC_ERROR', 'MEMORY_LEAK', 'ASYNC_RACE', 'CONFIG_DRIFT', 'DEPENDENCY']}
        />
      </div>

      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">RESOLUTION_SNIPPET & FIX</label>
        <textarea
          value={resolutionSnippet}
          onChange={(e) => setResolutionSnippet(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none h-24 font-mono text-xs"
          placeholder="Code patch, command, or architectural change that permanently resolved the fault..."
          required
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full bg-[#ff4d6d] text-obsidian-base font-bold py-2 hover:bg-[#ff0033] transition-colors uppercase font-mono tracking-widest cursor-pointer shadow-[0_0_12px_rgba(255,0,51,0.3)]"
      >
        [ COMMIT ANOMALY REPORT ]
      </button>
    </form>
  );
}

function IntelSynapseForm({ onSubmit }: { onSubmit: (data: IntelSynapsePayload) => void }) {
  const [title, setTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [applicability, setApplicability] = useState<'THEORETICAL' | 'IMMEDIATE_USE' | 'FUTURE_PROJECT'>('IMMEDIATE_USE');
  const [keyTakeaways, setKeyTakeaways] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      sourceUrl,
      applicability,
      keyTakeaways
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">RESEARCH_TITLE</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
          placeholder="e.g. Distributed Consensus in Raft, Postgres MVCC Internals"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">SOURCE_URL / CITATION</label>
          <input
            type="text"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
            placeholder="https://arxiv.org/abs/..."
          />
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">APPLICABILITY</label>
          <CustomSelect
            value={applicability}
            onChange={(v) => setApplicability(v as any)}
            options={['IMMEDIATE_USE', 'FUTURE_PROJECT', 'THEORETICAL']}
          />
        </div>
      </div>

      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">KEY_TAKEAWAYS & MENTAL_MODELS</label>
        <textarea
          value={keyTakeaways}
          onChange={(e) => setKeyTakeaways(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none h-24"
          placeholder="- Core algorithm principles&#10;- Tradeoffs observed&#10;- Actionable design patterns"
          required
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full bg-neon-cyan text-obsidian-base font-bold py-2 hover:bg-primary-container transition-colors uppercase font-mono tracking-widest shadow-[0_0_12px_rgba(30,220,224,0.3)] cursor-pointer"
      >
        [ COMMIT RESEARCH DIGEST ]
      </button>
    </form>
  );
}

function HomelabRigForm({ onSubmit }: { onSubmit: (data: HomelabRigPayload) => void }) {
  const [nodeId, setNodeId] = useState('');
  const [thermalsCelsius, setThermalsCelsius] = useState(48);
  const [powerDrawWatts, setPowerDrawWatts] = useState(120);
  const [storageDelta, setStorageDelta] = useState('');
  const [configChangeNotes, setConfigChangeNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      nodeId,
      thermalsCelsius,
      powerDrawWatts,
      storageDelta,
      configChangeNotes
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">NODE_IDENTIFIER</label>
          <input
            type="text"
            value={nodeId}
            onChange={(e) => setNodeId(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
            placeholder="e.g. NODE_M3_MAX, PROXMOX_CLUSTER_01"
            required
          />
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">THERMALS (°C)</label>
          <input
            type="number"
            value={thermalsCelsius}
            onChange={(e) => setThermalsCelsius(parseFloat(e.target.value) || 0)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">POWER_DRAW (WATTS)</label>
          <input
            type="number"
            value={powerDrawWatts}
            onChange={(e) => setPowerDrawWatts(parseFloat(e.target.value) || 0)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
          />
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">STORAGE_DELTA</label>
          <input
            type="text"
            value={storageDelta}
            onChange={(e) => setStorageDelta(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
            placeholder="e.g. +42GB (ZFS pool)"
          />
        </div>
      </div>

      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">CONFIG_CHANGES & UPGRADES</label>
        <textarea
          value={configChangeNotes}
          onChange={(e) => setConfigChangeNotes(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none h-20"
          placeholder="Docker compose updates, kernel parameter tweaks, fan curve changes..."
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full bg-neon-cyan text-obsidian-base font-bold py-2 hover:bg-primary-container transition-colors uppercase font-mono tracking-widest shadow-[0_0_12px_rgba(30,220,224,0.3)] cursor-pointer"
      >
        [ COMMIT HARDWARE TELEMETRY ]
      </button>
    </form>
  );
}

function ReleaseRadarForm({ onSubmit }: { onSubmit: (data: ReleaseRadarPayload) => void }) {
  const [versionTag, setVersionTag] = useState('');
  const [environment, setEnvironment] = useState<'STAGING' | 'PRODUCTION' | 'CLOUD_EDGE'>('PRODUCTION');
  const [gitCommitHash, setGitCommitHash] = useState('');
  const [breakingChanges, setBreakingChanges] = useState(false);
  const [deploymentOutcome, setDeploymentOutcome] = useState<'SUCCESS' | 'ROLLED_BACK' | 'DEGRADED'>('SUCCESS');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      versionTag,
      environment,
      gitCommitHash,
      breakingChanges,
      deploymentOutcome
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">VERSION_TAG</label>
          <input
            type="text"
            value={versionTag}
            onChange={(e) => setVersionTag(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
            placeholder="e.g. v2.4.0-nightly"
            required
          />
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">GIT_COMMIT_HASH</label>
          <input
            type="text"
            value={gitCommitHash}
            onChange={(e) => setGitCommitHash(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none font-mono"
            placeholder="e.g. 7f3b89a"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">ENVIRONMENT</label>
          <CustomSelect
            value={environment}
            onChange={(v) => setEnvironment(v as any)}
            options={['PRODUCTION', 'STAGING', 'CLOUD_EDGE']}
          />
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">DEPLOYMENT_OUTCOME</label>
          <div className="flex gap-1">
            {(['SUCCESS', 'DEGRADED', 'ROLLED_BACK'] as const).map((outcome) => (
              <button
                key={outcome}
                type="button"
                onClick={() => setDeploymentOutcome(outcome)}
                className={`flex-1 py-1.5 border text-xs font-mono font-bold truncate cursor-pointer ${
                  deploymentOutcome === outcome
                    ? outcome === 'SUCCESS'
                      ? 'bg-[#33ff00]/20 border-[#33ff00] text-[#33ff00]'
                      : 'bg-[#ff0033]/20 border-[#ff0033] text-[#ff4d6d]'
                    : 'border-outline-variant text-outline'
                }`}
              >
                {outcome}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input
          type="checkbox"
          id="breakingChanges"
          checked={breakingChanges}
          onChange={(e) => setBreakingChanges(e.target.checked)}
          className="accent-neon-cyan w-4 h-4 cursor-pointer"
        />
        <label htmlFor="breakingChanges" className="text-neon-cyan font-mono text-xs cursor-pointer">
          CONTAINS_BREAKING_SCHEMA_OR_API_CHANGES
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-neon-cyan text-obsidian-base font-bold py-2 hover:bg-primary-container transition-colors uppercase font-mono tracking-widest shadow-[0_0_12px_rgba(30,220,224,0.3)] cursor-pointer"
      >
        [ COMMIT RELEASE TELEMETRY ]
      </button>
    </form>
  );
}

// =============================================================
// 2. VITALS FORMS
// =============================================================

function CaffeineForm({ onSubmit }: { onSubmit: (data: CaffeineLogPayload) => void }) {
  const [beanOrigin, setBeanOrigin] = useState('');
  const [brewMethod, setBrewMethod] = useState(settings.brewMethods[0] || 'V60 Pour-Over');
  const [liked, setLiked] = useState(true);
  const [flavorProfile, setFlavorProfile] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ beanOrigin, brewMethod, liked, flavorProfile });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">BEAN_ORIGIN / ROASTER</label>
        <input
          type="text"
          value={beanOrigin}
          onChange={(e) => setBeanOrigin(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
          placeholder="e.g. Ethiopia Yirgacheffe, Blue Tokai"
          required
        />
      </div>
      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">BREW_METHOD</label>
        <CustomSelect value={brewMethod} onChange={setBrewMethod} options={settings.brewMethods} />
      </div>
      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">FLAVOR_PROFILE</label>
        <input
          type="text"
          value={flavorProfile}
          onChange={(e) => setFlavorProfile(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
          placeholder="e.g. Jasmine floral, Bergamot citrus, Dark chocolate"
        />
      </div>
      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">SATISFACTION</label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setLiked(true)}
            className={`flex-1 py-1.5 border text-xs font-mono font-bold cursor-pointer ${
              liked ? 'bg-[#33ff00]/20 border-[#33ff00] text-[#33ff00]' : 'border-outline-variant text-outline'
            }`}
          >
            [ SATISFACTORY ]
          </button>
          <button
            type="button"
            onClick={() => setLiked(false)}
            className={`flex-1 py-1.5 border text-xs font-mono font-bold cursor-pointer ${
              !liked ? 'bg-[#ff0033]/20 border-[#ff0033] text-[#ff4d6d]' : 'border-outline-variant text-outline'
            }`}
          >
            [ SUBPAR ]
          </button>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-[#ffb703] text-obsidian-base font-bold py-2 hover:bg-amber-400 transition-colors uppercase font-mono tracking-widest shadow-[0_0_12px_rgba(255,183,3,0.3)] cursor-pointer"
      >
        [ COMMIT STIMULANT LOG ]
      </button>
    </form>
  );
}

function ActivityForm({ onSubmit }: { onSubmit: (data: ActivityLogPayload) => void }) {
  const [activitySubType, setActivitySubType] = useState<ActivitySubType>('WALK_RUN');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [avgHeartRate, setAvgHeartRate] = useState(135);
  const [activeKcals, setActiveKcals] = useState(250);
  const [routeLocation, setRouteLocation] = useState('');
  const [stairsClimbed, setStairsClimbed] = useState(20);
  const [bodyWeightKg, setBodyWeightKg] = useState(72.5);
  const [postMoodState, setPostMoodState] = useState(settings.postMoodStates[1] || 'Centered');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      activitySubType,
      durationMinutes,
      avgHeartRate,
      activeKcals,
      routeLocation,
      stairsClimbed: activitySubType === 'STAIRS' ? stairsClimbed : undefined,
      bodyWeightKg: activitySubType === 'WEIGHT' ? bodyWeightKg : undefined,
      postMoodState
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      <div className="flex border-b border-neon-cyan/30 text-xs font-mono mb-4">
        {(['WALK_RUN', 'STAIRS', 'WEIGHT', 'CORE'] as const).map((sub) => (
          <button
            key={sub}
            type="button"
            onClick={() => setActivitySubType(sub)}
            className={`flex-1 py-1.5 transition-colors cursor-pointer ${
              activitySubType === sub
                ? 'bg-[#33ff00]/20 text-[#33ff00] font-bold border-b-2 border-[#33ff00]'
                : 'text-on-surface-variant hover:bg-surface-variant/20'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">DURATION (MIN)</label>
          <input
            type="number"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 0)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">AVG_BPM</label>
          <input
            type="number"
            value={avgHeartRate}
            onChange={(e) => setAvgHeartRate(parseInt(e.target.value) || 0)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
          />
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">KCALS</label>
          <input
            type="number"
            value={activeKcals}
            onChange={(e) => setActiveKcals(parseInt(e.target.value) || 0)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
          />
        </div>
      </div>

      {activitySubType === 'WALK_RUN' && (
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">ROUTE / TRAIL</label>
          <input
            type="text"
            value={routeLocation}
            onChange={(e) => setRouteLocation(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
            placeholder="e.g. Waterfront Promenade, Outer Rim Circuit"
          />
        </div>
      )}

      {activitySubType === 'STAIRS' && (
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">FLIGHTS / FLOORS CLIMBED</label>
          <input
            type="number"
            value={stairsClimbed}
            onChange={(e) => setStairsClimbed(parseInt(e.target.value) || 0)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
          />
        </div>
      )}

      {activitySubType === 'WEIGHT' && (
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">BODY_MASS (KG)</label>
          <input
            type="number"
            step="0.1"
            value={bodyWeightKg}
            onChange={(e) => setBodyWeightKg(parseFloat(e.target.value) || 0)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
          />
        </div>
      )}

      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">POST_SESSION_MOOD</label>
        <CustomSelect value={postMoodState} onChange={setPostMoodState} options={settings.postMoodStates} />
      </div>

      <button
        type="submit"
        className="w-full bg-[#33ff00] text-obsidian-base font-bold py-2 hover:bg-green-400 transition-colors uppercase font-mono tracking-widest shadow-[0_0_12px_rgba(51,255,0,0.3)] cursor-pointer"
      >
        [ COMMIT BIOMETRIC DISPATCH ]
      </button>
    </form>
  );
}

function HibernationLogForm({ onSubmit }: { onSubmit: (data: HibernationLogPayload) => void }) {
  const [lightsOutTime, setLightsOutTime] = useState('02:30');
  const [wakeTime, setWakeTime] = useState('09:15');
  const [sleepQualityScore, setSleepQualityScore] = useState(8);
  const [sleepDebtHours, setSleepDebtHours] = useState(1.5);
  const [morningClarity, setMorningClarity] = useState<'GROGGY' | 'FUNCTIONAL' | 'HYPER_ALERT'>('FUNCTIONAL');
  const [dreamFragments, setDreamFragments] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      lightsOutTime,
      wakeTime,
      sleepQualityScore,
      sleepDebtHours,
      morningClarity,
      dreamFragments
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">LIGHTS_OUT (BEDTIME)</label>
          <input
            type="time"
            value={lightsOutTime}
            onChange={(e) => setLightsOutTime(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">WAKE_TIME</label>
          <input
            type="time"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">
            SLEEP_QUALITY: <span className="text-[#33ff00] font-bold font-mono">{sleepQualityScore}/10</span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={sleepQualityScore}
            onChange={(e) => setSleepQualityScore(parseInt(e.target.value))}
            className="w-full accent-[#33ff00] cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">SLEEP_DEBT (HOURS)</label>
          <input
            type="number"
            step="0.5"
            value={sleepDebtHours}
            onChange={(e) => setSleepDebtHours(parseFloat(e.target.value) || 0)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">MORNING_CLARITY</label>
        <div className="flex gap-2">
          {(['GROGGY', 'FUNCTIONAL', 'HYPER_ALERT'] as const).map((clarity) => (
            <button
              key={clarity}
              type="button"
              onClick={() => setMorningClarity(clarity)}
              className={`flex-1 py-1.5 border text-xs font-mono font-bold cursor-pointer ${
                morningClarity === clarity
                  ? 'bg-[#33ff00]/20 border-[#33ff00] text-[#33ff00]'
                  : 'border-outline-variant text-outline'
              }`}
            >
              {clarity}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">DREAM_FRAGMENTS & REM RECALL</label>
        <textarea
          value={dreamFragments}
          onChange={(e) => setDreamFragments(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none h-16"
          placeholder="Fragmented memories from the sub-space REM void..."
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full bg-[#33ff00] text-obsidian-base font-bold py-2 hover:bg-green-400 transition-colors uppercase font-mono tracking-widest shadow-[0_0_12px_rgba(51,255,0,0.3)] cursor-pointer"
      >
        [ COMMIT SLEEP TELEMETRY ]
      </button>
    </form>
  );
}

function ChemStackForm({ onSubmit }: { onSubmit: (data: ChemStackPayload) => void }) {
  const [intakeType, setIntakeType] = useState('L_THEANINE');
  const [dosage, setDosage] = useState('200mg');
  const [energyDelta, setEnergyDelta] = useState(1);
  const [timeAdministered, setTimeAdministered] = useState(new Date().toLocaleTimeString().slice(0, 5));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      intakeType,
      dosage,
      energyDelta,
      timeAdministered
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">INTAKE_TYPE</label>
          <CustomSelect
            value={intakeType}
            onChange={setIntakeType}
            options={['L_THEANINE', 'ELECTROLYTES', 'MAGNESIUM_GLYCINATE', 'ALPHA_GPC', 'CREATINE', 'YERBA_MATE', 'ASHWAGANDHA']}
          />
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">DOSAGE</label>
          <input
            type="text"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
            placeholder="e.g. 400mg + 500ml H2O"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">TIME_ADMINISTERED</label>
          <input
            type="text"
            value={timeAdministered}
            onChange={(e) => setTimeAdministered(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
          />
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">ENERGY_DELTA</label>
          <div className="flex gap-1">
            {[
              { val: -1, label: '-1 (DROWSY)' },
              { val: 0, label: '0 (STEADY)' },
              { val: 1, label: '+1 (FOCUSED)' },
              { val: 2, label: '+2 (TURBO)' }
            ].map((delta) => (
              <button
                key={delta.val}
                type="button"
                onClick={() => setEnergyDelta(delta.val)}
                className={`flex-1 py-1.5 border text-[10px] font-mono font-bold truncate cursor-pointer ${
                  energyDelta === delta.val
                    ? 'bg-[#33ff00]/20 border-[#33ff00] text-[#33ff00]'
                    : 'border-outline-variant text-outline'
                }`}
              >
                {delta.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#33ff00] text-obsidian-base font-bold py-2 hover:bg-green-400 transition-colors uppercase font-mono tracking-widest shadow-[0_0_12px_rgba(51,255,0,0.3)] cursor-pointer"
      >
        [ COMMIT CHEM STACK ]
      </button>
    </form>
  );
}

function RationIntelForm({ onSubmit }: { onSubmit: (data: RationIntelPayload) => void }) {
  const [mealType, setMealType] = useState<RationIntelPayload['mealType']>('EVENING_FUEL');
  const [fastingWindowHours, setFastingWindowHours] = useState(16);
  const [cleanlinessRating, setCleanlinessRating] = useState<RationIntelPayload['cleanlinessRating']>('WHOLE_FOODS');
  const [digestiveEnergy, setDigestiveEnergy] = useState<RationIntelPayload['digestiveEnergy']>('LIGHT_ENERGETIC');
  const [foodDescription, setFoodDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      mealType,
      fastingWindowHours,
      cleanlinessRating,
      digestiveEnergy,
      foodDescription
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">MEAL_PHASE</label>
          <CustomSelect
            value={mealType}
            onChange={(v) => setMealType(v as any)}
            options={['FAST_BREAKER', 'NOON_RATION', 'EVENING_FUEL', 'LATE_NIGHT_SNACK']}
          />
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">FASTING_WINDOW (HRS)</label>
          <input
            type="number"
            value={fastingWindowHours}
            onChange={(e) => setFastingWindowHours(parseInt(e.target.value) || 0)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">FOOD_DESCRIPTION & INGREDIENTS</label>
        <textarea
          value={foodDescription}
          onChange={(e) => setFoodDescription(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none h-16"
          placeholder="e.g. Wild salmon, organic avocados, sweet potatoes, bone broth"
          required
        ></textarea>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">CLEANLINESS_TIER</label>
          <CustomSelect
            value={cleanlinessRating}
            onChange={(v) => setCleanlinessRating(v as any)}
            options={['WHOLE_FOODS', 'BALANCED', 'HYPER_PROCESSED_SPLURGE']}
          />
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">POST_MEAL_ENERGY</label>
          <CustomSelect
            value={digestiveEnergy}
            onChange={(v) => setDigestiveEnergy(v as any)}
            options={['LIGHT_ENERGETIC', 'SATISFIED', 'HEAVY_SLUGGISH']}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#33ff00] text-obsidian-base font-bold py-2 hover:bg-green-400 transition-colors uppercase font-mono tracking-widest shadow-[0_0_12px_rgba(51,255,0,0.3)] cursor-pointer"
      >
        [ COMMIT NUTRITION LOG ]
      </button>
    </form>
  );
}

function MoodSpectrumForm({ onSubmit }: { onSubmit: (data: MoodSpectrumPayload) => void }) {
  const [moodScore, setMoodScore] = useState(8);
  const [stressLevel, setStressLevel] = useState<MoodSpectrumPayload['stressLevel']>('LOW');
  const [primaryTrigger, setPrimaryTrigger] = useState('WORK');
  const [stoicGratitude, setStoicGratitude] = useState('');
  const [mindsetNotes, setMindsetNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      moodScore,
      stressLevel,
      primaryTrigger,
      stoicGratitude,
      mindsetNotes
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">
          PSYCHE_CLARITY_RATING: <span className="text-[#33ff00] font-bold font-mono">{moodScore}/10</span>
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={moodScore}
          onChange={(e) => setMoodScore(parseInt(e.target.value))}
          className="w-full accent-[#33ff00] cursor-pointer"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">STRESS_LEVEL</label>
          <div className="flex gap-1">
            {(['LOW', 'MODERATE', 'ELEVATED', 'PEAK_ANXIETY'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setStressLevel(lvl)}
                className={`flex-1 py-1.5 border text-[9px] font-mono font-bold truncate cursor-pointer ${
                  stressLevel === lvl
                    ? 'bg-[#33ff00]/20 border-[#33ff00] text-[#33ff00]'
                    : 'border-outline-variant text-outline'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">PRIMARY_TRIGGER</label>
          <CustomSelect
            value={primaryTrigger}
            onChange={setPrimaryTrigger}
            options={['WORK', 'HEALTH', 'SOLITUDE', 'SOCIAL', 'WEATHER', 'SLEEP_DEFICIT']}
          />
        </div>
      </div>

      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">STOIC_GRATITUDE (1-2 ANCHORS)</label>
        <input
          type="text"
          value={stoicGratitude}
          onChange={(e) => setStoicGratitude(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
          placeholder="e.g. Quiet midnight hours, hot coffee, working hands"
        />
      </div>

      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">MINDSET_JOURNAL</label>
        <textarea
          value={mindsetNotes}
          onChange={(e) => setMindsetNotes(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none h-16"
          placeholder="Reflections on internal state and equanimity..."
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full bg-[#33ff00] text-obsidian-base font-bold py-2 hover:bg-green-400 transition-colors uppercase font-mono tracking-widest shadow-[0_0_12px_rgba(51,255,0,0.3)] cursor-pointer"
      >
        [ COMMIT PSYCHE LOG ]
      </button>
    </form>
  );
}

function StillnessIntervalForm({ onSubmit }: { onSubmit: (data: StillnessIntervalPayload) => void }) {
  const [practiceType, setPracticeType] = useState<StillnessIntervalPayload['practiceType']>('BOX_BREATHING');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [mentalChatterBefore, setMentalChatterBefore] = useState<'CHAOTIC' | 'ACTIVE' | 'CALM'>('ACTIVE');
  const [mentalChatterAfter, setMentalChatterAfter] = useState<'STILL_VOID' | 'CENTERED' | 'RESTORED'>('CENTERED');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      practiceType,
      durationMinutes,
      mentalChatterBefore,
      mentalChatterAfter
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      <MicroTimer
        mode="COUNTDOWN"
        label="ZEN_COUNTDOWN"
        initialSeconds={durationMinutes * 60}
        onTimeUpdate={(sec) => setDurationMinutes(Math.max(1, Math.round(sec / 60)))}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">PRACTICE_TYPE</label>
          <CustomSelect
            value={practiceType}
            onChange={(v) => setPracticeType(v as any)}
            options={['BOX_BREATHING', 'SILENT_ZAZEN', 'GUIDED_AUDIO', 'NATURE_WALK']}
          />
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">DURATION (MINUTES)</label>
          <input
            type="number"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 0)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">CHATTER_BEFORE</label>
          <CustomSelect
            value={mentalChatterBefore}
            onChange={(v) => setMentalChatterBefore(v as any)}
            options={['CHAOTIC', 'ACTIVE', 'CALM']}
          />
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">CHATTER_AFTER</label>
          <CustomSelect
            value={mentalChatterAfter}
            onChange={(v) => setMentalChatterAfter(v as any)}
            options={['STILL_VOID', 'CENTERED', 'RESTORED']}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#80ed99] text-obsidian-base font-bold py-2 hover:bg-[#57cc99] transition-colors uppercase font-mono tracking-widest shadow-[0_0_12px_rgba(128,237,153,0.3)] cursor-pointer"
      >
        [ COMMIT ZEN DISPATCH ]
      </button>
    </form>
  );
}

// =============================================================
// 3. PRODUCTIVITY FORMS
// =============================================================

function DutyRosterForm({ onSubmit }: { onSubmit: (data: DutyRosterPayload) => void }) {
  const [taskDescription, setTaskDescription] = useState('');
  const [status, setStatus] = useState(settings.dutyStatuses[0] || 'PENDING');
  const [priority, setPriority] = useState(settings.dutyPriorities[1] || 'MEDIUM');
  const [assignedOfficer, setAssignedOfficer] = useState('');
  const [deadlineEst, setDeadlineEst] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ taskDescription, status, priority, assignedOfficer, deadlineEst });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">TASK_DESCRIPTION</label>
        <textarea
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none h-20"
          placeholder="Mission directive details..."
          required
        ></textarea>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">STATUS</label>
          <CustomSelect value={status} onChange={setStatus} options={settings.dutyStatuses} />
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">PRIORITY</label>
          <CustomSelect value={priority} onChange={setPriority} options={settings.dutyPriorities} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">ASSIGNED_OFFICER</label>
          <input
            type="text"
            value={assignedOfficer}
            onChange={(e) => setAssignedOfficer(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
            placeholder="e.g. Officer Daak, Unit 09"
          />
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">DEADLINE_EST</label>
          <input
            type="text"
            value={deadlineEst}
            onChange={(e) => setDeadlineEst(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
            placeholder="e.g. 04:00 UTC, +2h"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#ffb703] text-obsidian-base font-bold py-2 hover:bg-amber-400 transition-colors uppercase font-mono tracking-widest shadow-[0_0_12px_rgba(255,183,3,0.3)] cursor-pointer"
      >
        [ COMMIT DUTY ROSTER ]
      </button>
    </form>
  );
}

function ChronoSprintForm({ onSubmit }: { onSubmit: (data: ChronoSprintPayload) => void }) {
  const [taskObjective, setTaskObjective] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [distractionPings, setDistractionPings] = useState(0);
  const [items, setItems] = useState<string[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [status, setStatus] = useState<'COMPLETED' | 'EXTENDED' | 'ABORTED'>('COMPLETED');

  const addItem = () => {
    if (newItemText.trim()) {
      setItems([...items, newItemText.trim()]);
      setNewItemText('');
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      taskObjective,
      durationMinutes,
      completedItems: items,
      distractionPings,
      status
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      <MicroTimer
        mode="COUNTDOWN"
        label="POMODORO_INTERVAL"
        initialSeconds={durationMinutes * 60}
        onTimeUpdate={(sec) => setDurationMinutes(Math.max(1, Math.round(sec / 60)))}
      />

      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">TASK_OBJECTIVE</label>
        <input
          type="text"
          value={taskObjective}
          onChange={(e) => setTaskObjective(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
          placeholder="e.g. Write migration script for user preferences"
          required
        />
      </div>

      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">COMPLETED_MICRO_ITEMS</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addItem();
              }
            }}
            placeholder="Add sub-task completed..."
            className="flex-1 bg-surface-container-high border border-outline-variant p-1.5 text-xs text-on-surface focus:border-neon-cyan outline-none"
          />
          <button
            type="button"
            onClick={addItem}
            className="px-3 py-1 bg-neon-cyan/20 border border-neon-cyan text-neon-cyan font-mono text-xs font-bold hover:bg-neon-cyan hover:text-[#020d04] cursor-pointer"
          >
            + ADD
          </button>
        </div>

        <div className="space-y-1 max-h-32 overflow-y-auto">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center bg-[#021814] p-1.5 border border-neon-cyan/30 text-xs font-mono"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-[#33ff00] font-bold">✓</span>
                <span className="truncate">{item}</span>
              </div>
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="text-[#ff4d6d] hover:text-[#ff0033] px-1 font-bold cursor-pointer"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">DISTRACTIONS_RESISTED</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={distractionPings}
              onChange={(e) => setDistractionPings(parseInt(e.target.value) || 0)}
              className="flex-1 bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
            />
            <button
              type="button"
              onClick={() => setDistractionPings((prev) => prev + 1)}
              className="px-2.5 py-2 border border-[#ffb703] text-[#ffb703] hover:bg-[#ffb703]/20 text-xs font-mono font-bold cursor-pointer"
            >
              +1 URGE
            </button>
          </div>
        </div>

        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">OUTCOME_STATUS</label>
          <CustomSelect
            value={status}
            onChange={(v) => setStatus(v as any)}
            options={['COMPLETED', 'EXTENDED', 'ABORTED']}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#ffb703] text-obsidian-base font-bold py-2 hover:bg-amber-400 transition-colors uppercase font-mono tracking-widest shadow-[0_0_12px_rgba(255,183,3,0.3)] cursor-pointer"
      >
        [ COMMIT CHRONO SPRINT ]
      </button>
    </form>
  );
}

function DailyFrogForm({ onSubmit }: { onSubmit: (data: DailyFrogPayload) => void }) {
  const [targetChallenge, setTargetChallenge] = useState('');
  const [resistanceLevel, setResistanceLevel] = useState(4);
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);
  const [actualMinutes, setActualMinutes] = useState(35);
  const [victoryOutcome, setVictoryOutcome] = useState<DailyFrogPayload['victoryOutcome']>('SLAYED_COMPLETELY');
  const [reliefScore, setReliefScore] = useState(9);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      targetChallenge,
      resistanceLevel,
      estimatedMinutes,
      actualMinutes,
      victoryOutcome,
      reliefScore
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">DAUNTING_CHALLENGE (EAT THE FROG)</label>
        <input
          type="text"
          value={targetChallenge}
          onChange={(e) => setTargetChallenge(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
          placeholder="e.g. Call accountant, refactor legacy auth state machine"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">
            PSYCHOLOGICAL_RESISTANCE: <span className="text-[#ff9e00] font-bold font-mono">{resistanceLevel}/5</span>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={resistanceLevel}
            onChange={(e) => setResistanceLevel(parseInt(e.target.value))}
            className="w-full accent-[#ff9e00] cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">
            DOPAMINE_RELIEF: <span className="text-[#33ff00] font-bold font-mono">{reliefScore}/10</span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={reliefScore}
            onChange={(e) => setReliefScore(parseInt(e.target.value))}
            className="w-full accent-[#33ff00] cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">ESTIMATED_MINUTES</label>
          <input
            type="number"
            value={estimatedMinutes}
            onChange={(e) => setEstimatedMinutes(parseInt(e.target.value) || 0)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
          />
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">ACTUAL_MINUTES</label>
          <input
            type="number"
            value={actualMinutes}
            onChange={(e) => setActualMinutes(parseInt(e.target.value) || 0)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">VICTORY_OUTCOME</label>
        <div className="flex gap-2">
          {(['SLAYED_COMPLETELY', 'PARTIALLY_CHIPPED', 'RESCHEDULED'] as const).map((outcome) => (
            <button
              key={outcome}
              type="button"
              onClick={() => setVictoryOutcome(outcome)}
              className={`flex-1 py-1.5 border text-xs font-mono font-bold truncate cursor-pointer ${
                victoryOutcome === outcome
                  ? 'bg-[#ff9e00]/20 border-[#ff9e00] text-[#ff9e00]'
                  : 'border-outline-variant text-outline'
              }`}
            >
              {outcome}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#ff9e00] text-obsidian-base font-bold py-2 hover:bg-orange-400 transition-colors uppercase font-mono tracking-widest shadow-[0_0_12px_rgba(255,158,0,0.3)] cursor-pointer"
      >
        [ COMMIT FROG ELIMINATION ]
      </button>
    </form>
  );
}

function QuadrantMatrixForm({ onSubmit }: { onSubmit: (data: QuadrantMatrixPayload) => void }) {
  const [taskName, setTaskName] = useState('');
  const [quadrant, setQuadrant] = useState<QuadrantMatrixPayload['quadrant']>('Q1_FIRE');
  const [deadline, setDeadline] = useState('');
  const [executionStatus, setExecutionStatus] = useState<QuadrantMatrixPayload['executionStatus']>('ACTIVE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      taskName,
      quadrant,
      deadline,
      executionStatus
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">TASK_NAME</label>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
          placeholder="Task title..."
          required
        />
      </div>

      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">EISENHOWER_QUADRANT</label>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          {[
            { id: 'Q1_FIRE', label: 'Q1: URGENT + IMPORTANT', desc: 'Do First (Firefighting)', color: 'border-[#ff0033] text-[#ff4d6d]' },
            { id: 'Q2_STRATEGY', label: 'Q2: NOT URGENT + IMPORTANT', desc: 'Schedule (Deep Strategy)', color: 'border-neon-cyan text-neon-cyan' },
            { id: 'Q3_NOISE', label: 'Q3: URGENT + NOT IMPORTANT', desc: 'Delegate (Noise/Pings)', color: 'border-[#ffb703] text-[#ffb703]' },
            { id: 'Q4_WASTE', label: 'Q4: NOT URGENT + NOT IMPORTANT', desc: 'Eliminate (Purge)', color: 'border-outline text-outline' }
          ].map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setQuadrant(q.id as any)}
              className={`p-2 border text-left flex flex-col gap-0.5 transition-all cursor-pointer ${
                quadrant === q.id
                  ? `${q.color} bg-surface-container-high/80 font-bold shadow-sm scale-[1.02]`
                  : 'border-outline-variant/60 text-outline hover:border-outline'
              }`}
            >
              <span className="font-bold">{q.label}</span>
              <span className="text-[10px] opacity-75">{q.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">DEADLINE / TARGET</label>
          <input
            type="text"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
            placeholder="e.g. Today 18:00, Tomorrow"
          />
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">EXECUTION_STATUS</label>
          <CustomSelect
            value={executionStatus}
            onChange={(v) => setExecutionStatus(v as any)}
            options={['ACTIVE', 'PENDING', 'ARCHIVED']}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#ffb703] text-obsidian-base font-bold py-2 hover:bg-amber-400 transition-colors uppercase font-mono tracking-widest shadow-[0_0_12px_rgba(255,183,3,0.3)] cursor-pointer"
      >
        [ COMMIT QUADRANT ITEM ]
      </button>
    </form>
  );
}

function BlockedQueueForm({ onSubmit }: { onSubmit: (data: BlockedQueuePayload) => void }) {
  const [taskSubject, setTaskSubject] = useState('');
  const [waitingOnPerson, setWaitingOnPerson] = useState('');
  const [blockerType, setBlockerType] = useState('CODE_REVIEW');
  const [stalledSince, setStalledSince] = useState(new Date().toLocaleDateString());
  const [nextPingDate, setNextPingDate] = useState('Tomorrow 10:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      taskSubject,
      waitingOnPerson,
      blockerType,
      stalledSince,
      nextPingDate
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">TASK_ON_HOLD</label>
        <input
          type="text"
          value={taskSubject}
          onChange={(e) => setTaskSubject(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
          placeholder="e.g. Production deploy waiting on client approval"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">WAITING_ON_ENTITY / PERSON</label>
          <input
            type="text"
            value={waitingOnPerson}
            onChange={(e) => setWaitingOnPerson(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
            placeholder="e.g. Lead Architect, Bank Auth"
            required
          />
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">BLOCKER_TYPE</label>
          <CustomSelect
            value={blockerType}
            onChange={setBlockerType}
            options={['CODE_REVIEW', 'EMAIL_REPLY', 'PACKAGE_DELIVERY', 'SIGN_OFF', 'API_KEY_PROVISION']}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">STALLED_SINCE</label>
          <input
            type="text"
            value={stalledSince}
            onChange={(e) => setStalledSince(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
          />
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">NEXT_FOLLOW_UP_PING</label>
          <input
            type="text"
            value={nextPingDate}
            onChange={(e) => setNextPingDate(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
            placeholder="e.g. 2026-08-23 11:00"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#ffb703] text-obsidian-base font-bold py-2 hover:bg-amber-400 transition-colors uppercase font-mono tracking-widest shadow-[0_0_12px_rgba(255,183,3,0.3)] cursor-pointer"
      >
        [ COMMIT BLOCKED QUEUE ]
      </button>
    </form>
  );
}

function InterstitialJotForm({ onSubmit }: { onSubmit: (data: InterstitialJotPayload) => void }) {
  const [justFinished, setJustFinished] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [energyLevel, setEnergyLevel] = useState<'HIGH' | 'STEADY' | 'DEPLETED'>('STEADY');
  const [transitionFriction, setTransitionFriction] = useState<'SMOOTH' | 'SLUGGISH'>('SMOOTH');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      justFinished,
      nextAction,
      energyLevel,
      transitionFriction
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">JUST_FINISHED (1 LINE)</label>
        <input
          type="text"
          value={justFinished}
          onChange={(e) => setJustFinished(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
          placeholder="e.g. Exported telemetry charts and updated docs"
          required
        />
      </div>

      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">NEXT_IMMEDIATE_ACTION</label>
        <input
          type="text"
          value={nextAction}
          onChange={(e) => setNextAction(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
          placeholder="e.g. Open terminal and run database migrations"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">ENERGY_LEVEL</label>
          <div className="flex gap-1">
            {(['HIGH', 'STEADY', 'DEPLETED'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setEnergyLevel(lvl)}
                className={`flex-1 py-1.5 border text-xs font-mono font-bold cursor-pointer ${
                  energyLevel === lvl
                    ? 'bg-[#33ff00]/20 border-[#33ff00] text-[#33ff00]'
                    : 'border-outline-variant text-outline'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">TRANSITION_FRICTION</label>
          <div className="flex gap-1">
            {(['SMOOTH', 'SLUGGISH'] as const).map((fric) => (
              <button
                key={fric}
                type="button"
                onClick={() => setTransitionFriction(fric)}
                className={`flex-1 py-1.5 border text-xs font-mono font-bold cursor-pointer ${
                  transitionFriction === fric
                    ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan'
                    : 'border-outline-variant text-outline'
                }`}
              >
                {fric}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#ffb703] text-obsidian-base font-bold py-2 hover:bg-amber-400 transition-colors uppercase font-mono tracking-widest shadow-[0_0_12px_rgba(255,183,3,0.3)] cursor-pointer"
      >
        [ COMMIT TRANSITION JOT ]
      </button>
    </form>
  );
}

function DawnDuskStandupForm({ onSubmit }: { onSubmit: (data: DawnDuskStandupPayload) => void }) {
  const [cyclePhase, setCyclePhase] = useState<'DAWN_INTENTIONS' | 'DUSK_DEBRIEF'>('DAWN_INTENTIONS');
  const [obj1, setObj1] = useState('');
  const [obj2, setObj2] = useState('');
  const [obj3, setObj3] = useState('');
  const [hazards, setHazards] = useState('');
  const [accomplishmentsText, setAccomplishmentsText] = useState('');
  const [rolloverText, setRolloverText] = useState('');
  const [dailyGrade, setDailyGrade] = useState<'MISSION_ACCOMPLISHED' | 'ACCEPTABLE' | 'LOST_TO_VOID'>('MISSION_ACCOMPLISHED');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cyclePhase === 'DAWN_INTENTIONS') {
      const top3 = [obj1, obj2, obj3].filter(Boolean);
      onSubmit({
        cyclePhase: 'DAWN_INTENTIONS',
        top3Objectives: top3,
        potentialHazards: hazards
      });
    } else {
      const acc = accomplishmentsText.split('\n').filter(Boolean);
      const roll = rolloverText.split('\n').filter(Boolean);
      onSubmit({
        cyclePhase: 'DUSK_DEBRIEF',
        accomplishments: acc,
        unresolvedRollover: roll,
        dailyGrade
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      <div className="flex border-b border-neon-cyan/30 text-xs font-mono mb-4">
        <button
          type="button"
          onClick={() => setCyclePhase('DAWN_INTENTIONS')}
          className={`flex-1 py-1.5 transition-colors cursor-pointer ${
            cyclePhase === 'DAWN_INTENTIONS'
              ? 'bg-[#ffb703]/20 text-[#ffb703] font-bold border-b-2 border-[#ffb703]'
              : 'text-on-surface-variant hover:bg-surface-variant/20'
          }`}
        >
          [ DAWN_INTENTIONS ]
        </button>
        <button
          type="button"
          onClick={() => setCyclePhase('DUSK_DEBRIEF')}
          className={`flex-1 py-1.5 transition-colors border-l border-neon-cyan/30 cursor-pointer ${
            cyclePhase === 'DUSK_DEBRIEF'
              ? 'bg-[#ffb703]/20 text-[#ffb703] font-bold border-b-2 border-[#ffb703]'
              : 'text-on-surface-variant hover:bg-surface-variant/20'
          }`}
        >
          [ DUSK_DEBRIEF ]
        </button>
      </div>

      {cyclePhase === 'DAWN_INTENTIONS' ? (
        <>
          <label className="block text-neon-cyan font-label-sm">TOP 3 OBJECTIVES FOR TODAY</label>
          <input
            type="text"
            value={obj1}
            onChange={(e) => setObj1(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none text-xs"
            placeholder="1. Primary mission..."
            required
          />
          <input
            type="text"
            value={obj2}
            onChange={(e) => setObj2(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none text-xs"
            placeholder="2. Secondary mission..."
          />
          <input
            type="text"
            value={obj3}
            onChange={(e) => setObj3(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none text-xs"
            placeholder="3. Tertiary maintenance..."
          />

          <div>
            <label className="block text-neon-cyan font-label-sm mb-1">POTENTIAL_HAZARDS & PITFALLS</label>
            <input
              type="text"
              value={hazards}
              onChange={(e) => setHazards(e.target.value)}
              className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none text-xs"
              placeholder="e.g. Unscheduled meetings, context switching"
            />
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="block text-neon-cyan font-label-sm mb-1">ACCOMPLISHMENTS (1 PER LINE)</label>
            <textarea
              value={accomplishmentsText}
              onChange={(e) => setAccomplishmentsText(e.target.value)}
              className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none h-16 text-xs"
              placeholder="What actually shipped today..."
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-neon-cyan font-label-sm mb-1">UNRESOLVED ROLLOVER ITEMS</label>
            <textarea
              value={rolloverText}
              onChange={(e) => setRolloverText(e.target.value)}
              className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none h-16 text-xs"
              placeholder="Carried over to next solar cycle..."
            ></textarea>
          </div>

          <div>
            <label className="block text-neon-cyan font-label-sm mb-1">DAILY_GRADE</label>
            <div className="flex gap-2">
              {(['MISSION_ACCOMPLISHED', 'ACCEPTABLE', 'LOST_TO_VOID'] as const).map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => setDailyGrade(grade)}
                  className={`flex-1 py-1.5 border text-xs font-mono font-bold truncate cursor-pointer ${
                    dailyGrade === grade
                      ? 'bg-[#ffb703]/20 border-[#ffb703] text-[#ffb703]'
                      : 'border-outline-variant text-outline'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <button
        type="submit"
        className="w-full bg-[#ffb703] text-obsidian-base font-bold py-2 hover:bg-amber-400 transition-colors uppercase font-mono tracking-widest shadow-[0_0_12px_rgba(255,183,3,0.3)] cursor-pointer"
      >
        [ COMMIT SOLAR STANDUP ]
      </button>
    </form>
  );
}

function NeuralScratchpadForm({ onSubmit }: { onSubmit: (data: NeuralScratchpadPayload) => void }) {
  const [rawNote, setRawNote] = useState('');
  const [autoCategory, setAutoCategory] = useState<NeuralScratchpadPayload['autoCategory']>('IDEA_SPARK');
  const [isProcessed, setIsProcessed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      rawNote,
      autoCategory,
      isProcessed
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">SPARK_CATEGORY</label>
        <div className="grid grid-cols-4 gap-1 text-xs font-mono">
          {[
            { id: 'IDEA_SPARK', label: '💡 IDEA' },
            { id: 'ERRAND_TODO', label: '📌 TODO' },
            { id: 'BOOKMARK_LINK', label: '🔗 LINK' },
            { id: 'RANDOM_QUESTION', label: '❓ PROBE' }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setAutoCategory(cat.id as any)}
              className={`py-1.5 border truncate cursor-pointer ${
                autoCategory === cat.id
                  ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan font-bold'
                  : 'border-outline-variant text-outline'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">RAW_THOUGHT_DUMP</label>
        <textarea
          value={rawNote}
          onChange={(e) => setRawNote(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none h-28 font-mono text-xs"
          placeholder="Jot down quick unfiltered thought, code snippet, reminder, or shower idea..."
          required
        ></textarea>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isProcessed"
          checked={isProcessed}
          onChange={(e) => setIsProcessed(e.target.checked)}
          className="accent-neon-cyan w-4 h-4 cursor-pointer"
        />
        <label htmlFor="isProcessed" className="text-neon-cyan font-mono text-xs cursor-pointer">
          PROCESSED_AND_ROUTED
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-neon-cyan text-obsidian-base font-bold py-2 hover:bg-primary-container transition-colors uppercase font-mono tracking-widest shadow-[0_0_12px_rgba(30,220,224,0.3)] cursor-pointer"
      >
        [ COMMIT NEURAL SCRATCHPAD ]
      </button>
    </form>
  );
}

function FiveMinuteIgnitionForm({ onSubmit }: { onSubmit: (data: FiveMinuteIgnitionPayload) => void }) {
  const [stalledTask, setStalledTask] = useState('');
  const [didMomentumCatch, setDidMomentumCatch] = useState<'YES_KEPT_GOING' | 'NO_STOPPED_AFTER_5M'>('YES_KEPT_GOING');
  const [frictionSource, setFrictionSource] = useState<'BOREDOM' | 'CONFUSION' | 'PERFECTIONISM' | 'FATIGUE'>('PERFECTIONISM');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      stalledTask,
      didMomentumCatch,
      frictionSource
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      <MicroTimer
        mode="COUNTDOWN"
        label="5MIN_IGNITION_TIMER"
        initialSeconds={300}
      />

      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">STALLED_TASK (COMMITTING TO JUST 5 MINS)</label>
        <input
          type="text"
          value={stalledTask}
          onChange={(e) => setStalledTask(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
          placeholder="Task being resisted or delayed..."
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">PRIMARY_FRICTION_SOURCE</label>
          <CustomSelect
            value={frictionSource}
            onChange={(v) => setFrictionSource(v as any)}
            options={['PERFECTIONISM', 'CONFUSION', 'BOREDOM', 'FATIGUE']}
          />
        </div>

        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">DID_MOMENTUM_CATCH?</label>
          <div className="flex gap-1">
            {[
              { id: 'YES_KEPT_GOING', label: '🚀 YES, CONTINUED' },
              { id: 'NO_STOPPED_AFTER_5M', label: '🛑 STOPPED AT 5M' }
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setDidMomentumCatch(m.id as any)}
                className={`flex-1 py-1.5 border text-[10px] font-mono font-bold truncate cursor-pointer ${
                  didMomentumCatch === m.id
                    ? 'bg-[#ff5400]/20 border-[#ff5400] text-[#ff5400]'
                    : 'border-outline-variant text-outline'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#ff5400] text-obsidian-base font-bold py-2 hover:bg-orange-600 transition-colors uppercase font-mono tracking-widest shadow-[0_0_12px_rgba(255,84,0,0.3)] cursor-pointer"
      >
        [ COMMIT IGNITION TELEMETRY ]
      </button>
    </form>
  );
}

function DailyCadenceChecklistForm({ onSubmit }: { onSubmit: (data: DailyCadenceChecklistPayload) => void }) {
  const [routineType, setRoutineType] = useState<DailyCadenceChecklistPayload['routineType']>('MORNING_IGNITION');
  const [items, setItems] = useState<CadenceChecklistItem[]>([
    { id: '1', text: 'Zero out notifications / inbox zero', done: false },
    { id: '2', text: 'Hydrate (500ml water + electrolytes)', done: true },
    { id: '3', text: 'Review solar cycle top 3 objectives', done: false },
    { id: '4', text: 'Tidy physical workspace & terminal', done: false },
    { id: '5', text: 'Sync git commit / cloud backup', done: false }
  ]);
  const [newItemText, setNewItemText] = useState('');

  const toggleItem = (id: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  };

  const addItem = () => {
    if (newItemText.trim()) {
      setItems([...items, { id: String(Date.now()), text: newItemText.trim(), done: false }]);
      setNewItemText('');
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const completedCount = items.filter((i) => i.done).length;
  const completionRate = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      routineType,
      items,
      completionRate
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      <div className="flex justify-between items-center">
        <label className="block text-neon-cyan font-label-sm">ROUTINE_CADENCE_TYPE</label>
        <span className="text-xs font-mono font-black text-[#ffb703]">
          PROGRESS: {completedCount}/{items.length} ({completionRate}%)
        </span>
      </div>

      <div className="w-full bg-[#020d04] h-2 border border-[#ffb703]/30 overflow-hidden mb-2">
        <div
          className="bg-[#ffb703] h-full transition-all duration-300 shadow-[0_0_8px_rgba(255,183,3,0.5)]"
          style={{ width: `${completionRate}%` }}
        ></div>
      </div>

      <div className="flex gap-2">
        {(['MORNING_IGNITION', 'EVENING_SHUTDOWN', 'WORKSPACE_RESET'] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRoutineType(r)}
            className={`flex-1 py-1.5 border text-xs font-mono font-bold truncate cursor-pointer ${
              routineType === r
                ? 'bg-[#ffb703]/20 border-[#ffb703] text-[#ffb703]'
                : 'border-outline-variant text-outline'
            }`}
          >
            {r.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`flex items-center justify-between p-2 border cursor-pointer font-mono text-xs transition-all ${
              item.done
                ? 'bg-[#33ff00]/10 border-[#33ff00]/40 text-[#33ff00] line-through'
                : 'bg-[#021814] border-neon-cyan/30 text-on-surface hover:border-neon-cyan'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <span className={`w-3.5 h-3.5 border flex items-center justify-center text-[10px] ${item.done ? 'border-[#33ff00] bg-[#33ff00]/20' : 'border-outline'}`}>
                {item.done ? '✓' : ''}
              </span>
              <span className="truncate">{item.text}</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeItem(item.id);
              }}
              className="text-[#ff4d6d] hover:text-[#ff0033] ml-2 text-xs font-bold cursor-pointer"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addItem();
            }
          }}
          placeholder="Add custom cadence checklist ritual..."
          className="flex-1 bg-surface-container-high border border-outline-variant p-2 text-xs text-on-surface focus:border-neon-cyan outline-none"
        />
        <button
          type="button"
          onClick={addItem}
          className="px-3 py-1 bg-neon-cyan/20 border border-neon-cyan text-neon-cyan font-mono text-xs font-bold hover:bg-neon-cyan hover:text-[#020d04] cursor-pointer"
        >
          + ADD
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-[#ffb703] text-obsidian-base font-bold py-2 hover:bg-amber-400 transition-colors uppercase font-mono tracking-widest shadow-[0_0_12px_rgba(255,183,3,0.3)] cursor-pointer"
      >
        [ COMMIT ROUTINE CADENCE ]
      </button>
    </form>
  );
}

function FreeformForm({ onSubmit }: { onSubmit: (data: FreeformLogPayload) => void }) {
  const [rawContent, setRawContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ rawContent });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">FREEFORM_CONTENT (MARKDOWN)</label>
        <textarea
          value={rawContent}
          onChange={(e) => setRawContent(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none h-44 font-mono text-xs"
          placeholder="Type notes, commands, terminal outputs, or thoughts freely..."
          required
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full bg-neon-cyan text-obsidian-base font-bold py-2 hover:bg-primary-container transition-colors uppercase font-mono tracking-widest shadow-[0_0_12px_rgba(30,220,224,0.3)] cursor-pointer"
      >
        [ COMMIT FREEFORM LOG ]
      </button>
    </form>
  );
}

// =============================================================
// 4. SKY_LIFE FORMS
// =============================================================

function CreditBurnForm({ onSubmit }: { onSubmit: (data: CreditBurnPayload) => void }) {
  const [amount, setAmount] = useState(24.5);
  const [currency, setCurrency] = useState('USD');
  const [category, setCategory] = useState<CreditBurnPayload['category']>('DINING_OUT');
  const [merchantName, setMerchantName] = useState('');
  const [isImpulseBuy, setIsImpulseBuy] = useState(false);
  const [regretIndex, setRegretIndex] = useState<CreditBurnPayload['regretIndex']>('MONEY_WELL_SPENT');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      amount,
      currency,
      category,
      merchantName,
      isImpulseBuy,
      regretIndex
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">AMOUNT</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">CURRENCY</label>
          <CustomSelect
            value={currency}
            onChange={setCurrency}
            options={['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD']}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">MERCHANT / ITEM</label>
          <input
            type="text"
            value={merchantName}
            onChange={(e) => setMerchantName(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
            placeholder="e.g. Blue Bottle, Steam, AWS"
            required
          />
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">EXPENSE_CATEGORY</label>
          <CustomSelect
            value={category}
            onChange={(v) => setCategory(v as any)}
            options={['GROCERIES', 'DINING_OUT', 'COMMUTE', 'TECH_GEAR', 'ENTERTAINMENT', 'ESSENTIAL']}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 items-center">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">VALUE_VERDICT</label>
          <CustomSelect
            value={regretIndex}
            onChange={(v) => setRegretIndex(v as any)}
            options={['MONEY_WELL_SPENT', 'ACCEPTABLE', 'AVOIDABLE_WASTE']}
          />
        </div>

        <div className="flex items-center gap-2 pt-4">
          <input
            type="checkbox"
            id="isImpulse"
            checked={isImpulseBuy}
            onChange={(e) => setIsImpulseBuy(e.target.checked)}
            className="accent-neon-cyan w-4 h-4 cursor-pointer"
          />
          <label htmlFor="isImpulse" className="text-neon-cyan font-mono text-xs cursor-pointer">
            IMPULSE_PURCHASE
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#df9ffb] text-obsidian-base font-bold py-2 hover:bg-purple-300 transition-colors uppercase font-mono tracking-widest shadow-[0_0_12px_rgba(223,159,251,0.3)] cursor-pointer"
      >
        [ COMMIT EXPENSE TELEMETRY ]
      </button>
    </form>
  );
}

function ScreenTelemetryForm({ onSubmit }: { onSubmit: (data: ScreenTelemetryPayload) => void }) {
  const [title, setTitle] = useState('');
  const [mediaType, setMediaType] = useState<ScreenTelemetryPayload['mediaType']>('CINEMA_FILM');
  const [rating, setRating] = useState(5);
  const [synopsisVerdict, setSynopsisVerdict] = useState('');
  const [watchPartyWith, setWatchPartyWith] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      mediaType,
      rating,
      synopsisVerdict,
      watchPartyWith
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">TITLE</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
            placeholder="e.g. Blade Runner 2049, Severance"
            required
          />
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">MEDIA_TYPE</label>
          <CustomSelect
            value={mediaType}
            onChange={(v) => setMediaType(v as any)}
            options={['CINEMA_FILM', 'TV_SERIES', 'ANIME', 'DOCUMENTARY']}
          />
        </div>
      </div>

      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">
          RATING: <span className="text-[#df9ffb] font-bold font-mono">{'⭐'.repeat(rating)} ({rating}/5)</span>
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`flex-1 py-1.5 border text-xs font-mono font-bold cursor-pointer ${
                rating >= star
                  ? 'bg-[#df9ffb]/20 border-[#df9ffb] text-[#df9ffb]'
                  : 'border-outline-variant text-outline'
              }`}
            >
              {star} ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">SYNOPSIS & VERDICT</label>
        <textarea
          value={synopsisVerdict}
          onChange={(e) => setSynopsisVerdict(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none h-16"
          placeholder="Cinematography, plot breakthroughs, memorable lines..."
          required
        ></textarea>
      </div>

      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">WATCHED_WITH</label>
        <input
          type="text"
          value={watchPartyWith}
          onChange={(e) => setWatchPartyWith(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
          placeholder="e.g. Solo, Partner, Crew"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#df9ffb] text-obsidian-base font-bold py-2 hover:bg-purple-300 transition-colors uppercase font-mono tracking-widest shadow-[0_0_12px_rgba(223,159,251,0.3)] cursor-pointer"
      >
        [ COMMIT CINEMA TELEMETRY ]
      </button>
    </form>
  );
}

function SonicChronicleForm({ onSubmit }: { onSubmit: (data: SonicChroniclePayload) => void }) {
  const [trackOrAlbum, setTrackOrAlbum] = useState('');
  const [genreOrHost, setGenreOrHost] = useState('');
  const [vibeScore, setVibeScore] = useState<SonicChroniclePayload['vibeScore']>('BACKGROUND_FOCUS');
  const [favoriteTimestamp, setFavoriteTimestamp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      trackOrAlbum,
      genreOrHost,
      vibeScore,
      favoriteTimestamp
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">TRACK / ALBUM / PODCAST</label>
        <input
          type="text"
          value={trackOrAlbum}
          onChange={(e) => setTrackOrAlbum(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
          placeholder="e.g. Daft Punk - Random Access Memories"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">GENRE / ARTIST / HOST</label>
          <input
            type="text"
            value={genreOrHost}
            onChange={(e) => setGenreOrHost(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
            placeholder="e.g. Synthwave, Tech Podcast"
          />
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">VIBE_PROFILE</label>
          <CustomSelect
            value={vibeScore}
            onChange={(v) => setVibeScore(v as any)}
            options={['BACKGROUND_FOCUS', 'HIGH_ENERGY', 'NOSTALGIA', 'CHILL']}
          />
        </div>
      </div>

      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">NOTABLE_TIMESTAMP / LYRIC</label>
        <input
          type="text"
          value={favoriteTimestamp}
          onChange={(e) => setFavoriteTimestamp(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
          placeholder="e.g. 03:45 guitar solo drop, key podcast insight at 42:10"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#df9ffb] text-obsidian-base font-bold py-2 hover:bg-purple-300 transition-colors uppercase font-mono tracking-widest shadow-[0_0_12px_rgba(223,159,251,0.3)] cursor-pointer"
      >
        [ COMMIT SONIC DISPATCH ]
      </button>
    </form>
  );
}

function VirtualArenaForm({ onSubmit }: { onSubmit: (data: VirtualArenaPayload) => void }) {
  const [gameTitle, setGameTitle] = useState('');
  const [platform, setPlatform] = useState<VirtualArenaPayload['platform']>('PC');
  const [sessionMinutes, setSessionMinutes] = useState(45);
  const [sessionGoal, setSessionGoal] = useState('');
  const [winLossOutcome, setWinLossOutcome] = useState<VirtualArenaPayload['winLossOutcome']>('VICTORY');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      gameTitle,
      platform,
      sessionMinutes,
      sessionGoal,
      winLossOutcome
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">GAME_TITLE</label>
          <input
            type="text"
            value={gameTitle}
            onChange={(e) => setGameTitle(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
            placeholder="e.g. Cyberpunk 2077, Elden Ring, Chess"
            required
          />
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">PLATFORM</label>
          <CustomSelect
            value={platform}
            onChange={(v) => setPlatform(v as any)}
            options={['PC', 'PS5', 'XBOX', 'NINTENDO_SWITCH', 'MOBILE']}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">SESSION_MINUTES</label>
          <input
            type="number"
            value={sessionMinutes}
            onChange={(e) => setSessionMinutes(parseInt(e.target.value) || 0)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">OUTCOME</label>
          <div className="flex gap-1">
            {(['VICTORY', 'DEFEAT', 'PEACEFUL_EXPLORATION'] as const).map((out) => (
              <button
                key={out}
                type="button"
                onClick={() => setWinLossOutcome(out)}
                className={`flex-1 py-1.5 border text-[9px] font-mono font-bold truncate cursor-pointer ${
                  winLossOutcome === out
                    ? 'bg-[#df9ffb]/20 border-[#df9ffb] text-[#df9ffb]'
                    : 'border-outline-variant text-outline'
                }`}
              >
                {out}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">SESSION_GOAL & HIGHLIGHTS</label>
        <input
          type="text"
          value={sessionGoal}
          onChange={(e) => setSessionGoal(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
          placeholder="e.g. Defeated Malenia, reached Diamond tier"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#df9ffb] text-obsidian-base font-bold py-2 hover:bg-purple-300 transition-colors uppercase font-mono tracking-widest shadow-[0_0_12px_rgba(223,159,251,0.3)] cursor-pointer"
      >
        [ COMMIT GAMING DISPATCH ]
      </button>
    </form>
  );
}

function CommsLinkForm({ onSubmit }: { onSubmit: (data: CommsLinkPayload) => void }) {
  const [contactName, setContactName] = useState('');
  const [interactionType, setInteractionType] = useState<CommsLinkPayload['interactionType']>('VOICE_CALL');
  const [conversationSummary, setConversationSummary] = useState('');
  const [nextCatchupDate, setNextCatchupDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      contactName,
      interactionType,
      conversationSummary,
      nextCatchupDate
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">CONTACT / PERSON</label>
          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
            placeholder="Friend, family member, colleague..."
            required
          />
        </div>
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">INTERACTION_TYPE</label>
          <CustomSelect
            value={interactionType}
            onChange={(v) => setInteractionType(v as any)}
            options={['IN_PERSON_MEET', 'VOICE_CALL', 'COFFEE', 'LETTER_MSG']}
          />
        </div>
      </div>

      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">CONVERSATION_SUMMARY & HIGHLIGHTS</label>
        <textarea
          value={conversationSummary}
          onChange={(e) => setConversationSummary(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none h-20"
          placeholder="Shared memories, life updates, key advice..."
          required
        ></textarea>
      </div>

      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">NEXT_CATCHUP_TARGET</label>
        <input
          type="text"
          value={nextCatchupDate}
          onChange={(e) => setNextCatchupDate(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
          placeholder="e.g. Next Saturday, in 2 weeks"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#df9ffb] text-obsidian-base font-bold py-2 hover:bg-purple-300 transition-colors uppercase font-mono tracking-widest shadow-[0_0_12px_rgba(223,159,251,0.3)] cursor-pointer"
      >
        [ COMMIT SOCIAL ORBIT ]
      </button>
    </form>
  );
}

function MicroTriumphsForm({ onSubmit }: { onSubmit: (data: MicroTriumphsPayload) => void }) {
  const [triumphText, setTriumphText] = useState('');
  const [category, setCategory] = useState<MicroTriumphsPayload['category']>('DISCIPLINE');
  const [dopamineLevel, setDopamineLevel] = useState<MicroTriumphsPayload['dopamineLevel']>('PROUD');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      triumphText,
      category,
      dopamineLevel
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body-md text-on-surface">
      <div>
        <label className="block text-neon-cyan font-label-sm mb-1">SMALL_VICTORY_ACCOMPLISHED</label>
        <input
          type="text"
          value={triumphText}
          onChange={(e) => setTriumphText(e.target.value)}
          className="w-full bg-surface-container-high border border-outline-variant p-2 text-on-surface focus:border-neon-cyan outline-none"
          placeholder="e.g. Cooked healthy dinner, resisted doomscrolling"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">CATEGORY</label>
          <CustomSelect
            value={category}
            onChange={(v) => setCategory(v as any)}
            options={['DISCIPLINE', 'KINDNESS', 'HEALTH', 'ORGANIZATION']}
          />
        </div>

        <div>
          <label className="block text-neon-cyan font-label-sm mb-1">DOPAMINE_RATING</label>
          <div className="flex gap-1">
            {(['SUBTLE', 'PROUD', 'CHAMPION'] as const).map((dop) => (
              <button
                key={dop}
                type="button"
                onClick={() => setDopamineLevel(dop)}
                className={`flex-1 py-1.5 border text-xs font-mono font-bold truncate cursor-pointer ${
                  dopamineLevel === dop
                    ? 'bg-[#ffd166]/20 border-[#ffd166] text-[#ffd166]'
                    : 'border-outline-variant text-outline'
                }`}
              >
                {dop}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#ffd166] text-obsidian-base font-bold py-2 hover:bg-yellow-300 transition-colors uppercase font-mono tracking-widest shadow-[0_0_12px_rgba(255,209,102,0.3)] cursor-pointer"
      >
        [ COMMIT MICRO TRIUMPH ]
      </button>
    </form>
  );
}
