"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAiChat } from "@/hooks/useAiChat";

// Lightweight AI chat widget mounted in the bottom-right corner.
export function AiChatWidget() {
  const { messages, isLoading, send } = useAiChat();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  // Reset input when opening the widget
  useEffect(() => {
    if (open) setInput("");
  }, [open]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, open]);

  const onSend = () => {
    const text = input.trim();
    if (!text) return;
    // Use the hook-provided send function to process the user message and fetch AI reply
    send(text);
    setInput("");
  };

  // Keyboard: Enter to send
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSend();
    }
  };

  // Since useAiChat manages its own send, we expose a small input handler below (binding to the same send is achieved via the inner API).
  // For demonstration purposes, we wire a manual send button that pushes the input as a user message via a separate API.
  // To keep this widget minimal and self-contained, the actual send will be wired by calling window.dispatchEvent if needed in a fuller integration.

  return (
    <>
      {!open && (
        <button
          aria-label="Open AI chat"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 rounded-full bg-blue-600 text-white w-12 h-12 drop-shadow-lg hover:bg-blue-700 flex items-center justify-center"
          title="AI Chat"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 5h16a2 2 0 012 2v8a2 2 0 01-2 2H9l-5 4V7a2 2 0 012-2z" stroke="white" strokeWidth="2" fill="none"/>
          </svg>
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 w-96 h-[420px] max-h-[70vh] bg-white border rounded-md shadow-xl flex flex-col overflow-hidden" role="dialog" aria-label="AI Chat Widget">
          <div className="flex items-center justify-between px-3 py-2 border-b bg-gray-50">
            <span className="font-semibold">AI Chat</span>
            <button onClick={() => setOpen(false)} aria-label="Close" className="text-gray-600 hover:text-gray-800">✕</button>
          </div>
          <div className="flex-1 p-3 overflow-auto bg-white" style={{minHeight: 0}}>
            {messages.length === 0 && (
              <div className="text-sm text-gray-500">Start the conversation by typing a message.</div>
            )}
            {/** Render chat messages from hook state */}
            {Array.isArray(messages) && messages.map((m, idx) => (
              <div key={idx} className={`my-2 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-3 py-2 rounded-lg ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="p-2 border-t">
            <div className="flex gap-2 items-center">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                disabled={false}
              />
              <button onClick={onSend} className="px-4 py-2 bg-blue-600 text-white rounded-md">Send</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AiChatWidget;
