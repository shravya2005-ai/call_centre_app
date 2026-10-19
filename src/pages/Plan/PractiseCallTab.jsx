import React from 'react';
import { Sparkles, Phone, Bot, Target } from 'lucide-react';
import { useCall } from '../../context/CallContext';

export const PractiseCallTab = () => {
  const { startPracticeCall } = useCall();

  const scenarios = [
    {
      id: 'scen-1',
      title: 'Skeptical Walk-out: SmartGRID vs Spring Mattress',
      customerName: 'Amit Verma (Ortho Buyer)',
      brand: 'The Sleep Company',
      product: 'SmartGRID Ortho Pro King',
      difficulty: 'Intermediate',
      objection: 'Walked out thinking latex or memory foam is better for lower back pain. Skeptical of grid technology.',
      learningGoal: 'Name the shopper (+23.6pp lift), explain patented hyper-elastic polymer, pitch 100-night trial.',
      coachTip: 'Remind him that memory foam traps heat and collapses after 2 years; SmartGRID stays responsive forever.'
    },
    {
      id: 'scen-2',
      title: 'Price Objection: Demanding Extra Discount',
      customerName: 'Pooja Iyer (Living Room Makeover)',
      brand: 'Furnishka',
      product: 'Solid Teak 6-Seater Dining Set',
      difficulty: 'Advanced',
      objection: 'Quotes cheaper rubberwood furniture seen on Pepperfry/UrbanLadder.',
      learningGoal: 'Reframe price vs longevity: Teak lasts 25+ years vs 3 years for compressed particle board.',
      coachTip: 'Offer factory-treated stain resistant fabric upgrade instead of dropping margin on core teak wood.'
    },
    {
      id: 'scen-3',
      title: 'Urgent Delivery Constraint',
      customerName: 'Karthik Rao (House Warming)',
      brand: 'Duroflex',
      product: 'Duropedic Balance Mattress',
      difficulty: 'Beginner',
      objection: 'Needs mattress by this Thursday; standard courier takes 7 days.',
      learningGoal: 'Coordinate with store warehouse for local van dispatch within 48 hours.',
      coachTip: 'Confirm pincode first, verify warehouse reserve stock, and close immediately.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-[#62564C] text-white rounded-2xl p-6 border border-[#52473E] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#52473E] text-[#FAF7F2] border border-[#76675B] text-xs font-semibold">
              <Sparkles size={14} className="text-[#B69A78]" />
              <span>Pitch Coach AI Simulator</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Practise Outbound Calls in Safe Simulation
            </h2>
            <p className="text-xs text-[#D4C9BD] max-w-xl leading-relaxed">
              Roleplay challenging retail walk-out objections with our AI Shopper persona before calling real prospects.
              Our Pitch Coach Agent scores your talk tracks against On-Ground's retail SOP benchmarks.
            </p>
          </div>

          <div className="bg-[#52473E] p-4 rounded-xl border border-[#6B5E53] text-center shrink-0">
            <div className="text-xs text-[#D4C9BD]">Your SOP Adherence</div>
            <div className="text-2xl font-bold font-mono text-[#FAF7F2] mt-0.5">94%</div>
            <div className="text-[11px] text-[#B69A78] font-semibold mt-1">+23.6pp lift active</div>
          </div>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((scen) => (
          <div
            key={scen.id}
            className="bg-white rounded-2xl border border-[#E8E0D6] p-5 shadow-xs flex flex-col justify-between hover:border-[#B69A78]/50 transition"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#736B63] border border-[#E8E0D6]">
                  {scen.difficulty}
                </span>
                <span className="text-xs font-bold text-[#62564C] font-mono">{scen.brand}</span>
              </div>

              <h3 className="text-sm font-bold text-[#39342F] leading-snug">{scen.title}</h3>
              <p className="text-xs text-[#736B63] font-mono mt-0.5">Persona: {scen.customerName}</p>

              <div className="mt-3 p-3 bg-[#F7F2EC] border border-[#E8E0D6] rounded-xl text-xs text-[#39342F] space-y-1">
                <div className="font-semibold text-[#8E7252] flex items-center gap-1">
                  <Target size={12} className="text-[#B69A78]" />
                  <span>Customer Objection</span>
                </div>
                <p className="text-[11px] text-[#554D46] leading-relaxed">{scen.objection}</p>
              </div>

              <div className="mt-3 p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E0D6] text-xs text-[#554D46] space-y-1">
                <div className="font-semibold text-[#39342F] flex items-center gap-1">
                  <Bot size={12} className="text-[#8E7252]" />
                  <span>Coach Tip</span>
                </div>
                <p className="text-[11px] text-[#736B63] leading-relaxed">{scen.coachTip}</p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#E8E0D6]/60">
              <button
                onClick={() => startPracticeCall(scen)}
                className="w-full py-2.5 rounded-xl bg-[#62564C] hover:bg-[#52473E] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition active:scale-95"
              >
                <Phone size={14} className="text-[#B69A78]" />
                <span>Start Practice Call</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
