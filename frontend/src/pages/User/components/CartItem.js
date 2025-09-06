import styles from "./CartItem.module.scss";

export default function CartItem({ id, name, price, qty, onUpdate, onRemove }) {
  const handleChange = (newCount) => {
    if (newCount < 1) {
      onRemove(id); // 0 이하면 삭제
    } else {
      onUpdate(id, newCount);
    }
  };

  return (
    <div className={styles.itemPanel}>
      {/* 제목 위쪽 */}
      <span className={styles.name}>{name}</span>

      {/* 가격 + 수량 조절 버튼 한 줄 */}
      <div className={styles.bottomRow}>
        <span className={styles.price}>{price.toLocaleString()}원</span>
        <div className={styles.Counter}>
          <button onClick={() => handleChange(qty - 1)}>-</button>
          <span>{qty}</span>
          <button onClick={() => handleChange(qty + 1)}>+</button>
        </div>
      </div>
    </div>
  );
}
