// pages/Manager/ManagerCallTab.jsx
import { useMemo, useState } from "react";
import styles from "./ManagerCallTab.module.scss";
import { Modal } from "../../components/ui/Modal";
import { PageTitle } from "../../components/PageTitle";
import { AiOutlineUser } from "react-icons/ai";
// 더미 큐 데이터 (API 붙기 전까지 사용)
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
];

export const ManagerCallTab = () => {
  const [calls, setCalls] = useState(initialCalls);
  const [selected, setSelected] = useState(null); // 클릭한 호출

  // 오래된 순으로(또는 최신순으로 바꾸고 싶으면 .reverse())
  const sorted = useMemo(
    () => [...calls].sort((a, b) => a.createdAt - b.createdAt),
    [calls]
  );

  const openModal = (call) => setSelected(call);
  const closeModal = () => setSelected(null);

  // 모달에서 "확인" 누르면 해당 호출 삭제
  const confirmAndRemove = () => {
    if (!selected) return;
    setCalls((prev) => prev.filter((c) => c.id !== selected.id));
    setSelected(null);
  };

  // 테스트용: 새 요청 더미 추가 (원하면 지워도 됨)
  const addDummy = () => {
    const id = crypto.randomUUID ? crypto.randomUUID() : Math.random();
    setCalls((prev) => [
      ...prev,
      {
        id,
        tableNo: Math.floor(Math.random() * 30) + 1,
        requests: ["젓가락", "숟가락", "물"].slice(
          0,
          Math.floor(Math.random() * 3) + 1
        ),
        createdAt: Date.now(),
      },
    ]);
  };

  return (
    <>
      <PageTitle title="직원 호출" Icon={AiOutlineUser} />
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <button className={styles.addBtn} onClick={addDummy}>
            새 요청(더미)
          </button>
        </header>

        <ul className={styles.list}>
          {sorted.map((call) => (
            <li
              key={call.id}
              className={styles.item}
              onClick={() => openModal(call)}
            >
              {/* 왼쪽: 테이블 + 번호 */}
              <div className={styles.tableBox}>
                <div className={styles.label}>테이블</div>
                <div className={styles.number}>
                  {String(call.tableNo).padStart(2, "0")}
                </div>
              </div>

              {/* 오른쪽: 요청 사항 */}
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
            <div className={styles.empty}>현재 대기 중인 요청이 없습니다.</div>
          )}
        </ul>

        {/* 모달 */}
        <Modal
          open={!!selected}
          title={
            selected && (
              <>
                직원호출을 완료
                <br />
                처리하시겠습니까?
              </>
            )
          }
          onClose={closeModal}
          onConfirm={confirmAndRemove}
          confirmText="확인"
          closeText="닫기"
        >
          {selected && (
            <div className={styles.modalBody}>
              <ul className={styles.modalList}>
                {selected.tableNo}번 테이블 요청을 완료했는지 확인해주세요.
              </ul>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
};
