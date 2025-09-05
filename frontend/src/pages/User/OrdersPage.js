import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserTopBar } from "./components/UserTopBar";
import styles from "./OrdersPage.module.scss";
import { PageTitle } from "../../components/PageTitle";
import { OrderList } from "../../components/OrderList";
import { BsClipboard } from "react-icons/bs";
import { CompactToastModal } from "../../components/popups/CompactToastModal";
import { TotalPriceLabel } from "../../components/TotalPriceLabel";

//TODO: 실제 주문 내역 DB에서 받아오기
const dummyOrders = [
  { id: 1, name: "두근두근, 사랑은 계란을 타고...", amount: 2, price: 0 },
  { id: 2, name: "주점 인증샷 한잔해", amount: 1, price: 0 },
  { id: 3, name: "불가마 어묵탕", amount: 2, price: 10000 },
  { id: 4, name: "참숯가마 버팔로윙", amount: 1, price: 15000 },
  { id: 5, name: "황토방 두부김치", amount: 5, price: 8000 },
  { id: 6, name: "모듬 후르츄베릅", amount: 2, price: 8000 },
  { id: 7, name: "도리도리토스뱅크 타코", amount: 3, price: 7000 },
  { id: 8, name: "밥알 낭낭한 찜질방 식혜", amount: 1, price: 3000 },
  { id: 9, name: "세빠지게 섞은 주전자 미숫가루", amount: 2, price: 5000 },
];

export default function OrderPage() {
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  //TODO: 직원용 사이트에서 API로 받아와야함
  const isPaymentEnabled = true;

  const handlePayment = async () => {
    const accountNumber = "112-2218-9983-00 부산은행";

    if (!isPaymentEnabled) {
      setToast({
        message: "직원이 결제를 요청한 경우에 다시 시도해주세요.",
        variant: "error",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(accountNumber);
      setToast({
        message: "계좌번호가 성공적으로 복사되었습니다!",
        variant: "success",
      });
    } catch (err) {
      setToast({ message: "클립보드 복사에 실패했습니다.", variant: "error" });
    }
  };

  const totalPrice = dummyOrders.reduce(
    (sum, item) => sum + item.price * item.amount,
    0
  );

  const hasOrders = dummyOrders.length > 0;

  return (
    <>
      <div className={styles.Wrapper}>
        <div className={styles.MainPanel}>
          <div className={styles.TopBarWrapper}>
            <UserTopBar tableNumber={99} />
          </div>
          <PageTitle title="주문내역" Icon={BsClipboard} size={27} />
          <OrderList orders={dummyOrders} />

          <div className={styles.PaymentBar}>
            <TotalPriceLabel label="결제" price={totalPrice} />

            <button
              className={styles.OrderButton}
              onClick={() => {
                if (hasOrders) {
                  handlePayment();
                } else {
                  navigate("/user/main");
                }
              }}
            >
              {hasOrders ? "결제하기" : "지금 주문하러 가기"}
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <CompactToastModal
          message={toast.message}
          variant={toast.variant}
          duration={2000}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
