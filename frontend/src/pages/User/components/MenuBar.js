import styles from "./MenuBar.module.scss";

const TABS = [
  { key: "event", label: "EVENT" },
  { key: "main", label: "MAIN" },
  { key: "side", label: "SIDE" },
  { key: "drink", label: "DRINK" },
];

export default function MenuBar({ activeKey, onSelect }) {
  return (
    <div className={styles.MenuBar} >
      {TABS.map((tab) => (
        <button
          key={tab.key}
          className={`${styles.Tab} ${activeKey === tab.key ? styles.Active : ""}`}
          onClick={() => onSelect(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export { MenuBar };