// Categories and their associated colors/themes
export const CATEGORIES = {
  time: {
    id: 'time',
    label: '⏰ Time Management',
    shortLabel: 'Time',
    color: '#ff6b6b',
    cssClass: 'filled-time',
  },
  ai: {
    id: 'ai',
    label: '🤖 AI Tools',
    shortLabel: 'AI',
    color: '#4ecdc4',
    cssClass: 'filled-ai',
  },
  docs: {
    id: 'docs',
    label: '📝 Design Docs',
    shortLabel: 'Docs',
    color: '#ffd93d',
    cssClass: 'filled-docs',
  },
  connect: {
    id: 'connect',
    label: '🤝 Networking',
    shortLabel: 'Network',
    color: '#a855f7',
    cssClass: 'filled-connect',
  },
};

// Tips unlocked by clearing lines
export const TIPS = {
  time: [
    "Block your first hour each morning for deep work — no meetings, no Slack.",
    "Use the 2-minute rule: if a task takes less than 2 minutes, do it now.",
    "Set weekly goals on Monday morning and review them Friday afternoon.",
    "Time-box ambiguous tasks. Give yourself 45 minutes max before asking for help.",
    "Say no to meetings without agendas — protect your maker time.",
    "Batch similar tasks (emails, code reviews, 1:1s) into dedicated time slots.",
    "Track where your time actually goes for a week — you'll be surprised.",
    "Schedule buffer time between meetings to process notes and follow up.",
    "Prioritize tasks by impact, not urgency. High-impact work compounds.",
    "End your day by writing tomorrow's top 3 priorities.",
    "Use your onboarding period to build habits that'll last the whole internship.",
    "Don't try to learn everything at once — focus on one system per week.",
  ],
  ai: [
    "Use AI coding assistants to generate boilerplate, then customize.",
    "Before asking AI, frame your question clearly — specificity gets better answers.",
    "AI is great for explaining unfamiliar codebases. Paste code and ask 'what does this do?'",
    "Use AI to draft commit messages, PR descriptions, and documentation.",
    "AI can help you learn new frameworks faster by generating example projects.",
    "Always verify AI-generated code — it's confident but not always correct.",
    "Use AI to rubber-duck debug: describe your problem and let it suggest approaches.",
    "AI is great for writing test cases you might not think of.",
    "Ask AI to review your code for edge cases and potential bugs.",
    "Use AI to translate between programming languages when reading unfamiliar code.",
    "Prompt AI with context about your project's conventions for better suggestions.",
    "AI can summarize long docs or threads — use it to get up to speed quickly.",
  ],
  docs: [
    "Start every design doc with the problem statement — what are you solving and why?",
    "Include 'Non-Goals' to scope your design and prevent scope creep.",
    "Write your design doc before coding. It forces clarity and catches issues early.",
    "Include alternatives you considered and why you rejected them.",
    "A one-pager is just a shorter design doc — use it for smaller features.",
    "Get feedback on your design doc BEFORE you start implementing.",
    "Include success metrics — how will you know the feature works?",
    "Diagrams > walls of text. A sequence diagram clarifies complex flows.",
    "Write for someone who joins the team in 6 months — future-you will thank you.",
    "Keep a running log of decisions and why they were made.",
    "Your design doc is a living document — update it as requirements change.",
    "Include operational considerations: monitoring, rollback plan, and failure modes.",
  ],
  connect: [
    "Schedule 1:1 coffee chats with people outside your immediate team.",
    "Ask your manager to introduce you to key stakeholders in your project area.",
    "Join intern-specific Slack channels and communities on day one.",
    "Attend tech talks and company events — they're networking goldmines.",
    "When you meet someone interesting, follow up within 24 hours.",
    "Offer to help others before asking for favors — generosity builds relationships.",
    "Find a mentor who's 1-2 levels above you, not just senior leadership.",
    "Join or start a study group with other interns working on similar tech.",
    "Share what you're learning — write a short blog post or give a lightning talk.",
    "Ask your skip-level manager for a 30-minute chat about their career path.",
    "Build relationships with your code reviewers — they're invested in your growth.",
    "Connect with interns from other teams to understand the broader organization.",
  ],
};

// Quiz questions organized by category with progressive depth.
// Each category has questions ordered from foundational to advanced.
// Players progress through them — correct answers advance, wrong answers repeat.
export const QUIZZES = {
  time: [
    {
      question: "You've been stuck on a problem for 45 minutes. What's the best next step?",
      choices: ["Keep trying for another hour", "Ask a teammate or post in your team's channel", "Switch to a different task permanently"],
      correctIndex: 1,
      explanation: "The 45-minute rule: if you're stuck that long, asking for help is more efficient than spinning your wheels.",
    },
    {
      question: "You have 3 tasks: a bug fix (30 min), a design review (2 hrs), and responding to Slack messages (15 min). What's the best order?",
      choices: ["Bug fix → Slack → Design review", "Design review → Bug fix → Slack", "Slack → Bug fix → Design review"],
      correctIndex: 0,
      explanation: "Start with the quick win (bug fix) for momentum, handle Slack to unblock others, then protect a long block for the design review.",
    },
    {
      question: "Your calendar is packed with meetings all week. What should you do?",
      choices: ["Accept it — meetings are important", "Decline non-essential meetings and block focus time", "Skip meetings without telling anyone"],
      correctIndex: 1,
      explanation: "Protect your deep work time. Politely decline meetings without clear agendas or where you're not essential.",
    },
    {
      question: "You're working on a high-priority feature but keep getting interrupted by Slack. What's the best strategy?",
      choices: ["Keep Slack open and respond immediately to everything", "Set a DND status, batch Slack into 2-3 check-ins per day", "Close Slack entirely for the whole week"],
      correctIndex: 1,
      explanation: "Batching communications lets you do deep work while staying responsive. Full radio silence can block teammates.",
    },
    {
      question: "You're assigned 5 tasks with equal deadlines. How do you decide what to work on first?",
      choices: ["Pick the easiest one", "Prioritize by impact — which task unblocks the most people or moves the project forward most?", "Do them in alphabetical order"],
      correctIndex: 1,
      explanation: "Impact-first prioritization ensures your limited time creates the most value. Easy tasks can fill gaps between deep work blocks.",
    },
    {
      question: "Your manager asks for a status update but you're mid-flow on a complex problem. What do you do?",
      choices: ["Drop everything and respond immediately", "Finish your current thought, then respond within 30 minutes", "Ignore it until end of day"],
      correctIndex: 1,
      explanation: "Context-switching mid-flow is costly. A brief delay to finish a thought preserves your flow while still being responsive.",
    },
  ],
  ai: [
    {
      question: "You need to write a function in a language you've never used. Best AI approach?",
      choices: ["Ask AI to write the whole feature end-to-end", "Ask AI to explain the language's patterns, then write it yourself with AI assistance", "Copy-paste from Stack Overflow instead"],
      correctIndex: 1,
      explanation: "Understanding patterns first means you can validate and maintain the code. Pure copy-paste leads to code you can't debug.",
    },
    {
      question: "AI generated a code solution but you're not sure it handles edge cases. What do you do?",
      choices: ["Ship it — AI is usually right", "Ask AI to generate test cases for edge cases, then verify", "Rewrite everything from scratch"],
      correctIndex: 1,
      explanation: "AI is great at generating test cases. Use them to verify the solution handles edge cases before shipping.",
    },
    {
      question: "What's the most effective way to use AI for code review?",
      choices: ["Have AI approve all your PRs automatically", "Ask AI to identify potential bugs and suggest improvements before submitting", "Never use AI for review — only humans understand context"],
      correctIndex: 1,
      explanation: "AI catches common issues quickly, freeing human reviewers to focus on architecture and business logic.",
    },
    {
      question: "You're debugging a complex issue. How should you use AI most effectively?",
      choices: ["Paste the entire codebase and ask 'what's wrong?'", "Describe the expected vs actual behavior with relevant code snippets", "Only use print statements — AI can't debug"],
      correctIndex: 1,
      explanation: "Specific context gets specific answers. Describing the gap between expected and actual behavior helps AI pinpoint the issue.",
    },
    {
      question: "AI suggests refactoring your code to use a design pattern you've never seen. What should you do?",
      choices: ["Apply it blindly — AI knows best", "Ask AI to explain the pattern, its tradeoffs, and when NOT to use it before deciding", "Reject it — stick with what you know"],
      correctIndex: 1,
      explanation: "Understanding tradeoffs prevents over-engineering. A pattern might be overkill for your use case even if it's technically correct.",
    },
    {
      question: "You want AI to help you understand a large unfamiliar codebase. What's the best prompt strategy?",
      choices: ["Ask 'explain this entire repo'", "Start with architecture-level questions, then drill into specific modules one at a time", "Read every file manually without AI"],
      correctIndex: 1,
      explanation: "Top-down exploration (architecture → modules → functions) builds a mental model efficiently. 'Explain everything' gets overwhelming responses.",
    },
  ],
  docs: [
    {
      question: "What should be the FIRST section of a design document?",
      choices: ["Implementation details", "Problem statement and motivation", "API specification"],
      correctIndex: 1,
      explanation: "Always start with WHY. The problem statement ensures everyone agrees on what you're solving before discussing how.",
    },
    {
      question: "When is the right time to write a design doc?",
      choices: ["After you finish coding", "Before you start coding, once requirements are clear enough", "Only for massive multi-month projects"],
      correctIndex: 1,
      explanation: "Write before coding to catch issues early. Even small features benefit from a quick one-pager.",
    },
    {
      question: "Your design doc received critical feedback. Best response?",
      choices: ["Defend your original design", "Thank the reviewer and consider the alternatives they suggest", "Abandon the project"],
      correctIndex: 1,
      explanation: "Design review is about finding the best solution. Critical feedback means reviewers are engaged and want to help.",
    },
    {
      question: "What does a 'Non-Goals' section in a design doc accomplish?",
      choices: ["It shows what you're too lazy to build", "It explicitly scopes the project and prevents scope creep during implementation", "It's filler to make the doc longer"],
      correctIndex: 1,
      explanation: "Non-Goals are a contract with stakeholders about what's intentionally excluded. They prevent 'while we're at it...' scope creep.",
    },
    {
      question: "You're writing the 'Alternatives Considered' section. What makes it valuable?",
      choices: ["Listing options you rejected without explanation", "Explaining each alternative's tradeoffs and WHY you chose your approach over them", "Copying alternatives from other team's docs"],
      correctIndex: 1,
      explanation: "Showing your reasoning builds trust. Reviewers can validate your thinking or point out tradeoffs you missed.",
    },
    {
      question: "How should you handle a design doc when requirements change mid-implementation?",
      choices: ["Ignore the doc — it's outdated now", "Update the doc to reflect the new reality and note what changed and why", "Start a completely new doc from scratch"],
      correctIndex: 1,
      explanation: "A living document serves as the source of truth. Recording what changed and why preserves institutional knowledge.",
    },
  ],
  connect: [
    {
      question: "You want to meet engineers on other teams. What's the best first step?",
      choices: ["Wait for them to reach out to you", "Ask your manager for introductions and attend cross-team events", "Send cold messages to VPs"],
      correctIndex: 1,
      explanation: "Your manager knows the org and can make warm introductions. Cross-team events lower the barrier to meeting people.",
    },
    {
      question: "An intern from another team asks for help with something outside your expertise. What do you do?",
      choices: ["Tell them you can't help", "Try to help and connect them with someone who knows more", "Ignore the message"],
      correctIndex: 1,
      explanation: "Being a connector builds your network. Even if you can't solve it, pointing them to the right person is valuable.",
    },
    {
      question: "What's the most valuable networking habit during an internship?",
      choices: ["Collecting as many LinkedIn connections as possible", "Building genuine relationships through regular, meaningful interactions", "Only networking with senior leadership"],
      correctIndex: 1,
      explanation: "Quality over quantity. Regular, genuine interactions with peers and mentors build lasting professional relationships.",
    },
    {
      question: "You had a great 1:1 coffee chat with a senior engineer. What's the best follow-up?",
      choices: ["Never reach out again — you don't want to be annoying", "Send a thank-you message and follow up in 2-3 weeks with something relevant to your conversation", "Add them on all social media platforms immediately"],
      correctIndex: 1,
      explanation: "Thoughtful follow-ups show you valued the conversation. Sharing relevant articles or updates keeps the relationship alive organically.",
    },
    {
      question: "You want to give a lightning talk to other interns but feel like you're not expert enough. What should you do?",
      choices: ["Wait until you're a recognized expert in something", "Share what you've learned so far — 'beginner teaching beginner' is incredibly valuable", "Only present if your manager assigns it"],
      correctIndex: 1,
      explanation: "You don't need to be an expert to share. Teaching forces you to solidify your understanding, and peers learn best from people one step ahead.",
    },
    {
      question: "How do you build a relationship with your code reviewer that goes beyond transactional?",
      choices: ["Only interact during code reviews", "Ask them about their career path, seek mentorship on broader topics, and offer to help them too", "Buy them gifts"],
      correctIndex: 1,
      explanation: "Code reviewers are invested in your growth. Showing curiosity beyond just the code creates a mentorship dynamic that benefits both sides.",
    },
  ],
};
