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

// Public API for frontend to call AI chat capability
export const aiApi = {
  chat: (payload: { message: string; history: HistoryEntry[] }): Promise<{ reply: string }> => {
    const useBackend = typeof window !== 'undefined' && (process.env.NEXT_PUBLIC_AI_BACKEND_ENABLED === '1');
    if (useBackend) {
      // If a real backend is wired, you'd implement a fetch here, e.g.:
      // return apiClient.post<{ reply: string }>('/ai/chat', payload);
      // For safety in this environment, fall back to mock if backend is not actually wired.
      return Promise.resolve({ reply: mockAiResponse(payload.message, payload.history) });
    }
    // Client-side mock (default)
    return new Promise((resolve) => {
      const latency = 150 + Math.random() * 450;
      setTimeout(() => {
        resolve({ reply: mockAiResponse(payload.message, payload.history) });
      }, latency);
    });
  },
};
