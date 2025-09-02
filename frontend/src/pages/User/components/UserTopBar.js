import { useNavigate } from "react-router-dom";
import { TbHome } from "react-icons/tb";
import styles from "./UserTopBar.module.scss";

//TODO: 테이블 번호 받아오기
export default function UserTopBar({ tableNumber }) {
  const navigate = useNavigate();

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
          className={styles.CallManagerButton}
          onClick={() => navigate("/user/call")}
        >
          직원호출
        </button>
        <button
          className={styles.OrderListButton}
          onClick={() => navigate("/user/orders")}
        >
          주문내역
        </button>
      </div>
    </div>
  );
}

export { UserTopBar };
