// pages/Manager/ManagerCallTab.jsx
import { useState, useMemo, useCallback, useEffect } from "react";
import styles from "./ManagerCallTab.module.scss";
import { Modal } from "../../components/popups/Modal";
import { CompactToastModal } from "../../components/popups/CompactToastModal";
import axios from "axios";
import { socket } from "../../socket";

export const ManagerCallTab = ({ onCallsChange }) => {
  const [calls, setCalls] = useState([]);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  const showToast = ({ message, variant = "success" }) =>
    setToast({ message, variant, key: Date.now() });

  const fetchCall = useCallback(async () => {
    try {
      const res = await axios.get("/api/employee/calls");
      const list = Array.isArray(res.data) ? res.data : [];
      setCalls(list);
      onCallsChange?.(list);
      console.log("직원호출 정보:", list);
    } catch (err) {
      console.error("직원호출 정보 불러오기 실패:", err);
      setCalls([]);
      onCallsChange?.([]);
    }
  }, [onCallsChange]);

  const completeCall = useCallback(async (selected) => {
    try {
      await axios.post("/api/employee/complete", {
        tableNumber: selected.tableNumber,
        items: selected.items,
      });
      console.log("직원호출 완료");
      showToast({ message: "해당 테이블의 직원호출이 완료되었습니다." });
      fetchCall();
    } catch (err) {
      console.error("직원호출 완료 처리 실패:", err);
      showToast({ message: "호출 완료 처리 실패", variant: "error" });
    }
  }, [fetchCall]);

  useEffect(() => {
    fetchCall();
    socket.connect();

    const handleCallUpdate = () => {
      console.log("[실시간] 직원 호출 목록 갱신!");
      fetchCall();
    };

    socket.on("employeeCallUpdated", handleCallUpdate);
    return () => {
      socket.off("employeeCallUpdated", handleCallUpdate);
      socket.disconnect();
    };
  }, [fetchCall]);

  const openModal = (call) => setSelected(call);
  const closeModal = () => setSelected(null);
  const confirmAndRemove = () => {
    if (!selected) return;
      completeCall(selected);
      setSelected(null);
  };

  return (
    <>
      <div className={styles.page}>
        <div className={styles.list}>
          {calls.map((call, idx) => (
            <div
              key={idx}
              className={styles.card}
              onClick={() => openModal(call)}
            >
              <div className={styles.table}>
                <span className={styles.tableNo}>테이블</span>
                <span className={styles.tableNo}>{call.tableNumber}</span>
              </div>
              <div className={styles.requests}>
                {call.items.map((req, idx) => (
                  <span key={idx} className={styles.requestItem}>
                    {req}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {calls.length === 0 && (
            <div className={styles.empty}>현재 대기 중인 요청이 없습니다.</div>
          )}
        </div>
      </div>

      <Modal
        open={!!selected}
        title={
          <div className={styles.titleLines}>
            <span>직원호출을 완료</span>
            <span>처리하시겠습니까?</span>
          </div>
        }
        onClose={closeModal}
        onConfirm={confirmAndRemove}
        body={`${selected?.tableNumber}번 테이블 요청을 완료했는지 확인해주세요.`}
      />

      {toast && (
        <CompactToastModal
          message={toast.message}
          variant={toast.variant}
          duration={1800}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};
