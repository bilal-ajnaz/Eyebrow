export type Feature = {
  title: string;
  body: string;
  icon: string; // key into components/Icon.tsx
  group: string;
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
    body: "Volume, display brightness and keyboard backlight stop covering your work. Hierarchical or gradient styling, optional glow, accent tinting, inline or full.",
  },
  {
    group: "System",
    icon: "battery",
    title: "Battery and power",
    body: "Charge state, percentage and power-source changes as a live activity — plus the battery level of connected Bluetooth devices.",
  },
  {
    group: "System",
    icon: "cpu",
    title: "System stats",
    body: "CPU and memory pressure at a glance, without another menu-bar icon fighting for space.",
  },
  {
    group: "Files",
    icon: "tray",
    title: "The Shelf",
    body: "Drag anything to the notch and it waits there. Drag it back out anywhere. Thumbnails, Quick Look, copy-on-drag, auto-clear, and one-tap Quick Share.",
  },
  {
    group: "Files",
    icon: "clipboard",
    title: "Clipboard history",
    body: "Text, links, images, screenshots, colours and files, filtered by type and searchable. Keep 7, 30 or 365 days. ⇧⌘C from anywhere.",
  },
  {
    group: "Files",
    icon: "download",
    title: "Download progress",
    body: "Safari, Chrome, Firefox, Arc and Brave downloads show live progress in the notch — progress bar or percentage, with the source app's icon.",
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
    icon: "moon",
    title: "Notification triage",
    body: "While Focus is on, notifications are held in the notch behind a count instead of interrupting. When Focus ends, expand the digest and clear it in one pass.",
  },
  {
    group: "Focus",
    icon: "timer",
    title: "Timers and focus sessions",
    body: "Start a timer in the notch and watch it count down in the closed state. No extra window, no extra app.",
  },
  {
    group: "Day",
    icon: "calendar",
    title: "Calendar and Reminders",
    body: "Upcoming events with auto-scroll to what's next, all-day events hidden if you like, and reminders you can tick off in place. Meeting alerts fire as the call starts.",
  },
  {
    group: "Day",
    icon: "cloud",
    title: "Weather",
    body: "Current conditions and temperature in the notch, in Celsius or Fahrenheit.",
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
    group: "Input",
    icon: "message",
    title: "Messages in the notch",
    body: "Read incoming messages and reply inline, without leaving what you're doing.",
  },
];

export type Widget = { name: string; body: string; icon: string };

/** WidgetKind — all sixteen, sizes S / M / L. */
export const widgets: Widget[] = [
  { name: "Clock", body: "Current time and date", icon: "clock" },
  { name: "Weather", body: "Temperature and conditions", icon: "cloud" },
  { name: "Battery", body: "Battery level and status", icon: "battery" },
  { name: "Now Playing", body: "Now playing with controls", icon: "music" },
  { name: "Calendar", body: "Upcoming calendar events", icon: "calendar" },
  { name: "Reminders", body: "Pending reminders", icon: "check" },
  { name: "System Stats", body: "CPU and memory usage", icon: "cpu" },
  { name: "Time & Weather", body: "Time, date and weather together", icon: "sun" },
  { name: "Timer / Focus", body: "Focus timer with controls", icon: "timer" },
  { name: "Clipboard", body: "Clipboard history by type", icon: "clipboard" },
  { name: "Transcription", body: "On-device speech transcription", icon: "waveform" },
  { name: "AI Usage", body: "Claude / Codex session info", icon: "sparkle" },
  { name: "Meeting Alert", body: "Alert when a meeting starts", icon: "bell" },
  { name: "Call Controls", body: "Zoom / Meet / Teams controls", icon: "phone" },
  { name: "Browser Tabs", body: "Safari and Chrome tab switcher", icon: "globe" },
  { name: "Messages", body: "In-notch messaging and replies", icon: "message" },
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
  { name: "Focus", body: "Held notifications and the digest" },
  { name: "Weather", body: "Conditions right now" },
  { name: "Widgets", body: "Your own layout, S / M / L" },
];

export const faqs = [
  {
    q: "Is Eyebrow really free?",
    a: "Yes. Every feature on this page, no subscription, no trial, no upgrade tier, no ads. If you like it, tell someone about it.",
  },
  {
    q: "Does my data leave my Mac?",
    a: "No. Transcription uses Apple's on-device speech recognition. Your clipboard, shelf, screenshots, calendar and notifications are read and stored locally. There is no account to create and no server to sign in to.",
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
    a: "Only for what you turn on. Calendar and Reminders for your day, Microphone and Speech Recognition for transcription, Accessibility for HUD replacement and mute detection, Screen Recording for screenshot interception, Notifications for triage. Every one is optional and revocable.",
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
