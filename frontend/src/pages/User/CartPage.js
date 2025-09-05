import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserTopBar } from "./components/UserTopBar";
import styles from "./CartPage.module.scss";
import { PageTitle } from "../../components/PageTitle";
import { BsCart2 } from "react-icons/bs";
import { useCart } from "./data/CartContext";
import { TotalPriceLabel } from "../../components/TotalPriceLabel";
import CartItem from "./components/CartItem";
import { CompactToastModal } from "../../components/popups/CompactToastModal";

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, updateQty, removeFromCart, clearCart } = useCart();
  const [toast, setToast] = useState(null);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleOrder = () => {
    if (cart.length === 0) {
      navigate("/user/main");
    } else {
      // TODO: 주문하기 → 나중에 DB로 전송
      console.log("주문 전송:", cart);
      clearCart();

      setToast({
        message: "주문이 성공적으로 접수되었습니다!",
        variant: "success",
      });
    }
  };

  return (
    <>
      <div className={styles.Wrapper}>
        <div className={styles.MainPanel}>
          <div className={styles.TopBarWrapper}>
            <UserTopBar tableNumber={99} />
          </div>

          <PageTitle title="장바구니" Icon={BsCart2} size={31} />

          <div className={styles.mainPanel}>
            <div className={styles.orderPanel}>
              {cart.length > 0 ? (
                cart.map((item) => (
                  <CartItem
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    qty={item.qty}
                    onUpdate={updateQty}
                    onRemove={removeFromCart}
                  />
                ))
              ) : (
                <div className={styles.notice}>장바구니가 비어있습니다.</div>
              )}
            </div>
          </div>

          <div className={styles.PaymentBar}>
            <TotalPriceLabel label="주문" price={totalPrice} />
            <button className={styles.OrderButton} onClick={handleOrder}>
              {cart.length === 0 ? "메뉴 구경하러 가기" : "주문하기"}
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
