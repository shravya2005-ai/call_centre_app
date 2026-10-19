import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Phone,
  Trash2
} from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { useCall } from '../../context/CallContext';
import { ScheduleModal } from './ScheduleModal';

export const CalendarPage = () => {
  const { calendarEvents, deleteCalendarEvent } = useAppData();
  const { startCall } = useCall();

  // Current viewed month: default October 2026
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // 0-indexed: 9 = October
  const [selectedDate, setSelectedDate] = useState('2026-10-19');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(9);
    setSelectedDate('2026-10-19');
  };

  // Build grid days for the month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Events for selected date
  const eventsForSelectedDate = calendarEvents.filter((ev) => ev.date === selectedDate);

  // Check if a day has events
  const getEventsForDay = (dayNum) => {
    const formatted = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    return calendarEvents.filter((ev) => ev.date === formatted);
  };

  const handleCallNow = (ev) => {
    startCall(
      {
        name: ev.leadName,
        phone: ev.phone,
        brand: 'Scheduled Callback',
        product: ev.type
      },
      'demo'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E0D6] pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#39342F] tracking-tight">
            Follow-up & Callback Calendar
          </h1>
          <p className="text-xs md:text-sm text-[#736B63] mt-0.5">
            Coordinate customer callbacks, store visit appointments, and financing follow-ups.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsScheduleOpen(true)}
            className="px-4 py-2 bg-[#62564C] hover:bg-[#52473E] text-white text-xs font-semibold rounded-xl shadow-xs transition flex items-center gap-1.5 active:scale-95"
          >
            <Plus size={15} className="text-[#B69A78]" />
            <span>Schedule Follow-up</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Calendar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Monthly Grid (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E8E0D6] p-5 md:p-6 shadow-xs flex flex-col justify-between">
          <div>
            {/* Month Switcher Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-[#39342F]">
                  {monthNames[currentMonth]} {currentYear}
                </h2>
                <button
                  onClick={handleToday}
                  className="px-2.5 py-1 text-xs font-semibold bg-[#FAF7F2] hover:bg-[#F2ECE3] text-[#39342F] border border-[#E8E0D6] rounded-lg transition"
                >
                  Today
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg border border-[#E8E0D6] hover:bg-[#FAF7F2] text-[#736B63] transition"
                  title="Previous month"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg border border-[#E8E0D6] hover:bg-[#FAF7F2] text-[#736B63] transition"
                  title="Next month"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[#736B63] mb-2">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Calendar Cells */}
            <div className="grid grid-cols-7 gap-1.5 md:gap-2">
              {/* Blank empty cells before first day */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="h-14 md:h-18 rounded-xl bg-[#FAF7F2]/40 opacity-30" />
              ))}

              {/* Month Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const isSelected = selectedDate === formattedDate;
                const isToday = formattedDate === '2026-10-19';
                const dayEvents = getEventsForDay(dayNum);

                return (
                  <button
                    key={dayNum}
                    onClick={() => setSelectedDate(formattedDate)}
                    className={`h-14 md:h-18 p-1.5 rounded-xl border flex flex-col justify-between text-left transition relative ${
                      isSelected
                        ? 'bg-[#62564C] text-white border-[#62564C] shadow-xs'
                        : isToday
                        ? 'bg-[#F5EFE8] border-[#B69A78] text-[#39342F]'
                        : 'bg-white border-[#E8E0D6] hover:border-[#B69A78]/60 text-[#39342F]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold leading-none ${
                          isSelected
                            ? 'text-white'
                            : isToday
                            ? 'text-[#8E7252]'
                            : 'text-[#39342F]'
                        }`}
                      >
                        {dayNum}
                      </span>
                      {isToday && (
                        <span className="text-[9px] px-1 rounded-xs bg-[#B69A78] text-white font-bold hidden md:inline">
                          Today
                        </span>
                      )}
                    </div>

                    {/* Event indicators */}
                    <div className="flex items-center gap-1 overflow-hidden mt-1">
                      {dayEvents.slice(0, 3).map((ev, idx) => (
                        <span
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected
                              ? 'bg-[#B69A78]'
                              : ev.priority === 'Hot'
                              ? 'bg-[#934938]'
                              : 'bg-[#B69A78]'
                          }`}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="text-[9px] text-[#736B63]">+{dayEvents.length - 3}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#E8E0D6]/60 flex items-center justify-between text-xs text-[#736B63]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#934938]" /> Hot Follow-up
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#B69A78]" /> Scheduled Call
              </span>
            </div>
            <span>Selected date: <strong className="text-[#39342F] font-mono">{selectedDate}</strong></span>
          </div>
        </div>

        {/* Right: Daily Agenda (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E8E0D6] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#E8E0D6]/60 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#39342F]">Agenda for {selectedDate}</h3>
                <p className="text-xs text-[#736B63]">
                  {eventsForSelectedDate.length} scheduled action{eventsForSelectedDate.length === 1 ? '' : 's'}
                </p>
              </div>
              <button
                onClick={() => setIsScheduleOpen(true)}
                className="p-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F2ECE3] text-[#39342F] border border-[#E8E0D6]"
                title="Add event on this date"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Agenda List */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {eventsForSelectedDate.length === 0 ? (
                <div className="p-8 text-center text-[#938A82] text-xs">
                  <CalendarIcon size={32} className="mx-auto mb-2 opacity-40 text-[#62564C]" />
                  <p>No calls or follow-ups scheduled for this day.</p>
                  <button
                    onClick={() => setIsScheduleOpen(true)}
                    className="mt-3 text-[#62564C] font-semibold underline text-xs inline-block hover:text-[#39342F]"
                  >
                    + Schedule callback
                  </button>
                </div>
              ) : (
                eventsForSelectedDate.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3.5 rounded-xl border border-[#E8E0D6] bg-[#FAF7F2] hover:bg-[#F5EFE8] transition space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#39342F]">{ev.leadName}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold border ${
                              ev.priority === 'Hot'
                                ? 'bg-[#F9ECE7] text-[#934938] border-[#EDD3CB]'
                                : 'bg-[#F5EFE8] text-[#8E7252] border-[#E8E0D6]'
                            }`}
                          >
                            {ev.priority}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#736B63] font-mono mt-0.5 flex items-center gap-2">
                          <span className="flex items-center gap-1 text-[#62564C] font-semibold">
                            <Clock size={11} /> {ev.time}
                          </span>
                          <span>{ev.phone}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteCalendarEvent(ev.id)}
                        className="text-[#938A82] hover:text-[#934938] p-1 rounded transition"
                        title="Delete event"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {ev.notes && (
                      <p className="text-[11px] text-[#554D46] bg-white p-2 rounded-lg border border-[#E8E0D6] leading-relaxed">
                        {ev.notes}
                      </p>
                    )}

                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[10px] text-[#736B63] uppercase font-medium">{ev.type}</span>
                      <button
                        onClick={() => handleCallNow(ev)}
                        className="px-3 py-1 rounded-lg bg-[#62564C] hover:bg-[#52473E] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition active:scale-95"
                      >
                        <Phone size={12} className="text-[#B69A78]" />
                        <span>Call Now</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        defaultDate={selectedDate}
      />
    </div>
  );
};
