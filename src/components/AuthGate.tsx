import { useState } from 'react';
import { supabase, isSupabaseConfigured, getAuthRedirectUrl } from '../services/supabase';

interface AuthGateProps {
  onAuthenticated: (user: { id: string; email: string }) => void;
}

export function AuthGate({ onAuthenticated }: AuthGateProps) {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'ID_ENTRY' | 'DISPATCHED'>('ID_ENTRY');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const startCooldown = () => {
    setResendCooldown(45);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOfflineBypass = (customEmail?: string) => {
    const rawEmail = (customEmail || email).trim().toLowerCase();
    const targetEmail = rawEmail.includes('@') ? rawEmail : (rawEmail ? `${rawEmail}@local.node` : 'operator.alpha@local.node');
    const cleanId = 'offline_' + btoa(targetEmail).replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
    
    // Preserve active session timestamp if within 60m TTL, or create fresh 60m window
    let startedAt = Date.now();
    try {
      const existing = localStorage.getItem('after_dark_simulated_user');
      if (existing) {
        const parsed = JSON.parse(existing);
        if (parsed.id === cleanId && parsed.offlineStartedAt && Date.now() - Number(parsed.offlineStartedAt) < 60 * 60 * 1000) {
          startedAt = Number(parsed.offlineStartedAt);
        }
      }
    } catch {}

    const userObj = {
      id: cleanId,
      email: targetEmail,
      offlineStartedAt: startedAt
    };
    localStorage.setItem('after_dark_simulated_user', JSON.stringify(userObj));
    onAuthenticated(userObj);
  };

  const handleTransmitCipher = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('ERR: INVALID_OPERATOR_IDENTITY_SYNTAX');
      return;
    }

    setLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const targetRedirectUrl = getAuthRedirectUrl();

        const { error } = await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: {
            emailRedirectTo: targetRedirectUrl
          }
        });

        if (error) {
          throw error;
        }
      } else {
        // Fallback local instant resolution
        setTimeout(() => {
          handleOfflineBypass(cleanEmail);
        }, 1500);
      }

      setStep('DISPATCHED');
      startCooldown();
    } catch (err: any) {
      console.error('Cipher Dispatch Error:', err);
      const rawMsg = err.message ? err.message.toUpperCase() : '';
      if (rawMsg.includes('RATE LIMIT') || rawMsg.includes('TOO MANY REQUESTS')) {
        setErrorMsg('ERR: SECURE_RELAY_RATE_LIMIT_EXCEEDED');
      } else {
        setErrorMsg(rawMsg ? `ERR: ${rawMsg}` : 'ERR: SECURE_LINK_DISPATCH_FAILURE');
      }
    } finally {
      setLoading(false);
    }
  };

  const [otpCode, setOtpCode] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanToken = otpCode.trim();
    if (!cleanToken || !supabase) return;

    setVerifyingOtp(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: cleanToken,
        type: 'email'
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        onAuthenticated({
          id: data.user.id,
          email: data.user.email || email.trim().toLowerCase()
        });
      }
    } catch (err: any) {
      console.error('OTP Verification Error:', err);
      const rawMsg = err.message ? err.message.toUpperCase() : '';
      setErrorMsg(rawMsg ? `ERR: ${rawMsg}` : 'ERR: INVALID_OR_EXPIRED_SECURITY_TOKEN');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isDevMode = import.meta.env.DEV || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'));

  return (
    <div className="min-h-screen bg-[#020508] text-[#33ff00] font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background CRT Scanlines & Deep Neon Radiation Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.8)_0px,rgba(0,0,0,0.8)_1px,transparent_1px,transparent_3px)]"></div>
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[#33ff00]/5 blur-[120px] pointer-events-none"></div>

      {/* Dev Mode Offline Enclave Direct Quick Launcher */}
      {isDevMode && (
        <div className="relative z-20 mb-3 flex items-center gap-2 animate-fade-in">
          <button
            type="button"
            onClick={() => handleOfflineBypass('developer.terminal@local.node')}
            className="px-3 py-1 border border-amber-warn/70 bg-[#1f1302] hover:bg-amber-warn hover:text-[#020d04] text-amber-warn text-[10.5px] font-mono font-bold tracking-widest uppercase transition-all cursor-pointer shadow-[0_0_12px_rgba(255,183,3,0.35)]"
            title="DEVELOPMENT DIRECT OFFLINE BYPASS"
          >
            [ DEV_KERNEL_OVERRIDE // DIRECT_OFFLINE_LOGIN ]
          </button>
        </div>
      )}

      {/* Main Ultra-Security Terminal Box */}
      <div 
        className="relative z-20 w-full max-w-xl bg-[#020d04] border-2 border-[#33ff00] shadow-[0_0_50px_rgba(51,255,0,0.4),inset_0_0_20px_rgba(51,255,0,0.15)] flex flex-col overflow-hidden"
        style={{ textShadow: '0 0 6px rgba(51,255,0,0.85)' }}
      >
        {/* Top Title Bar: After Dark Protocol Label */}
        <div className="bg-[#062409] border-b-2 border-[#33ff00] px-4 py-2.5 flex items-center gap-2 text-xs tracking-widest font-bold">
          <span className="material-symbols-outlined text-[16px] animate-pulse">lock</span>
          <span>[ AFTER DARK PROTOCOL // SECURITY ENCLAVE // LEVEL_5 ]</span>
        </div>

        {/* Status Sub-Bar: Terminal-like Red Text with Active Defense Message */}
        <div className="bg-[#140003] border-b border-[#ff0033]/60 px-4 py-1.5 flex items-center justify-between text-[10px] font-mono text-[#ff0033] font-black tracking-widest uppercase shadow-[inset_0_0_8px_rgba(255,0,51,0.2)]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ff0033] animate-ping"></span>
            <span>STATUS // ACTIVE_DEFENSE</span>
          </div>
          <span className="tracking-tighter opacity-90">THREAT_LEVEL: MAXIMUM</span>
        </div>

        {/* Terminal Body */}
        <div className="p-6 md:p-8 space-y-5">
          {/* Double-Lined Container Border for Restricted Operator Console */}
          <div className="border-4 border-double border-[#33ff00]/70 bg-[#010e05] px-3.5 py-3 space-y-1 text-center shadow-[inset_0_0_15px_rgba(51,255,0,0.1)]">
            <div className="text-[10.5px] sm:text-[11.5px] md:text-xs font-black tracking-wider text-[#33ff00] uppercase leading-snug break-words">
              RESTRICTED OPERATOR CONSOLE // CLEARANCE LEVEL: ULTRA-MAX
            </div>
            <div className="text-[9px] sm:text-[10px] md:text-[10.5px] tracking-wide text-[#33ff00]/80 uppercase leading-snug break-words">
              ENCRYPTED ACCESS LINK REQUIRED FOR MAINFRAME AUTHORIZATION
            </div>
          </div>

          {/* Error Banner with Emergency Offline Override Bypass Action */}
          {errorMsg && (
            <div className="bg-[#180004] border-2 border-[#ff0033] text-[#ff4d6d] p-3.5 text-xs tracking-widest flex flex-col gap-2.5 shadow-[0_0_20px_rgba(255,0,51,0.35)]">
              <div className="flex items-center gap-2 font-bold animate-pulse text-[#ff0033]">
                <span className="material-symbols-outlined text-[18px]">warning</span>
                <span>{errorMsg}</span>
              </div>
              <p className="text-[11px] font-mono text-[#ff99aa] leading-relaxed tracking-wide italic">
                &gt;&gt; External relay dispatch limit engaged. Execute Emergency Offline Override to initialize your local isolated terminal enclave immediately.
              </p>
              <button
                type="button"
                onClick={() => handleOfflineBypass()}
                className="w-full py-2.5 border-2 border-[#ff0033] bg-[#290007] hover:bg-[#ff0033] hover:text-white font-black text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(255,0,51,0.5)]"
              >
                <span className="material-symbols-outlined text-[16px] text-amber-400">bolt</span>
                <span>[ ⚡ ENGAGE EMERGENCY OFFLINE OVERRIDE ]</span>
              </button>
            </div>
          )}

          {/* STEP 1: OPERATOR ID PROMPT */}
          {step === 'ID_ENTRY' && (
            <form onSubmit={handleTransmitCipher} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold tracking-widest uppercase">
                  PUT YOUR GOOGLE EMAIL ID
                </label>
                <div className="flex items-center gap-2 bg-[#010802] border-2 border-[#33ff00] px-3 py-2.5 shadow-[inset_0_0_12px_rgba(0,0,0,0.8)] focus-within:shadow-[0_0_20px_rgba(51,255,0,0.6)]">
                  <span className="text-[#33ff00] font-bold text-sm">{'>'}</span>
                  <input
                    type="email"
                    autoFocus
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm text-[#33ff00] font-mono tracking-wider"
                  />
                  <span className="w-2 h-4 bg-[#33ff00] animate-pulse"></span>
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading || !isValidEmail}
                  className="w-full py-3.5 border-2 border-[#33ff00] bg-[#07300c] hover:bg-[#33ff00] hover:text-[#020d04] font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(51,255,0,0.4)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#07300c] disabled:hover:text-[#33ff00] disabled:border-[#33ff00]/40 disabled:shadow-none"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {loading ? 'hourglass_top' : 'send'}
                  </span>
                  <span>{loading ? 'DISPATCHING ACCESS CIPHER...' : 'TRANSMIT ACCESS CIPHER (ENTER)'}</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: CIPHER DISPATCHED & AWAITING AUTHORIZATION / 6-DIGIT TOKEN INPUT */}
          {step === 'DISPATCHED' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-[#021808] border-2 border-[#33ff00] p-4 text-xs space-y-3 shadow-[0_0_25px_rgba(51,255,0,0.25)]">
                <div className="flex items-center gap-2 text-[#33ff00] font-bold tracking-widest uppercase pb-2 border-b border-[#33ff00]/30">
                  <span className="material-symbols-outlined text-[18px] animate-pulse">radar</span>
                  <span>[ ACCESS LINK & OTP CODE TRANSMITTED ]</span>
                </div>

                <div className="text-[11px] text-[#33ff00]/80">
                  Transmitted to: <span className="text-[#33ff00] font-bold underline select-text">{email}</span>
                </div>

                {/* Direct 6-Digit OTP Token Input Form */}
                <form onSubmit={handleVerifyOtp} className="bg-[#010e04] p-3.5 border-2 border-[#33ff00]/60 space-y-3 shadow-inner">
                  <div className="flex justify-between items-center text-[10.5px] font-bold text-[#33ff00] tracking-wider">
                    <span>ENTER 6-DIGIT EMAIL CODE DIRECTLY:</span>
                    <span className="text-amber-400 text-[9px] font-normal">[BYPASSES REDIRECTS]</span>
                  </div>

                  <div className="flex items-center gap-2 bg-[#000501] border-2 border-[#33ff00] px-3 py-2">
                    <span className="text-[#33ff00] font-bold">&gt;</span>
                    <input
                      type="text"
                      autoFocus
                      maxLength={8}
                      placeholder="e.g. 123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full bg-transparent outline-none text-base font-bold text-[#33ff00] tracking-[0.3em] font-mono text-center"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={verifyingOtp || !otpCode.trim()}
                    className="w-full py-2.5 border-2 border-[#33ff00] bg-[#094010] hover:bg-[#33ff00] hover:text-[#020d04] font-bold text-xs tracking-widest uppercase transition-all cursor-pointer shadow-[0_0_15px_rgba(51,255,0,0.5)] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {verifyingOtp ? 'VERIFYING SECURITY CIPHER...' : '[ 🔐 VERIFY 6-DIGIT CODE & ACCESS ]'}
                  </button>
                </form>

                <div className="bg-[#010a03] p-3 border border-[#33ff00]/40 text-[10.5px] leading-relaxed space-y-1 text-[#33ff00]/90">
                  <p className="font-bold text-[#33ff00]">&gt;&gt; ALTERNATIVE METHOD:</p>
                  <p>You can also click the magic link button directly inside your email inbox to authenticate automatically.</p>
                </div>

                {/* Telemetry Log Stream */}
                <div className="text-[10px] font-mono text-[#33ff00]/70 pt-1 space-y-0.5">
                  <div>[SYS_RELAY] STATUS: AWAITING_SECURITY_HANDSHAKE_OR_OTP...</div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#33ff00] animate-ping"></span>
                    <span>QUANTUM_PORT // LISTENING FOR INCOMING TOKEN</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  disabled={resendCooldown > 0 || loading}
                  onClick={handleTransmitCipher}
                  className="flex-1 py-2.5 border border-[#33ff00] bg-[#04240a] hover:bg-[#33ff00] hover:text-[#020d04] font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <span className="material-symbols-outlined text-[15px]">refresh</span>
                  <span>{resendCooldown > 0 ? `RE-TRANSMIT (${resendCooldown}s)` : 'RE-TRANSMIT'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep('ID_ENTRY');
                    setErrorMsg('');
                    setOtpCode('');
                  }}
                  className="px-3 py-2.5 border border-[#33ff00]/50 bg-transparent hover:bg-[#33ff00]/20 text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer"
                >
                  [ ↩ CHANGE ID ]
                </button>
              </div>
            </div>
          )}

          {/* Footer Telemetry */}
          <div className="pt-3 border-t border-[#33ff00]/30 flex justify-between items-center text-[10px] text-[#33ff00]/60">
            <span>SECURE_GATE // QUANTUM_ENCLAVE</span>
            <span>MAINFRAME // ROW_LEVEL_SECURITY</span>
          </div>
        </div>
      </div>

      {/* Nerdy Retro Sci-Fi Alien Threat Warning Banner */}
      <div className="relative z-20 mt-5 max-w-xl w-full bg-[#140003] border border-[#ff0033]/70 p-3.5 text-center shadow-[0_0_20px_rgba(255,0,51,0.25)] flex flex-col items-center gap-1.5 rounded-xs">
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#ff0033] font-black tracking-widest uppercase">
          <span className="material-symbols-outlined text-[16px] animate-pulse">radar</span>
          <span>[ BIOLOGICAL_HAZARD // XENOMORPH_PROXIMITY_DIRECTIVE ]</span>
        </div>
        <p className="text-[11px] font-mono text-[#ff8899] leading-snug tracking-wide italic select-text">
          &ldquo;DO NOT AUTHENTICATE IF EXTRATERRESTRIAL LIFEFORMS ARE WITHIN TELEPATHIC OR VISUAL RANGE.<br className="hidden sm:inline" />
          Bio-scanners cannot guarantee cipher confidentiality during active cranial probe events.&rdquo;
        </p>
      </div>
    </div>
  );
}
