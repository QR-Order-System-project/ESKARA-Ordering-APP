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
      <PageTitle title={name ?? "테이블"} Icon={FaMoneyBillWave} />
      <OrderList orders={orders} />
      <TotalPriceLabel label="주문" price={totalPrice} />

      <div className={styles.buttonRow}>
        <button
          className={styles.payCompleteButton}
          onClick={() => onPayComplete?.(id)}
          disabled={isPaying || !orders.length}
        >
          {isPaying ? "처리 중..." : "결제완료"}
        </button>
      </div>
      <div className={styles.backButton}>
        <button className={styles.backButton} onClick={onClose}>
          뒤로
        </button>
      </div>
    </div>
  );
};
