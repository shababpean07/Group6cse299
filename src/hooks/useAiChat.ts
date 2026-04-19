"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { aiApi } from "@/lib/ai";

type Message = { role: 'user' | 'ai'; content: string; timestamp?: string };

export function useAiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load persisted history (if any)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("ai_chat_history");
      if (raw) {
        const parsed = JSON.parse(raw) as Message[];
        if (Array.isArray(parsed)) {
          setMessages(parsed);
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem("ai_chat_history", JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  const send = useCallback(async (text: string) => {
    const trimmed = (text ?? '').trim();
    if (!trimmed) return;

    const userMsg: Message = { role: 'user', content: trimmed, timestamp: new Date().toISOString() };
    // Optimistically add user message
    setMessages((m) => [...m, userMsg]);
    setIsLoading(true);

    try {
      const history = [...messages, userMsg];
      const res = await aiApi.chat({ message: trimmed, history });
      const aiReply = res?.reply ?? 'I’m not sure how to respond to that.';
      const aiMsg: Message = { role: 'ai', content: aiReply, timestamp: new Date().toISOString() };
      setMessages((m) => [...m, aiMsg]);
    } catch (e) {
      const errorMsg: Message = { role: 'ai', content: 'Sorry, I encountered an error. Please try again.', timestamp: new Date().toISOString() };
      setMessages((m) => [...m, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clear = useCallback(() => {
    setMessages([]);
    localStorage.removeItem("ai_chat_history");
  }, []);

  // Ensure a stable content quo for UI if needed
  const summary = useMemo(() => {
    const countUser = messages.filter((m) => m.role === 'user').length;
    const countAi = messages.filter((m) => m.role === 'ai').length;
    return { countUser, countAi };
  }, [messages]);

  return { messages, isLoading, send, clear, summary };
}
