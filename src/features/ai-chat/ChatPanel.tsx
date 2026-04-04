'use client';

import { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  readonly role: 'user' | 'assistant';
  readonly content: string;
}

interface ChatPanelProps {
  readonly onClose: () => void;
}

const SUGGESTED_QUESTIONS = [
  'What will WTI do this week?',
  'How does Iran tension affect prices?',
  'Explain the latest SPR release',
  'Is Brent overvalued right now?',
];

export default function ChatPanel({ onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<readonly ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: text.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const json = await res.json();
      if (json.content) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: json.content },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Communication error. AI engine offline.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed right-0 top-0 bottom-0 z-40 w-[380px] flex flex-col border-l border-[var(--color-panel-border)] bg-[rgba(3,11,26,0.97)] backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-panel-border)] px-4 py-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
          AI ANALYSIS ENGINE
        </span>
        <button
          onClick={onClose}
          className="text-[var(--color-text-dim)] hover:text-[var(--color-primary)] text-sm"
        >
          [X]
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-3 space-y-3 min-h-0">
        {messages.length === 0 && (
          <div className="space-y-2 pt-4">
            <p className="text-[10px] text-[var(--color-text-dim)] text-center mb-3">
              ASK THE AI ABOUT OIL MARKETS
            </p>
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="block w-full text-left text-[10px] px-3 py-2 border border-[var(--color-panel-border)] text-[var(--color-text-dim)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`text-[11px] leading-relaxed ${
              msg.role === 'user'
                ? 'text-[var(--color-primary)] text-right'
                : 'text-[var(--color-text)]'
            }`}
          >
            <div className="text-[8px] uppercase text-[var(--color-text-dim)] mb-0.5">
              {msg.role === 'user' ? 'YOU' : 'AI ENGINE'}
            </div>
            <div
              className={`inline-block text-left px-3 py-2 rounded-sm max-w-[90%] ${
                msg.role === 'user'
                  ? 'bg-[rgba(0,240,255,0.1)] border border-[rgba(0,240,255,0.2)]'
                  : 'bg-[rgba(0,20,40,0.5)] border border-[var(--color-panel-border)]'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-[10px] text-[var(--color-primary)] pulse-glow">
            PROCESSING QUERY...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[var(--color-panel-border)] p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask about oil markets..."
            className="flex-1 bg-[rgba(0,0,0,0.3)] border border-[var(--color-panel-border)] px-3 py-1.5 text-[11px] text-[var(--color-text)] placeholder-[var(--color-text-dim)] focus:border-[var(--color-primary)] focus:outline-none"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="px-3 py-1.5 text-[10px] uppercase tracking-widest border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[rgba(0,240,255,0.1)] disabled:opacity-30 transition-colors"
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
}
