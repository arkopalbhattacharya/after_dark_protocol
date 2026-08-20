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
  }
};
