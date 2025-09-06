import { useNavigate, useLocation } from "react-router-dom";
import { TbHome } from "react-icons/tb";
import styles from "./UserTopBar.module.scss";

export default function UserTopBar({ tableNumber }) {
  const navigate = useNavigate();
  const currentLocation = useLocation();

  return (
    <div className={styles.TopBar}>
      <div className={styles.LeftGroup}>
        <button
          className={styles.HomeButton}
          onClick={() => navigate("/user/main")}
        >
          <TbHome />
        </button>
        <button className={styles.TableLabel} disabled>
          테이블 {tableNumber ?? "N"}
        </button>
      </div>

      <div className={styles.RightGroup}>
        <button
          className={`${styles.CallManagerButton} ${
            currentLocation.pathname === "/user/call" ? styles.active : ""
          }`}
          onClick={() => navigate("/user/call")}
        >
          직원호출
        </button>
        <button
          className={`${styles.OrderListButton} ${
            currentLocation.pathname === "/user/orders" ? styles.active : ""
          }`}
          onClick={() => navigate("/user/orders")}
        >
          주문내역
        </button>
      </div>
    </div>
  );
}

export { UserTopBar };
