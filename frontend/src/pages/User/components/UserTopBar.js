import { useNavigate, useLocation, useParams } from "react-router-dom";
import { TbHome } from "react-icons/tb";
import styles from "./UserTopBar.module.scss";
//tableNumber을 url에서 받아온다.
export default function UserTopBar() {
  const navigate = useNavigate();
  const currentLocation = useLocation();
  const { tableNumber } = useParams();

  return (
    <div className={styles.TopBar}>
      <div className={styles.LeftGroup}>
        <button
          className={styles.HomeButton}
          onClick={() => navigate(`/user/main/${tableNumber}`)}
        >
          <TbHome color="black" />
        </button>
        <button className={styles.TableLabel} disabled>
          테이블 {tableNumber ?? "N"}
        </button>
      </div>

      <div className={styles.RightGroup}>
        <button
          className={`${styles.CallManagerButton} ${
            currentLocation.pathname === `/user/call/${tableNumber}` ? styles.active : ""
          }`}
          onClick={() => navigate(`/user/call/${tableNumber}`)}
        >
          직원호출
        </button>
        <button
          className={`${styles.OrderListButton} ${
            currentLocation.pathname === `/user/orders/${tableNumber}` ? styles.active : ""
          }`}
          onClick={() => navigate(`/user/orders/${tableNumber}`)}
        >
          주문내역
        </button>
      </div>
    </div>
  );
}

export { UserTopBar };
