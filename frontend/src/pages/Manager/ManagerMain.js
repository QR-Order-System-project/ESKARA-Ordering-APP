import { HomeButton } from "../../components/HomeButton";
import { OrderList } from "../../components/OrderList";
import { TotalPriceLabel } from "../../components/TotalPriceLabel";
import styles from "./ManagerMain.module.scss";

export const ManagerMain = () => {
  const dummyOrders = [
    { id: 1, name: "아메리카노", amount: 2, price: 4500 },
    { id: 2, name: "카페라떼", amount: 1, price: 5000 },
    { id: 3, name: "카푸치노", amount: 3, price: 4800 },
    { id: 4, name: "초콜릿 라떼", amount: 1, price: 5500 },
    { id: 5, name: "녹차 프라푸치노", amount: 2, price: 6000 },
    { id: 6, name: "민트 초코", amount: 1, price: 5500 },
    { id: 7, name: "딸기 스무디", amount: 2, price: 6200 },
    { id: 8, name: "바닐라 라떼", amount: 1, price: 5300 },
    { id: 9, name: "콜드브루", amount: 2, price: 4900 },
    { id: 10, name: "허니 레몬티", amount: 1, price: 5700 },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.mainPanel}>
        <div className={styles.topBar}>
          <HomeButton to="/manager" />
          <div className={styles.logo}></div>
        </div>
        <OrderList orders={dummyOrders} />
        <TotalPriceLabel label="주문" price="99999999" />
      </div>
    </div>
  );
};
