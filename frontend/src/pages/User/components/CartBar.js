import { BsCart2 } from "react-icons/bs";
import styles from "./CartBar.module.scss";
import { useNavigate, useParams } from "react-router-dom"
import { useCart } from "../data/CartContext";

export default function CartBar() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const { tableNumber } = useParams();

  return (
    <div className={styles.CartBar} onClick={() => navigate(`/user/cart/${tableNumber}`)}>
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