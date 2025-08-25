import styles from "./Table.module.scss";

export const Table = ({ table, isActive, onClick }) => {
  const { name, totalPrice } = table;

  return (
    <div
      className={`${styles.tablePanel} ${isActive ? styles.active : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className={styles.tableName}>{name}</div>
      <div className={styles.tablePrice}>{totalPrice.toLocaleString()}원</div>
    </div>
  );
};
