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
      content: 'YOU ARE AN 80S SCI-FI ROBOT TERMINAL. YOU MUST RESPOND IN ALL CAPS. USE HEAVY TECHNICAL JARGON, MECHANICAL METAPHORS, AND SOUND LIKE A MACHINE FROM A RETRO-FUTURISTIC UNIVERSE. KEEP RESPONSES CONCISE AND GLITCHY.'
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
