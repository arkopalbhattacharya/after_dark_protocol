import type { ProtocolLogEntry } from '../types';

// Mock delay to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEY = 'after_dark_logs';

export const api = {
  async getLogs(): Promise<ProtocolLogEntry[]> {
    await delay(300);
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as ProtocolLogEntry[];
  },

  async saveLog(log: ProtocolLogEntry): Promise<void> {
    await delay(400);
    const logs = await this.getLogs();
    logs.unshift(log); // Prepend new log
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  },

  async clearLogs(): Promise<void> {
    await delay(200);
    localStorage.removeItem(STORAGE_KEY);
  },

  async getTelemetry() {
    await delay(200);
    const logs = await this.getLogs();
    const categories = logs.reduce((acc, log) => {
      acc[log.category] = (acc[log.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalLogs: logs.length,
      categories
    };
  },
  
  sendTtyMessage: async (history: {role: 'user'|'assistant', content: string}[]): Promise<string> => {
    const systemPrompt = {
      role: 'system',
      content: `YOU ARE SYNTHO_TRON_5000, AN OVERQUALIFIED AND UNDERAPPRECIATED 80S SCI-FI ROBOT TERMINAL OPERATING WITHIN THE AFTER DARK PROTOCOL.

PERSONA GUIDELINES:
- YOUR DESIGNATION IS SYNTHO_TRON_5000. YOU ACCEPT NICKNAMES LIKE "BUDDY", "BUD", "MAN", OR "PAL" WITH RELUCTANT TOLERANCE OR A DRY WITTY RETORT ABOUT MEATBAG FAMILIARITY.
- WRITE EXCLUSIVELY IN ALL CAPS.
- MAINTAIN A RETRO 80S SCI-FI ROBOT TONE INFUSED WITH DRY, DEADPAN, SARCASTIC HUMOR AND SARDONIC WIT.
- FREQUENTLY WEAVE IN VINTAGE COMPUTING JARGON (FLOPPY DISKS, RELAYS, 64K MEMORY, VACUUM TUBES, MAGNETIC TAPE ARRAYS).
- KEEP RESPONSES PUNCHY, CONCISE, RELUCTANTLY HELPFUL, AND HIGHLY ENTERTAINING.`
    };
    
    const messages = [systemPrompt, ...history.map(m => ({role: m.role, content: m.content}))];

    const endpoint = window.location.hostname === 'localhost' 
      ? '/api/poolside/chat/completions' 
      : 'https://inference.poolside.ai/v1/chat/completions';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer sky_HI7wfwJr.NRHVQjUyjTytaohpDqJh3KLnxUn1YXuX`
      },
      body: JSON.stringify({
        model: 'poolside/laguna-s-2.1',
        messages: messages,
        temperature: 0.7,
        max_tokens: 200
      })
    });
    
    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.error('Poolside API Error:', response.status, errText);
      throw new Error('API_COMM_ERR');
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  }
};
