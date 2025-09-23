import { HairMetrics } from '@/services/analysis';
import * as FileSystem from 'expo-file-system';

export type SessionData = {
  uri: string;
  metrics: HairMetrics;
  average: number;
  timestamp: number;
};

const SESSION_FILE = `${FileSystem.documentDirectory}current-session.json`;

export async function saveSession(data: Omit<SessionData, 'timestamp'>) {
  const payload: SessionData = { ...data, timestamp: Date.now() };
  await FileSystem.writeAsStringAsync(SESSION_FILE, JSON.stringify(payload));
}

export async function loadSession(): Promise<SessionData | null> {
  try {
    const info = await FileSystem.getInfoAsync(SESSION_FILE);
    if (!info.exists) return null;
    const content = await FileSystem.readAsStringAsync(SESSION_FILE);
    return JSON.parse(content) as SessionData;
  } catch {
    return null;
  }
}

export async function clearSession() {
  try {
    await FileSystem.deleteAsync(SESSION_FILE, { idempotent: true });
  } catch {
    // ignore
  }
}


