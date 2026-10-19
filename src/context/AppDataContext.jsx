import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialLeads,
  initialIncomingCalls,
  initialRecentCalls,
  initialCalendarEvents,
  initialPulseChannels,
  initialAiAgents,
  initialChartData,
  initialKpis
} from '../data/initialData';

const AppDataContext = createContext();

export const AppDataProvider = ({ children }) => {
  // Load from localStorage or fallback
  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem('onground_leads');
    return saved ? JSON.parse(saved) : initialLeads;
  });

  const [incomingCalls, setIncomingCalls] = useState(() => {
    const saved = localStorage.getItem('onground_incoming');
    return saved ? JSON.parse(saved) : initialIncomingCalls;
  });

  const [recentCalls, setRecentCalls] = useState(() => {
    const saved = localStorage.getItem('onground_recent');
    return saved ? JSON.parse(saved) : initialRecentCalls;
  });

  const [calendarEvents, setCalendarEvents] = useState(() => {
    const saved = localStorage.getItem('onground_calendar');
    return saved ? JSON.parse(saved) : initialCalendarEvents;
  });

  const [channels, setChannels] = useState(() => {
    const saved = localStorage.getItem('onground_channels');
    return saved ? JSON.parse(saved) : initialPulseChannels;
  });

  const [kpis, setKpis] = useState(() => {
    const saved = localStorage.getItem('onground_kpis');
    return saved ? JSON.parse(saved) : initialKpis;
  });

  const [activeLeadModalId, setActiveLeadModalId] = useState(null);

  const [notifications, setNotifications] = useState([
    {
      id: 'n-1',
      title: 'High ICP Walk-out Alert',
      message: 'Mukunda Dwarkanath (Score 96) walked out of Indiranagar store 30m ago.',
      time: '12m ago',
      read: false,
      leadId: 'lead-1'
    },
    {
      id: 'n-2',
      title: 'Callback Scheduled',
      message: 'Sneha Roy requested callback at 2:30 PM regarding Diwali voucher.',
      time: '45m ago',
      read: false,
      leadId: 'lead-4'
    },
    {
      id: 'n-3',
      title: 'AI Pitch Coach Milestone',
      message: '+23.6pp conversion lift achieved by naming shoppers today!',
      time: '2h ago',
      read: true
    }
  ]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('onground_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('onground_incoming', JSON.stringify(incomingCalls));
  }, [incomingCalls]);

  useEffect(() => {
    localStorage.setItem('onground_recent', JSON.stringify(recentCalls));
  }, [recentCalls]);

  useEffect(() => {
    localStorage.setItem('onground_calendar', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem('onground_channels', JSON.stringify(channels));
  }, [channels]);

  useEffect(() => {
    localStorage.setItem('onground_kpis', JSON.stringify(kpis));
  }, [kpis]);

  // Lead modal controls
  const openLeadModal = (leadId) => {
    setActiveLeadModalId(leadId);
  };

  const closeLeadModal = () => {
    setActiveLeadModalId(null);
  };

  const navigateLeadModal = (direction) => {
    if (!activeLeadModalId) return;
    const currentIndex = leads.findIndex((l) => l.id === activeLeadModalId);
    if (currentIndex === -1) return;
    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex < 0) nextIndex = leads.length - 1;
    if (nextIndex >= leads.length) nextIndex = 0;
    setActiveLeadModalId(leads[nextIndex].id);
  };

  // Add a newly finished call to Recent calls and update KPIs
  const logFinishedCall = ({ contact, durationSeconds, outcome, notes, dealValue, nextFollowUpDate }) => {
    const formattedDuration = `${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s`;
    const newRecentCall = {
      id: `rec-${Date.now()}`,
      name: contact.name || 'Caller ' + contact.phone,
      phone: contact.phone,
      brand: contact.brand || 'The Sleep Company',
      product: contact.product || 'Inquiry Call',
      type: contact.isCallback ? 'Inbound Callback' : 'Outbound',
      dateTime: 'Just now',
      duration: formattedDuration,
      durationSeconds,
      outcome: outcome || 'Call Completed',
      sentiment: outcome === 'Order Closed' ? 'Positive (92%)' : 'Neutral',
      sopScore: outcome === 'Order Closed' ? 95 : 88,
      notes: notes || 'No call notes entered.',
      valueClosed: dealValue ? `₹${Number(dealValue).toLocaleString('en-IN')}` : '₹0',
      transcript: [
        { speaker: 'Agent', text: `Hello ${contact.name || 'there'}, Akshat here from On-Ground customer desk.` },
        { speaker: 'Customer', text: 'Thank you for following up so promptly!' },
        { speaker: 'Agent', text: notes ? `Notes logged: ${notes}` : 'Discussed product details and resolved inquiries.' }
      ]
    };

    setRecentCalls((prev) => [newRecentCall, ...prev]);

    // Update KPIs
    setKpis((prev) => {
      const isClosed = outcome === 'Order Closed';
      const addedRevenue = isClosed && dealValue ? Number(dealValue) : 0;
      const currentRevenueNum = parseInt(prev.revenueClosedToday.replace(/[^\d]/g, '') || '0', 10);
      const newRevenueTotal = currentRevenueNum + addedRevenue;
      const earningsNum = parseInt(prev.myEarningsToday.replace(/[^\d]/g, '') || '0', 10);
      const addedEarnings = isClosed ? Math.round(addedRevenue * 0.03) + 500 : 100; // commission + call incentive

      return {
        ...prev,
        callsMadeToday: prev.callsMadeToday + 1,
        conversionsToday: isClosed ? prev.conversionsToday + 1 : prev.conversionsToday,
        revenueClosedToday: `₹${newRevenueTotal.toLocaleString('en-IN')}`,
        myEarningsToday: `₹${(earningsNum + addedEarnings).toLocaleString('en-IN')}`,
        targetProgressPercent: Math.min(100, Math.round(((earningsNum + addedEarnings) / 8000) * 100))
      };
    });

    // If follow-up date was scheduled, add to calendar
    if (nextFollowUpDate) {
      const newEvent = {
        id: `ev-${Date.now()}`,
        title: `Follow-up: ${contact.name}`,
        leadName: contact.name,
        phone: contact.phone,
        date: nextFollowUpDate.split('T')[0] || new Date().toISOString().split('T')[0],
        time: nextFollowUpDate.split('T')[1] || '14:00',
        type: 'Scheduled Follow-up',
        status: 'Scheduled',
        priority: 'Hot',
        notes: notes || 'Follow up from call disposition.'
      };
      setCalendarEvents((prev) => [...prev, newEvent]);
    }

    // If contact was an incoming missed call, mark it resolved
    if (contact.incomingId) {
      resolveIncomingCall(contact.incomingId);
    }

    // Update lead status if matched
    if (contact.leadId) {
      setLeads((prev) =>
        prev.map((lead) => {
          if (lead.id === contact.leadId) {
            return {
              ...lead,
              status: outcome === 'Order Closed' ? 'Closed' : 'Contacted',
              callCount: (lead.callCount || 0) + 1,
              lastContact: 'Just now',
              agentNotes: notes ? `${notes} (Last call)` : lead.agentNotes
            };
          }
          return lead;
        })
      );
    }
  };

  // Incoming call handling
  const resolveIncomingCall = (id) => {
    setIncomingCalls((prev) =>
      prev.map((call) => (call.id === id ? { ...call, status: 'Resolved' } : call))
    );
  };

  // Calendar Event actions
  const addCalendarEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: `ev-${Date.now()}`
    };
    setCalendarEvents((prev) => [...prev, newEvent]);
  };

  const updateCalendarEvent = (id, updatedFields) => {
    setCalendarEvents((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, ...updatedFields } : ev))
    );
  };

  const deleteCalendarEvent = (id) => {
    setCalendarEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  // Pulse Channel actions
  const sendChannelMessage = (channelId, text) => {
    if (!text.trim()) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'Akshat Rajan (You)',
      role: 'Telecaller #4',
      avatar: 'AR',
      isAi: false,
      timestamp: 'Just now',
      content: text
    };

    setChannels((prev) =>
      prev.map((ch) => {
        if (ch.id === channelId) {
          return {
            ...ch,
            messages: [...ch.messages, newMsg]
          };
        }
        return ch;
      })
    );

    // Dynamic AI response simulation from AvaniBot or Pitch Coach
    setTimeout(() => {
      const aiReplies = [
        `AvaniBot: Noted Akshat! I've updated the CRM notes and synced this with the Indiranagar store manager.`,
        `Pitch Coach Agent: Excellent communication. The customer's objection was handled smoothly.`,
        `AvaniBot: Logged! Next SOP deadline set for 4:00 PM.`
      ];
      const randomReply = aiReplies[Math.floor(Math.random() * aiReplies.length)];

      const aiMsg = {
        id: `msg-ai-${Date.now()}`,
        sender: 'AvaniBot',
        role: 'AI Coordinator',
        avatar: '🤖',
        isAi: true,
        timestamp: 'Just now',
        content: randomReply
      };

      setChannels((prev) =>
        prev.map((ch) => {
          if (ch.id === channelId) {
            return {
              ...ch,
              messages: [...ch.messages, aiMsg]
            };
          }
          return ch;
        })
      );
    }, 1200);
  };

  const answerPinnedInputCard = (channelId, resolutionText, actionChoice) => {
    setChannels((prev) =>
      prev.map((ch) => {
        if (ch.id === channelId && ch.pinnedInputCard) {
          return {
            ...ch,
            pinnedInputCard: {
              ...ch.pinnedInputCard,
              resolved: true,
              resolutionText: resolutionText || `Selected action: ${actionChoice}`
            },
            messages: [
              ...ch.messages,
              {
                id: `msg-${Date.now()}`,
                sender: 'Akshat Rajan (You)',
                role: 'Telecaller #4',
                avatar: 'AR',
                isAi: false,
                timestamp: 'Just now',
                content: `✅ Actioned exception for ${ch.pinnedInputCard.title}: "${resolutionText || actionChoice}".`
              },
              {
                id: `msg-bot-${Date.now() + 1}`,
                sender: 'AvaniBot',
                role: 'AI System',
                avatar: '🤖',
                isAi: true,
                timestamp: 'Just now',
                content: `Approval recorded and SMS voucher code dispatched to lead! Status marked resolved in store terminal.`
              }
            ]
          };
        }
        return ch;
      })
    );
  };

  // Mark notification read
  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <AppDataContext.Provider
      value={{
        leads,
        setLeads,
        incomingCalls,
        recentCalls,
        calendarEvents,
        channels,
        kpis,
        aiAgents: initialAiAgents,
        chartData: initialChartData,
        activeLeadModalId,
        openLeadModal,
        closeLeadModal,
        navigateLeadModal,
        logFinishedCall,
        resolveIncomingCall,
        addCalendarEvent,
        updateCalendarEvent,
        deleteCalendarEvent,
        sendChannelMessage,
        answerPinnedInputCard,
        notifications,
        markNotificationRead,
        markAllNotificationsRead
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => useContext(AppDataContext);
