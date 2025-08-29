import { OrderList } from "../../components/OrderList";
import { PageTitle } from "../../components/PageTitle";
import { TotalPriceLabel } from "../../components/TotalPriceLabel";
import { FaMoneyBillWave } from "react-icons/fa";
import styles from "./ManagerTableDetail.module.scss";

export const ManagerTableDetail = ({
  table,
  onClose,
  onPayComplete,
  isPaying,
}) => {
  const { id, name, totalPrice, orders = [] } = table ?? {};

  return (
    <div className={styles.mainPanel}>
      {/* 🔝 타이틀 고정될 영역 */}
      <div className={styles.titleBar}>
        <PageTitle title={name ?? "테이블"} Icon={FaMoneyBillWave} />
      </div>

      {/* 📜 주문 목록 + 합계만 스크롤 */}
      <div className={styles.content}>
        <OrderList orders={orders} />
        <TotalPriceLabel label="주문" price={totalPrice} />
      </div>

      {/* ✔ 결제 버튼 */}
      <div className={styles.buttonRow}>
        <button
          className={styles.payCompleteButton}
          onClick={() => onPayComplete?.(id)}
        >
          {isPaying ? "처리 중..." : "결제완료"}
        </button>
      </div>

      {/* ◀ 뒤로 버튼 */}
      <div className={styles.backRow}>
        <button className={styles.backButton} onClick={onClose}>
          뒤로
        </button>
      </div>
    </div>
  );
};
