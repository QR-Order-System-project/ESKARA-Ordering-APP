import { useCallback, useState } from "react";
import styles from "./ManagerOrderTab.module.scss";
import { Modal } from "../../components/ui/Modal";
import { PageTitle } from "../../components/PageTitle";
import { HiOutlineClipboardList } from "react-icons/hi";
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
  const [data, setData] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null); // { menu, table }

  const handleCardClick = useCallback((menu, table) => {
    setSelected({ menu, table });
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    setSelected(null);
  }, []);

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
      <div className={styles.boardWrap}>
        <div className={styles.titleBar}>
          <PageTitle title="주문 관리" Icon={HiOutlineClipboardList} />
        </div>

        {/* ✅ PageTitle을 제외한 영역만 세로 스크롤 */}
        <div className={styles.vScroller}>
          {/* 가로 스크롤은 기존대로 여기서만 */}
          <div className={styles.hScroller}>
            <div className={styles.board} role="list">
              {Object.entries(data).map(([menu, tables]) => (
                <section className={styles.column} key={menu} role="listitem">
                  <header className={styles.columnHeader}>
                    <span className={styles.columnTitle}>{menu}</span>
                  </header>

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
                    {tables.length === 0 && (
                      <div className={styles.empty}>대기중인 테이블 없음</div>
                    )}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Modal: title을 div/span 두 줄로 고정 */}
      <Modal
        open={open}
        title={
          <div className={styles.titleLines}>
            <span>해당 주문을 완료</span>
            <span>처리하시겠습니까?</span>
          </div>
        }
        onClose={closeModal}
        onConfirm={removeTable}
      >
        <div>
          <p className={styles.orderBody}>
            {selected?.table?.label} - {selected?.menu}
          </p>
        </div>
      </Modal>
    </>
  );
};
