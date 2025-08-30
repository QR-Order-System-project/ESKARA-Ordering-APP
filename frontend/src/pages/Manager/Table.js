import styles from "./Table.module.scss";

/**
 * Table
 * - 테이블 단위 카드 컴포넌트
 * - 이름과 총 금액을 표시
 *
 * Props
 * - table: { name, totalPrice } 테이블 정보
 * - isActive: 선택 여부 (스타일 강조)
 * - onClick: 클릭 핸들러
 */
export const Table = ({ table, isActive, onClick }) => {
  const { name, totalPrice } = table;

  return (
    <div
      className={`${styles.tablePanel} ${isActive ? styles.active : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {/* 테이블 이름 */}
      <div className={styles.tableName}>{name}</div>

      {/* 총 금액 */}
      <div className={styles.tablePrice}>{totalPrice.toLocaleString()}원</div>
    </div>
  );
};
