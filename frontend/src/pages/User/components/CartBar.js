import { BsCart2 } from "react-icons/bs";
import styles from "./CartBar.module.scss";
import { useNavigate } from "react-router-dom"

export default function CartBar({ cart }) {
  const navigate = useNavigate();
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className={styles.CartBar} onClick={() => navigate("/user/cart")}>
      <div className={styles.Left}>
        <div className={styles.IconWrapper}>
          <BsCart2 size={30} />
          {totalQty > 0 && (
            <span className={styles.Badge}>{totalQty}</span>
          )}
        </div>
        <span>장바구니</span>
      </div>
      <div className={styles.Right}>
        {totalPrice.toLocaleString()}원
      </div>
    </div>
  );
}

export { CartBar };