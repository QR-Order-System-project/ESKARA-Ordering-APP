import styles from "./TotalPriceLabel.module.scss";

export const TotalPriceLabel = ({ label, price }) => {
  return (
    <div className={styles.mainBar}>
      <div className={styles.label}>총 {label}금액</div>
      <div className={styles.price}>{price}원</div>
    </div>
  );
};
