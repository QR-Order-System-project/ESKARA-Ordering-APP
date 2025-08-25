// ManagerTableTab.jsx
import { useMemo, useState } from "react";
import styles from "./ManagerTableTab.module.scss";
import { Table } from "./Table";
import { ManagerTableDetail } from "./ManagerTableDetail";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { useToast } from "../../components/ui/ToastProvider";

export const ManagerTableTab = () => {
  const toast = useToast();

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
      toast.error({ message: "주문내역이 존재하지 않습니다." });
      return;
    }
    setConfirmId(tableId); // 확인 모달 오픈
  };

  // 실제 결제 처리 (모달에서 확인)
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
      toast.error({ message: "결제 처리 중 오류가 발생했습니다." });
    } finally {
      setConfirmId(null); // 모달 닫기
    }
  };

  // 모달 텍스트
  const confirmTitle = "해당 테이블을 결제완료로 처리하시겠습니까?";
  const confirmDesc = (() => {
    const t = tableMap.get(confirmId);
    if (!t) return "";
    const total = getTotal(t.orders).toLocaleString();
    // ConfirmDialog가 description을 HTML로 렌더하도록 만들어뒀음
    return `총 주문금액을 확인해주세요.<br/><b>${t.name}</b> · <b>${total}원</b>`;
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
          onPayComplete={handlePayComplete} // 빈 주문이면 토스트, 있으면 모달
        />
      )}

      {/* 결제 확인 모달 */}
      <ConfirmDialog
        open={confirmId != null}
        onClose={() => setConfirmId(null)}
        onConfirm={() => doPay(confirmId)}
        title={confirmTitle}
        description={confirmDesc}
        cancelText="닫기"
        confirmText="확인"
      />
    </div>
  );
};

// --- Mock API ---
const fakeSaveBill = (payload) =>
  new Promise((resolve) => setTimeout(() => resolve(payload), 300));
