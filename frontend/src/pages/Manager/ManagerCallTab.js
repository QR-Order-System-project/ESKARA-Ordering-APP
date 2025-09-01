// pages/Manager/ManagerCallTab.jsx
import { useMemo, useState } from "react";
import styles from "./ManagerCallTab.module.scss";
import { Modal } from "../../components/popups/Modal";
import { PageTitle } from "../../components/PageTitle";
import { AiOutlineUser } from "react-icons/ai";

/**
 * ManagerCallTab
 * - 직원 호출 큐를 시간순으로 보여주고, 항목 선택 시 완료 확인 모달을 띄움
 * - 모달 확인 시 해당 호출을 큐에서 제거
 */

// 더미 큐 데이터 (API 연동 전 임시)
const initialCalls = [
  {
    id: 1,
    tableNo: 12,
    requests: ["젓가락 2세트", "숟가락 추가", "물 리필"],
    createdAt: Date.now() - 1000 * 60 * 3,
  },
  {
    id: 2,
    tableNo: 30,
    requests: ["앞접시 3개", "키친타올"],
    createdAt: Date.now() - 1000 * 60 * 8,
  },
  {
    id: 3,
    tableNo: 9,
    requests: ["티슈", "얼음컵 2개", "물 리필"],
    createdAt: Date.now() - 1000 * 60 * 12,
  },
  {
    id: 4,
    tableNo: 15,
    requests: ["포크 1개"],
    createdAt: Date.now() - 1000 * 60 * 15,
  },
  {
    id: 5,
    tableNo: 24,
    requests: ["밑반찬 리필", "숟가락 1개"],
    createdAt: Date.now() - 1000 * 60 * 22,
  },
  {
    id: 6,
    tableNo: 24,
    requests: ["밑반찬 리필", "숟가락 1개"],
    createdAt: Date.now() - 1000 * 60 * 22,
  },
];

export const ManagerCallTab = () => {
  const [calls, setCalls] = useState(initialCalls);
  const [selected, setSelected] = useState(null);

  // 정렬된 큐 (오래된 순)
  const sorted = useMemo(
    () => [...calls].sort((a, b) => a.createdAt - b.createdAt),
    [calls]
  );

  // 이벤트 핸들러
  const openModal = (call) => setSelected(call);
  const closeModal = () => setSelected(null);
  const confirmAndRemove = () => {
    if (!selected) return;
    setCalls((prev) => prev.filter((c) => c.id !== selected.id));
    setSelected(null);
  };

  return (
    <>
      <div className={styles.page}>
        <div className={styles.titleBar}>
          <PageTitle title="직원 호출" Icon={AiOutlineUser} />
        </div>

        {/* 내부 스크롤 담당 래퍼 */}
        <div className={styles.wrapper}>
          <ul className={styles.list}>
            {sorted.map((call) => (
              <li
                key={call.id}
                className={styles.item}
                onClick={() => openModal(call)}
              >
                <div className={styles.tableBox}>
                  <div className={styles.label}>테이블</div>
                  <div className={styles.number}>
                    {String(call.tableNo).padStart(2, "0")}
                  </div>
                </div>

                <div className={styles.requests}>
                  {call.requests.map((r, i) => (
                    <div key={i} className={styles.reqLine}>
                      {r}
                    </div>
                  ))}
                </div>
              </li>
            ))}

            {sorted.length === 0 && (
              <div className={styles.empty}>
                현재 대기 중인 요청이 없습니다.
              </div>
            )}
          </ul>
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
      >
        <div className={styles.modalBody}>
          <div className={styles.modalList}>
            <span>
              {selected?.tableNo}번 테이블 요청을 완료했는지 확인해주세요.
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
};
