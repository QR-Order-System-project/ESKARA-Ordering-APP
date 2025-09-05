import styles from "./ButtonBar.module.scss";

/**
 * ButtonBar
 * - 상단 탭 전환 바 (TABLE / ORDER / CALL)
 * - value: 현재 선택된 탭
 * - onChange: 탭 클릭 시 호출
 */

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
