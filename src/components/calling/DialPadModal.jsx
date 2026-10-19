import React, { useState } from 'react';
import { Phone, X, Delete, Settings2 } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-[#62564C] border border-[#76675B] text-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#52473E] flex items-center justify-between bg-[#52473E]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#62564C] border border-[#76675B] text-[#B69A78] flex items-center justify-center">
              <Phone size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Outbound Dial Pad</h3>
              <p className="text-[11px] text-[#D4C9BD]">DTMF Tone Audio & Web Calling</p>
            </div>
          </div>
          <button
            onClick={() => setIsDialPadOpen(false)}
            className="p-1 rounded-lg text-[#D4C9BD] hover:text-white hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Calling Mode Selector */}
        <div className="px-6 pt-3 pb-2 flex items-center justify-between bg-[#52473E] border-b border-[#6B5E53] text-xs">
          <span className="text-[#D4C9BD]">Calling Mode:</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCallingMode('demo')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                callingMode === 'demo'
                  ? 'bg-[#B69A78] text-white shadow-xs'
                  : 'text-[#D4C9BD] hover:text-white'
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
                  ? 'bg-[#B69A78] text-white shadow-xs'
                  : 'text-[#D4C9BD] hover:text-white'
              }`}
            >
              Twilio SDK <Settings2 size={12} />
            </button>
            <button
              onClick={() => setCallingMode('tel')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                callingMode === 'tel'
                  ? 'bg-[#B69A78] text-white shadow-xs'
                  : 'text-[#D4C9BD] hover:text-white'
              }`}
            >
              Native tel:
            </button>
          </div>
        </div>

        {/* Quick select from priority leads */}
        <div className="px-6 py-2.5 border-b border-[#6B5E53] bg-[#52473E]">
          <div className="text-[11px] font-semibold text-[#D4C9BD] uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Quick Select Walk-out Lead</span>
            <span className="text-[#B69A78]">Score 90+</span>
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
                    ? 'bg-[#B69A78] border-[#C5AA89] text-white'
                    : 'bg-[#62564C] border-[#76675B] text-[#FAF7F2] hover:border-[#B69A78]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#B69A78]" />
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
            className="w-full text-2xl font-mono font-semibold tracking-wider bg-transparent text-white focus:outline-none placeholder:text-[#938A82]"
          />
          {phoneNumber && (
            <button
              onClick={handleBackspace}
              className="p-2 text-[#D4C9BD] hover:text-white transition"
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
              className="h-14 rounded-xl bg-[#52473E] hover:bg-[#6F6257] active:scale-95 border border-[#6B5E53] flex flex-col items-center justify-center transition shadow-xs"
            >
              <span className="text-xl font-bold leading-none text-white">{num}</span>
              {letters && <span className="text-[10px] text-[#D4C9BD] tracking-widest">{letters}</span>}
            </button>
          ))}
        </div>

        {/* Call Button */}
        <div className="p-6 pt-0 flex items-center gap-3">
          <button
            onClick={handleCall}
            disabled={!phoneNumber.trim()}
            className="w-full py-3.5 rounded-xl bg-[#B69A78] hover:bg-[#A48968] disabled:opacity-40 text-white font-semibold flex items-center justify-center gap-2 shadow-md transition active:scale-98"
          >
            <Phone size={18} />
            <span>Call {selectedLead ? selectedLead.name.split(' ')[0] : phoneNumber || 'Number'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
