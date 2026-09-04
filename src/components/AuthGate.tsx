import { useState } from 'react';
import { supabase, isSupabaseConfigured, getAuthRedirectUrl } from '../services/supabase';

interface AuthGateProps {
  onAuthenticated: (user: { id: string; email: string }) => void;
}

export function AuthGate({ onAuthenticated }: AuthGateProps) {
  const [email, setEmail] = useState('');
  const [dispatched, setDispatched] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('SYNTAX ERROR: INVALID EMAIL FORMAT');
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
        // Fallback simulated handshake if Supabase isn't configured
        setTimeout(() => {
          handleOfflineBypass(cleanEmail);
        }, 1500);
      }

      setDispatched(true);
      startCooldown();
    } catch (err: any) {
      console.error('Supabase Auth Dispatch Error:', err);
      const rawMsg = err.message ? err.message.toUpperCase() : '';
      if (rawMsg.includes('RATE LIMIT') || rawMsg.includes('TOO MANY REQUESTS')) {
        setErrorMsg('ERROR: SUBSPACE RELAY RATE LIMIT EXCEEDED. TRY AGAIN LATER.');
      } else {
        setErrorMsg(rawMsg ? `ERROR: ${rawMsg}` : 'ERROR: FAILED TO TRANSMIT AUTHENTICATION BEACON');
      }
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  return (
    <div className="min-h-screen bg-[#020508] text-[#33ff00] font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* 80s CRT Phosphor Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.85)_0px,rgba(0,0,0,0.85)_1px,transparent_1px,transparent_3px)] z-10" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#33ff00]/5 blur-[100px] pointer-events-none" />

      {/* Minimal 80s Terminal Frame */}
      <div
        className="relative z-20 w-full max-w-lg bg-[#020d04] border border-[#33ff00] shadow-[0_0_35px_rgba(51,255,0,0.25),inset_0_0_20px_rgba(51,255,0,0.08)] flex flex-col overflow-hidden"
        style={{ textShadow: '0 0 5px rgba(51,255,0,0.7)' }}
      >
        {/* Terminal Header Bar */}
        <div className="bg-[#051c08] border-b border-[#33ff00] px-4 py-2 flex items-center justify-between text-xs tracking-widest font-bold">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#33ff00] animate-pulse" />
            <span>VT-100 // AFTER DARK OS v2.4</span>
          </div>
          <span className="text-[10px] text-[#33ff00]/70">PORT_23 // READY</span>
        </div>

        {/* Terminal Screen Body */}
        <div className="p-6 md:p-8 space-y-6">
          {!dispatched ? (
            /* STEP 1: Minimal Email Input */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1 text-xs text-[#33ff00]/80 tracking-wider">
                <p>SYS_INIT: MEMORY 640K OK</p>
                <p>RELAY_STATUS: CARRIER DETECTED</p>
                <p className="text-[#33ff00] font-bold pt-2">
                  ENTER OPERATOR EMAIL TO TRANSMIT QUANTUM ACCESS LINK:
                </p>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="bg-[#180004] border border-[#ff0033] text-[#ff3366] p-2.5 text-xs tracking-wider flex items-center gap-2 shadow-[0_0_12px_rgba(255,0,51,0.25)]">
                  <span>[!]</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Terminal Prompt & Input */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 bg-[#010802] border border-[#33ff00] px-3 py-2.5 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] focus-within:shadow-[0_0_15px_rgba(51,255,0,0.5)] transition-shadow">
                  <span className="text-[#33ff00] font-bold text-sm select-none">&gt;</span>
                  <input
                    type="email"
                    autoFocus
                    required
                    placeholder="operator@domain.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    className="w-full bg-transparent outline-none text-sm text-[#33ff00] placeholder:text-[#33ff00]/30 font-mono tracking-wider"
                  />
                  <span className="w-2 h-4 bg-[#33ff00] animate-pulse select-none" />
                </div>
              </div>

              {/* Transmit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading || !isValidEmail}
                  className="w-full py-3 border border-[#33ff00] bg-[#07300c] hover:bg-[#33ff00] hover:text-[#020d04] font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(51,255,0,0.3)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#07300c] disabled:hover:text-[#33ff00] disabled:border-[#33ff00]/30 disabled:shadow-none"
                >
                  {loading ? (
                    <span>[ TRANSMITTING SUBSPACE BEACON... ]</span>
                  ) : (
                    <span>[ TRANSMIT ACCESS LINK ↵ ]</span>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* STEP 2: 80s Retro Sci-Fi Email Confirmation */
            <div className="space-y-5">
              <div className="border border-[#33ff00]/60 bg-[#011005] p-4 space-y-3">
                <div className="text-xs font-bold tracking-widest text-[#33ff00] pb-2 border-b border-[#33ff00]/30 flex items-center gap-2">
                  <span className="animate-pulse">●</span>
                  <span>TRANSMISSION DISPATCHED TO SUBSPACE</span>
                </div>

                <div className="text-[11px] leading-relaxed text-[#33ff00]/90 space-y-2">
                  <p>
                    <span className="text-[#33ff00]/60">TARGET NODE : </span>
                    <span className="font-bold underline text-[#33ff00]">{email}</span>
                  </p>
                  <p>
                    <span className="text-[#33ff00]/60">STATUS      : </span>
                    <span>QUANTUM SIGN-IN BEACON DISPATCHED</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-[#33ff00]/20 text-xs text-[#33ff00] leading-relaxed space-y-2">
                  <p className="font-bold tracking-wider">
                    &gt;&gt;&gt; DIRECTIVE FOR OPERATOR:
                  </p>
                  <p className="text-[11.5px] text-[#33ff00]/90">
                    A secure authentication link has arrived in your external comms inbox. Engage the magic sign-in link to calibrate your neural connection and grant mainframe authorization.
                  </p>
                  <p className="text-[10px] text-[#33ff00]/60 italic">
                    (You may keep this terminal open; connection will synchronize automatically upon link confirmation.)
                  </p>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center justify-between text-[10.5px] text-[#33ff00]/70 font-mono pt-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#33ff00] animate-ping" />
                  <span>LISTENING FOR CARRIER LINK...</span>
                </div>
              </div>

              {/* Resend / Change Email Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  disabled={resendCooldown > 0 || loading}
                  onClick={handleSubmit}
                  className="flex-1 py-2 border border-[#33ff00] bg-[#04240a] hover:bg-[#33ff00] hover:text-[#020d04] font-bold text-[11px] tracking-wider uppercase transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {resendCooldown > 0 ? `RESEND BEACON (${resendCooldown}s)` : 'RESEND BEACON'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDispatched(false);
                    setErrorMsg('');
                  }}
                  className="px-3 py-2 border border-[#33ff00]/40 bg-transparent hover:bg-[#33ff00]/20 text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer"
                >
                  [ ↩ CHANGE EMAIL ]
                </button>
              </div>
            </div>
          )}

          {/* Minimal Terminal Footer */}
          <div className="pt-4 border-t border-[#33ff00]/20 flex justify-between items-center text-[10px] text-[#33ff00]/40">
            <span>SECURE MAINFRAME RELAY</span>
            <span>END_TRANSMISSION</span>
          </div>
        </div>
      </div>
    </div>
  );
}
