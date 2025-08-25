import { OrderItem } from "./OrderItem";
import styles from "./OrderList.module.scss";

//주문내역을 관리하는 컴포넌트.
// dummyOrders = [
//     { id: 1, name: "아메리카노", amount: 2, price: 4500 },
//     { id: 2, name: "카페라떼", amount: 1, price: 5000 },
//     { id: 3, name: "카푸치노", amount: 3, price: 4800 },
//   ];
//과 같은 형태의 배열을 받아서 사용한다 (id는 필수 아님).

export const OrderList = ({ orders }) => {
  return (
    <div className={styles.mainPanel}>
      <div className={styles.orderPanel}>
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <OrderItem
              className={styles.orderItem}
              key={order.id}
              order={order}
            />
          ))
        ) : (
          <div className={styles.notice}>
            주문 내역이
            <br /> 존재하지 않습니다.
          </div>
        )}
      </div>
    </div>
  );
};
