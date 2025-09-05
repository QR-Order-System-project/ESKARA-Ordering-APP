import { OrderList } from "../../components/OrderList";
import { PageTitle } from "../../components/PageTitle";
import { TotalPriceLabel } from "../../components/TotalPriceLabel";
import { FaMoneyBillWave } from "react-icons/fa";
import styles from "./ManagerTableDetail.module.scss";

/**
 * ManagerTableDetail
 * - 단일 테이블의 상세 주문 내역을 표시
 * - 주문 목록, 총 금액, 결제완료 버튼, 뒤로가기 버튼 포함
 *
 * Props
 * - table: { id, name, totalPrice, orders } 테이블 정보
 * - onClose: 뒤로가기 클릭 핸들러
 * - onPayComplete: 결제완료 시 호출 (id 전달)
 */
export const ManagerTableDetail = ({ table, onClose, onPayComplete }) => {
  // 안전한 디폴트 구조 분해
  const {
    id = null,
    name = "테이블",
    totalPrice = 0,
    orders = [],
  } = table ?? {};

  const safeOrders = Array.isArray(orders) ? orders : [];

  /* 결제 버튼 클릭 */
  const handlePay = () => {
    if (id == null) return;
    onPayComplete?.(id);
  };

  return (
    <div className={styles.mainPanel}>
      {/* 상단 타이틀 (테이블명) */}
      <div className={styles.titleBar}>
        <PageTitle title={name} Icon={FaMoneyBillWave} />
      </div>

      {/* 주문 내역 + 합계 금액 */}
      <div className={styles.content}>
        <OrderList orders={safeOrders} />
        <TotalPriceLabel label="주문" price={totalPrice} />
      </div>

      {/* 결제완료 버튼 */}
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
    </div>
  );
};
