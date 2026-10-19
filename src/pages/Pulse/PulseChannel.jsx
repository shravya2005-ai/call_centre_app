import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Send,
  Hash
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { NeedsInputCard } from './NeedsInputCard';

export const PulseChannel = ({ channelId, onBack }) => {
  const { channels, sendChannelMessage } = useAppData();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const channel = channels.find((c) => c.id === channelId) || channels[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channel?.messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChannelMessage(channel.id, inputText);
    setInputText('');
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E8E0D6] shadow-xs flex flex-col h-[750px] max-h-[85vh] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 bg-[#62564C] text-white flex items-center justify-between border-b border-[#52473E]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg text-[#E8E0D6] hover:text-white hover:bg-white/10 transition"
            title="Back to Pulse Home"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Hash size={16} className="text-[#B69A78]" />
              <h3 className="text-sm font-bold text-white tracking-wide">{channel.name}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#52473E] text-[#E8E0D6] border border-[#76675B]">
                {channel.brand}
              </span>
            </div>
            <p className="text-[11px] text-[#D4C9BD] truncate mt-0.5">{channel.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#E8E0D6]">
          <span className="w-2 h-2 rounded-full bg-[#B69A78] animate-pulse" />
          <span className="hidden sm:inline">AvaniBot AI Active</span>
        </div>
      </div>

      {/* Main Chat Scroll Container */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#FAF7F2]">
        {/* Pinned Needs Your Input Card if present */}
        {channel.pinnedInputCard && (
          <NeedsInputCard
            card={channel.pinnedInputCard}
            channelId={channel.id}
          />
        )}

        {/* Message Stream */}
        <div className="space-y-3 pt-2">
          {channel.messages.map((msg) => {
            const isMe = !msg.isAi && msg.sender.includes('You');
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${
                  isMe ? 'justify-end' : 'justify-start'
                }`}
              >
                {!isMe && (
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      msg.isAi
                        ? 'bg-[#B69A78] text-white shadow-xs'
                        : 'bg-[#52473E] text-white'
                    }`}
                  >
                    {msg.avatar || (msg.isAi ? '🤖' : 'U')}
                  </div>
                )}

                <div className={`max-w-md ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[11px] font-bold text-[#39342F]">{msg.sender}</span>
                    <span className="text-[10px] text-[#938A82] font-mono">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                      isMe
                        ? 'bg-[#62564C] text-white rounded-tr-xs'
                        : 'bg-white border border-[#E8E0D6] text-[#39342F] rounded-tl-xs'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>

                {isMe && (
                  <div className="w-8 h-8 rounded-full bg-[#52473E] text-[#FAF7F2] font-bold text-xs flex items-center justify-center shrink-0">
                    AR
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input Composer */}
      <form onSubmit={handleSend} className="p-3.5 bg-white border-t border-[#E8E0D6] flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Message #${channel.name} (AvaniBot will assist)...`}
          className="flex-1 px-4 py-2.5 text-xs bg-[#FAF7F2] border border-[#E8E0D6] rounded-xl text-[#39342F] placeholder:text-[#938A82] focus:outline-none focus:ring-2 focus:ring-[#B69A78]"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="px-4 py-2.5 rounded-xl bg-[#62564C] hover:bg-[#52473E] text-white disabled:opacity-40 transition flex items-center gap-1.5 text-xs font-semibold shadow-xs"
        >
          <span>Send</span>
          <Send size={13} />
        </button>
      </form>
    </div>
  );
};
