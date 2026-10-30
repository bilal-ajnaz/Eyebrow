import Icon from "@/components/Icon";

export type NotchTab = "home" | "shelf" | "clipboard" | "widgets";

const tabs: { id: NotchTab; icon: string; label: string }[] = [
  { id: "home", icon: "home", label: "Home" },
  { id: "shelf", icon: "tray", label: "Shelf" },
  { id: "clipboard", icon: "clipboard", label: "Clipboard" },
  { id: "widgets", icon: "widgets", label: "Widgets" },
];

/* A live open notch, drawn in HTML to the app's measurements (640 × ~230,
   tiles on notch-fill-2, white icons) so the guide's demos can be used,
   not just looked at. `extra` sits in the header beside the settings gear. */
export default function Notch({
  tab,
  extra,
  children,
  label,
}: {
  tab: NotchTab;
  extra?: React.ReactNode;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="nt" role="group" aria-label={label}>
      <div className="nt__head">
        <ul className="nt__tabs" aria-hidden="true">
          {tabs.map((t) => (
            <li key={t.id} data-on={t.id === tab}>
              <Icon name={t.icon} size={17} />
            </li>
          ))}
        </ul>
        <div className="nt__status">
          {extra}
          <span className="nt__gear" aria-hidden="true"><Icon name="gear" size={16} /></span>
          <span className="nt__batt" aria-hidden="true">82%<i /></span>
        </div>
      </div>
      <div className="nt__body">{children}</div>
    </div>
  );
}
