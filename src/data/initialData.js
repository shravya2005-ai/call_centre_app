// Initial mock data reflecting On-Ground.ai customer retail environment
// Partners: The Sleep Company, Furnishka, Duroflex, Tractor Junction, DCDC, Nestasia

export const initialLeads = [
  {
    id: 'lead-1',
    name: 'Mukunda Dwarkanath',
    phone: '+91 98450 23145',
    email: 'mukunda.d@gmail.com',
    brand: 'The Sleep Company',
    product: 'SmartGRID Luxe King Mattress',
    storeLocation: 'Indiranagar Experience Center',
    visitedAt: 'Today, 11:15 AM',
    score: 96,
    icpScore: 94,
    intentScore: 98,
    status: 'Pending',
    priority: 'Hot',
    valueAtStake: '₹54,999',
    timeline: 'Needs purchase by this Friday before house-warming',
    signals: [
      {
        category: 'Financing Related',
        icon: 'CreditCard',
        content: 'Asked specifically about 0% EMI on HDFC & ICICI credit cards for 12 months. Budget ceiling: ₹55,000.',
        severity: 'high'
      },
      {
        category: 'Quotation Demanded',
        icon: 'Receipt',
        content: 'Compared pricing with Sunday Latex Mattress (quoted ₹49,000). Wants matching discount or value add.',
        severity: 'high'
      },
      {
        category: 'Warranty Related',
        icon: 'ShieldCheck',
        content: 'Inquired about the 10-year warranty coverage and sagging replacement policy.',
        severity: 'medium'
      },
      {
        category: 'Competitor Mentioned',
        icon: 'AlertCircle',
        content: 'Currently comparing with Sunday Ortho Pro & Wakefit Latex Plus.',
        severity: 'medium'
      }
    ],
    recommendedPitch: 'Acknowledge his preference for firm lumbar support. Offer the 100-night risk-free trial + complimentary dual-contour pillows combo to offset the ₹5,000 price gap with Sunday.',
    agentNotes: 'Walked out because Indiranagar store was crowded and floor executive could not process instant EMI sanction.',
    callCount: 0,
    lastContact: null
  },
  {
    id: 'lead-2',
    name: 'Kavita Nair',
    phone: '+91 97412 88392',
    email: 'kavita.nair@outlook.com',
    brand: 'Furnishka',
    product: 'Solid Teak 6-Seater Dining Set',
    storeLocation: 'Koramangala Studio',
    visitedAt: 'Today, 10:30 AM',
    score: 92,
    icpScore: 95,
    intentScore: 89,
    status: 'Pending',
    priority: 'Hot',
    valueAtStake: '₹68,500',
    timeline: 'Moving into new apartment next week',
    signals: [
      {
        category: 'Delivery Constraint',
        icon: 'Clock',
        content: 'Needs guaranteed delivery by next Wednesday. Standard delivery is 14 days.',
        severity: 'high'
      },
      {
        category: 'Customization',
        icon: 'CheckCircle2',
        content: 'Asked if fabric on chairs can be swapped to stain-resistant beige bouclé.',
        severity: 'medium'
      }
    ],
    recommendedPitch: 'Confirm we have pre-polished teak frame in warehouse; commit to expedited 5-day delivery with factory-treated stain guard fabric.',
    agentNotes: 'Loved the wood grain and finish. Walked out only due to uncertain delivery timeline.',
    callCount: 1,
    lastContact: 'Yesterday'
  },
  {
    id: 'lead-3',
    name: 'Rohan Kulkarni',
    phone: '+91 98860 12450',
    email: 'rohan.k@techcorp.io',
    brand: 'The Sleep Company',
    product: 'Elev8 Smart Recliner Bed',
    storeLocation: 'Whitefield Store',
    visitedAt: 'Today, 09:45 AM',
    score: 89,
    icpScore: 91,
    intentScore: 87,
    status: 'In Progress',
    priority: 'Hot',
    valueAtStake: '₹89,000',
    timeline: 'Suffering from chronic cervical spondylosis',
    signals: [
      {
        category: 'Medical Need',
        icon: 'ShieldCheck',
        content: 'Doctor recommended elevation for acid reflux and back pain. Spent 25 mins testing Zero-Gravity mode.',
        severity: 'high'
      },
      {
        category: 'Decision Maker',
        icon: 'Users',
        content: 'Spouse was not present during store visit; promised to consult spouse before swiping card.',
        severity: 'high'
      }
    ],
    recommendedPitch: 'Send video demo of Zero-Gravity mode for spouse; offer complimentary white-glove assembly and 1-year free motor insurance.',
    agentNotes: 'Ready buyer. High willingness to spend if spouse approves.',
    callCount: 0,
    lastContact: null
  },
  {
    id: 'lead-4',
    name: 'Sneha Roy',
    phone: '+91 99001 54721',
    email: 'sneha.roy@gmail.com',
    brand: 'Duroflex',
    product: 'Duropedic Balance Mattress',
    storeLocation: 'Jayanagar Flagship',
    visitedAt: 'Yesterday, 04:20 PM',
    score: 85,
    icpScore: 88,
    intentScore: 82,
    status: 'Scheduled',
    priority: 'Warm',
    valueAtStake: '₹34,000',
    timeline: 'Upgrading guest bedroom mattress',
    signals: [
      {
        category: 'Price Sensitivity',
        icon: 'Receipt',
        content: 'Asked if Diwali pre-booking voucher can be redeemed against current bill.',
        severity: 'medium'
      }
    ],
    recommendedPitch: 'Honor the 10% festive credit code + free water-resistant mattress protector.',
    agentNotes: 'Requested callback at 2:30 PM today after team sync.',
    callCount: 1,
    lastContact: 'Yesterday, 5:00 PM'
  },
  {
    id: 'lead-5',
    name: 'Deepak Mehta',
    phone: '+91 98200 45678',
    email: 'deepak.mehta@infraholdings.in',
    brand: 'Tractor Junction',
    product: 'Mahindra 575 DI Tractor',
    storeLocation: 'Pune Rural Hub',
    visitedAt: 'Yesterday, 02:15 PM',
    score: 83,
    icpScore: 86,
    intentScore: 80,
    status: 'Pending',
    priority: 'Warm',
    valueAtStake: '₹7,20,000',
    timeline: 'Harvest season beginning next month',
    signals: [
      {
        category: 'Commercial Financing',
        icon: 'CreditCard',
        content: 'Wants Kisan Credit Card financing and subsidized diesel engine warranty.',
        severity: 'high'
      }
    ],
    recommendedPitch: 'Explain tied-up NABARD low-interest scheme with zero processing fees.',
    agentNotes: 'High ticket enterprise lead. Follow-up prioritized.',
    callCount: 0,
    lastContact: null
  },
  {
    id: 'lead-6',
    name: 'Priya Sharma',
    phone: '+91 98111 76234',
    email: 'priya.sharma@studioarc.com',
    brand: 'Furnishka',
    product: 'Modena Modular L-Shape Sofa',
    storeLocation: 'Bellandur Center',
    visitedAt: '2 days ago',
    score: 80,
    icpScore: 82,
    intentScore: 78,
    status: 'Pending',
    priority: 'Warm',
    valueAtStake: '₹52,000',
    timeline: 'Renovating living room',
    signals: [
      {
        category: 'Dimension Check',
        icon: 'Clock',
        content: 'Needed to measure living room wall width (uncertain whether 8ft or 9ft fits better).',
        severity: 'medium'
      }
    ],
    recommendedPitch: 'Offer our free virtual spatial consultation or WhatsApp room dimensions to get 3D layout.',
    agentNotes: 'Interior designer client. Repeat purchase potential is high.',
    callCount: 0,
    lastContact: null
  },
  {
    id: 'lead-7',
    name: 'Vikram Patil',
    phone: '+91 98700 99123',
    email: 'v.patil@agripro.com',
    brand: 'Nestasia',
    product: 'Artisan Ceramic Dinnerware & Decor Bundle',
    storeLocation: 'Phoenix Mall Bangalore',
    visitedAt: '2 days ago',
    score: 74,
    icpScore: 76,
    intentScore: 72,
    status: 'Pending',
    priority: 'Cold',
    valueAtStake: '₹18,500',
    timeline: 'Corporate gifting for Diwali',
    signals: [
      {
        category: 'Bulk Pricing',
        icon: 'Receipt',
        content: 'Asked for tier pricing for 15 gift boxes.',
        severity: 'medium'
      }
    ],
    recommendedPitch: 'Present curated corporate catalog with customized gift wrap and doorstep dispatch.',
    agentNotes: 'Requested quotation via email.',
    callCount: 0,
    lastContact: null
  },
  {
    id: 'lead-8',
    name: 'Meera Swaminathan',
    phone: '+91 99400 33819',
    email: 'meera.s@healthplus.org',
    brand: 'The Sleep Company',
    product: 'Stylux Ergonomic Office Chair',
    storeLocation: 'Indiranagar Experience Center',
    visitedAt: '3 days ago',
    score: 71,
    icpScore: 75,
    intentScore: 68,
    status: 'Pending',
    priority: 'Cold',
    valueAtStake: '₹21,999',
    timeline: 'WFH posture support',
    signals: [
      {
        category: 'Trial Request',
        icon: 'CheckCircle2',
        content: 'Tested chair for 10 minutes, was comparing with Featherlite and Steelcase.',
        severity: 'low'
      }
    ],
    recommendedPitch: 'Highlight patented SmartGRID seating that never sinks, 3-year on-site replacement warranty.',
    agentNotes: 'Casual shopper, but high intent if corporate discount applies.',
    callCount: 0,
    lastContact: null
  }
];

export const initialIncomingCalls = [
  {
    id: 'inc-1',
    name: 'Suresh Raina',
    phone: '+91 98451 90214',
    brand: 'The Sleep Company',
    product: 'SmartGRID Luxe 8-inch',
    time: '8m ago',
    valueAtStake: '₹52,000',
    type: 'Missed Call',
    status: 'High Urgency',
    notes: 'Walk-out from Koramangala store 40m ago. Rang twice while agent was on another call.'
  },
  {
    id: 'inc-2',
    name: 'Ananya Deshmukh',
    phone: '+91 97123 44501',
    brand: 'Furnishka',
    product: 'Teak Coffee Table & Sideboard',
    time: '24m ago',
    valueAtStake: '₹31,500',
    type: 'Missed Call',
    status: 'Pending Callback',
    notes: 'Left store without ordering; called back asking about weekend delivery slot.'
  },
  {
    id: 'inc-3',
    name: 'Gaurav Singhal',
    phone: '+91 98104 77129',
    brand: 'Duroflex',
    product: 'Latex Comfort Queen',
    time: '1h ago',
    valueAtStake: '₹28,900',
    type: 'Missed Call',
    status: 'Pending Callback',
    notes: 'Callback request triggered via website QR scanned at store.'
  },
  {
    id: 'inc-4',
    name: 'Harish Babu',
    phone: '+91 99805 11200',
    brand: 'Tractor Junction',
    product: 'Sonalika Tiger 50',
    time: '2h ago',
    valueAtStake: '₹6,40,000',
    type: 'Missed Call',
    status: 'Resolved',
    notes: 'Called regarding tractor test drive; handled by branch sales manager.'
  }
];

export const initialRecentCalls = [
  {
    id: 'rec-1',
    name: 'Rajesh Chawla',
    phone: '+91 98199 44321',
    brand: 'The Sleep Company',
    product: 'SmartGRID Ortho Pro',
    type: 'Outbound',
    dateTime: 'Today, 11:32 AM',
    duration: '4m 18s',
    durationSeconds: 258,
    outcome: 'Order Closed',
    sentiment: 'Positive (88%)',
    sopScore: 94,
    notes: 'Explained 100-night trial and offered complimentary dual pillows. Customer agreed to ₹46,000 swipe on HDFC EMI link sent via SMS.',
    valueClosed: '₹46,000',
    transcript: [
      { speaker: 'Agent', text: 'Good morning Mr. Rajesh! This is Akshat from The Sleep Company Indiranagar store follow-up desk.' },
      { speaker: 'Shopper', text: 'Hi Akshat. Yes, I was at your store an hour back trying out the Ortho Pro mattress.' },
      { speaker: 'Agent', text: 'Indeed, Rajesh ji! I saw you were looking closely at the 8-inch orthopaedic grid. Did you have any questions about the spine alignment warranty?' },
      { speaker: 'Shopper', text: 'I liked it, but Wakefit is offering a mattress for 32k. Yours is 46k.' },
      { speaker: 'Agent', text: 'I understand budget is key. However, our medical-grade SmartGRID doesn’t sink after 2 years like standard memory foam. Plus you get 100 nights in-home trial. If your back isn\'t relieved, we take it back 100% refund.' },
      { speaker: 'Shopper', text: 'Okay, that makes sense. Can you send me the payment link for 6 months No-Cost EMI?' },
      { speaker: 'Agent', text: 'Sending it right away, and adding 2 free Smart Contour pillows for your family!' }
    ]
  },
  {
    id: 'rec-2',
    name: 'Bhavna Joshi',
    phone: '+91 98711 02934',
    brand: 'Furnishka',
    product: 'Solid Oak Bar Stools (Set of 2)',
    type: 'Outbound',
    dateTime: 'Today, 10:45 AM',
    duration: '2m 42s',
    durationSeconds: 162,
    outcome: 'Follow-up Scheduled',
    sentiment: 'Neutral',
    sopScore: 88,
    notes: 'Shopper is measuring counter height tonight with husband. Scheduled callback tomorrow at 11:00 AM.',
    valueClosed: '₹0',
    transcript: [
      { speaker: 'Agent', text: 'Hello Bhavna ji, Akshat calling from Furnishka. Following up on your morning visit to our Koramangala studio.' },
      { speaker: 'Shopper', text: 'Hello Akshat, yes. The bar stools were lovely, but I need to double check our kitchen island counter height.' },
      { speaker: 'Agent', text: 'Understood! I will schedule a quick callback for tomorrow at 11 AM once you have had a chance to verify.' }
    ]
  },
  {
    id: 'rec-3',
    name: 'Karan Mehra',
    phone: '+91 99201 88471',
    brand: 'Duroflex',
    product: 'Latex Foam Queen',
    type: 'Inbound',
    dateTime: 'Today, 09:12 AM',
    duration: '3m 10s',
    durationSeconds: 190,
    outcome: 'Callback Requested',
    sentiment: 'Positive (79%)',
    sopScore: 91,
    notes: 'Caller requested specification brochure via WhatsApp. Sent immediately.',
    valueClosed: '₹0',
    transcript: []
  },
  {
    id: 'rec-4',
    name: 'Vinay Aggarwal',
    phone: '+91 98450 67112',
    brand: 'The Sleep Company',
    product: 'Elev8 Smart Bed',
    type: 'Outbound',
    dateTime: 'Yesterday, 05:40 PM',
    duration: '5m 04s',
    durationSeconds: 304,
    outcome: 'Order Closed',
    sentiment: 'Positive (95%)',
    sopScore: 98,
    notes: 'Closed sale with Bajaj Finserv 0% EMI scheme. Delivery booked for Friday.',
    valueClosed: '₹92,000',
    transcript: []
  },
  {
    id: 'rec-5',
    name: 'Pooja Hegde',
    phone: '+91 97401 22998',
    brand: 'Nestasia',
    product: 'Nordic Gold Cutlery Set',
    type: 'Outbound',
    dateTime: 'Yesterday, 03:15 PM',
    duration: '1m 20s',
    durationSeconds: 80,
    outcome: 'Not Interested',
    sentiment: 'Neutral',
    sopScore: 82,
    notes: 'Purchased an alternative set elsewhere.',
    valueClosed: '₹0',
    transcript: []
  }
];

export const initialCalendarEvents = [
  {
    id: 'ev-1',
    title: 'Call Mukunda Dwarkanath (The Sleep Company)',
    leadName: 'Mukunda Dwarkanath',
    phone: '+91 98450 23145',
    date: '2026-10-19',
    time: '14:30',
    type: 'Closing Call',
    status: 'Pending',
    priority: 'Hot',
    notes: 'Confirm HDFC EMI approval and apply 2 free pillow coupon.'
  },
  {
    id: 'ev-2',
    title: 'Follow-up Sneha Roy (Duroflex)',
    leadName: 'Sneha Roy',
    phone: '+91 99001 54721',
    date: '2026-10-19',
    time: '15:15',
    type: 'Follow-up',
    status: 'Pending',
    priority: 'Warm',
    notes: 'Discuss Diwali pre-booking voucher match.'
  },
  {
    id: 'ev-3',
    title: 'Bhavna Joshi counter height check (Furnishka)',
    leadName: 'Bhavna Joshi',
    phone: '+91 98711 02934',
    date: '2026-10-20',
    time: '11:00',
    type: 'Closing Call',
    status: 'Scheduled',
    priority: 'Warm',
    notes: 'Verify 30-inch seat height specification.'
  },
  {
    id: 'ev-4',
    title: 'Tractor Junction Loan Docs (Deepak Mehta)',
    leadName: 'Deepak Mehta',
    phone: '+91 98200 45678',
    date: '2026-10-21',
    time: '12:00',
    type: 'Financing Verification',
    status: 'Scheduled',
    priority: 'Hot',
    notes: 'Connect with NABARD field officer for tractor subsidy.'
  },
  {
    id: 'ev-5',
    title: 'Weekly Telecaller Performance Review & SOP Coaching',
    leadName: 'Internal Team',
    phone: 'Internal Zoom',
    date: '2026-10-22',
    time: '17:00',
    type: 'Coaching',
    status: 'Scheduled',
    priority: 'Normal',
    notes: 'Review conversion lift when telecaller names the shopper (+23.6pp).'
  }
];

export const initialAiAgents = [
  {
    id: 'agent-1',
    name: 'Walk-out Recovery Agent',
    code: 'Role Agent #1',
    status: 'Active',
    metrics: '14 leads captured today',
    description: 'Listens to store door sensors and RFID tags. When a shopper leaves without a billing invoice, initiates immediate CRM enrichment within 4 minutes.',
    efficiency: '86% capture rate'
  },
  {
    id: 'agent-2',
    name: 'Pitch Coach Agent',
    code: 'Role Agent #2',
    status: 'Active',
    metrics: '94% SOP compliance',
    description: 'Listens live to telecaller audio tracks. Reminds agent to name the customer (+23.6pp conversion impact) and pitch the 100-night trial.',
    efficiency: 'Real-time guidance'
  },
  {
    id: 'agent-3',
    name: 'ASM Agent (Area Sales Manager)',
    code: 'Role Agent #3',
    status: 'Monitoring',
    metrics: '7 stores coordinated',
    description: 'Bridges store managers, floor salesmen, and remote telecallers. Escalates stalled quotations and synchronizes store inventory reserves.',
    efficiency: 'Auto-sync active'
  },
  {
    id: 'agent-4',
    name: 'Tele-caller Agent',
    code: 'Role Agent #4',
    status: 'Live & Queued',
    metrics: '8 hot leads in queue',
    description: 'Ranks outbound priorities by intent score and past store browsing duration. Pre-dials and handles cadence scheduling.',
    efficiency: '+2% revenue lift'
  },
  {
    id: 'agent-5',
    name: 'Follow-up Agent',
    code: 'Role Agent #5',
    status: 'Active',
    metrics: '28 automated nudges sent',
    description: 'Dispatches personalized WhatsApp quotes with 3D product previews and localized store contact details.',
    efficiency: '91% open rate'
  }
];

export const initialPulseChannels = [
  {
    id: 'chan-1',
    name: 'walkouts-the-sleep-company',
    brand: 'The Sleep Company',
    description: 'Real-time store walkout recovery alerts & high-intent shopper escalations',
    unreadCount: 3,
    pinnedInputCard: {
      id: 'input-card-1',
      author: 'AvaniBot (AI Coordinator)',
      timestamp: '12m ago',
      title: 'Action Required: Lead Mukunda Dwarkanath Discount Exception',
      leadId: 'lead-1',
      store: 'The Sleep Company — Indiranagar Experience Center',
      details: 'Customer walked out after comparing with Sunday Mattress. Demands additional 5% discount or 2 free Smart Contour Pillows (value ₹3,999) on King Size SmartGRID Ortho Pro.',
      suggestedResolution: 'Approve 2 free pillows; retain core product margin while satisfying shopper value perception.',
      actions: [
        { id: 'btn-1', label: 'Approve Free Pillows Combo', value: 'approved_pillows', primary: true },
        { id: 'btn-2', label: 'Offer Flat ₹1,500 Instant Cashback', value: 'cashback', primary: false }
      ],
      resolved: false,
      resolutionText: ''
    },
    messages: [
      {
        id: 'msg-1',
        sender: 'AvaniBot',
        role: 'AI System',
        avatar: '🤖',
        isAi: true,
        timestamp: '11:18 AM',
        content: '🚨 New High-Intent Walkout Detected: Mukunda Dwarkanath spent 22 mins testing SmartGRID Luxe at Indiranagar. Left without purchasing due to price comparison with Sunday Mattress.'
      },
      {
        id: 'msg-2',
        sender: 'Rashmi Sehgal (Store Lead)',
        role: 'Founder & CEO',
        avatar: 'RS',
        isAi: false,
        timestamp: '11:22 AM',
        content: 'Floor executive Rahul was swamped with 3 other walk-ins. Mukunda has a high willingness to buy if we give him comfortable EMI terms.'
      },
      {
        id: 'msg-3',
        sender: 'Pitch Coach Agent',
        role: 'AI Coach',
        avatar: '⚡',
        isAi: true,
        timestamp: '11:25 AM',
        content: 'Tip for telecaller Akshat: Remember to say his name "Mukunda ji" right at the opening. Our analytics shows a +23.6pp conversion lift when the agent names the shopper.'
      }
    ]
  },
  {
    id: 'chan-2',
    name: 'furnishka-leads',
    brand: 'Furnishka',
    description: 'Custom furniture, dining sets, and solid wood inquiries',
    unreadCount: 1,
    pinnedInputCard: null,
    messages: [
      {
        id: 'msg-f1',
        sender: 'AvaniBot',
        role: 'AI System',
        avatar: '🤖',
        isAi: true,
        timestamp: '10:32 AM',
        content: 'Kavita Nair visited Koramangala Studio for Solid Teak Dining Set. Delivery timeline is her sole objection.'
      },
      {
        id: 'msg-f2',
        sender: 'Akshat Rajan (You)',
        role: 'Telecaller #4',
        avatar: 'AR',
        isAi: false,
        timestamp: '10:40 AM',
        content: 'Spoke with warehouse manager. We have 1 unpolished teak frame ready. We can deliver in 5 days if order confirmed by 4 PM.'
      }
    ]
  },
  {
    id: 'chan-3',
    name: 'escalations-vip',
    brand: 'Enterprise All',
    description: 'High ticket enterprise deals (> ₹1,00,000) needing founder/ASM review',
    unreadCount: 0,
    pinnedInputCard: null,
    messages: [
      {
        id: 'msg-e1',
        sender: 'Mukunda Dwarkanath (Co-founder)',
        role: 'Co-founder',
        avatar: 'MD',
        isAi: false,
        timestamp: 'Yesterday, 06:10 PM',
        content: 'Great job closing the Elev8 Smart Bed sale yesterday! The 0% financing pitch was executed crisply.'
      }
    ]
  }
];

export const initialChartData = [
  { day: 'Mon', calls: 32, connected: 26, conversions: 5, revenue: 145000 },
  { day: 'Tue', calls: 28, connected: 22, conversions: 4, revenue: 112000 },
  { day: 'Wed', calls: 35, connected: 29, conversions: 7, revenue: 210000 },
  { day: 'Thu', calls: 30, connected: 25, conversions: 6, revenue: 168000 },
  { day: 'Fri', calls: 38, connected: 31, conversions: 8, revenue: 254000 },
  { day: 'Sat', calls: 44, connected: 36, conversions: 9, revenue: 312000 },
  { day: 'Sun', calls: 24, connected: 19, conversions: 4, revenue: 125000 }
];

export const initialKpis = {
  totalLeadsAssigned: 42,
  contactedToday: 18,
  qualifiedToday: 14,
  callsMadeToday: 28,
  connectRate: '78.5%',
  conversionsToday: 6,
  conversionLift: '+23.6pp',
  revenueClosedToday: '₹1,84,000',
  myEarningsToday: '₹5,200',
  monthlyEarnings: '₹48,500',
  targetGoal: '₹8,000',
  targetProgressPercent: 65,
  pendingTasksCount: 5
};
