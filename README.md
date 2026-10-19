# On-Ground.ai — Call Centre App (Working Product)

A high-performance, responsive Call Centre application engineered for **On-Ground.ai**, built for telecallers and retail agents who manage walk-out recovery, lead scoring, live calling, and AI role agents throughout their shift.

Developed for the **On-Ground.ai Engineering Hire Assignment**.

---

## 🌟 Live Demo & Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/shravya2005-ai/call_centre_app.git
cd call_centre_app

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in Google Chrome or any modern browser.

To verify a production build:
```bash
npm run build
npm run preview
```

---

## 🛠️ Technology Stack & Architectural Decisions

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | **React 19 with Vite 8** | Instant HMR, minimal bundle size (built in 1.3s), modern component architecture. |
| **Routing** | **React Router v7** | Client-side routing with clean URL state (`/`, `/plan?tab=calls`, `/calendar`, `/pulse`). |
| **Styling** | **Tailwind CSS v4 & Modular CSS** | Minimalist mocha & cream palette: deep taupe (`#62564C`), warm cream canvas (`#FAF7F2`), white cards (`#FFFFFF`), soft caramel accents (`#B69A78`), dark brown-gray text (`#39342F`), and beige-gray borders (`#E8E0D6`). |
| **Icons** | **Lucide React** | Consistent, restrained enterprise SaaS iconography. |
| **Charts** | **Recharts** | Interactive 7-day call volume, connect rate, and conversion revenue charts. |
| **Telephony Audio** | **Web Audio API** | Real dual-frequency DTMF dial tones (697Hz–1477Hz), authentic ringback tone (400Hz+450Hz cadence), connect chimes, and hangup tones without relying on external MP3 assets. |
| **State & Persistence** | **React Context & `localStorage`** | Zero-backend architecture: leads, disposition notes, call history, channels, and calendar events persist across page refreshes. |

---

## 📞 Working Calling Feature (Core Requirement)

Mock screens alone are not enough. This application provides **genuine calling workflows** with three distinct operational modes:

### Mode 1 — Twilio Voice WebRTC Architecture (PSTN Integration)
- Integrated configuration drawer accessible from the top bar or dial pad.
- Fully documents the enterprise-grade client-side WebRTC token handshake with a secure backend issuing short-lived `Twilio.jwt.AccessToken` tokens.
- Eliminates client-side credential exposure while providing live connection testing.

### Mode 2 — High-Definition Local Demo Calling Engine (Default)
A complete, interactive calling lifecycle powered by the browser's **Web Audio API**:
1. **Dialing & Connecting**: Initiates connection route with carrier latency simulation.
2. **Ringing**: Emits real dual-frequency telephone ringback tones (`400Hz + 450Hz`).
3. **Connected Call**:
   - Connection chime plays when answered.
   - Live running duration timer (`00:01`, `00:02`...).
   - Dynamic SVG audio waveform visualizer.
   - Interactive in-call controls: **Mute / Unmute**, **Hold / Resume**, **Speaker toggle**, and **DTMF Keypad** (emits real DTMF tones when pressed).
   - Real-time conversation cues and AI live transcript with On-Ground's core rule: *"Name the shopper for +23.6pp conversion lift"*.
4. **Call Wrap-up & Disposition Modal**:
   - Triggers immediately after hanging up.
   - Agent selects outcome (*Order Closed / Won*, *Follow-up Scheduled*, *Callback Requested*, *Left Voicemail*, *Not Interested*).
   - Closed deals capture transaction value (₹) and automatically calculate the telecaller's shift incentive.
   - Includes **"✨ AI Draft Note"** to auto-summarize key objections.
   - Follow-up date/time picker automatically syncs new events into the **Calendar**.
   - Instantly updates **Recent Calls** and **Dashboard KPIs**.

### Mode 3 — Native `tel:` Protocol
- Directly opens the device's native calling client (FaceTime, Windows Phone Link, Skype, or mobile dialer) via `tel:` URI.

---

## 🖥️ Screen Overview

### 1. App Shell
- **Deep Taupe Sidebar (`#62564C`)**: On-Ground.ai branding, shift incentive progress bar, navigation links, and a direct outbound dialer trigger.
- **Deep Taupe Top Bar (`#574C43`)**: Breadcrumbs, calling mode switcher, audio headset status (`Jabra Evolve 20`), agent status dropdown (*Available*, *In Call*, *Wrap-up*, *Break*), and notification center.
- **Responsive Mobile Navigation**: Touch-friendly layouts that adapt smoothly to smartphone screens.

### 2. Dashboard (`/`)
- **Shift Greeting & Target Progress**: Live shift duration indicator, active partner queues (*The Sleep Company* & *Furnishka*), and visual milestone bar toward the ₹8,000 daily goal.
- **KPI Cards**: Total Leads, Calls Made, Closed Conversions (+23.6pp lift), Tasks Pending, and Today's Incentive Earnings.
- **"Who is Waiting" Alert Section**: Detects shoppers who exited physical stores in the last 2 hours without purchasing, giving direct "Call Now" shortcuts before competitor quotes expire.
- **Priority Task Queue**: Leads ranked by score with click-to-open Leads Modal and direct call actions.
- **Earnings Summary & 7-Day Charts**: Recharts bar chart for daily call volume and area chart for conversion revenue (₹).

### 3. Plan Page (`/plan`)
Organized into 4 specialized tabs:
- **Calls to Make**: Leads ranked by score (96 down to 71), search by name/product, filter by priority (*Hot*, *Warm*, *Cold*) and store brand, expandable context rows with buying signals and SOP scripts, working pagination, and Call buttons.
- **Incoming**: Missed calls list displaying **Value at Stake** (e.g. ₹52,000), urgency badges, and a **Call Back** button on every row.
- **Recent**: Complete call history with duration, type, and outcome filters. Clicking any row opens the **Call Review Drawer**, featuring a simulated audio player with interactive waveform scrubbing, playback speed (1x, 1.25x, 1.5x), SOP compliance score (94%), sentiment score, and full AI call transcript.
- **Practise a Call (Bonus)**: AI Pitch Coach roleplay simulator allowing telecallers to practice difficult objections (*Skeptical buyer*, *Demanding 10% discount*, *Delivery constraint*) with simulated AI customer feedback.

### 4. Leads Modal (with Paging)
- Triggered by clicking any lead on the Dashboard or Plan table.
- Displays ICP Fit Score (e.g. 94%) and Lead Intent Score (98%) with visual progress meters.
- **Collapsible Buying Signals**: Categorized into *Financing Related*, *Quotation Demanded*, *Warranty Related*, and *Competitor Mentioned*.
- Recommended Telecaller SOP Pitch.
- `< Previous` and `Next >` paging controls to cycle seamlessly through all assigned leads.
- In-App Call Lead and Phone Call (`tel:`) buttons.

### 5. Calendar Page (`/calendar`)
- Interactive monthly calendar grid for **October 2026** (matching assignment date).
- Month switcher controls with a quick **"Today"** reset button.
- Color-coded event dots on dates with scheduled callbacks.
- Day Agenda view with details and a direct **"Call Now"** button for each event.
- **Schedule Follow-up Modal**: Schedule new calls with lead selection, date, time, priority, and notes, persisted in `localStorage`.

### 6. Pulse Page (`/pulse`)
- **Pulse Home**:
  - AvaniBot AI assistant hero banner.
  - 5 AI Role Agents: *Walk-out Recovery Agent*, *Pitch Coach Agent*, *ASM Agent*, *Tele-caller Agent*, and *Follow-up Bot* with live status, metrics, and efficiency ratings.
  - Channels list with unread counters.
  - Kudos and team shoutouts feed.
- **Pulse Channel Chat (`#walkouts-the-sleep-company`)**:
  - Back button navigation.
  - **Pinned "Needs your input" card**: Displays walk-out exception details (*Mukunda Dwarkanath discount exception*), two interactive decision buttons (*Approve Free Pillows Combo*, *Offer Flat ₹1,500 Instant Cashback*), and a custom input reply box.
  - Interactive chat stream with distinct sender bubbles, timestamps, and automatic intelligent responses simulated by AvaniBot.

---

## 🎯 Bonus Items Delivered

- [x] **Send a message in a channel**: Working interactive chat composer with simulated AI responses.
- [x] **Answer the "Needs your input" card**: Interactive approval buttons and custom instruction submission that resolves the card and posts confirmation to the channel.
- [x] **Practise a call and Call back**: Interactive AI Pitch Coach simulator and working Call Back buttons on all missed call rows.
- [x] **Works on phone-width screen**: Mobile hamburger drawer, responsive grids, and touch-friendly controls.
- [x] **Charts with Recharts**: Interactive 7-day call volume and revenue area charts with custom tooltips.

---

## 🤖 AI Tools Disclosure

In accordance with On-Ground.ai's instructions:
- **Antigravity AI (Google DeepMind)** was utilized as an agentic pair-programming assistant for rapid project scaffolding, component assembly, and architectural validation.
- All business logic, Web Audio API telephony synthesis, data structures, and styling tokens were specifically designed and reviewed to match the assignment requirements.

---

## 📁 Repository Structure

```
call_centre_app/
├── index.html                       # Entry HTML with Inter font & favicon
├── package.json                     # Dependencies & scripts
├── vite.config.js                   # Vite config with Tailwind CSS plugin
├── src/
│   ├── main.jsx                     # Application entry point
│   ├── App.jsx                      # Router & Context provider setup
│   ├── index.css                    # Design system tokens & Tailwind CSS
│   ├── context/
│   │   ├── AppDataContext.jsx       # Global persistence, leads, calls, calendar, channels
│   │   └── CallContext.jsx          # Telephony lifecycle, audio tones, timer, active call
│   ├── utils/
│   │   └── soundEffects.js          # Web Audio API generator (DTMF, ringback, connect, hangup)
│   ├── data/
│   │   └── initialData.js           # Sample enterprise retail data (The Sleep Company, Furnishka, etc.)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx          # Dark forest-green sidebar
│   │   │   ├── Topbar.jsx           # Slim top navigation bar
│   │   │   └── Layout.jsx           # Shell container with modal layer
│   │   ├── calling/
│   │   │   ├── CallModal.jsx        # Active call screen with waveform & controls
│   │   │   ├── DialPadModal.jsx     # Outbound dialer with DTMF audio
│   │   │   ├── CallDispositionModal.jsx # Post-call outcome & notes logging
│   │   │   └── TwilioConfigModal.jsx# Mode 1 WebRTC setup & documentation
│   │   └── leads/
│   │       └── LeadDetailsModal.jsx # ICP/intent scores, buying signals, paging
│   └── pages/
│       ├── Dashboard/
│       │   └── DashboardPage.jsx    # KPIs, waiting alert, tasks, Recharts
│       ├── Plan/
│       │   ├── PlanPage.jsx         # Sub-tab router
│       │   ├── CallsToMakeTab.jsx   # Ranked leads with pagination & expand
│       │   ├── IncomingTab.jsx      # Missed calls with Call Back action
│       │   ├── RecentTab.jsx        # Call history with review trigger
│       │   ├── CallReviewDrawer.jsx # Audio mock player & SOP review
│       │   └── PractiseCallTab.jsx  # AI pitch coach simulator
│       ├── Calendar/
│       │   ├── CalendarPage.jsx     # Month grid, day agenda, Call Now action
│       │   └── ScheduleModal.jsx    # Schedule follow-up modal
│       └── Pulse/
│           ├── PulsePage.jsx        # Pulse router
│           ├── PulseHome.jsx        # AvaniBot, 5 role agents, channels, kudos
│           ├── PulseChannel.jsx     # Channel chat stream
│           └── NeedsInputCard.jsx   # Pinned exception approval card
```

---


- **Repository**: [https://github.com/shravya2005-ai/call_centre_app.git](https://github.com/shravya2005-ai/call_centre_app.git)

