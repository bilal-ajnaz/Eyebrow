type Props = { name: string; size?: number };

const paths: Record<string, React.ReactNode> = {
  music: <><path d="M9 18V5l10-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="16" cy="16" r="3" /></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
  text: <><path d="M4 6h16M4 12h12M4 18h8" /></>,
  notes: <><rect x="4" y="3" width="16" height="18" rx="3" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
  sliders: <><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h10M18 18h2" /><circle cx="16" cy="6" r="2" /><circle cx="10" cy="12" r="2" /><circle cx="16" cy="18" r="2" /></>,
  battery: <><rect x="2" y="8" width="16" height="9" rx="2.5" /><path d="M21 11v3" /><path d="M5 11h6v3H5z" fill="currentColor" stroke="none" /></>,
  cpu: <><rect x="7" y="7" width="10" height="10" rx="2" /><path d="M10 2v3M14 2v3M10 19v3M14 19v3M2 10h3M2 14h3M19 10h3M19 14h3" /></>,
  tray: <><path d="M3 14h5l1.5 3h5L16 14h5" /><path d="M4.5 5h15l1.5 9v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4Z" /></>,
  clipboard: <><rect x="8" y="3" width="8" height="4" rx="1.5" /><path d="M9 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3" /></>,
  download: <><path d="M12 3v11M8 11l4 4 4-4" /><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" /></>,
  camera: <><path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" /><circle cx="12" cy="13" r="3.5" /></>,
  phone: <><path d="M5 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L15 13l5 2v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3 5.2 2 2 0 0 1 5 3Z" /></>,
  mic: <><rect x="9" y="2" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>,
  moon: <><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" /></>,
  timer: <><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2M9 2h6" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2.5" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  cloud: <><path d="M7 18a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 17.5 10 3.5 3.5 0 0 1 17 18Z" /></>,
  speaker: <><path d="M4 9h3.5L12 5v14l-4.5-4H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1Z" /><path d="M16 9.5a3.5 3.5 0 0 1 0 5M19 7a7 7 0 0 1 0 10" /></>,
  waveform: <><path d="M3 12h2M8 7v10M12 4v16M16 8v8M21 11v2" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" /></>,
  message: <><path d="M21 12a8 8 0 0 1-11.4 7.2L4 21l1.8-5.1A8 8 0 1 1 21 12Z" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
  check: <><circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.8 2.7L16 9.5" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M5 5l1.8 1.8M17.2 17.2 19 19M19 5l-1.8 1.8M6.8 17.2 5 19" /></>,
  live: <><circle cx="12" cy="12" r="2" /><path d="M8.2 8.2a5.4 5.4 0 0 0 0 7.6M15.8 8.2a5.4 5.4 0 0 1 0 7.6M5.4 5.4a9.3 9.3 0 0 0 0 13.2M18.6 5.4a9.3 9.3 0 0 1 0 13.2" /></>,
  sparkle: <><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z" /><path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z" /></>,
  face: <><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" /><path d="M9 9.5v1M15 9.5v1M12 9.5V13h-1M9.5 15.5a4 4 0 0 0 5 0" /></>,
  bell: <><path d="M18 15V10a6 6 0 1 0-12 0v5l-2 3h16Z" /><path d="M10 21h4" /></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2.5" /><path d="M8 10V7a4 4 0 1 1 8 0v3" /></>,
  bolt: <><path d="M13 2 4 14h7l-1 8 9-12h-7Z" /></>,
  arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m3.5 7 8.5 6 8.5-6" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" /></>,
  keyboard: <><rect x="2" y="6" width="20" height="12" rx="2.5" /><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8" /></>,
  display: <><rect x="2.5" y="4" width="19" height="13" rx="2.5" /><path d="M9 21h6M12 17v4" /></>,
  home: <><path d="M4 11 12 4.5 20 11v8.5a1 1 0 0 1-1 1h-4.5V15h-5v5.5H5a1 1 0 0 1-1-1Z" /></>,
  widgets: <><rect x="3" y="4" width="8" height="7" rx="2" /><rect x="13" y="4" width="8" height="16" rx="2" /><rect x="3" y="13" width="8" height="7" rx="2" /></>,
  pencil: <><path d="M4 20l1-4.5L15.5 5a2.1 2.1 0 0 1 3 3L8 18.5Z" /><path d="M13.5 7l3 3" /></>,
  link: <><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></>,
  file: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" /><path d="M14 3v5h5" /></>,
  copy: <><rect x="8" y="8" width="12" height="12" rx="2.5" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></>,
  save: <><path d="M12 4v10M8 10l4 4 4-4" /><path d="M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" /></>,
  pin: <><path d="M9 3.5h6l-1 6.5 3.5 3.5h-11L10 10z" /><path d="M12 13.5V21" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  minus: <><path d="M6 12h12" /></>,
  play: <><path d="M7 5.2v13.6a.8.8 0 0 0 1.2.7l11-6.8a.8.8 0 0 0 0-1.4l-11-6.8A.8.8 0 0 0 7 5.2Z" fill="currentColor" /></>,
  // Transport — same grid, filled like the system media glyphs.
  pause: <><rect x="6.5" y="5" width="3.6" height="14" rx="1.2" fill="currentColor" /><rect x="13.9" y="5" width="3.6" height="14" rx="1.2" fill="currentColor" /></>,
  next: <><path d="M4.5 7v10a.8.8 0 0 0 1.25.66L12 13.2V17a.8.8 0 0 0 1.25.66l7.1-5a.8.8 0 0 0 0-1.32l-7.1-5A.8.8 0 0 0 12 7v3.8L5.75 6.34A.8.8 0 0 0 4.5 7Z" fill="currentColor" /></>,
  previous: <><path d="M19.5 7v10a.8.8 0 0 1-1.25.66L12 13.2V17a.8.8 0 0 1-1.25.66l-7.1-5a.8.8 0 0 1 0-1.32l7.1-5A.8.8 0 0 1 12 7v3.8l6.25-4.46A.8.8 0 0 1 19.5 7Z" fill="currentColor" /></>,
};

export default function Icon({ name, size = 19 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name] ?? paths.sparkle}
    </svg>
  );
}
