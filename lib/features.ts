export type Feature = {
  title: string;
  body: string;
  icon: string; // key into components/Icon.tsx
  group: string;
  /** an Eyebrow Pro feature */
  pro?: boolean;
  /** not in the released app yet: "new" for a feature, "update" for a change to one that is */
  soon?: "new" | "update";
};

/**
 * Everything below is drawn from the shipping app — Settings panes,
 * NotchViews, WidgetKind and the managers in Eyebrow/managers.
 */
export const features: Feature[] = [
  {
    group: "Media",
    icon: "music",
    title: "Now Playing, properly",
    body: "Album art, scrubbing, shuffle and repeat, and a colour-matched spectrogram. Works with system Now Playing, Apple Music, Spotify and YouTube Music.",
  },
  {
    group: "Media",
    icon: "eye",
    title: "Sneak Peek",
    body: "Track changes slide under the notch for a moment, then disappear. Standard or inline styling, and a shortcut to summon it on demand.",
  },
  {
    group: "Media",
    icon: "text",
    title: "Lyrics and visualisers",
    body: "Lyrics under the artist name, player tinting from the artwork, blur behind the album art, and custom visualisers you can swap in.",
  },
  {
    group: "System",
    icon: "sliders",
    title: "HUD replacement",
    body: "Volume changes stop covering your work. Hierarchical or gradient styling, optional glow, accent tinting, inline or full. Pro adds custom colours and themes.",
  },
  {
    group: "System",
    icon: "battery",
    title: "Battery and power",
    body: "Charge state, percentage and power-source changes in the closed notch — plus the battery level of connected Bluetooth devices.",
  },
  {
    group: "System",
    icon: "cpu",
    title: "System stats",
    body: "CPU and memory pressure at a glance, without another menu-bar icon fighting for space.",
  },
  {
    group: "System",
    icon: "sun",
    title: "Stay Awake",
    body: "Keep your Mac awake for 30 minutes, 1, 2 or 4 hours, or until you turn it off. Start it from a widget or the menu bar.",
  },
  {
    group: "Files",
    icon: "tray",
    title: "The Shelf",
    body: "Drag anything to the notch and it waits there. Drag it back out anywhere. Thumbnails, Quick Look, copy-on-drag, auto-clear, and one-tap Quick Share.",
  },
  {
    group: "Files",
    icon: "tray",
    title: "Floating shelf and file tools",
    body: "Shake a file while you drag it and a small shelf appears beside the pointer, so it's on the Shelf without a trip to the notch. Shelf files get tools too: compress a PDF with its text still selectable, combine PDFs and images into one PDF, compress a video to HEVC up to 1080p, or turn its first 12 seconds into a GIF.",
    pro: true,
  },
  {
    group: "Files",
    icon: "clipboard",
    title: "Clipboard history",
    body: "Text, links, images, screenshots, colours and files, filtered by type and searchable. ⇧⌘C from anywhere, and pin the ones you reuse. Free keeps your last 500 items; Pro keeps 5,000.",
  },
  {
    group: "Files",
    icon: "download",
    title: "Download progress",
    body: "Safari, Chrome, Firefox, Arc and Brave downloads show live progress in the notch — progress bar or percentage, with the source app's icon and the time left (\"2 min left\"). When the file lands, a green tick shows in the closed notch.",
  },
  {
    group: "Files",
    icon: "camera",
    title: "Screenshot interception",
    body: "⇧⌘3 and ⇧⌘4 land in the notch instead of littering your desktop. Copy, annotate, run OCR, or save — then it's gone.",
  },
  {
    group: "Calls",
    icon: "phone",
    title: "In-call controls",
    body: "Eyebrow spots active Zoom, Google Meet and Microsoft Teams calls and puts mute, camera and leave in the notch.",
  },
  {
    group: "Calls",
    icon: "mic",
    title: "Global mic kill switch",
    body: "One shortcut cuts the microphone system-wide, in any app, whether or not call detection is on.",
  },
  {
    group: "Focus",
    icon: "timer",
    title: "Timers and focus sessions",
    body: "Start a timer in the notch and watch it count down in the closed state. No extra window, no extra app. Set it on a minutes ruler like Control Center's, and it remembers the length you like. Turn on Pomodoro mode and it cycles focus, a 5-minute break, and a 15-minute break after every fourth session.",
  },
  {
    group: "Day",
    icon: "calendar",
    title: "Calendar and Reminders",
    body: "Upcoming events with auto-scroll to what's next, all-day events hidden if you like, and reminders you can tick off in place. Events with a Zoom, Google Meet, Teams, Webex or FaceTime link get a Join button, so the call opens straight from the notch. A countdown to your next meeting shows beside the closed notch (from 10 minutes before, or 2, 5, 15 or 30) and turns to Now when it starts.",
  },
  {
    group: "Day",
    icon: "bell",
    title: "Meeting reminder",
    body: "A minute before a meeting starts, the notch opens by itself with the title, the time and a live countdown. Join the call, press OK, or snooze it for 1 or 5 minutes or until it starts. It stays open until you answer, and it can remind you at the start or up to 10 minutes before, for every event or only ones with a call or other people.",
    pro: true,
  },
  {
    group: "Day",
    icon: "cloud",
    title: "Weather",
    body: "Current conditions and temperature in the notch, in Celsius or Fahrenheit. Uses your approximate location to fetch a forecast from Open-Meteo.",
  },
  {
    group: "Audio",
    icon: "speaker",
    title: "Audio device switching",
    body: "Every input and output in one list. Set auto-switch rules, or have Bluetooth take over automatically the moment it connects.",
  },
  {
    group: "Input",
    icon: "waveform",
    title: "On-device transcription",
    body: "Speak, and Eyebrow writes it down using Apple's on-device speech recognition, with a live waveform. Nothing is sent anywhere.",
  },
  {
    group: "Input",
    icon: "globe",
    title: "Browser tab switcher",
    body: "Jump between open Safari, Chrome and Brave tabs from the notch, without hunting through windows.",
  },
  {
    group: "AI",
    icon: "sparkle",
    title: "Claude Code and Codex in the notch",
    body: "Claude's mark turns beside the notch while a session works, and goes amber when it needs your permission. With Pro, each Claude Code session also gets a page in the Live tab, a box to message it, and Allow and Deny right in the notch. Turn on Codex in Settings and its sessions show beside the notch too, to watch rather than answer: Codex's questions are still answered in the terminal. With Pro, each Codex session gets a Live tab page showing its activity.",
  },
  {
    group: "System",
    icon: "live",
    title: "Live activities",
    body: "When music, a call, a timer, a download and a Claude Code session are all going at once, the rest wait in small notches either side of the one in front; click one to swap. Each also gets a page in the Live tab.",
    pro: true,
  },
  {
    group: "Security",
    icon: "face",
    title: "Face Unlock",
    body: "When your Mac is locked, Eyebrow recognises your face through the camera and types your password for you. Face data and password stay encrypted in this Mac's Keychain. A convenience, not extra security.",
    pro: true,
  },
];

export type Widget = { name: string; body: string; icon: string; soon?: "new" | "update" };

/** WidgetKind — all eighteen, sizes S / M / L. */
export const widgets: Widget[] = [
  { name: "Clock", body: "Current time and date", icon: "clock" },
  { name: "Weather", body: "Temperature and conditions", icon: "cloud" },
  { name: "Battery", body: "Battery level and status", icon: "battery" },
  { name: "Now Playing", body: "Now playing with controls", icon: "music" },
  { name: "Calendar", body: "Upcoming events, with one-click Join", icon: "calendar" },
  { name: "Reminders", body: "Pending reminders", icon: "check" },
  { name: "System Stats", body: "CPU and memory usage", icon: "cpu" },
  { name: "Time & Weather", body: "Time, date and weather together", icon: "sun" },
  { name: "Timer / Focus", body: "Focus timer, with a Pomodoro mode", icon: "timer" },
  { name: "Stay Awake", body: "Keep the Mac awake for a while", icon: "sun" },
  { name: "Teleprompter", body: "Your script, scrolling under the camera", icon: "text" },
  { name: "Notes", body: "Write a note that saves to Notes", icon: "notes" },
  { name: "Clipboard", body: "Clipboard history by type", icon: "clipboard" },
  { name: "Transcription", body: "On-device speech transcription", icon: "waveform" },
  { name: "AI Usage", body: "Claude / Codex session info", icon: "sparkle" },
  { name: "Meeting Alert", body: "Alert when a meeting starts", icon: "bell" },
  { name: "Call Controls", body: "Zoom / Meet / Teams controls", icon: "phone" },
  { name: "Browser Tabs", body: "Safari and Chrome tab switcher", icon: "globe" },
];

/** NotchViews — the tabs you can put in the notch. */
export const tabs = [
  { name: "Home", body: "Now playing, calendar and your day" },
  { name: "Shelf", body: "Files parked and ready to drag out" },
  { name: "Clipboard", body: "Everything you've copied" },
  { name: "Downloads", body: "Live browser download progress" },
  { name: "Screenshots", body: "Captures caught before the desktop" },
  { name: "Call", body: "Mute, camera and leave" },
  { name: "Audio", body: "Inputs and outputs" },
  { name: "Weather", body: "Conditions right now" },
  { name: "Widgets", body: "Your own layout, S / M / L" },
];

export type Plan = {
  id: "free" | "pro";
  name: string;
  summary: string;
  items: string[];
};

/**
 * Free vs Pro. Pro never takes anything away from Free — it raises three
 * ceilings (clipboard history, widget pages, tabs) and adds what did not
 * exist before (Face Unlock, vertical tabs, live activities and the Live
 * tab with Claude Code sessions, the floating shelf and Shelf file tools, the meeting reminder, custom
 * HUD colours and themes, iCloud sync, icon packs with a custom Widgets tab
 * icon).
 */
export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    summary: "Every feature on this page not marked Pro, with no trial and no time limit.",
    items: [
      "Twenty of the twenty-four features, all eighteen widgets",
      "Up to four tabs, across the top",
      "Claude Code and Codex status in the closed notch",
      "Clipboard history — your last 500 items",
      "One page of widgets",
      "HUD replacement in the default style",
      "No account, no ads, no watermark",
      "Updates included",
    ],
  },
  {
    id: "pro",
    name: "Eyebrow Pro",
    summary: "One purchase, on the App Store. Not a subscription.",
    items: [
      "Clipboard history up to 5,000 items",
      "Four widget pages instead of one",
      "Custom HUD colours and themes",
      "iCloud sync for your Shelf and clipboard across Macs",
      "App icon packs and a custom Widgets tab icon",
      "Floating shelf: shake a file while dragging to keep it on the Shelf",
      "Shelf tools: compress and combine PDFs, compress videos, make GIFs",
      "Meeting reminder: the notch opens before a meeting, with Join, OK and snooze",
      "Face Unlock",
      "Live activities: everything that's running waits in small notches either side, one click to swap",
      "The Live tab: a page for every running activity and each Claude Code and Codex session, with quick messages and permission answers for Claude Code",
      "Up to six tabs across the top, or vertical tabs down the side with as many as you like",
    ],
  },
];

export const faqs = [
  {
    q: "Is Eyebrow really free?",
    a: "Yes. Every feature on this page not marked Pro ships in the free app, with no trial, no time limit and no ads. Pro is a single one-time purchase that raises three ceilings — clipboard history, widget pages and tabs — and adds Face Unlock, vertical tabs, live activities, the Live tab with Claude Code sessions, custom HUD colours and themes, iCloud sync, app icon packs with a custom Widgets tab icon, a floating shelf, PDF and video tools for the Shelf, and a meeting reminder that opens the notch when a meeting is about to start. Nothing you get for free is ever moved behind it.",
  },
  {
    q: "Is Pro a subscription?",
    a: "No. It is one in-app purchase, bought once through the App Store, and it stays yours. There is no renewal, and updates to Pro features are free. If you reinstall or move to a new Mac, Restore Purchases in Settings › Pro brings it back.",
  },
  {
    q: "Does my data leave my Mac?",
    a: "Almost none of it. There is no account, no telemetry and no server of ours to send anything to. Your clipboard, shelf, screenshots and calendar stay local, and transcription runs on Apple's on-device recogniser. Three optional features do reach out, because they can't work otherwise: Weather sends your approximate coordinates to Open-Meteo, Lyrics sends the track title and artist to LRCLIB, and sports scores come from ESPN. With Pro, iCloud sync — off until you turn it on — keeps your Shelf and clipboard in your own private iCloud, which we cannot read. The privacy policy lists every request in full.",
  },
  {
    q: "Do I need a Mac with a notch?",
    a: "No. On a Mac without a notch, Eyebrow draws its own at the top of the screen and you can size it to match your menu bar — or set a custom height.",
  },
  {
    q: "What does it need to run?",
    a: "macOS 15 Sequoia or later, on Apple silicon or Intel.",
  },
  {
    q: "Which permissions does it ask for, and why?",
    a: "Only for what you turn on. Calendar and Reminders for your day, Microphone and Speech Recognition for transcription, Accessibility for call controls, access to your screenshots folder for screenshot interception, Notifications for timer alerts. Every one is optional and revocable.",
  },
  {
    q: "Will it get in the way of full-screen video?",
    a: "No. Eyebrow detects full-screen media and stays out of it, and you can choose to hide the notch for every app, only your media app, or never.",
  },
  {
    q: "Can I use it across several displays?",
    a: "Yes — show it on all displays at once, pin it to one you choose, or let it follow the display you're working on.",
  },
  {
    q: "How do I get help or report a bug?",
    a: "Use the support page. It reaches a real person, and bug reports genuinely do turn into fixes.",
  },
];
