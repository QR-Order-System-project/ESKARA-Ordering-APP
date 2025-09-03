import { useCallback, useState } from "react";
import styles from "./ManagerOrderTab.module.scss";
import { Modal } from "../../components/popups/Modal";

/**
 * ManagerOrderTab
 * - 메뉴별로 대기 중인 테이블을 칼럼/카드 형태로 표시
 * - 카드 클릭 시 완료 확인 모달을 띄우고, 확인하면 해당 항목을 제거
 */

// 초기 더미 데이터 (API 연동 전 사용)
const initialData = {
  아메리카노: [
    { id: 1, label: "테이블 01" },
    { id: 2, label: "테이블 07" },
    { id: 3, label: "테이블 12" },
    { id: 4, label: "테이블 12" },
    { id: 5, label: "테이블 12" },
    { id: 6, label: "테이블 12" },
    { id: 7, label: "테이블 12" },
    { id: 8, label: "테이블 12" },
    { id: 9, label: "테이블 12" },
    { id: 10, label: "테이블 12" },
    { id: 11, label: "테이블 12" },
    { id: 12, label: "테이블 12" },
  ],
  카페라떼: [
    { id: 4, label: "테이블 03" },
    { id: 5, label: "테이블 09" },
  ],
  카푸치노: [
    { id: 6, label: "테이블 05" },
    { id: 7, label: "테이블 11" },
  ],
  바닐라라떼: [
    { id: 8, label: "테이블 02" },
    { id: 9, label: "테이블 14" },
  ],
  카라멜마키아또: [
    { id: 10, label: "테이블 06" },
    { id: 11, label: "테이블 10" },
    { id: 12, label: "테이블 21" },
  ],
  초코프라푸치노: [{ id: 13, label: "테이블 04" }],
  그린티라떼: [
    { id: 14, label: "테이블 08" },
    { id: 15, label: "테이블 16" },
  ],
  복숭아아이스티: [{ id: 16, label: "테이블 13" }],
  레몬에이드: [
    { id: 17, label: "테이블 15" },
    { id: 18, label: "테이블 20" },
  ],
  핫초코: [
    { id: 19, label: "테이블 18" },
    { id: 20, label: "테이블 22" },
  ],
};

export const ManagerOrderTab = () => {
  /* 상태: 데이터, 모달 열림, 선택 항목 */
  const [data, setData] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null); // { menu, table }

  /* 카드 클릭 → 선택/모달 오픈 */
  const handleCardClick = useCallback((menu, table) => {
    setSelected({ menu, table });
    setOpen(true);
  }, []);

  /* 모달 닫기 */
  const closeModal = useCallback(() => {
    setOpen(false);
    setSelected(null);
  }, []);

  /* 모달 확인 → 선택 항목 제거 */
  const removeTable = useCallback(() => {
    if (!selected) return;
    const { menu, table } = selected;
    setData((prev) => ({
      ...prev,
      [menu]: (prev[menu] ?? []).filter((t) => t.id !== table.id),
    }));
    closeModal();
  }, [selected, closeModal]);

  return (
    <>
      {/* 상단 타이틀 */}
      <div className={styles.boardWrap}>
        <div className={styles.board} role="list">
          {Object.entries(data).map(([menu, tables]) => (
            <section className={styles.column} key={menu} role="listitem">
              {/* 칼럼 헤더 */}
              <header className={styles.columnHeader}>
                <span className={styles.columnTitle}>{menu}</span>
              </header>

              {/* 카드 스택 */}
              <div className={styles.stack}>
                {tables.map((t) => (
                  <button
                    key={t.id}
                    className={styles.card}
                    onClick={() => handleCardClick(menu, t)}
                  >
                    {t.label}
                  </button>
                ))}

                {/* 비었을 때 */}
                {tables.length === 0 && <div className={styles.empty}></div>}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* 완료 확인 모달 (제목 두 줄 고정) */}
      <Modal
        open={open}
        title={
          <div className={styles.titleLines}>
            <span>해당 주문을 어떻게</span>
            <span>처리하시겠습니까?</span>
          </div>
        }
        onClose={closeModal}
        onConfirm={removeTable}
        button1="삭제"
        button2="완료"
        body={`${selected?.table?.label} - ${selected?.menu}`}
      />
    </>
  );
};
