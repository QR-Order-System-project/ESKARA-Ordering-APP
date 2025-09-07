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
export const Table = ({ table, onClick }) => {
  const { tableNumber } = table;
  const totalAmount = table.totalAmount ?? 0;

  return (
    <div
      className={styles.tablePanel}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {/* 테이블 이름 */}
      <div className={styles.tableName}>테이블 {tableNumber}</div>

      {/* 총 금액 */}
      <div className={styles.tablePrice}>{totalAmount.toLocaleString()}원</div>
    </div>
  );
};
