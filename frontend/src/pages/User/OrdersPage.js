import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserTopBar } from "./components/UserTopBar";
import styles from "./OrdersPage.module.scss";
import { PageTitle } from "../../components/PageTitle";
import { OrderList } from "../../components/OrderList";
import { BsClipboard } from "react-icons/bs";
import { CompactToastModal } from "../../components/popups/CompactToastModal";
import { TotalPriceLabel } from "../../components/TotalPriceLabel";
import { getOrderDetails } from "../../api/orders";
import { getPaymentDetail } from "../../api/payment";
import { io } from "socket.io-client"; 

export default function OrderPage() {
  const [orderDetails, setOrderDetails] = useState({ items: [], totalAmount: 0, paymentAble: false, });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const { tableNumber } = useParams();

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      const data = await getPaymentDetail(tableNumber);
      setOrderDetails(data);
    } catch (err) {
      setError("주문 내역을 불러오는 데 실패했습니다.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();

    const socket = io("http://localhost:3001"); // TODO: 배포 시 서버 주소로 변경

    socket.on("refreshTableStatus", () => {
      console.log("refreshTableStatus 이벤트 감지 → 주문내역 갱신");
      fetchOrderDetails();
    });

    socket.on("paymentActivated", () => {
      console.log("paymentActivated 이벤트 감지 → 결제 가능 상태로 변경");
      setOrderDetails((prev) => ({ ...prev, paymentAble: true }));
    });

    socket.on("paymentDeactivated", () => {
      console.log("paymentDeactivated 이벤트 감지 → 결제 불가 상태로 변경");
      setOrderDetails((prev) => ({ ...prev, paymentAble: false }));
    });

    return () => {
      socket.disconnect();
    };
  }, [tableNumber]);

  const handlePayment = async () => {
    if (!orderDetails?.paymentAble) {   // 비활성화 상태면
    setToast({
      message: "직원이 결제를 요청한 경우에 다시 시도해주세요.",
      variant: "error",
    });
    return;
    }

    try {
      await navigator.clipboard.writeText("3333-32-4717865 카카오뱅크");
      setToast({
        message: "계좌번호가 성공적으로 복사되었습니다!",
        variant: "success",
      });
    } catch (err) {
      setToast({ message: "클립보드 복사에 실패했습니다.", variant: "error" });
    }
  };

  const formattedOrders = orderDetails.items.map(item => ({
    name: item.menu,
    amount: item.count,
    price: item.price,
    id: item.menu,
  }));

  const hasOrders = formattedOrders.length > 0;

  return (
    <>
      <div className={styles.Wrapper}>
        <div className={styles.MainPanel}>
          <div className={styles.TopBarWrapper}>
            <UserTopBar tableNumber={tableNumber} />
          </div>
          <PageTitle title="주문내역" Icon={BsClipboard} size={27} />
          
            {isLoading ? (
              <div className={styles.notice}>주문 내역을 불러오는 중...</div>
            ) : error ? (
              <div className={styles.notice}>{error}</div>
            ) : (
              <OrderList orders={formattedOrders} />
            )}


          <div className={styles.PaymentBar}>
            <TotalPriceLabel label="결제" price={orderDetails.totalAmount} />

            <button
              className={styles.OrderButton}
              onClick={() => {
                if (hasOrders) {
                  handlePayment();
                } else {
                  navigate(`/user/main/${tableNumber}`);
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
