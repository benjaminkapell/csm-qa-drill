// Lessons for the Learn tab: short explanations per knowledge area, each with quick checks.
// source "class" = covered in the lectures, "extra" = standard theory that fills a gap.
// Put your own version in local/lessons.json (same shape, optional "example" field) to replace these on your machine.
export const LESSONS = [
 {
  "id": "sm-theory",
  "area": "SM",
  "source": "class",
  "title": "Stakeholder theory: Freeman, not Friedman",
  "who": "R. Edward Freeman, Strategic Management: A Stakeholder Approach (1984)",
  "plain": "Stakeholders are individuals or groups who can affect or are affected by a business: a two-way relationship. Before Freeman, business was about the bottom line and keeping shareholders happy (Milton Friedman's shareholder view). Freeman, who came from ethics and philosophy, said a business must create value for customers, suppliers, employees, communities and financiers together, because neglecting any one of them makes the business decline.",
  "points": [
   "Memory trick from class: FREEman = a freer, wider view. FRIEDman = narrow focus on shareholders.",
   "Two-way: a yoga studio's neighbours are affected by noise and parked cars, and can affect the studio by protesting.",
   "Which stakeholders matter most depends on the industry (a restaurant's fresh-food suppliers, a chemical plant's community).",
   "Costco paid 42% above competitors: lower turnover, stock outperformed. Value for all can help the bottom line.",
   "Boeing 737 MAX: engineers' concerns weren't heard, two crashes, trust lost with every group. Ignored stakeholder voices have ethical consequences.",
   "Are competitors stakeholders? Class answer: it depends."
  ],
  "apply": "List the groups your project needs a yes from, and what each one gets.",
  "remember": "Stakeholder = can affect or is affected (two-way). Freeman 1984 = value for all; Friedman = shareholders only.",
  "checks": [
   {
    "q": "Who is the 'father' of stakeholder theory?",
    "options": [
     "Milton Friedman",
     "R. Edward Freeman",
     "Dale Carnegie"
    ],
    "answer": 1,
    "why": "Freeman (1984). Friedman stands for the shareholder view. Trick: FREEman = the freer, wider view."
   },
   {
    "q": "Which definition of a stakeholder was used in class?",
    "options": [
     "Anyone who owns shares",
     "Anyone who can affect or is affected by the business",
     "Only customers and employees"
    ],
    "answer": 1,
    "why": "It's a bi-directional relationship: they can affect you and you can affect them."
   },
   {
    "q": "What did the Boeing 737 MAX case show?",
    "options": [
     "Speed to market always wins",
     "Ignoring internal stakeholders' warnings can destroy trust with everyone",
     "Engineers aren't stakeholders"
    ],
    "answer": 1,
    "why": "Engineers raised concerns nobody heard; after the crashes Boeing had to rebuild trust and its culture."
   }
  ]
 },
 {
  "id": "sm-grid",
  "area": "SM",
  "source": "class",
  "title": "The power-interest grid",
  "who": "Usually credited to Aubrey Mendelow (1991)",
  "plain": "Place each stakeholder by how much power they have over you and how interested they are in you. That gives four strategies: manage closely (high power, high interest), keep satisfied (high power, low interest: short, positive updates), keep informed (low power, high interest) and monitor (low, low). The point is to decide how often and how you communicate with each group. It's a placement map, not a graph, and it moves over time.",
  "points": [
   "It's dynamic: low-power people gain power through alliances, protests or going viral. Update it regularly.",
   "Power is subjective: a supplier of a part only they can make has high power, even if it's 2% of your product.",
   "Class example (FuckUp Nights): speakers = manage closely; volunteers = keep informed; sponsors = keep satisfied; the venue partner moved from high/high to keep satisfied ('they don't want to know the day-to-day stuff').",
   "Use data to settle disagreements: promo codes showed a partner brought branding, not tickets.",
   "Rule from class: build your grid without AI, to train your strategic thinking."
  ],
  "apply": "Place your four most important stakeholders on the grid and say how often you talk to each.",
  "remember": "Power × interest → manage closely / keep satisfied / keep informed / monitor. It moves.",
  "checks": [
   {
    "q": "A big sponsor gives money but doesn't care about the day-to-day. Which quadrant?",
    "options": [
     "Manage closely",
     "Keep satisfied",
     "Keep informed"
    ],
    "answer": 1,
    "why": "High power, low interest: short, positive updates, no detail."
   },
   {
    "q": "Volunteers care a lot but can't decide much. Which quadrant?",
    "options": [
     "Keep informed",
     "Monitor",
     "Manage closely"
    ],
    "answer": 0,
    "why": "Low power, high interest: keep them informed."
   },
   {
    "q": "Why update the grid regularly?",
    "options": [
     "Positions change: people gain power through alliances, protests or going viral",
     "The lecturer asks for it",
     "Power never changes"
    ],
    "answer": 0,
    "why": "Class stressed it's dynamic, and a sponsor can drop out after one event."
   }
  ]
 },
 {
  "id": "sm-rasci",
  "area": "SM",
  "source": "class",
  "title": "RASCI: who does what",
  "plain": "After mapping who your stakeholders are and how important they are, RASCI says how you interact with them on a task. Responsible does the work. Accountable owns the result and answers for it (only one person). Support helps the responsible person execute. Consulted is asked for their opinion before. Informed just gets an FYI afterwards. Class taught RASCI, with the S; many people only know RACI.",
  "points": [
   "Responsible vs accountable: a volunteer can be responsible for a social post, but the project owner is accountable if it goes wrong.",
   "Only one A per task, otherwise nobody owns it.",
   "Start from the status quo. If your team is tiny, use a likely scenario: scaling, a new market, a launch or a pivot.",
   "You can write the letters straight onto your power-interest grid."
  ],
  "apply": "Pick one task in your project and assign R, A, S, C and I.",
  "remember": "R does it, A owns it (only one), S helps, C is asked before, I is told after.",
  "checks": [
   {
    "q": "A volunteer posts something inappropriate. Who answers for it?",
    "options": [
     "The volunteer (Responsible)",
     "The project owner (Accountable)",
     "The audience (Informed)"
    ],
    "answer": 1,
    "why": "Responsible does the work; Accountable owns the result."
   },
   {
    "q": "What does the S in RASCI stand for?",
    "options": [
     "Sponsor",
     "Support",
     "Stakeholder"
    ],
    "answer": 1,
    "why": "Support: helps the responsible person execute the task."
   },
   {
    "q": "What's the rule people break most?",
    "options": [
     "More than one Accountable",
     "Too many Informed",
     "No Consulted"
    ],
    "answer": 0,
    "why": "If two people are accountable, nobody is."
   }
  ]
 },
 {
  "id": "sm-comms",
  "area": "SM",
  "source": "class",
  "title": "Communication strategy: inside first, one story everywhere",
  "plain": "Communication strategy covers everything strategic about communication, internal and external. Internal is culture and how teams talk to each other; external is marketing (what you put out and control) and PR (what others say about you, which you control less). All of it must tell the same story. And align internally before you communicate externally: a change support wasn't told about floods them with requests, costs time and money, and breaks trust.",
  "points": [
   "'You cannot not communicate' (Watzlawick, not named in class): undefined internal comms still exist.",
   "Marketing = the 4Ps (product, price, placement, promotion): you control it. PR = media and third parties speak for you.",
   "Mismatch creates cognitive dissonance: people feel uncomfortable, avoid deciding and see the brand negatively.",
   "Bad news: the CEO announces the general news; each person hears it from their closer manager, in person.",
   "Internal and external audiences don't need the same message: customers don't need every behind-the-scenes change.",
   "People need about 7–8 touchpoints before they notice a brand."
  ],
  "apply": "Find one place where your project's messages could contradict each other (website, product, pitch, team).",
  "remember": "Inside first, then outside. Marketing = what you say, PR = what others say. One story everywhere.",
  "checks": [
   {
    "q": "Which comes first?",
    "options": [
     "External communication",
     "Internal communication",
     "It doesn't matter"
    ],
    "answer": 1,
    "why": "Align inside first: otherwise support is surprised, time and money are wasted and trust breaks."
   },
   {
    "q": "What's the difference between marketing and PR?",
    "options": [
     "None",
     "Marketing is what you say and control; PR is what others say about you",
     "PR is paid ads"
    ],
    "answer": 1,
    "why": "Third-party praise (a blogger, a journalist) can have as big an effect or bigger, but you control it less."
   },
   {
    "q": "Who should announce layoffs, according to class?",
    "options": [
     "HR by email",
     "The CEO for the general news, the closer manager personally for each person",
     "A surprise calendar invite"
    ],
    "answer": 1,
    "why": "C-level takes accountability; the personal message comes from the manager who knows the person, in person."
   }
  ]
 },
 {
  "id": "sm-sostac",
  "area": "SM",
  "source": "class",
  "title": "SOSTAC: planning a communication",
  "who": "PR Smith (not named in class)",
  "plain": "SOSTAC is a six-step plan: Situation (where are we now: audience, channels, data), Objectives (what we want and why it matters), Strategy (how we get there), Tactics (exact channels, timing, message), Action (who does what, when) and Control (the metrics). Strategy is what you want to do; tactics is how. Test the plan, see what's different in reality, adapt, and once it works copy it to the next time.",
  "points": [
   "Control turns 'success' into numbers: 'Success is always subjective; to make it objective you need ways to measure it.'",
   "Internal example: a team isn't aligned on a launch → one meeting only about the deadline; give a deadline for questions ('send them by end of today').",
   "External example: a kids' toy → playful but science-backed tone; working parents on Instagram after 4–5pm; kitas in person beat cold emails.",
   "B2B outreach: know their channels and rhythm; cold calls and emails are more work than you expect; try fairs and webinars; avoid quarter-end."
  ],
  "apply": "Run one real communication from your project through all six SOSTAC steps, with a number for Control.",
  "remember": "Situation, Objectives, Strategy, Tactics, Action, Control. Control = a number.",
  "checks": [
   {
    "q": "What's the difference between strategy and tactics?",
    "options": [
     "Strategy is what/how you get there broadly; tactics are the exact channels, timing and message",
     "They're the same",
     "Tactics come before strategy"
    ],
    "answer": 0,
    "why": "Strategy = the route; tactics = the concrete execution."
   },
   {
    "q": "Which step turns success into something measurable?",
    "options": [
     "Situation",
     "Action",
     "Control"
    ],
    "answer": 2,
    "why": "Control = the metrics. It's the step people skip."
   },
   {
    "q": "Kitas don't answer cold emails. What does SOSTAC tell you to do?",
    "options": [
     "Send more emails",
     "Test, see what's different in reality, adapt (e.g. go in person)",
     "Give up the channel forever"
    ],
    "answer": 1,
    "why": "It's an ongoing process: test, adapt, then copy what works."
   }
  ]
 },
 {
  "id": "sm-network",
  "area": "SM",
  "source": "class",
  "title": "Networking: prepare, connect, don't sell",
  "plain": "Networking is building professional relationships on purpose. It works best when you prepare who you want to meet and why, look for a real, even personal point of connection first, and only talk business later. Pitching straight away is annoying for both sides, because the other person just pitches back.",
  "points": [
   "Prep questions: Who do I want to meet, and why? Where (event or LinkedIn)? What do I know about them? What can I offer? How will I follow up?",
   "Open with something that isn't salesy: a shared city, their post, the event itself.",
   "Six conversation skills: open questions, active listening, remembering details, appreciation, common ground, reading body language.",
   "Open question ladder: 'Good weekend?' → 'What did you do?' → 'What was the best thing you did?'",
   "The liking gap: people like you more than you think. Your fears are bigger in your head than in real life."
  ],
  "apply": "Think of one person you met through your project. What was the non-salesy point of connection, or what could it have been?",
  "remember": "Connect first, sell later. Prepare who, why and how you follow up.",
  "checks": [
   {
    "q": "At a networking event someone opens by pitching their app at you. What did class say usually happens?",
    "options": [
     "You pitch back, and it's annoying for both sides",
     "It builds trust because it's efficient",
     "It's the best way to stand out"
    ],
    "answer": 0,
    "why": "The lecturer: people pitch at once, the other person pitches back, and it's annoying for both. Find a non-salesy connection first."
   },
   {
    "q": "Which is the best open question?",
    "options": [
     "Did you have a good weekend?",
     "What was the best thing you did last weekend?",
     "You had a good weekend, right?"
    ],
    "answer": 1,
    "why": "It can't be answered with yes or no and it's fun to answer. The first one ends the conversation; the third is leading."
   },
   {
    "q": "What is the 'liking gap'?",
    "options": [
     "We like people more than they like us",
     "People like us more than we think after a conversation",
     "Introverts are liked less at events"
    ],
    "answer": 1,
    "why": "Research shows we underestimate how much others liked talking to us, so the fear is bigger than reality."
   }
  ]
 },
 {
  "id": "sm-carnegie",
  "area": "SM",
  "source": "class",
  "title": "Carnegie, and why authenticity beats tricks",
  "who": "Dale Carnegie, How to Win Friends and Influence People (1936)",
  "plain": "Carnegie's rules: remember names and what you talked about, let people talk about themselves, listen, make them feel important, give honest appreciation, don't criticise, and let them save face. the lecturer agreed with most of it but not all: a fake smile and using someone's name every few sentences feel manipulative. Her bottom line is to be authentic: stay true to your values while adapting your style to the context.",
  "points": [
   "Remember names and the last small talk (the car salesman who wrote it all down and asked 'How was the family trip?').",
   "Make a bored-you founder feel important: ask why they do it, or ask them for advice. Don't give unasked suggestions.",
   "Asking a favour makes people like you more (the Ben Franklin effect).",
   "The lecturer's critique: fake smiles and overusing names backfire. Authentic beats technique.",
   "Authenticity = same values, different channel (FuckUp Nights: memes on Instagram, studies on LinkedIn)."
  ],
  "apply": "Which of Carnegie's rules did you actually use in your project, and where would a 'trick' have felt fake?",
  "remember": "Carnegie's rules work only when they're genuine. Authentic = same values, adapted style.",
  "checks": [
   {
    "q": "Which two Carnegie tips did the lecturer NOT fully agree with?",
    "options": [
     "Listen and ask questions",
     "Smile and use the person's name often",
     "Give appreciation and don't criticise"
    ],
    "answer": 1,
    "why": "A fake smile (mouth, not eyes) and a name every fourth sentence come across as manipulative."
   },
   {
    "q": "Someone's pitch bores you. What makes them feel important without faking it?",
    "options": [
     "Tell them how to improve their app",
     "Ask why they do it, or ask them for advice",
     "Compliment them a lot"
    ],
    "answer": 1,
    "why": "Asking about their motivation or their advice treats them as the expert. Unasked suggestions trigger resistance."
   },
   {
    "q": "How did class define authenticity?",
    "options": [
     "Speaking the same way everywhere",
     "Staying true to your values while adapting to the context",
     "Never changing your opinion"
    ],
    "answer": 1,
    "why": "You adapt vocabulary, channel and style, but you stay the same person with the same values."
   }
  ]
 },
 {
  "id": "sm-followup",
  "area": "SM",
  "source": "class",
  "title": "Keeping relationships alive: follow-up",
  "plain": "The most important part of networking happens after the event. Whoever wants something, or promised something, reaches out first, within 24 to 48 hours, because people meet so many faces that two weeks later they've forgotten you. After that, don't spam: agree on the next touchpoint, and for your own team create a fixed structure like a check-in every two weeks.",
  "points": [
   "Who reaches out first: the one who wants something or made a promise.",
   "When: within 24–48 hours.",
   "Then: one coffee about two weeks later, and agree the next touchpoint with a date ('end of January when we know more').",
   "Your own team counts too: a fixed 30-minute check-in every two weeks.",
   "Before networking, know your values: they drive decisions and others will use them in negotiations."
  ],
  "apply": "Who in your project did you never follow up with? What would a 24–48 hour follow-up have said?",
  "remember": "The one who wants something follows up first, within 24–48 hours, then agrees the next touchpoint.",
  "checks": [
   {
    "q": "After meeting someone at an event, who should reach out first?",
    "options": [
     "The more senior person",
     "Whoever wants something or promised something",
     "Nobody: wait and see"
    ],
    "answer": 1,
    "why": "The lecturer: usually the one who wants something or made a promise. If you said 'I'll connect', connect."
   },
   {
    "q": "How soon should you follow up?",
    "options": [
     "Within 24–48 hours",
     "After two weeks",
     "Only when you need something"
    ],
    "answer": 0,
    "why": "People meet many faces; after two weeks they've forgotten you."
   }
  ]
 },
 {
  "id": "st-brand",
  "area": "ST",
  "source": "class",
  "title": "From customer journey to core message",
  "plain": "A brand isn't what you think it is, it's what your audience thinks it is. You can't control that, but you can influence it, and emotion (the heart) works better than facts (the head). The steps from class: know the customer's journey (where they come from, where they're going, what's in their way), find the pain points, find your position in that journey, clarify your value, write ONE core message, break it into key messages, then add meaning and emotion.",
  "points": [
   "Pain point = the problem you solve. Touchpoint = where your brand touches the person (an email, an ad, the product).",
   "People need about 7–8 touchpoints before they notice a brand, so be present everywhere they are.",
   "Perception can differ from intent: 'we think we're a super funny brand, the audience thinks we're cringe.'",
   "A classmate's locker example: value 'a locker you can book anywhere', core message 'relieve yourself of any luggage', emotion 'travel freely'."
  ],
  "apply": "Write your project's journey (from where, to where, what's in the way) and one core message.",
  "remember": "Journey → pain → position → value → core message → key messages → emotion.",
  "checks": [
   {
    "q": "What's the difference between a pain point and a touchpoint?",
    "options": [
     "They're the same",
     "Pain point = the customer's problem; touchpoint = where your brand meets them",
     "Touchpoint = the price"
    ],
    "answer": 1,
    "why": "That was the lecturer's clarification in the 17 Sep class."
   },
   {
    "q": "Who decides what your brand is?",
    "options": [
     "The founder",
     "The audience: it's their perception",
     "The logo designer"
    ],
    "answer": 1,
    "why": "A brand lives in the audience's mind. You influence it, you don't control it."
   }
  ]
 },
 {
  "id": "st-hero",
  "area": "ST",
  "source": "extra",
  "title": "The customer is the hero, you are the guide",
  "who": "Hero's journey (Campbell); brand storytelling (e.g. Donald Miller's StoryBrand)",
  "plain": "In a good product story the customer is the hero, not the company. The hero has a problem, meets a guide (your brand) who gives a plan, and ends up changed. The same story changes its hero and emphasis for each audience: investors hear the founder story first and numbers after; a partner hears what they gain; the team hears what they'll own. Feedback should change the story too.",
  "points": [
   "Hero (customer) → problem → guide (you) → plan → success.",
   "Same core story, different hero per audience.",
   "A founder story explains why you care; it isn't the hero.",
   "Frame or loop structure: end where you started to show what changed."
  ],
  "apply": "Tell your project's story twice: once with the customer as hero, once for an investor.",
  "remember": "Customer = hero, you = guide. Same story, different hero per audience.",
  "checks": [
   {
    "q": "In brand storytelling, who should the hero be?",
    "options": [
     "The founder",
     "The customer",
     "The product"
    ],
    "answer": 1,
    "why": "The brand is the guide that helps the hero solve their problem."
   },
   {
    "q": "How do you adapt a story for an investor?",
    "options": [
     "Only numbers",
     "Founder story first, then the numbers",
     "Leave out the problem"
    ],
    "answer": 1,
    "why": "People remember stories; the numbers land better after one."
   }
  ]
 },
 {
  "id": "st-concise",
  "area": "ST",
  "source": "class",
  "title": "Tell it short, from beginning to end",
  "plain": "In class you practised telling a real work situation concisely, without giving away the ending, so others could think about how to handle it. A good presentation is one story from beginning to end. Keep it short, concrete and in order: who, where, what went wrong, what was at stake. Emotion makes it stick, because decisions come from emotions and values.",
  "points": [
   "Concise: situation, people, the moment it went wrong, what was at stake.",
   "Concrete details make a story believable (a place, a number, a quote).",
   "Decisions come from emotions and values, so name what was at stake for someone.",
   "Same values, different channel: adapt the telling, not the truth."
  ],
  "apply": "Tell your project's origin story in under 60 seconds, with one concrete detail.",
  "remember": "Short, concrete, in order, with something at stake.",
  "checks": [
   {
    "q": "What makes a short story believable?",
    "options": [
     "Big adjectives",
     "Concrete details: a place, a number, a quote",
     "Leaving out names and places"
    ],
    "answer": 1,
    "why": "Specific details make it real; vague stories sound invented."
   }
  ]
 },
 {
  "id": "pi-structure",
  "area": "PI",
  "source": "class",
  "title": "The pitch structure",
  "plain": "The structure recalled in class: problem, solution, market, business model, team, and for investors the finances. Start with a hook: the problem and why it matters to THIS listener. SCQR (situation, complication, question, resolution) works as the story inside it. The format changes with the setting: elevator pitch, investor deck, demo, cold email or one-on-one.",
  "points": [
   "Problem → solution → market → business → team (+ finances for investors).",
   "Hook first: what will they miss if they don't listen?",
   "Be honest about traction: say what isn't done yet before they find it.",
   "Different formats: elevator, deck, demo, email, one-on-one. Pick the one that fits the audience."
  ],
  "apply": "Write your pitch in five lines: problem, solution, market, business, team.",
  "remember": "Hook, then problem → solution → market → business → team (+ finances).",
  "checks": [
   {
    "q": "What's missing from 'problem, solution, market, team' for investors?",
    "options": [
     "The business model and finances",
     "Your hobbies",
     "A long history"
    ],
    "answer": 0,
    "why": "Business model, plus finances when you pitch to investors."
   },
   {
    "q": "How should a pitch open?",
    "options": [
     "With your CV",
     "With a hook: the problem and why it matters to this listener",
     "With the price"
    ],
    "answer": 1,
    "why": "Like a social video: earn attention in the first seconds."
   }
  ]
 },
 {
  "id": "pi-outreach",
  "area": "PI",
  "source": "class",
  "title": "Cold vs warm: getting the pitch heard",
  "plain": "Before you pitch, you have to reach people. Class advice for B2B: know your audience's channels and working rhythm, expect cold calls and emails to be much more work than you think, and test alternatives like fairs, webinars or lead magnets. Don't open by selling: find a connection first. A warm introduction transfers trust from someone they already know.",
  "points": [
   "Know their channels, rhythm and timing (not at quarter-end, when B2B people are stressed).",
   "Cold outreach is more work than expected; measure it (Control).",
   "Warm intros transfer trust; weak ties (acquaintances) bring new opportunities (Granovetter, extra).",
   "If they have no urgency, the pain isn't conveyed strongly enough, or there's a hidden fear: ask why."
  ],
  "apply": "Count how your project's contacts came in: cold vs warm. Which converted better?",
  "remember": "Cold is more work than you think. Warm transfers trust. Connect before you sell.",
  "checks": [
   {
    "q": "What did class say about cold B2B emails and calls?",
    "options": [
     "They're the easiest channel",
     "They're more work than you expect; test alternatives",
     "Never measure them"
    ],
    "answer": 1,
    "why": "Try fairs, webinars, lead magnets, and test which works."
   },
   {
    "q": "Why does a warm intro work better?",
    "options": [
     "It's cheaper",
     "It transfers trust from someone they already know",
     "It's faster to write"
    ],
    "answer": 1,
    "why": "The introducer's credibility carries over to you."
   }
  ]
 },
 {
  "id": "pi-remote",
  "area": "PI",
  "source": "class",
  "title": "Pitching online vs in person",
  "plain": "Online, people drift to Slack, email and Excel the moment you lose them; in a room they check their phones. So online pitches should be shorter, hook early, go straight to the point and ask more questions. In person you can personalise, react and let them try the product, which is why live demos and discovery calls still exist next to product videos.",
  "points": [
   "Online: shorter, earlier hook, more questions, simple visuals.",
   "In person: personalised, they remember more, they can touch the product.",
   "A video works when no personalisation or questions are needed, but it can't steer focus."
  ],
  "apply": "How would you change your pitch for a 15-minute video call?",
  "remember": "Online: shorter, hook early, ask more. In person: show the real thing.",
  "checks": [
   {
    "q": "What should change in an online pitch?",
    "options": [
     "Make it longer to be thorough",
     "Shorter, earlier hook, more questions",
     "Turn your camera off"
    ],
    "answer": 1,
    "why": "People drift to their inbox; interaction keeps them with you."
   }
  ]
 },
 {
  "id": "vp-audience",
  "area": "VP",
  "source": "class",
  "title": "Know your audience, then tell one story",
  "plain": "Before you open the slides, know your audience: their knowledge, culture and expectations. The same topic becomes a completely different presentation for investors, a venue or classmates. Then build one story from beginning to end, with a hook at the start like a social media video: what will they miss if they don't listen?",
  "points": [
   "Audience first: knowledge level, culture, expectations.",
   "A hook: start with the problem and why it matters to these listeners.",
   "Data needs a story: guide people to one number.",
   "In person people check phones; online they do Slack and email. Earn attention with slides AND delivery.",
   "Live beats video when personalisation and questions matter."
  ],
  "apply": "Who exactly is the audience of your final presentation, and what's your hook in the first 20 seconds?",
  "remember": "Audience first, then one story with a hook. Data needs a story.",
  "checks": [
   {
    "q": "What comes first when building a presentation, according to the lecturer?",
    "options": [
     "Choose a template",
     "Know your audience",
     "Write all the text"
    ],
    "answer": 1,
    "why": "Knowledge, culture and expectations of the audience change the whole presentation."
   },
   {
    "q": "How do you make data land?",
    "options": [
     "Show every number you have",
     "Guide people to one number and tie it to a story",
     "Use 3D charts"
    ],
    "answer": 1,
    "why": "Data alone is dry; it needs a story."
   }
  ]
 },
 {
  "id": "vp-scqr",
  "area": "VP",
  "source": "class",
  "title": "SCQR: the consultant's story structure",
  "who": "McKinsey; Barbara Minto, The Pyramid Principle (Minto not named in class)",
  "plain": "Situation, Complication, Question, Resolution: a storytelling structure consultants use for presentations. Situation sets the scene, Complication says why it's a problem, Question asks what we should do, and Resolution recommends specific actions. the lecturer presented it as mixing storytelling with presenting.",
  "points": [
   "Situation: what's going on?",
   "Complication: why is it a problem?",
   "Question: what should we do now?",
   "Resolution: a recommendation with specific actions.",
   "Pitch structure from the pitching class: problem, solution, market, business, team (+ finances for investors)."
  ],
  "apply": "Say your project in four sentences: S, C, Q, R.",
  "remember": "Situation → Complication → Question → Resolution.",
  "checks": [
   {
    "q": "What does the C in SCQR stand for?",
    "options": [
     "Conclusion",
     "Complication",
     "Customer"
    ],
    "answer": 1,
    "why": "Complication: why the situation is a problem."
   },
   {
    "q": "What should the Resolution contain?",
    "options": [
     "A summary of the problem",
     "A recommendation with specific actions",
     "A joke"
    ],
    "answer": 1,
    "why": "Resolution = what we should do, concretely."
   }
  ]
 },
 {
  "id": "vp-slides",
  "area": "VP",
  "source": "class",
  "title": "Slides that work, and the PechaKucha rules",
  "plain": "Make slides readable: action titles (a title that says the point, like 'Make it readable', not 'Readability'), consistent fonts and colours, big enough text and good contrast. Slides are also your anchor for remembering what to say, but they don't have to be the focus: sometimes you want people to look at you. For the exam the format is PechaKucha: images only, no notes, showing you know the knowledge areas and can apply them.",
  "points": [
   "Action titles, consistency, readability from the back of the room.",
   "The lecturer's own self-critique: pink text unreadable from the back, no images, font too small.",
   "Distracting visuals kill the story (her FuckUp Nights GIF rule: slow 4-second GIFs, not flashy 1-second ones).",
   "AI-made decks are recognisable; for something you put real thought into, build it yourself.",
   "PechaKucha (Klein & Dytham, Tokyo 2003): originally 20×20 s; here images only, 15 min, no notes. Go area by area, or through your project showing where you applied each area."
  ],
  "apply": "Pick one of your slides. What is its single point, and would it read from the back row?",
  "remember": "Action titles, readable from the back, slides as anchor, you as the focus.",
  "checks": [
   {
    "q": "Which is an action title?",
    "options": [
     "'Market'",
     "'Travellers lose 5 hours a trip to their bags'",
     "'Slide 4'"
    ],
    "answer": 1,
    "why": "An action title states the point of the slide."
   },
   {
    "q": "What does the exam PechaKucha need to show?",
    "options": [
     "As much text as possible",
     "That you know the knowledge areas and can apply them, with images only",
     "Only your financials"
    ],
    "answer": 1,
    "why": "Images only, and either area by area or through your project showing where you applied each."
   }
  ]
 },
 {
  "id": "ps-body",
  "area": "PS",
  "source": "class",
  "title": "Body, voice and pauses",
  "plain": "How you stand and sound decides whether people trust what you say. Stand rooted with both feet on the ground, keep your arms open, use pauses instead of filler words, vary your voice, and hold the last seconds before you leave the stage. A smile is audible even on the phone, but only a real one: a fake smile (mouth, not eyes) backfires.",
  "points": [
   "Stand rooted, open arms, calm hands.",
   "Pause instead of 'so basically' or 'um'. A pause holds attention.",
   "Vary pace and volume; slow down on the key number.",
   "A real smile is audible; a fake one is noticed.",
   "Look at people, not the slides. You are the focus, slides are support."
  ],
  "apply": "Record yourself for one minute. Count your filler words and pauses.",
  "remember": "Rooted stance, open arms, pauses instead of fillers, look at people.",
  "checks": [
   {
    "q": "What should replace filler words like 'so basically'?",
    "options": [
     "Talking faster",
     "A short pause",
     "Reading from the slide"
    ],
    "answer": 1,
    "why": "Pauses sound confident and give the audience time to think."
   },
   {
    "q": "Where should the audience look during a picture-only talk?",
    "options": [
     "At the slides only",
     "At you; the pictures are support and anchors",
     "At their notes"
    ],
    "answer": 1,
    "why": "Slides can be your anchor, but you are the focus."
   }
  ]
 },
 {
  "id": "ps-nerves",
  "area": "PS",
  "source": "class",
  "title": "Nerves, self-monitoring and trust",
  "plain": "Nerves come from fear: of rejection, of being judged, of not knowing what to say. That fear makes you self-monitor ('my voice just went up'), which makes it worse, because your attention goes to yourself instead of the audience. Class said these fears are much bigger in your head than in reality, and the liking gap shows people like you more than you think. Put your attention on the listeners and it becomes a conversation.",
  "points": [
   "Self-monitoring = attention on yourself → more awkward. Attention on them → a conversation.",
   "Fears are bigger in your head than in real life.",
   "Trust habits: open with a personal story, slow down, look at people, be honest about what isn't working.",
   "Know your audience and adapt your vocabulary and examples, but stay authentic."
  ],
  "apply": "Name one presenting moment from your project: what made you nervous, and what helped?",
  "remember": "Attention on them, not on you. Fears are bigger in your head.",
  "checks": [
   {
    "q": "Why does self-monitoring make nerves worse?",
    "options": [
     "It makes you speak too slowly",
     "Your attention goes to yourself instead of the audience",
     "It doesn't"
    ],
    "answer": 1,
    "why": "Class: focus on the other person and it becomes a conversation, not a 'stress talk'."
   },
   {
    "q": "Which habit builds trust fastest?",
    "options": [
     "Hiding weaknesses",
     "Being honest about what isn't working yet",
     "Speaking as fast as possible"
    ],
    "answer": 1,
    "why": "Saying the weak spot first takes the attack away and shows confidence."
   }
  ]
 },
 {
  "id": "ne-gty",
  "area": "NE",
  "source": "class",
  "title": "Getting to Yes: the four principles",
  "who": "Roger Fisher & William Ury, Harvard Negotiation Project (1981)",
  "plain": "A negotiation isn't a fight to win; it's working together on a problem while keeping the relationship. Getting to Yes gives four principles: separate the people from the problem, focus on interests not positions, invent options for mutual gain, and use objective (fair) criteria. A position is what someone says they want; the interest is why they want it.",
  "points": [
   "Separate people from problem: soft on the person, hard on the problem.",
   "Interests, not positions: ask WHY. Orange story: one wanted the peel, one the fruit.",
   "Options for mutual gain: brainstorm first, judge later.",
   "Objective criteria: market prices, published ranges, expert opinion. 'It's not me demanding it, it's the standard.'",
   "Negotiation is about more than money: scope, time, responsibility."
  ],
  "apply": "In your project's negotiation: what was the other side's position, and what was the interest behind it?",
  "remember": "Soft on people, hard on the problem. Ask why. Use a fair standard.",
  "checks": [
   {
    "q": "A client says 'We need a lower price.' What is that?",
    "options": [
     "An interest",
     "A position",
     "A BATNA"
    ],
    "answer": 1,
    "why": "It's what they say they want. The interest is why: maybe a fixed budget or fear of risk."
   },
   {
    "q": "Which is an objective criterion?",
    "options": [
     "'I think it's worth more'",
     "A competitor's quote for the same job",
     "Your gut feeling"
    ],
    "answer": 1,
    "why": "Market prices, published ranges and expert opinion take the ego out: it's the standard, not you."
   },
   {
    "q": "An employee wants more money to pay for sports. Which answer fits the interest?",
    "options": [
     "Refuse, budgets are fixed",
     "Offer an Urban Sports Club membership",
     "Split the difference"
    ],
    "answer": 1,
    "why": "If you understand the true interest (sports), you can meet it in another way."
   }
  ]
 },
 {
  "id": "ne-batna",
  "area": "NE",
  "source": "class",
  "title": "BATNA and ZOPA",
  "plain": "Your BATNA (Best Alternative To a Negotiated Agreement) is what you do if this deal fails. The better your BATNA, the easier you can walk away, so the more power you have. The ZOPA (Zone Of Possible Agreement) is the overlap between your worst acceptable deal and theirs: a deal is only possible inside it.",
  "points": [
   "Develop your BATNA BEFORE you negotiate, and keep improving it.",
   "Don't reveal a weak BATNA. Don't lie about one ('five other offers'): it kills trust if it comes out.",
   "Don't reveal it too early, or it sounds like a threat. Show you want THIS deal.",
   "Encourage the other side to share theirs.",
   "ZOPA: between your walk-away point and theirs. No overlap, no deal."
  ],
  "apply": "What was your BATNA in your project's negotiation, and roughly where was the ZOPA?",
  "remember": "BATNA = your plan B; it gives you power. ZOPA = where both walk-away points overlap.",
  "checks": [
   {
    "q": "What gives you more power in a negotiation?",
    "options": [
     "Talking more",
     "A strong BATNA",
     "Revealing your minimum early"
    ],
    "answer": 1,
    "why": "The more easily you can walk away, the greater your power."
   },
   {
    "q": "Which BATNA tip did class give?",
    "options": [
     "Bluff about other offers",
     "Don't reveal a weak BATNA, and don't lie about it",
     "Always reveal it first"
    ],
    "answer": 1,
    "why": "Lying kills trust if it shows; revealing a weak one hands over power."
   },
   {
    "q": "What is the ZOPA?",
    "options": [
     "The overlap between both sides' walk-away points",
     "Your opening offer",
     "The other side's BATNA"
    ],
    "answer": 0,
    "why": "A deal is only possible where both sides' acceptable ranges overlap."
   }
  ]
 },
 {
  "id": "ne-tactics",
  "area": "NE",
  "source": "class",
  "title": "Tactics: let them go first, use silence, Chris Voss",
  "who": "Chris Voss, Never Split the Difference (ex-FBI hostage negotiator)",
  "plain": "Three practical tactics came up in class. Try to get the other side to name a number first. Once you've made your offer or reached a deal, stay quiet: silence makes people keep talking and reveal more. And Chris Voss, an ex-FBI hostage negotiator, warns that classic 'little yes' tricks don't work any more because everyone knows them.",
  "points": [
   "Ask them to reveal their number first.",
   "Silence: in the 9 Oct role play the deal was already perfect, then the person kept talking because silence felt uncomfortable.",
   "If they have no urgency, ask WHY they say no: there may be a hidden fear (change, mess, risk). Show a simple concrete plan.",
   "Risk reversal and testimonials help when you're young or new.",
   "Dirty tactics: name them calmly ('looks like good cop, bad cop')."
  ],
  "apply": "In your negotiation, who named the number first? What would change if the other side had?",
  "remember": "Let them name the number first, then let silence work.",
  "checks": [
   {
    "q": "The client goes quiet after your offer. What should you do?",
    "options": [
     "Lower your price to fill the gap",
     "Stay quiet and let them respond",
     "Repeat your whole pitch"
    ],
    "answer": 1,
    "why": "Silence is uncomfortable, so the other person talks and often reveals more. Filling it gives value away."
   },
   {
    "q": "A venue isn't interested even though you'd save them money. What did the lecturer suggest?",
    "options": [
     "Push harder on price",
     "Ask why they say no: there may be a hidden fear",
     "Move on immediately"
    ],
    "answer": 1,
    "why": "If you don't know the real reason (fear of change, mess), you can't offer a solution."
   }
  ]
 },
 {
  "id": "dc-safety",
  "area": "DC",
  "source": "class",
  "title": "Psychological safety and Project Aristotle",
  "who": "Amy Edmondson (Harvard); Google's Project Aristotle (re:Work)",
  "plain": "Google studied what makes teams effective and found it's not who is on the team but how they work together. The five dynamics are psychological safety (the most important), dependability, structure and clarity, meaning and impact. Psychological safety isn't trust between two people: it's a shared atmosphere where you can ask a 'dumb' question or admit a mistake without damaging the relationship.",
  "points": [
   "Edmondson's hospital study: better teams reported MORE mistakes, because they felt safe to, so root causes got fixed.",
   "It's hard because we feel interpersonal risk strongly: exclusion from the group used to be dangerous.",
   "Leaders: say up front that mistakes are OK, admit your own, ask curious questions ('What are we not seeing?'), give good feedback.",
   "Meaning (it matters to me) and impact (it matters to others) sound similar but are different."
  ],
  "apply": "Was your project team psychologically safe? Name one moment someone did or didn't speak up.",
  "remember": "How a team works together beats who is on it. Safety = people can admit mistakes.",
  "checks": [
   {
    "q": "What surprised Edmondson in her hospital study?",
    "options": [
     "Better teams made fewer mistakes",
     "Better teams reported more mistakes",
     "Mistakes didn't matter"
    ],
    "answer": 1,
    "why": "They didn't make more mistakes, they reported more, so the causes got fixed."
   },
   {
    "q": "Which is NOT one of Project Aristotle's five dynamics?",
    "options": [
     "Dependability",
     "Having the smartest people",
     "Structure and clarity"
    ],
    "answer": 1,
    "why": "The finding: it's how the team works together, not who is on it. The five: safety, dependability, structure & clarity, meaning, impact."
   },
   {
    "q": "What can a leader do to create psychological safety?",
    "options": [
     "Hide their own mistakes to look strong",
     "Admit their own mistakes and say errors are OK to report",
     "Punish mistakes fast"
    ],
    "answer": 1,
    "why": "You model the behaviour: if the leader hides mistakes, the team will too."
   }
  ]
 },
 {
  "id": "dc-feedback",
  "area": "DC",
  "source": "class",
  "title": "Feedback: sandwich vs SBI",
  "who": "SBI: Center for Creative Leadership (not named in class)",
  "plain": "The feedback sandwich (positive, negative, positive) is common, but the lecturer is sceptical: once people know the pattern they ignore the praise and feel tricked. SBI is more direct: Situation, Behaviour, Impact, then a request. Describe what happened objectively, the behaviour you saw, and its effect, then stop and ask for what you need.",
  "points": [
   "Situation: 'In yesterday's client meeting...'",
   "Behaviour: '...you spoke 15 minutes past the agenda...'",
   "Impact: '...the client checked the time and we never got to pricing.'",
   "Then a request: 'Next time, I'd appreciate if...' and stop. Adding praise afterwards signals insecurity.",
   "Check whether the mistake was shared (no agreed handover time = collaborative mistake).",
   "Ask permission first: 'Would you like my feedback?'"
  ],
  "apply": "Write one piece of SBI feedback you could give someone in your project.",
  "remember": "Situation, Behaviour, Impact, request. Then stop talking.",
  "checks": [
   {
    "q": "What's the lecturer's main problem with the feedback sandwich?",
    "options": [
     "It's too direct",
     "People learn the pattern, ignore the praise and feel tricked",
     "It takes too long"
    ],
    "answer": 1,
    "why": "She said she doesn't even listen to the positives because she knows it's a framework."
   },
   {
    "q": "What comes after the Impact in SBI, according to class?",
    "options": [
     "More praise to soften it",
     "A clear request, then stop",
     "An apology"
    ],
    "answer": 1,
    "why": "End at the impact plus a request. Praise afterwards makes you look insecure."
   },
   {
    "q": "Which is an objective 'Behaviour'?",
    "options": [
     "'You were unprofessional'",
     "'You sent the file at 9:00 instead of Thursday night'",
     "'You don't care about the team'"
    ],
    "answer": 1,
    "why": "Behaviour is what a camera would record, not a judgement about the person."
   }
  ]
 },
 {
  "id": "dc-nvc",
  "area": "DC",
  "source": "class",
  "title": "Non-violent communication (NVC)",
  "who": "Marshall Rosenberg (Gewaltfreie Kommunikation)",
  "plain": "NVC is a framework for conversations that get emotional. Four steps: Observation (what a camera would see, no judgement), Feeling, Need (where the feeling comes from), Request (concrete and doable). We're emotional beings, in business too, so naming the feeling and the need makes the request easier to hear.",
  "points": [
   "Observation: 'The last three deadlines passed.' Not 'You're unreliable.'",
   "Feeling: 'I feel worried...'",
   "Need: '...because I need to rely on how we split the work.'",
   "Request: 'Would you be willing to tell me by Monday if a deadline is at risk?'",
   "Adapt to culture and relationship: direct works in Germany and startups; in more hierarchical cultures be gentler. 'Sometimes they nod and say yes, but it's not a yes.'"
  ],
  "apply": "Turn one real conflict in your project into the four NVC steps.",
  "remember": "Observation → feeling → need → request. Say the need before you ask.",
  "checks": [
   {
    "q": "Which is a proper NVC observation?",
    "options": [
     "'You never take this seriously'",
     "'You came 20 minutes late to the last two meetings'",
     "'You're lazy'"
    ],
    "answer": 1,
    "why": "An observation is what a camera would record, without judgement."
   },
   {
    "q": "What's the right order?",
    "options": [
     "Request, need, feeling, observation",
     "Observation, feeling, need, request",
     "Feeling, observation, request, need"
    ],
    "answer": 1,
    "why": "Observation, feeling, need, request (Rosenberg)."
   }
  ]
 },
 {
  "id": "dc-messenger",
  "area": "DC",
  "source": "class",
  "title": "Hard news, boundaries and crisis planning",
  "plain": "Sometimes you have to deliver news you didn't decide (a layoff, a cancellation). Class said: think about timing (earlier is better), the worst case and a human, personal approach. When you need to say no (a boundary, a request you won't do), prepare one sentence in advance and offer an alternative. And plan your worst case before it happens: decide who says what, to whom, and when.",
  "points": [
   "Layoff case: communicate earlier, be human ('I'm genuinely sorry as a person'), offer concrete help. Praise added on top can feel manipulative.",
   "Saying no hurts because rejection feels like real pain to the brain. So prepare it: 'For me this is purely professional, but I'm happy to connect on LinkedIn.'",
   "'You cannot not communicate': avoiding the conversation also sends a message.",
   "Crisis communication: the lecturer mentioned a UN framework but didn't teach it. Her advice: think through your worst case in advance."
  ],
  "apply": "What is your project's worst case, and who would hear what from whom first?",
  "remember": "Prepare the hard sentence. Avoiding it is also a message. Plan the worst case before it happens.",
  "checks": [
   {
    "q": "How did class suggest saying no to an unwanted request at an event?",
    "options": [
     "Ignore it and leave",
     "Prepare one sentence and offer an alternative (e.g. LinkedIn)",
     "Say yes to be polite"
    ],
    "answer": 1,
    "why": "Rejection feels painful, so empathetic people struggle. A prepared sentence plus an alternative makes it easier."
   },
   {
    "q": "Did the lecturer teach the UN crisis communication framework in class?",
    "options": [
     "Yes, in detail",
     "No, she mentioned it and said to plan your worst case",
     "It was the exam topic"
    ],
    "answer": 1,
    "why": "It was planned 'if we have time' and wasn't covered; slides were to be uploaded. Don't claim to know its steps from class."
   }
  ]
 }
];
