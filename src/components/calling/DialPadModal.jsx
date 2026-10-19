import React, { useState } from 'react';
import { Phone, X, Delete, User, Sparkles, Building, Settings2 } from 'lucide-react';
import { useCall } from '../../context/CallContext';
import { useAppData } from '../../context/AppDataContext';

export const DialPadModal = () => {
  const {
    isDialPadOpen,
    setIsDialPadOpen,
    startCall,
    callingMode,
    setCallingMode,
    playDtmf,
    setIsTwilioConfigOpen
  } = useCall();
  const { leads } = useAppData();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);

  if (!isDialPadOpen) return null;

  const handleDigit = (digit) => {
    playDtmf(digit);
    setPhoneNumber((prev) => prev + digit);
  };

  const handleBackspace = () => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (!phoneNumber.trim()) return;

    const contact = selectedLead || {
      name: 'Direct Dial Contact',
      phone: phoneNumber,
      brand: 'On-Ground Retail Partner',
      product: 'Inquiry Call'
    };

    setIsDialPadOpen(false);
    startCall(contact, callingMode);
  };

  const keys = [
    { num: '1', letters: '' },
    { num: '2', letters: 'ABC' },
    { num: '3', letters: 'DEF' },
    { num: '4', letters: 'GHI' },
    { num: '5', letters: 'JKL' },
    { num: '6', letters: 'MNO' },
    { num: '7', letters: 'PQRS' },
    { num: '8', letters: 'TUV' },
    { num: '9', letters: 'WXYZ' },
    { num: '*', letters: '' },
    { num: '0', letters: '+' },
    { num: '#', letters: '' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#0e3025] border border-[#235845] text-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1b4d3c] flex items-center justify-between bg-[#0a241c]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Phone size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Outbound Dial Pad</h3>
              <p className="text-[11px] text-slate-400">DTMF Tone Audio & Web Calling</p>
            </div>
          </div>
          <button
            onClick={() => setIsDialPadOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Calling Mode Selector */}
        <div className="px-6 pt-3 pb-2 flex items-center justify-between bg-[#092019] border-b border-[#1b4d3c] text-xs">
          <span className="text-slate-400">Calling Mode:</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCallingMode('demo')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                callingMode === 'demo'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Demo HD Audio
            </button>
            <button
              onClick={() => {
                setCallingMode('twilio');
                setIsTwilioConfigOpen(true);
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition flex items-center gap-1 ${
                callingMode === 'twilio'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Twilio SDK <Settings2 size={12} />
            </button>
            <button
              onClick={() => setCallingMode('tel')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                callingMode === 'tel'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Native tel:
            </button>
          </div>
        </div>

        {/* Quick select from priority leads */}
        <div className="px-6 py-2.5 border-b border-[#1b4d3c] bg-[#0c281f]">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Quick Select Walk-out Lead</span>
            <span className="text-amber-400">Score 90+</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {leads.slice(0, 4).map((lead) => (
              <button
                key={lead.id}
                onClick={() => {
                  setSelectedLead(lead);
                  setPhoneNumber(lead.phone);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs shrink-0 flex items-center gap-1.5 border transition ${
                  selectedLead?.id === lead.id
                    ? 'bg-emerald-600/30 border-emerald-400 text-white'
                    : 'bg-[#143d30] border-[#225544] text-slate-300 hover:border-slate-400'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{lead.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Number Display */}
        <div className="px-6 py-4 flex items-center justify-between">
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number..."
            className="w-full text-2xl font-mono font-semibold tracking-wider bg-transparent text-white focus:outline-none placeholder:text-slate-500"
          />
          {phoneNumber && (
            <button
              onClick={handleBackspace}
              className="p-2 text-slate-400 hover:text-white transition"
              title="Backspace"
            >
              <Delete size={20} />
            </button>
          )}
        </div>

        {/* DTMF Keypad Grid */}
        <div className="px-6 pb-6 pt-1 grid grid-cols-3 gap-3">
          {keys.map(({ num, letters }) => (
            <button
              key={num}
              onClick={() => handleDigit(num)}
              className="h-14 rounded-xl bg-[#143d30] hover:bg-[#1b4e3e] active:scale-95 border border-[#235845] flex flex-col items-center justify-center transition shadow-sm"
            >
              <span className="text-xl font-bold leading-none text-white">{num}</span>
              {letters && <span className="text-[10px] text-slate-400 tracking-widest">{letters}</span>}
            </button>
          ))}
        </div>

        {/* Call Button */}
        <div className="p-6 pt-0 flex items-center gap-3">
          <button
            onClick={handleCall}
            disabled={!phoneNumber.trim()}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition active:scale-98"
          >
            <Phone size={18} />
            <span>Call {selectedLead ? selectedLead.name.split(' ')[0] : phoneNumber || 'Number'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
