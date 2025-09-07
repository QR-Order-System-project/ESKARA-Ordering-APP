import { useCallback, useEffect, useState } from "react";
import styles from "./ManagerOrderTab.module.scss";
import { Modal } from "../../components/popups/Modal";
import { CompactToastModal } from "../../components/popups/CompactToastModal";
import axios from "axios";
import { socket } from "../../socket";

const MENU_ORDER = [
  "도리도리토스뱅크 타코",
  "두근두근, 사랑은 계란을 타고...",
  "모듬 후르츄베릅",
  "밥알 낭낭한 찜질방 식혜",
  "불가마 어묵탕",
  "세빠지게 섞은 주전자 미숫가루",
  "소프트아이스크림과 뻥튀기",
  "주점 인증샷 한잔해",
  "찜질베개 토스트(안 딱딱함)",
  "참숯가마 버팔로윙",
  "황토방 두부김치",
];

export const ManagerOrderTab = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  const showToast = ({ message, variant = "success" }) =>
    setToast({ message, variant, key: Date.now() });

  const [menuQueue, setMenuQueue] = useState({});

  const fetchMenuQueue = useCallback(async () => {
    try {
      const res = await axios.get("/api/menu/showMenuQueue");
      setMenuQueue(res.data);
      console.log("메뉴 리스트:", res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchMenuQueue();
    socket.connect();
    socket.on("menuQueueUpdated", fetchMenuQueue);
    socket.on("orderCancellationUpdated", fetchMenuQueue);
    socket.on("menuQueuePopped", fetchMenuQueue);

    return () => {
      socket.off("menuQueueUpdated");
      socket.off("orderCancellationUpdated");
      socket.off("menuQueuePopped");
      socket.disconnect();
    };
  }, [fetchMenuQueue]);

  const handleCardClick = useCallback((menu, table, index) => {
    setSelected({ menu, table, index });
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    setSelected(null);
  }, []);

  const removeTable = useCallback(async () => {
    if (!selected) return;
    const { menu, table } = selected;

    try {
      await axios.post("/api/orders/cancel", {
        tableNumber: table,
        menu: menu,
      });
      showToast({ message: "해당 테이블의 주문이 삭제 되었습니다." });
    } catch (err) {
      console.error("cancel 실패:", err);
      showToast({ message: "삭제 중 오류가 발생했습니다.", variant: "error" });
    } finally {
      closeModal();
    }
  }, [selected, closeModal]);

  const confirmTable = useCallback(async () => {
    if (!selected) return;
    const { menu, table } = selected;

   try {
    await axios.post("/api/menu/finish", {
      tableNumber: table,
      menu: menu,
    });
    showToast({ message: "해당 테이블의 주문이 완료되었습니다." });
  } catch (err) {
    console.error("finish 실패:", err);
    showToast({ message: "처리 중 오류가 발생했습니다.", variant: "error" });
  } finally {
    closeModal();
  }
}, [selected, closeModal]);

  return (
    <>
      <div className={styles.boardWrap}>
        <div className={styles.board}>
          {MENU_ORDER.map((menu) => {
            const tables = menuQueue[menu] ?? [];
            return (
              <section className={styles.column} key={menu}>
                <header className={styles.columnHeader}>
                  <span className={styles.columnTitle}>{menu}</span>
                </header>

                <div className={styles.stack}>
                  {tables.map((t, idx) => (
                    <button
                      key={`${menu}-${idx}-${t}`}
                      className={styles.card}
                      onClick={() => handleCardClick(menu, t, idx)}
                    >
                      테이블 {t}
                    </button>
                  ))}
                  {tables.length === 0 && <div className={styles.empty} />}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <Modal
        open={open}
        title={
          <div className={styles.titleLines}>
            <span>해당 주문을 어떻게</span>
            <span>처리하시겠습니까?</span>
          </div>
        }
        onClose={closeModal}
        onDismiss={removeTable}
        onConfirm={confirmTable}
        button1="삭제"
        button2="완료"
        body={`테이블 ${selected?.table ?? ""} - ${selected?.menu ?? ""}`}
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
