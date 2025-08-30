import styles from "./ButtonBar.module.scss";

// 맨 위 테이블, 오더, 콜 탭 전환 버튼

const TABS = ["TABLE", "ORDER", "CALL"];

export const ButtonBar = ({ value, onChange }) => (
  <div className={styles.mainPanel}>
    {TABS.map((label) => {
      const isActive = value === label;
      return (
        <button
          key={label}
          type="button"
          className={`${styles.button} ${isActive ? styles.active : ""}`}
          onClick={() => onChange?.(label)}
        >
          {label}
        </button>
      );
    })}
  </div>
);
