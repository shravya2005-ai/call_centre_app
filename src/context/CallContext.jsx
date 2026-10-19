import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { telephonySound } from '../utils/soundEffects';
import { useAppData } from './AppDataContext';

const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const { logFinishedCall } = useAppData();

  // Call states: 'idle' | 'connecting' | 'ringing' | 'connected' | 'ended'
  const [callState, setCallState] = useState('idle');
  const [callingMode, setCallingMode] = useState('demo'); // 'demo' | 'twilio' | 'tel'
  const [activeContact, setActiveContact] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isKeypadVisible, setIsKeypadVisible] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState([]);
  const [audioWaveformActive, setAudioWaveformActive] = useState(false);

  // Modals
  const [isDialPadOpen, setIsDialPadOpen] = useState(false);
  const [isDispositionOpen, setIsDispositionOpen] = useState(false);
  const [isTwilioConfigOpen, setIsTwilioConfigOpen] = useState(false);
  const [twilioConfig, setTwilioConfig] = useState({
    accountSid: '',
    authToken: '',
    twimlAppSid: '',
    callerId: '+918000000000',
    isConnected: false
  });

  // Practice call state
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [practiceScenario, setPracticeScenario] = useState(null);

  const timerRef = useRef(null);
  const speechTimeoutRef = useRef(null);

  // Duration timer
  useEffect(() => {
    if (callState === 'connected') {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  // Clean up sounds on unmount
  useEffect(() => {
    return () => {
      telephonySound.stopRingback();
      if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    };
  }, []);

  // Initiate call to a contact
  const startCall = (contact, mode = 'demo') => {
    if (!contact || !contact.phone) return;

    if (mode === 'tel' || callingMode === 'tel') {
      // Trigger native phone dialer
      window.location.href = `tel:${contact.phone.replace(/\s+/g, '')}`;
      return;
    }

    setActiveContact(contact);
    setCallDuration(0);
    setIsMuted(false);
    setIsOnHold(false);
    setIsKeypadVisible(false);
    setLiveTranscript([]);
    setCallState('connecting');

    // Telephony sound: short connecting latency, then ringing
    setTimeout(() => {
      setCallState('ringing');
      telephonySound.startRingback();

      // Simulate contact answering after 3.5 seconds
      speechTimeoutRef.current = setTimeout(() => {
        telephonySound.playConnectChime();
        setCallState('connected');
        setAudioWaveformActive(true);

        // Add realistic starting greeting to live transcript
        const initialCustomerLine = contact.name
          ? `Hello? Yes, this is ${contact.name.split(' ')[0]}. Who is calling?`
          : 'Hello? Yes, speaking.';

        setLiveTranscript([
          { speaker: 'System', text: 'Call connected (HD Audio Codec Opus 24kHz)' },
          { speaker: 'Customer', text: initialCustomerLine }
        ]);

        // Second response simulation after 4 seconds
        setTimeout(() => {
          if (contact.brand) {
            setLiveTranscript((prev) => [
              ...prev,
              {
                speaker: 'Customer',
                text: `Ah yes! I was at the ${contact.brand} store earlier. I was inquiring about ${contact.product || 'the product'}.`
              }
            ]);
          }
        }, 4000);
      }, 3500);
    }, 1000);
  };

  // Start a Pitch Coach AI Practice Call
  const startPracticeCall = (scenario) => {
    setIsPracticeMode(true);
    setPracticeScenario(scenario);
    startCall({
      name: scenario.customerName || 'Skeptical Walk-out Shopper',
      phone: '+91 99000 88771',
      brand: scenario.brand || 'The Sleep Company',
      product: scenario.product || 'SmartGRID Ortho Pro',
      isPractice: true,
      scenarioTitle: scenario.title
    });
  };

  // Terminate active call
  const endCall = () => {
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    telephonySound.playHangupTone();
    setCallState('ended');
    setAudioWaveformActive(false);

    // Open post-call disposition modal to save notes and outcome
    setTimeout(() => {
      setIsDispositionOpen(true);
    }, 600);
  };

  // Toggle Mute
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  // Toggle Hold
  const toggleHold = () => {
    setIsOnHold((prev) => !prev);
  };

  // Toggle Speaker
  const toggleSpeaker = () => {
    setIsSpeakerOn((prev) => !prev);
  };

  // Play DTMF Tone
  const playDtmf = (digit) => {
    telephonySound.playDtmf(digit);
  };

  // Save disposition and finalize
  const submitDisposition = ({ outcome, notes, dealValue, nextFollowUpDate }) => {
    if (activeContact) {
      logFinishedCall({
        contact: activeContact,
        durationSeconds: callDuration,
        outcome,
        notes,
        dealValue,
        nextFollowUpDate
      });
    }

    // Reset call state
    setIsDispositionOpen(false);
    setCallState('idle');
    setActiveContact(null);
    setCallDuration(0);
    setIsPracticeMode(false);
    setPracticeScenario(null);
  };

  const closeDisposition = () => {
    setIsDispositionOpen(false);
    setCallState('idle');
    setActiveContact(null);
    setCallDuration(0);
  };

  return (
    <CallContext.Provider
      value={{
        callState,
        callingMode,
        setCallingMode,
        activeContact,
        callDuration,
        isMuted,
        isOnHold,
        isSpeakerOn,
        isKeypadVisible,
        setIsKeypadVisible,
        liveTranscript,
        audioWaveformActive,
        isDialPadOpen,
        setIsDialPadOpen,
        isDispositionOpen,
        setIsDispositionOpen,
        isTwilioConfigOpen,
        setIsTwilioConfigOpen,
        twilioConfig,
        setTwilioConfig,
        isPracticeMode,
        practiceScenario,
        startCall,
        startPracticeCall,
        endCall,
        toggleMute,
        toggleHold,
        toggleSpeaker,
        playDtmf,
        submitDisposition,
        closeDisposition
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => useContext(CallContext);
