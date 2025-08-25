import { useState } from "react";
import { HomeButton } from "../../components/HomeButton";
import { ButtonBar } from "./ButtonBar";
import styles from "./ManagerMain.module.scss";

export const ManagerMain = () => {
  const [tab, setTab] = useState("TABLE");

  return (
    <div className={styles.wrapper}>
      <div className={styles.mainPanel}>
        <div className={styles.topBar}>
          <HomeButton to="/manager" />
          <div className={styles.logoPanel}>
            <img src="" alt="유학대학로고" className={styles.Icon} />
            <img
              src="/icons/Sowlmate_Icon.png"
              alt="솦꿉친구로고"
              className={styles.Icon}
            />
          </div>
        </div>

        <ButtonBar value={tab} onChange={setTab} />

        {tab === "TABLE" && <div>테이블 화면</div>}
        {tab === "ORDER" && <div>주문 화면</div>}
        {tab === "CALL" && <div>콜 화면</div>}
      </div>
    </div>
  );
};
