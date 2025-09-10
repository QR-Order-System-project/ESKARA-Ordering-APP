import { useCallback, useEffect, useState } from "react";
import { HomeButton } from "../../components/HomeButton";
import { ButtonBar } from "./ButtonBar";
import styles from "./ManagerMain.module.scss";
import { ManagerTableTab } from "./ManagerTableTab";
import { ManagerOrderTab } from "./ManagerOrderTab";
import { ManagerCallTab } from "./ManagerCallTab";
import { CompactToastModal } from "../../components/popups/CompactToastModal";
import { PageTitle } from "../../components/PageTitle";
import { BsCurrencyDollar } from "react-icons/bs";
import client from "../../api/client";
import { requestFcmToken, listenToMessages } from "../../fcm";
import { socket } from "../../socket";

export const ManagerMain = () => {
  const [active, setActive] = useState("TABLE");
  const [header, setHeader] = useState({
    title: "테이블 관리",
    Icon: BsCurrencyDollar,
  });
  const [hasCall, setHasCall] = useState(false);

  const [tableReset, setTableReset] = useState(0);

  const changeTitle = (title, Icon) => {
    setHeader({ title, Icon });
  };

  const handleTabChange = ({ label, title, Icon }) => {
    if (active === "TABLE" && label === "TABLE") {
      setTableReset((n) => n + 1);
      return;
    }
    setActive(label);
    setHeader({ title, Icon });
  };

  const handleHomeClick = useCallback(() => {
    if (active === "TABLE") {
      setTableReset((n) => n + 1);
    } else {
      setActive("TABLE");
      setHeader({ title: "테이블 관리", Icon: BsCurrencyDollar });
    }
  }, [active]);

  const fetchCall = useCallback(async () => {
    try {
      const res = await client.get("/api/employee/calls");
      const list = Array.isArray(res.data) ? res.data : [];
      setHasCall(list.length > 0);
      console.log("직원호출 수:", list.length);
    } catch (err) {
      console.error("직원호출 정보 불러오기 실패:", err);
      setHasCall(false);
    }
  }, []);

  useEffect(() => {
  // 기존 FCM 관련 로직
  requestFcmToken("server");
  listenToMessages(() => {
    fetchCall(); // 알림 오면 호출 배지 갱신
  });

  // 🔥 소켓으로 실시간 직원호출 감지 → 빨간점 즉시 업데이트
  const handleCallUpdate = async () => {
    console.log("[실시간] 직원호출 발생 - 배지 갱신!");
    try {
      const res = await client.get("/api/employee/calls");
      const list = Array.isArray(res.data) ? res.data : [];
      setHasCall(list.length > 0);
    } catch (err) {
      console.error("직원호출 갱신 실패:", err);
    }
  };

  socket.on("employeeCallUpdated", handleCallUpdate);

  return () => {
    socket.off("employeeCallUpdated", handleCallUpdate);
  };
}, [fetchCall]);

  const [toast, setToast] = useState(null);

  return (
    <div className={styles.wrapper}>
      <div className={styles.mainPanel}>
        <div className={styles.topPanel}>
          <div className={styles.topBar}>
            <HomeButton onClick={handleHomeClick} />
            <div className={styles.logoPanel}>
              <img
                src="/icons/swlogo.svg"
                alt="SW 로고"
                className={styles.swLogo}
              />
              <img src="/icons/logo.svg" alt="로고" className={styles.logo} />
            </div>
          </div>

          <ButtonBar
            value={active}
            onChange={handleTabChange}
            badges={{ CALL: hasCall }}
          />
          <PageTitle title={header.title} Icon={header.Icon} />
        </div>

        <div className={styles.content}>
          {active === "TABLE" && (
            <ManagerTableTab
              changeTitle={changeTitle}
              resetSignal={tableReset}
            />
          )}
          {active === "ORDER" && <ManagerOrderTab />}
          {active === "CALL" && (
            <ManagerCallTab
              onCallsChange={(list) => setHasCall(list.length > 0)}
            />
          )}
        </div>
      </div>

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
