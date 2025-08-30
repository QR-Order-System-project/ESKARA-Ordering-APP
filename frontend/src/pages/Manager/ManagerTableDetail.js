import { OrderList } from "../../components/OrderList";
import { PageTitle } from "../../components/PageTitle";
import { TotalPriceLabel } from "../../components/TotalPriceLabel";
import { FaMoneyBillWave } from "react-icons/fa";
import styles from "./ManagerTableDetail.module.scss";

export const ManagerTableDetail = ({ table, onClose, onPayComplete }) => {
  // 안전한 디폴트
  const {
    id = null,
    name = "테이블",
    totalPrice = 0,
    orders = [],
  } = table ?? {};

  const safeOrders = Array.isArray(orders) ? orders : [];

  const handlePay = () => {
    if (id == null) return;
    onPayComplete?.(id);
  };

  return (
    <div className={styles.mainPanel}>
      {/* 🔝 타이틀 고정 */}
      <div className={styles.titleBar}>
        <PageTitle title={name} Icon={FaMoneyBillWave} />
      </div>

      {/* 📜 주문 목록 + 합계 */}
      <div className={styles.content}>
        <OrderList orders={safeOrders} />
        <TotalPriceLabel label="주문" price={totalPrice} />
      </div>

      {/* ✔ 결제 버튼 */}
      <div className={styles.buttonRow}>
        <button
          type="button"
          className={styles.payCompleteButton}
          onClick={handlePay}
          disabled={id == null}
        >
          결제완료
        </button>
      </div>

      {/* ◀ 뒤로 버튼 */}
      <div className={styles.backRow}>
        <button type="button" className={styles.backButton} onClick={onClose}>
          뒤로
        </button>
      </div>
    </div>
  );
};
