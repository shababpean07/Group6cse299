"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAiChat } from "@/hooks/useAiChat";
import { Send, X, MessageCircle, Bot, User, Sparkles, Minimize2, Trash2 } from "lucide-react";

export function AiChatWidget() {
  const { messages, isLoading, send, clear } = useAiChat();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, open]);

  useEffect(() => {
    if (isLoading) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isLoading, messages]);

  const onSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    send(text);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <>
      {!open && (
        <button
          aria-label="Open AI chat"
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)',
            border: 'none',
            boxShadow: '0 8px 25px rgba(13,115,119,0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9998,
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(13,115,119,0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(13,115,119,0.4)';
          }}
        >
          <MessageCircle style={{ width: 26, height: 26, color: '#fff' }} />
        </button>
      )}

      {open && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 400,
          height: 560,
          maxHeight: '80vh',
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 9999,
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Bot style={{ width: 22, height: 22, color: '#fff' }} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#fff' }}>AI Assistant</h3>
                <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles style={{ width: 12, height: 12 }} />
                  Always here to help
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={clear}
                title="Clear chat"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  borderRadius: 10,
                  width: 36,
                  height: 36,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              >
                <Trash2 style={{ width: 16, height: 16, color: '#fff' }} />
              </button>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  borderRadius: 10,
                  width: 36,
                  height: 36,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              >
                <Minimize2 style={{ width: 16, height: 16, color: '#fff' }} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: 20,
            overflowY: 'auto',
            background: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            {messages.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
              }}>
                <div style={{
                  width: 80,
                  height: 80,
                  margin: '0 auto 16px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(13,115,119,0.1) 0%, rgba(20,255,236,0.1) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Sparkles style={{ width: 36, height: 36, color: '#0D7377' }} />
                </div>
                <h4 style={{ margin: '0 0 8px', fontSize: 16, color: '#1e293b' }}>Welcome to NSU ClubHub AI!</h4>
                <p style={{ margin: 0, fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
                  I can help you with:<br/>
                  • Finding clubs and events<br/>
                  • Understanding recruitment cycles<br/>
                  • Getting event details and schedules
                </p>
              </div>
            )}

            {messages.map((m, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                  animation: 'fadeIn 0.2s ease-out',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 8, maxWidth: '85%' }}>
                  {m.role === 'ai' && (
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: '#0D7377',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Bot style={{ width: 14, height: 14, color: '#fff' }} />
                    </div>
                  )}
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: m.role === 'user' 
                      ? 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)' 
                      : '#fff',
                    color: m.role === 'user' ? '#fff' : '#1e293b',
                    fontSize: 14,
                    lineHeight: 1.5,
                    boxShadow: m.role === 'ai' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                    border: m.role === 'ai' ? '1px solid #e2e8f0' : 'none',
                  }}>
                    {m.content}
                  </div>
                  {m.role === 'user' && (
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: '#6366f1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <User style={{ width: 14, height: 14, color: '#fff' }} />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: '#0D7377',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Bot style={{ width: 14, height: 14, color: '#fff' }} />
                </div>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: 18,
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  gap: 4,
                }}>
                  <span style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#0D7377',
                    animation: 'bounce 1.4s infinite ease-in-out both',
                    animationDelay: '0s',
                  }} />
                  <span style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#0D7377',
                    animation: 'bounce 1.4s infinite ease-in-out both',
                    animationDelay: '0.2s',
                  }} />
                  <span style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#0D7377',
                    animation: 'bounce 1.4s infinite ease-in-out both',
                    animationDelay: '0.4s',
                  }} />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: 16,
            background: '#fff',
            borderTop: '1px solid #e2e8f0',
          }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <div style={{
                flex: 1,
                position: 'relative',
              }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    paddingRight: 50,
                    borderRadius: 14,
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    fontSize: 14,
                    outline: 'none',
                    resize: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0D7377';
                    e.target.style.boxShadow = '0 0 0 3px rgba(13,115,119,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <button
                onClick={onSend}
                disabled={!input.trim() || isLoading}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: input.trim() && !isLoading
                    ? 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)'
                    : '#e2e8f0',
                  border: 'none',
                  cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (input.trim() && !isLoading) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Send style={{ width: 18, height: 18, color: input.trim() && !isLoading ? '#fff' : '#94a3b8' }} />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.8); }
          40% { transform: scale(1.2); }
        }
      `}</style>
    </>
  );
}

export default AiChatWidget;