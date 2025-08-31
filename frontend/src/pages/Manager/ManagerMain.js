import { useEffect, useState } from "react";
import { HomeButton } from "../../components/HomeButton";
import { ButtonBar } from "./ButtonBar";
import styles from "./ManagerMain.module.scss";
import { ManagerTableTab } from "./ManagerTableTab";
import { ManagerOrderTab } from "./ManagerOrderTab";
import { ManagerCallTab } from "./ManagerCallTab";
import { useLocation } from "react-router";

/**
 * ManagerMain
 * - 매니저 페이지 메인 화면
 * - 상단 로고/홈버튼, 탭 버튼바, 탭별 콘텐츠로 구성
 * - /manager 경로 접근 시 기본 탭은 TABLE
 */
export const ManagerMain = () => {
  /* 현재 탭 상태 */
  const [tab, setTab] = useState("TABLE");
  const location = useLocation();

  /* URL이 /manager일 때 기본 탭 TABLE로 초기화 */
  useEffect(() => {
    if (location.pathname === "/manager") setTab("TABLE");
  }, [location]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.mainPanel}>
        {/* 상단 홈 버튼 + 로고 영역 */}
        <div className={styles.topBar}>
          <HomeButton to="/manager" />
          <div className={styles.logoPanel}>
            <img src="/icons/logo.svg" alt="로고" className={styles.logo} />
          </div>
        </div>

        {/* 탭 전환 버튼 바 */}
        <ButtonBar value={tab} onChange={setTab} />

        {/* 탭 콘텐츠 영역 (상단/하단 고정, 내부만 스크롤) */}
        <div className={styles.content}>
          {tab === "TABLE" && <ManagerTableTab />}
          {tab === "ORDER" && <ManagerOrderTab />}
          {tab === "CALL" && <ManagerCallTab />}
        </div>
      </div>
    </div>
  );
};
