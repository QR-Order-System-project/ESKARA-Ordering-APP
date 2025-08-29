import { useEffect, useState } from "react";
import { HomeButton } from "../../components/HomeButton";
import { ButtonBar } from "./ButtonBar";
import styles from "./ManagerMain.module.scss";
import { ManagerTableTab } from "./ManagerTableTab";
import { ManagerOrderTab } from "./ManagerOrderTab";
import { ManagerCallTab } from "./ManagerCallTab";
import { useLocation } from "react-router";

export const ManagerMain = () => {
  const [tab, setTab] = useState("TABLE");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/manager") setTab("TABLE");
  }, [location]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.mainPanel}>
        <div className={styles.topBar}>
          <HomeButton to="/manager" />
          <div className={styles.logoPanel}>
            <img
              src="/icons/YuSeong_Icon.png"
              alt="유학대학로고"
              className={styles.yuseongIcon}
            />
            <img
              src="/icons/Sowlmate_Icon.png"
              alt="솦꿉친구로고"
              className={styles.sowlmateIcon}
            />
          </div>
        </div>

        <ButtonBar value={tab} onChange={setTab} />

        {/* 🔹 콘텐츠 영역만 스크롤 (상하바 고정) */}
        <div className={styles.content}>
          {tab === "TABLE" && <ManagerTableTab />}
          {tab === "ORDER" && <ManagerOrderTab />}
          {tab === "CALL" && <ManagerCallTab />}
        </div>
      </div>
    </div>
  );
};
