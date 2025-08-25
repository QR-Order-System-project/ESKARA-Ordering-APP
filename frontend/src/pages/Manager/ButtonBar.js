import styles from "./ButtonBar.module.scss";

const TABS = ["TABLE", "ORDER", "CALL"];

export const ButtonBar = ({ value, onChange }) => {
  return (
    <div className={styles.mainPanel} role="tablist">
      {TABS.map((label) => (
        <button
          key={label}
          type="button"
          role="tab"
          aria-selected={value === label}
          className={`${styles.button} ${value === label ? styles.active : ""}`}
          onClick={() => onChange?.(label)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
