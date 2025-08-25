import { useState } from "react";
import { HomeButton } from "../../components/HomeButton";
import { ButtonBar } from "./ButtonBar";
import styles from "./ManagerMain.module.scss";
import { CompactToastModal } from "../../components/popups/CompactToastModal";
import { ManagerTableTab } from "./ManagerTableTab";

export const ManagerMain = () => {
  const [tab, setTab] = useState("TABLE");

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

        {tab === "TABLE" && <ManagerTableTab />}
        {tab === "ORDER" && <div>주문 화면</div>}
        {tab === "CALL" && <div>콜 화면</div>}
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
