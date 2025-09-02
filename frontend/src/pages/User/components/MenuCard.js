import { useState } from "react";
import styles from "./MenuCard.module.scss";
import { CompactToastModal } from "../../../components/popups/CompactToastModal";

export default function MenuCard({id, name, price, desc, img, onAdd }) {
  const [count, setCount] = useState(1);
  const [toast, setToast] = useState(null);

  const handleAddClick = () => {
    if (typeof onAdd === "function") {
      onAdd({ id, name, price, qty: count });
      setCount(1);
      setToast({ message: `선택한 메뉴가 장바구니에 담겼습니다.`, variant: "success" });
    }
  };

  return (
    <>
    <div className={styles.Card}>
      <div className={styles.ImageBox}>
        <img src={img} alt={name} />
      </div>

      <div className={styles.Content}>
        <div className={styles.Info}>
          <span className={styles.Name}>{name}</span>
          <span className={styles.Price}>{price.toLocaleString()}원</span>
          <span className={styles.Desc}>{desc}</span>
        </div>

        <div className={styles.Actions}>
          <div className={styles.Counter}>
            <button onClick={() => setCount(Math.max(1, count - 1))}>-</button>
            <span>{count}</span>
            <button onClick={() => setCount(count + 1)}>+</button>
          </div>
          <button className={styles.Add} onClick={handleAddClick}>메뉴담기</button>
        </div>
      </div>
    </div>

    {toast && (
        <CompactToastModal
          message={toast.message}
          variant={toast.variant}
          duration={1800}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
