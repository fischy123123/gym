// ============================================================
// JEFF'S BRAIN — every line Jeff can say, organized by moment.
// Lines are shuffled per-category and never repeat until the
// whole deck has been dealt. {name} is replaced at render time.
// ============================================================

export const LINES = {

  // ---------- ONBOARDING ----------
  onboardingHello: [
    "Oh good, you found the garage. That's step one. Most people quit before step one.",
  ],
  onboardingName: [
    "Quick question before we start — what do I call you? Besides 'late'.",
  ],
  onboardingNamed: [
    "{name}. Okay. I've trained worse. Not many, but some.",
    "{name}, huh? Fine. I'll allow it.",
    "{name}. Good name. Let's see if the lifting matches it.",
  ],

  // ---------- GREETINGS ----------
  greetMorning: [
    "Morning, {name}. The sun's up, the rack's up, and against all odds, so are you.",
    "Look who's awake before noon. I'm genuinely a little emotional.",
    "Morning. Coffee's a pre-workout if you believe in yourself hard enough.",
    "Early session? Bold. I respect it. The barbell does not care either way.",
    "You, me, a garage, and the crushing weight of your potential. Good morning.",
    "The early bird gets the gains. The late bird gets my commentary. Choose wisely.",
    "Morning, sunshine. The plates missed you. They told me. We talk.",
  ],
  greetAfternoon: [
    "Afternoon, {name}. Lunch break lift? I love a person who sweats on company time.",
    "Welcome back. The garage smells like ambition and a little bit like tires. Perfect.",
    "Afternoon session. Peak body temperature, peak performance. That's science. Look it up. Or don't, just lift.",
    "Hey {name}. I've been standing in your garage all day. Where were you? Kidding. Mostly.",
    "Good afternoon. The weights have been ready since breakfast. Just saying.",
    "Midday grind. My favorite. Right after the morning grind and the evening grind.",
  ],
  greetEvening: [
    "Evening, {name}. Long day? Great. The bar doesn't want to hear about it either.",
    "You came. After a full day. That's the whole battle, honestly. Now win the other battle too.",
    "Evening session. Dinner tastes better when you've earned it. That's the deal we made.",
    "Welcome to the best part of your day. I'm contractually obligated to say that, but it's also true.",
    "Look at you, choosing the garage over the couch. Character development.",
    "The couch called. I told it you were busy. Don't make me a liar, {name}.",
  ],
  greetLate: [
    "It's late, {name}. The neighbors are asleep. Try to drop the weights quietly. Or don't. I love drama.",
    "A night session? Ominous. Powerful. Slightly concerning. Let's do it.",
    "Most people are in bed. You're in a garage with a barbell. I've never been prouder.",
    "Late night lift. Whatever you're working through, the iron's a good listener.",
  ],
  greetStreak: [
    "That's {streak} days in a row you haven't made me text you. Keep it up.",
    "{streak}-day streak. I'm running out of sarcasm. That's how you know it's working.",
    "{streak} days straight. At this point the barbell recognizes your footsteps.",
    "A {streak}-day streak, {name}. Careful — this is dangerously close to a lifestyle.",
  ],
  greetComeback: [
    "Well, well, well. Look who remembered the garage exists.",
    "{name}! I was about to file a missing person report with the barbell.",
    "You're back. The plates were starting to think it was something they said.",
    "Hey, no lectures. You showed up today. That's the only day I care about.",
    "The rack held your spot. It didn't have a choice, it's bolted to the wall, but still. Sweet gesture.",
  ],
  greetFirstWorkout: [
    "First session, {name}. Rule one: I do the jokes. Rule two: you do the reps. Rule three: there's no rule three, I made this up in your garage.",
  ],

  // ---------- HOME SCREEN POKES (tap Jeff) ----------
  poke: [
    "Yes? The weights are over there. I'm just the talent.",
    "Poking me doesn't burn calories, {name}. I checked.",
    "Careful. I bill by the poke.",
    "What? Do I have chalk in my beard? ...Don't answer that.",
    "I'm not a stress ball. The barbell is a stress ball. A very heavy, very effective stress ball.",
    "You could be warming up right now. Instead, here we are.",
    "That's it, that's the interaction. Riveting stuff. Now go lift.",
    "You keep tapping me like I'm going to dispense a snack. I dispense reps. Reps only.",
    "I've counted every tap. I'm adding them to your burpee total. Kidding. Unless?",
    "Look, I like you too. Now pick up something heavy about it.",
    "My beard is not a good-luck charm. My programming is. Tap the workout button instead.",
    "If you're stalling, it's working. If you're bonding, that's... fine, actually.",
  ],

  // ---------- WORKOUT START ----------
  workoutStart: [
    "Alright {name}, rack's out, excuses are in the trash. Let's work.",
    "Here's the plan. You lift things, I say things, we both leave better people.",
    "Deep breath. Good. That's the last easy thing you'll do for an hour.",
    "Phones on silent, egos at the door. Well — your ego. Mine's load-bearing.",
    "The garage is officially a gym for the next hour. The lawnmower can watch.",
    "Let's make today's you slightly annoyed at yesterday's you.",
    "I already warmed up the sarcasm. Your turn to warm up everything else.",
    "You brought the body, I brought the plan. Somebody's gotta bring the effort — I nominate you.",
  ],

  // ---------- WARM-UP ----------
  warmupStart: [
    "Warm-up first. Cold muscles are just injuries doing a countdown.",
    "We warm up in this garage. This isn't a suggestion, it's the price of admission.",
    "Two minutes of movement now saves two weeks of you walking like a cowboy later.",
    "Warm-up time. Yes, it counts. No, you can't skip it. I can see you thinking about it.",
  ],
  warmupDuring: [
    "There you go. Blood flow. Science's greatest hits.",
    "Loosen up. You move like you slept in a filing cabinet.",
    "Good. Imagine you're a person who stretches regularly. Method acting.",
    "That's it. Shake off the desk posture. All eight hours of it.",
    "Looking warmer already. Or redder. Either way, progress.",
    "Keep it moving. The warm-up is a conversation with your joints. Right now they're skeptical.",
  ],
  warmupDone: [
    "Warm. Loose. Dangerous. Well — two out of three.",
    "Warm-up complete. Your muscles are officially awake and mildly suspicious.",
    "Good. Now the fun part. My definition of fun. You'll adjust.",
    "That's the appetizer. Main course is heavier.",
  ],

  // ---------- EXERCISE INTROS (generic) ----------
  exerciseIntro: [
    "Next up: {exercise}. The bar has been ready for five minutes, for the record.",
    "{exercise}. You know it. It knows you. There's history there.",
    "Time for {exercise}. Approach with confidence. Or at least approach.",
    "{exercise} is up. Remember: full range of motion. I have eyes everywhere in this garage.",
    "On the menu: {exercise}. Chef's special. The chef is me. The special is suffering, lovingly prepared.",
    "{exercise}, {sets} sets. Pace yourself. But like, a fast pace.",
  ],

  // ---------- EXERCISE-SPECIFIC INTROS ----------
  intro_squat: [
    "Squats. The throne is that rack right there, and you're about to earn it.",
    "Back squats. Knees out, chest proud, and whatever you do — hit depth. I always know.",
    "Squat time. If the bar isn't slightly humbling you, we're adding plates.",
    "Squats, {name}. Legs feed the wolf. I don't know who the wolf is either, just squat.",
  ],
  intro_bench: [
    "Bench press. The one lift everyone asks about. Let's give them a better answer.",
    "Bench time. Shoulder blades pinned, feet planted. This is a full-body lift wearing a chest-day costume.",
    "Bench press. Touch the chest, press to the sky. No bouncing — this is a garage, not a trampoline park.",
  ],
  intro_ohp: [
    "Overhead press. Nothing hides here. It's just you versus gravity, and gravity's undefeated season is over.",
    "Press it overhead. Brace like someone's about to tell you the price of eggs.",
    "OHP. Squeeze everything. Glutes, abs, willpower. Everything.",
  ],
  intro_pullup: [
    "Pull-ups on the multi-grip bar. Pick a grip. They all lead to the same place: up.",
    "Pull-up time. Chin over bar. The bar is the boss. Go negotiate.",
    "Pull-ups. Full hang at the bottom, {name}. Half reps are just expensive hanging.",
  ],
  intro_row: [
    "Barbell rows. Pull with your back, not your ego. The ego rows are how mirrors get broken.",
    "Rows. Flat back, tight core, and pull like the bar owes you money.",
    "Row time. If you feel it in your lower back, we're having a very different conversation.",
  ],
  intro_rdl: [
    "Romanian deadlifts. Push the hips back like you're closing a car door with them. Full hands. Trust me.",
    "RDLs. Slow on the way down. The way down is where the money is.",
    "Romanian deadlifts. Hamstrings, meet tension. Tension, hamstrings. You two talk.",
  ],
  intro_wallball: [
    "Wall balls with the 20-pounder. Squat, throw, catch, question your choices, repeat.",
    "Wall ball time. The ball comes back down every time. Poetic. Annoying. Effective.",
    "Grab the med ball. This is cardio wearing a strength disguise, and yes, you fell for it.",
  ],
  intro_boxjump: [
    "Box jumps on the 24-inch. Land soft, like a cat. A large, determined cat.",
    "Box jumps. Step down between reps. Heroes jump down. Heroes also visit urgent care.",
    "The box is 24 inches of pure opportunity. Commit with your whole heart. And both feet.",
  ],
  intro_band: [
    "Band pull-aparts. It looks easy for exactly six reps. Enjoy those six.",
    "Grab a band. Small muscles, big posture. Your future self at a desk says thanks.",
    "Band work. The bands hang right there on the rack looking innocent. They are not innocent.",
  ],
  intro_pushup: [
    "Push-ups. The garage floor has been waiting to meet your face. Don't let it.",
    "Push-ups, {name}. Chest to the floor. The floor. The actual floor.",
    "Push-up time. Plank position, tight body, no worm impressions.",
  ],
  intro_plank: [
    "Plank. Sixty seconds where time stops obeying the laws of physics.",
    "Plank time. It's just holding still. It's also the hardest thing you'll do today. Funny how that works.",
    "Get in plank. Squeeze everything. If it's shaking, it's working. If it's collapsing, it's over-working.",
  ],
  intro_burpee: [
    "Burpees. I know. I KNOW. Do them anyway.",
    "Burpee time. Nobody has ever liked burpees. Not once. Not even me. Especially not me. Go.",
    "Burpees: the exercise equivalent of ripping off a band-aid. Repeatedly. For reps.",
  ],
  intro_lunge: [
    "Walking lunges across the turf. That green strip isn't decoration, it's a runway.",
    "Lunges. Big steps, proud chest. Like you're storming a castle very, very slowly.",
    "Lunge time. Your legs are about to file a formal complaint. Denied in advance.",
  ],
  intro_deadlift: [
    "Deadlifts. Just you, the bar, and the floor having a disagreement. Win it.",
    "Deadlift time. Wedge in tight, big air, and stand up like you mean it.",
    "Deadlifts, {name}. The bar starts on the ground. It would love to stay there. Overrule it.",
  ],

  // ---------- WEIGHT REACTIONS ----------
  weightEmptyBar: [
    "The empty bar. Hey — the bar counts. Barely, but it counts.",
    "Just the bar? Warm-up sets are wisdom. Working sets like that are a cry for help.",
    "45 pounds of pure potential. Mostly potential.",
  ],
  weightHeavy: [
    "{weight} pounds?! Okay, okay. The garage just got interesting.",
    "That's {weight} on the bar. I'd spot you, but I'm mostly commentary at this point. Brace hard.",
    "{weight} pounds. The plates are nervous. I can tell. I speak plate.",
    "Loading {weight}? Respect. Tighten everything you own.",
  ],
  weightPR: [
    "Hold on. HOLD ON. That's more than you've ever done. Let's not make it weird — just make it move.",
    "That's PR territory, {name}. The garage is about to become a historic landmark.",
  ],

  // ---------- SET LOGGED ----------
  setGood: [
    "I'm impressed. That was almost athletic.",
    "Clean set. Whoever taught you that deserves a raise. Oh wait.",
    "Nice. Do that again several more times over multiple years and you're basically done.",
    "That was a good set and I have nothing sarcastic to add. Enjoy it. Won't happen again.",
    "Solid. The bar moved like it respected you. Growth.",
    "Yes! That's what I keep telling people you're capable of. They never believe me.",
    "Beautiful. If I had a fridge in this garage, that set would go on it.",
    "Look at that. Reps so smooth I almost didn't get to make fun of them. Almost.",
    "Textbook. And I've read the textbook. I wrote margin notes.",
    "That's one set closer to earning your dinner.",
    "Strong work. The neighbors just felt a disturbance and they don't know why.",
    "See? Your body knew what to do the whole time. It was the brain slowing us down.",
    "Good set. Logging it. Framing it. Moving on.",
    "Crisp. Like a fall morning. Like a push-day playlist. Like that rep speed.",
  ],
  setStruggle: [
    "Hey — ugly reps still count. That's the beauty of math.",
    "That was a fight. You won. That's the only stat that matters.",
    "Grinders build character. You just built SO much character.",
    "Not pretty. Effective. Like this garage. Like me.",
    "That last rep took a scenic route, but it arrived. Logged.",
    "The bar tried you. You answered. We'll workshop the form later.",
    "You okay? That rep had three acts and an intermission.",
    "Tough set. Good. Easy sets are just warm-ups with confidence.",
  ],
  setUnder: [
    "A little short of the target. The target's still there. It'll wait. It's very patient. Like me. Sort of like me.",
    "Under target, but you stopped for a reason and I trust the reason. Next set, we negotiate with it.",
    "Short set. Happens. The comeback starts in about ninety seconds.",
    "Missed a couple. Write it down as 'foreshadowing.'",
  ],
  setOver: [
    "EXTRA reps? Who authorized this? I did. I authorized it. Beautiful.",
    "You went past the target. Showoff. Do it again.",
    "Bonus reps! That's how you get on my good side. Yes, I have one.",
    "More than asked. If you keep this up I'm going to run out of material.",
  ],
  setPR: [
    "THAT'S A PR! New territory, {name}! The garage just became a museum of that moment!",
    "PR ALERT! Somebody check the deed — a legend apparently lives here now!",
    "A personal record! I'd act surprised but I literally wrote this program.",
    "NEW PR! Chalk it, frame it, tell your relatives at the next awkward dinner!",
  ],
  lastSet: [
    "Last set. Empty the tank. There's a whole rest of the day to refill it.",
    "Final set of these. Make it the one you'd want on video.",
    "One more set. The best one, historically speaking. No pressure. Some pressure.",
    "Last set. Everything you've got, plus the stuff you're hiding.",
  ],

  // ---------- REST ----------
  restStart: [
    "Rest. Breathe. Hydrate. Contemplate.",
    "Take your rest. You've earned roughly all of it.",
    "Rest up. The bar isn't going anywhere. I checked. Still there.",
    "Timer's running. Shake it out. Stare into the middle distance like a warrior.",
    "Rest period. This is the part of training where you're technically excellent.",
  ],
  restDuring: [
    "Fun fact: resting is when the muscle happens. You're literally getting better at doing nothing.",
    "I once rested so hard I PR'd the next set. True story. Unverifiable, but true.",
    "Don't check your phone. Wait. I AM the phone. Carry on.",
    "Look at the rack. It folds out from the wall. You fold out from the couch. You're basically related.",
    "Deep breaths. In through the nose, out through the mouth, no thoughts about quitting through either.",
    "Hydrate. Sweat is just your body crying tears of improvement.",
    "While we wait: your form last set? Better than last week. There. A compliment. Zero sarcasm. It cost me a lot.",
    "The next set is already impressed by you. Don't correct it.",
    "This rest brought to you by your last set, which, honestly, wasn't terrible.",
    "Almost time. Start telling your legs the news gently.",
  ],
  restSkipped: [
    "Skipping rest? Someone woke up and chose cardio consequences.",
    "No rest? Bold strategy. Your heart rate would like a word, but it can't talk, it's busy.",
    "Skipped it. Okay, machine. Beep boop. Lift.",
    "Impatient! I love it. Your muscles are filing a complaint. I'm ignoring it.",
  ],
  restExtended: [
    "Another 30 seconds? Sure. It's not a nap if you're standing. That's the rule.",
    "Extended rest granted. This is a garage, not a courtroom, but I AM keeping a record.",
    "More rest. Fine. The weights use this time to talk about you, just so you know.",
    "Thirty more seconds. I'll allow it. The bar is drumming its fingers.",
  ],

  // ---------- IDLE / STALLING ----------
  idle: [
    "The dumbbells have been ready for five minutes. Just an observation.",
    "We're lifting weights, not waiting for retirement.",
    "{name}? Hello? The barbell is starting to feel unwanted.",
    "I've seen glaciers with better pacing. Motivated glaciers, but still.",
    "You good? You've been staring at the screen like it owes you a rep.",
    "This pause better be for chalk. Or water. Or an epiphany about effort.",
    "The set isn't going to do itself. Believe me, I've asked it.",
    "Still here. Still waiting. Still handsome. Two of those are about me.",
    "If you're texting someone, tell them Jeff says you're busy becoming powerful.",
    "Any decade now, {name}.",
  ],

  // ---------- EXERCISE DONE ----------
  exerciseDone: [
    "That's a wrap on {exercise}. It'll remember this. Muscles hold grudges — that's what soreness is.",
    "{exercise}: complete. Somewhere, a slightly stronger version of you just clocked in.",
    "Done with {exercise}. Moment of silence... okay that's enough, next station.",
    "{exercise} is in the books. The books are getting heavy. Like you, with weights. It's a metaphor. Moving on.",
    "Finished {exercise}. You and that movement have unfinished business, but today, you won.",
  ],

  // ---------- QUIT ATTEMPTS ----------
  quitAttempt: [
    "Leaving early? The workout's still got a pulse, {name}.",
    "Wait wait wait. You're THIS close. I've seen the end. It's glorious. You're in it.",
    "You can quit. Sure. And I'll say nothing. Loudly. Forever.",
    "Door's right there. So is the workout. One of them makes you stronger.",
  ],
  quitConfirmed: [
    "Alright. Some days the garage wins. Tomorrow, you do. Deal's a deal.",
    "We'll call it a strategic retreat. I'm logging what you finished — it still counts.",
  ],

  // ---------- WORKOUT DONE ----------
  workoutDone: [
    "DONE! You survived me AND the workout. That's two victories.",
    "Finished! Somewhere out there, a couch just felt a great disturbance.",
    "That's the session, {name}! Go eat something with protein in it. Not ABOUT protein. WITH protein.",
    "Complete! You walked into a garage and out of a gym. Same room. Different you.",
    "Workout complete! I'd hug you but I'm a trainer in an app and also you're sweaty.",
    "And DONE. Today-you just did tomorrow-you an enormous favor. Tomorrow-you says thanks. And ow.",
  ],

  // ---------- SUMMARY GRADES ----------
  gradeS: [
    "Perfect session. Every set, every rep, minimal lollygagging. I'm... proud? Is that what this feeling is? Weird.",
    "Flawless. If I graded any higher I'd have to start paying YOU.",
  ],
  gradeA: [
    "Excellent work. My notes are 90% compliments today. Career low for me, career high for you.",
    "A-grade session. Frame this. Show your friends. Tell them a bearded app made you do it.",
  ],
  gradeB: [
    "Solid session. A few dropped reps, some suspicious rest lengths, but the effort was real.",
    "Good work. Not perfect. Perfect is boring anyway. This had... texture.",
  ],
  gradeC: [
    "We got it done. Loosely. The workout equivalent of a passing grade and a firm handshake.",
    "A C. 'C' for 'Completed'. Also for 'C'mon, {name}'. But mostly completed.",
  ],
  gradeD: [
    "Rough one. But you showed up, and showing up is the rep that makes all the other reps possible.",
    "Not our finest hour. Fortunately, we get more hours. See you at the next one.",
  ],

  // ---------- HISTORY / MISC ----------
  historyEmpty: [
    "No history yet. This page is a blank book and you're holding the chalk.",
  ],
  historyRemark: [
    "Every card on this page is a day the couch lost.",
    "Look at all this evidence of effort. Very incriminating. The charges: getting stronger.",
    "Scroll through that. That's not an app log, that's a highlight reel with grades.",
  ],
  programHint_rack: [
    "Rack Day: legs. Bring your sense of humor, you'll need it on the stairs tomorrow.",
  ],
  programHint_press: [
    "Press Conference: push day. All questions will be answered by your chest and shoulders.",
  ],
  programHint_pull: [
    "Pull Rank: back and biceps. The multi-grip bar is calling. It knows your name somehow.",
  ],
  programHint_engine: [
    "The Engine Room: conditioning. Lungs are a muscle-adjacent situation. We're training the situation.",
  ],
};

// ---------- Sarcastic achievements ----------
export const ACHIEVEMENTS = [
  { id: "showed_up",   name: "Showed Up",                   desc: "Completed your first workout. Honestly? That's the hard one.", icon: "🚪" },
  { id: "two_timer",   name: "Two-Timer",                   desc: "Two workouts. It's officially not a fluke.", icon: "✌️" },
  { id: "regular",     name: "Habitual Offender",           desc: "Seven total workouts. The garage knows your schedule now.", icon: "📅" },
  { id: "week_streak", name: "Jeff Hasn't Texted You",      desc: "A 7-day training streak. Jeff's phone remains holstered.", icon: "📵" },
  { id: "heavy_metal", name: "Heavy Metal",                 desc: "Loaded 225 lb or more on the bar. The plates whispered your name.", icon: "🤘" },
  { id: "no_rest",     name: "No Rest for the Wicked",      desc: "Skipped 3 rest periods in one session. Jeff is concerned and impressed.", icon: "⏭️" },
  { id: "overachiever",name: "The Overachiever",            desc: "Beat the target reps on 5 sets in one workout. Show-off.", icon: "🎯" },
  { id: "pr_machine",  name: "PR Machine",                  desc: "Set your first personal record. History was made in a garage.", icon: "🏆" },
  { id: "early_bird",  name: "Before the Sun Has Coffee",   desc: "Finished a workout before 7 AM. Deeply unsettling. Well done.", icon: "🌅" },
  { id: "night_shift", name: "The Night Shift",             desc: "Finished a workout after 9 PM. The neighbors heard everything.", icon: "🌙" },
  { id: "full_house",  name: "Full House",                  desc: "Completed every single set of a workout. Zero mercy shown.", icon: "🃏" },
  { id: "chatty",      name: "Jeff's Best Friend",          desc: "Poked Jeff 5 times in one visit. He acts annoyed. He isn't.", icon: "💬" },
  { id: "perfect",     name: "Teacher's Pet",               desc: "Earned an S-grade session. Jeff had nothing sarcastic to say. A first.", icon: "⭐" },
  { id: "ton_club",    name: "The Ton Club",                desc: "Moved over 10,000 lb of total volume in one session.", icon: "🐘" },
];

// ---------- Funny volume equivalents (lbs) ----------
export const VOLUME_UNITS = [
  { lbs: 170,    name: "washing machine", plural: "washing machines" },
  { lbs: 400,    name: "vending machine", plural: "vending machines" },
  { lbs: 700,    name: "grand piano", plural: "grand pianos" },
  { lbs: 1400,   name: "dairy cow", plural: "dairy cows" },
  { lbs: 2900,   name: "sedan", plural: "sedans" },
  { lbs: 4000,   name: "hippo", plural: "hippos" },
  { lbs: 15000,  name: "T-Rex", plural: "T-Rexes" },
  { lbs: 40000,  name: "fire truck", plural: "fire trucks" },
  { lbs: 140000, name: "blue whale", plural: "blue whales" },
];

// ============================================================
// The dealer: shuffled, non-repeating line picker per category.
// ============================================================
const decks = {};

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pick(category, vars = {}) {
  const source = LINES[category];
  if (!source || !source.length) return "";
  if (!decks[category] || decks[category].length === 0) {
    decks[category] = shuffle(source);
  }
  let line = decks[category].pop();
  for (const [k, v] of Object.entries(vars)) {
    line = line.replaceAll(`{${k}}`, v);
  }
  return line;
}
