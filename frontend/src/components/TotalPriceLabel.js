import styles from "./TotalPriceLabel.module.scss";

//총 OO 금액 컴포넌트.
//label에 금액 종류, price에 가격을 string으로 입력하면 된다.
//금액은 자동으로 포맷된다.

export const TotalPriceLabel = ({ label, price }) => {
  return (
    <div className={styles.mainBar}>
      <div className={styles.label}>총 {label}금액</div>
      <div className={styles.price}>
        {Number(price ?? 0).toLocaleString()}원
      </div>
    </div>
  );
};
