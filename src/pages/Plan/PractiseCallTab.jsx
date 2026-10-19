import React from 'react';
import { Sparkles, Phone, Bot, Target, Shield, Award, CheckCircle2, Flame } from 'lucide-react';
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
      <div className="bg-gradient-to-br from-[#0e3025] to-[#09221a] text-white rounded-2xl p-6 border border-[#1b4d3c] shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
              <Sparkles size={14} className="text-amber-400" />
              <span>Pitch Coach AI Simulator</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Practise Outbound Calls in Safe Simulation
            </h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Roleplay challenging retail walk-out objections with our AI Shopper persona before calling real prospects.
              Our Pitch Coach Agent scores your talk tracks against On-Ground's retail SOP benchmarks.
            </p>
          </div>

          <div className="bg-[#143d30] p-4 rounded-xl border border-[#225544] text-center shrink-0">
            <div className="text-xs text-slate-300">Your SOP Adherence</div>
            <div className="text-2xl font-bold font-mono text-emerald-300 mt-0.5">94%</div>
            <div className="text-[11px] text-amber-400 font-semibold mt-1">+23.6pp lift active</div>
          </div>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((scen) => (
          <div
            key={scen.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {scen.difficulty}
                </span>
                <span className="text-xs font-bold text-emerald-800 font-mono">{scen.brand}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">{scen.title}</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">Persona: {scen.customerName}</p>

              <div className="mt-3 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-950 space-y-1">
                <div className="font-semibold text-amber-900 flex items-center gap-1">
                  <Target size={12} />
                  <span>Customer Objection</span>
                </div>
                <p className="text-[11px] leading-relaxed">{scen.objection}</p>
              </div>

              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                <div className="font-semibold text-slate-900 flex items-center gap-1">
                  <Bot size={12} className="text-emerald-700" />
                  <span>Coach Tip</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{scen.coachTip}</p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <button
                onClick={() => startPracticeCall(scen)}
                className="w-full py-2.5 rounded-xl bg-[#0e3025] hover:bg-[#164235] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
              >
                <Phone size={14} className="text-amber-400" />
                <span>Start Practice Call</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
