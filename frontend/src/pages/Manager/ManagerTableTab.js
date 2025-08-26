// ManagerTableTab.jsx
import { useMemo, useState } from "react";
import styles from "./ManagerTableTab.module.scss";
import { Table } from "./Table";
import { ManagerTableDetail } from "./ManagerTableDetail";

import { Modal } from "../../components/ui/Modal";
import ToastModal from "../../components/ui/ToastModal";

export const ManagerTableTab = () => {
  const [toast, setToast] = useState({ open: false, tone: "info", msg: "" });
  const [tables, setTables] = useState([
    {
      id: 1,
      name: "테이블 01",
      orders: [
        { id: 1, name: "아메리카노", amount: 2, price: 4500 },
        { id: 2, name: "카페라떼", amount: 1, price: 5000 },
      ],
    },
    { id: 2, name: "테이블 02", orders: [] },
    { id: 3, name: "테이블 03", orders: [] },
  ]);

  const [selectedId, setSelectedId] = useState(null);
  const [confirmId, setConfirmId] = useState(null); // 결제 확인 모달용
  const [infoMessage, setInfoMessage] = useState(null); // 안내 모달용 (토스트 대체)

  const getTotal = (orders) =>
    orders?.reduce((sum, o) => sum + o.price * o.amount, 0) ?? 0;

  const selectedTable = useMemo(
    () => tables.find((t) => t.id === selectedId) ?? null,
    [tables, selectedId]
  );

  // id -> table 빠른 조회용
  const tableMap = useMemo(() => {
    const m = new Map();
    tables.forEach((t) => m.set(t.id, t));
    return m;
  }, [tables]);

  // 상세에서 "결제완료" 클릭
  const handlePayComplete = (tableId) => {
    const t = tableMap.get(tableId);
    if (!t || (t.orders?.length ?? 0) === 0) {
      setToast({
        open: true,
        tone: "error",
        msg: "주문내역이 존재하지 않습니다.",
      });
      return;
    }
    setConfirmId(tableId);
  };

  const doPay = async (tableId) => {
    const t = tableMap.get(tableId);
    if (!t) return;

    try {
      await fakeSaveBill({
        tableId,
        name: t.name,
        orders: t.orders,
        totalPrice: getTotal(t.orders),
        paidAt: new Date().toISOString(),
      });

      // ✅ 주문만 비우기 (상세 화면 유지)
      setTables((prev) =>
        prev.map((row) => (row.id === tableId ? { ...row, orders: [] } : row))
      );
    } catch (e) {
      console.error(e);
      // ✅ 토스트 제거 → 에러도 안내 모달로
      setInfoMessage("결제 처리 중 오류가 발생했습니다.");
    } finally {
      setConfirmId(null); // 모달 닫기
    }
  };

  const confirmTitle = "해당 테이블을 결제완료 처리하시겠습니까?";

  const confirmBody = (() => {
    const t = tableMap.get(confirmId);
    if (!t) return null;
    const total = getTotal(t.orders).toLocaleString();
    return (
      <div>
        <p className={styles.confirmBody}>
          총 주문금액과 이체금액을 확인해주세요.
        </p>
      </div>
    );
  })();

  return (
    <div className={styles.wrapper}>
      {selectedTable === null ? (
        <div className={styles.mainPanel}>
          <div className={styles.tablePanel}>
            {tables.map((t) => (
              <Table
                key={t.id}
                table={{ ...t, totalPrice: getTotal(t.orders) }}
                onClick={() => setSelectedId(t.id)}
              />
            ))}
          </div>
        </div>
      ) : (
        <ManagerTableDetail
          table={{
            ...selectedTable,
            totalPrice: getTotal(selectedTable.orders),
          }}
          onClose={() => setSelectedId(null)}
          onPayComplete={handlePayComplete} // 빈 주문이면 안내 모달, 있으면 컨펌 모달
        />
      )}

      {/* ✅ 안내 모달 (토스트 대체) */}
      <Modal
        open={!!infoMessage}
        onClose={() => setInfoMessage(null)}
        // onConfirm 없음 → 확인 버튼 숨김
        title="알림"
        closeText="닫기"
        dimmed
      >
        {infoMessage}
      </Modal>

      {/* ✅ 결제 확인 모달 */}
      <Modal
        open={confirmId != null}
        onClose={() => setConfirmId(null)}
        onConfirm={() => doPay(confirmId)}
        title={confirmTitle}
        closeText="닫기"
        confirmText="확인"
        dimmed
      >
        {confirmBody}
      </Modal>

      <ToastModal
        open={toast.open}
        onClose={() => setToast((s) => ({ ...s, open: false }))}
        message={toast.msg}
        tone={toast.tone}
        duration={1500}
        dimmed={false} // 배경 어둡게 원하면 true
      />
    </div>
  );
};

// --- Mock API ---
const fakeSaveBill = (payload) =>
  new Promise((resolve) => setTimeout(() => resolve(payload), 300));
