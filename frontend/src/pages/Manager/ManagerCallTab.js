// pages/Manager/ManagerCallTab.jsx
import { useState, useMemo } from "react";
import styles from "./ManagerCallTab.module.scss";
import { Modal } from "../../components/popups/Modal";
import { CompactToastModal } from "../../components/popups/CompactToastModal";

const initialCalls = [
  {
    id: 1,
    tableNo: 12,
    requests: ["젓가락 2세트", "숟가락 추가", "물 리필"],
  },
  {
    id: 2,
    tableNo: 30,
    requests: ["앞접시 3개", "키친타올"],
  },
  {
    id: 3,
    tableNo: 9,
    requests: ["티슈", "얼음컵 2개", "물 리필"],
  },
  {
    id: 4,
    tableNo: 15,
    requests: ["포크 1개"],
  },
  {
    id: 5,
    tableNo: 24,
    requests: ["밑반찬 리필", "숟가락 1개"],
  },
  {
    id: 6,
    tableNo: 24,
    requests: ["밑반찬 리필", "숟가락 1개"],
  },
  {
    id: 7,
    tableNo: 24,
    requests: ["밑반찬 리필", "숟가락 1개"],
  },
  {
    id: 8,
    tableNo: 24,
    requests: ["밑반찬 리필", "숟가락 1개"],
  },
  {
    id: 9,
    tableNo: 24,
    requests: ["밑반찬 리필", "숟가락 1개"],
  },
  {
    id: 10,
    tableNo: 24,
    requests: ["밑반찬 리필", "숟가락 1개"],
  },
  {
    id: 11,
    tableNo: 24,
    requests: ["밑반찬 리필", "숟가락 1개"],
  },
];

export const ManagerCallTab = () => {
  const [calls, setCalls] = useState(initialCalls);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  const showToast = ({ message, variant = "success" }) =>
    setToast({ message, variant, key: Date.now() });

  const sorted = useMemo(() => [...calls].sort((a, b) => a.id - b.id), [calls]);

  const openModal = (call) => setSelected(call);
  const closeModal = () => setSelected(null);
  const confirmAndRemove = () => {
    if (!selected) return;
    setCalls((prev) => prev.filter((c) => c.id !== selected.id));
    showToast({ message: "해당 테이블의 직원호출이 완료되었습니다." });
    setSelected(null);
  };

  return (
    <>
      <div className={styles.page}>
        <div className={styles.list}>
          {sorted.map((call) => (
            <div
              key={call.id}
              className={styles.card}
              onClick={() => openModal(call)} // ✅ 클릭 시 모달 열림
            >
              <div className={styles.table}>
                <span className={styles.tableNo}>테이블</span>
                <span className={styles.tableNo}>{call.tableNo}</span>
              </div>
              <div className={styles.requests}>
                {call.requests.map((req, idx) => (
                  <span key={idx} className={styles.requestItem}>
                    {req}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {sorted.length === 0 && (
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
        body={`${selected?.tableNo}번 테이블 요청을 완료했는지 확인해주세요.`}
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
