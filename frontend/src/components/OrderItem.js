import styles from "./OrderItem.module.scss";

//주문내역의 각 주문 하나를 관리하는 컴포넌트
//이름, 수량, 가격을 받아서 띄운다.

export const OrderItem = ({ order }) => {
  const { name = "이름", amount = 0, price = 0 } = order || {};

  return (
    <div className={styles.itemPanel}>
      <div className={styles.titlePanel}>
        <div className={styles.orderName}>{name}</div>
        <div className={styles.orderAmount}>X{amount}</div>
      </div>
      <div className={styles.price}>{(price).toLocaleString()}원</div>
    </div>
  );
};
