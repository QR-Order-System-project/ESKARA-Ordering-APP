import { useEffect, useState } from "react";
import { HomeButton } from "../../components/HomeButton";
import { ButtonBar } from "./ButtonBar";
import styles from "./ManagerMain.module.scss";
import { ManagerTableTab } from "./ManagerTableTab";
import { ManagerOrderTab } from "./ManagerOrderTab";
import { ManagerCallTab } from "./ManagerCallTab";
import { useLocation } from "react-router";
import { CompactToastModal } from "../../components/popups/CompactToastModal";

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

  const [toast, setToast] = useState(null);
  // toast: { message, variant } | null

  const showSuccess = () =>
    setToast({
      message: "계좌번호가 성공적으로 복사되었습니다!",
      variant: "success",
    });
  const showError = () =>
    setToast({ message: "실패했습니다.", variant: "error" });

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
      <button onClick={showSuccess}>성공 토스트</button>
      <button onClick={showError}>실패 토스트</button>
      {toast && (
        <CompactToastModal
          message={toast.message}
          variant={toast.variant}
          duration={1800}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
