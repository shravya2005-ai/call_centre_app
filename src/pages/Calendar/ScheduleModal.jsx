import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';

export const ScheduleModal = ({ isOpen, onClose, defaultDate }) => {
  const { leads, addCalendarEvent } = useAppData();

  const [leadName, setLeadName] = useState(leads[0]?.name || '');
  const [phone, setPhone] = useState(leads[0]?.phone || '');
  const [date, setDate] = useState(defaultDate || '2026-10-19');
  const [time, setTime] = useState('14:30');
  const [type, setType] = useState('Closing Call');
  const [priority, setPriority] = useState('Hot');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleLeadSelect = (e) => {
    const selected = leads.find((l) => l.name === e.target.value);
    if (selected) {
      setLeadName(selected.name);
      setPhone(selected.phone);
    } else {
      setLeadName(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addCalendarEvent({
      title: `${type}: ${leadName}`,
      leadName,
      phone,
      date,
      time,
      type,
      priority,
      status: 'Scheduled',
      notes: notes || 'Scheduled follow-up reminder.'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-[#E8E0D6] text-[#39342F] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#62564C] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-[#B69A78]" />
            <h3 className="text-base font-bold text-white">Schedule Follow-up Call</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#E8E0D6] hover:text-white hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#736B63] uppercase tracking-wider mb-1">
              Select or Enter Lead
            </label>
            <div className="relative">
              <input
                type="text"
                list="leads-list"
                value={leadName}
                onChange={handleLeadSelect}
                placeholder="Select lead name or type custom..."
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E0D6] rounded-lg text-[#39342F] focus:outline-none focus:ring-2 focus:ring-[#B69A78]"
                required
              />
              <datalist id="leads-list">
                {leads.map((l) => (
                  <option key={l.id} value={l.name}>
                    {l.brand} • {l.phone}
                  </option>
                ))}
              </datalist>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#736B63] uppercase tracking-wider mb-1">
              Contact Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98..."
              className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E0D6] rounded-lg text-[#39342F] focus:outline-none focus:ring-2 focus:ring-[#B69A78]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#736B63] uppercase tracking-wider mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E0D6] rounded-lg text-[#39342F] focus:outline-none focus:ring-2 focus:ring-[#B69A78]"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-[#736B63] uppercase tracking-wider mb-1">
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E0D6] rounded-lg text-[#39342F] focus:outline-none focus:ring-2 focus:ring-[#B69A78]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#736B63] uppercase tracking-wider mb-1">
                Call Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E0D6] rounded-lg text-[#39342F] focus:outline-none focus:ring-2 focus:ring-[#B69A78]"
              >
                <option value="Closing Call">Closing Call</option>
                <option value="Follow-up">Follow-up</option>
                <option value="EMI Verification">EMI Verification</option>
                <option value="Product Demo">Product Demo</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#736B63] uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E0D6] rounded-lg text-[#39342F] focus:outline-none focus:ring-2 focus:ring-[#B69A78]"
              >
                <option value="Hot">Hot</option>
                <option value="Warm">Warm</option>
                <option value="Normal">Normal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#736B63] uppercase tracking-wider mb-1">
              Follow-up Agenda / Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Verify HDFC credit card 0% EMI sanction code..."
              className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E0D6] rounded-lg text-[#39342F] placeholder:text-[#938A82] focus:outline-none focus:ring-2 focus:ring-[#B69A78]"
            />
          </div>

          {/* Footer */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E8E0D6]/60">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-[#736B63] hover:text-[#39342F] rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#62564C] hover:bg-[#52473E] text-white font-semibold rounded-xl shadow-xs transition"
            >
              Save Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
