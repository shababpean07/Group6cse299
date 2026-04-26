// AI Chat API bridge (mockable)
// This module provides a lightweight aiApi.chat method that can be backed by a real
// backend (when NEXT_PUBLIC_AI_BACKEND_ENABLED=1) or a client-side mock for demo purposes.

type HistoryEntry = { role: 'user' | 'ai'; content: string; timestamp?: string };

function mockAiResponse(message: string, history: HistoryEntry[] = []): string {
  const lower = message.toLowerCase();
  if (lower.includes('hello') || lower.includes('hi')) {
    return "Hello! I'm your AI assistant. How can I help you today?";
  }
  if (lower.includes('club')) {
    return 'NSU ClubHub helps you discover clubs, track recruitment, and RSVP to events.';
  }
  if (lower.includes('how') && history.length > 0) {
    return 'Here’s a tip: you can ask me about clubs, events, or recruitment cycles.';
  }
  // fallback generic response
  return `You asked: "${message}". I can help with clubs, events, or recruitment information on NSU ClubHub.`;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function callBackendAi(message: string): Promise<string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/ai/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'AI chat failed');
  }

  const data = await response.json();
  return data.reply || `You said: ${message}`;
}

// Public API for frontend to call AI chat capability
export const aiApi = {
  chat: async (payload: { message: string; history: HistoryEntry[] }): Promise<{ reply: string }> => {
    try {
      const reply = await callBackendAi(payload.message);
      return { reply };
    } catch (error) {
      console.warn('AI backend unavailable, using mock response:', error);
      return new Promise((resolve) => {
        const latency = 150 + Math.random() * 450;
        setTimeout(() => {
          resolve({ reply: mockAiResponse(payload.message, payload.history) });
        }, latency);
      });
    }
  },
};
