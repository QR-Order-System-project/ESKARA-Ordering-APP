// ManagerTableTab.jsx
import { useMemo, useState, useCallback } from "react";
import styles from "./ManagerTableTab.module.scss";
import { Table } from "./Table";
import { ManagerTableDetail } from "./ManagerTableDetail";

import { Modal } from "../../components/popups/Modal";
import { FaMoneyBillWave } from "react-icons/fa";
import { PageTitle } from "../../components/PageTitle";
import { CompactToastModal } from "../../components/popups/CompactToastModal";

/**
 * ManagerTableTab
 * - 테이블 목록을 보여주고, 선택 시 상세 화면으로 전환
 * - 결제 활성/비활성 토글 및 결제완료 확인 모달 제공
 */

// --- Mock API (결제 데이터 저장 시뮬레이션) ---
const fakeSaveBill = (payload) =>
  new Promise((resolve) => setTimeout(() => resolve(payload), 300));

export const ManagerTableTab = () => {
  /* 테이블 목록 상태 */
  const [tables, setTables] = useState([
    {
      id: 1,
      name: "테이블 01",
      orders: [
        { id: 1, name: "아메리카노", amount: 2, price: 4500 },
        { id: 2, name: "카페라떼", amount: 1, price: 5000 },
      ],
    },
    {
      id: 2,
      name: "테이블 02",
      orders: [
        { id: 1, name: "카라멜마키아토", amount: 3, price: 5500 },
        { id: 2, name: "에스프레소", amount: 2, price: 3500 },
      ],
    },
    { id: 3, name: "테이블 03", orders: [] },
    {
      id: 4,
      name: "테이블 04",
      orders: [
        { id: 1, name: "초코라떼", amount: 1, price: 6000 },
        { id: 2, name: "아메리카노", amount: 4, price: 4500 },
        { id: 3, name: "허브티", amount: 2, price: 4000 },
      ],
    },
    {
      id: 5,
      name: "테이블 05",
      orders: [
        { id: 1, name: "카푸치노", amount: 2, price: 5000 },
        { id: 2, name: "녹차라떼", amount: 1, price: 5500 },
      ],
    },
    { id: 6, name: "테이블 06", orders: [] },
    {
      id: 7,
      name: "테이블 07",
      orders: [
        { id: 1, name: "바닐라라떼", amount: 2, price: 5300 },
        { id: 2, name: "레몬에이드", amount: 1, price: 6000 },
      ],
    },
    {
      id: 8,
      name: "테이블 08",
      orders: [{ id: 1, name: "아메리카노", amount: 1, price: 4500 }],
    },
    { id: 9, name: "테이블 09", orders: [] },
    {
      id: 10,
      name: "테이블 10",
      orders: [
        { id: 1, name: "카페모카", amount: 2, price: 5500 },
        { id: 2, name: "홍차", amount: 1, price: 4000 },
        { id: 3, name: "에이드", amount: 2, price: 6500 },
      ],
    },
    { id: 11, name: "테이블 11", orders: [] },
    {
      id: 12,
      name: "테이블 12",
      orders: [
        { id: 1, name: "카라멜마키아토", amount: 1, price: 5500 },
        { id: 2, name: "그린티프라푸치노", amount: 1, price: 6500 },
        { id: 3, name: "딸기스무디", amount: 2, price: 7000 },
      ],
    },
    {
      id: 13,
      name: "테이블 13",
      orders: [
        { id: 1, name: "아메리카노", amount: 3, price: 4500 },
        { id: 2, name: "카페라떼", amount: 2, price: 5000 },
      ],
    },
    { id: 14, name: "테이블 14", orders: [] },
    {
      id: 15,
      name: "테이블 15",
      orders: [
        { id: 1, name: "콜드브루", amount: 2, price: 6000 },
        { id: 2, name: "민트초코라떼", amount: 1, price: 6500 },
      ],
    },
    {
      id: 16,
      name: "테이블 16",
      orders: [
        { id: 1, name: "레몬차", amount: 1, price: 4500 },
        { id: 2, name: "아이스티", amount: 2, price: 5000 },
      ],
    },
    { id: 17, name: "테이블 17", orders: [] },
    {
      id: 18,
      name: "테이블 18",
      orders: [
        { id: 1, name: "아메리카노", amount: 5, price: 4500 },
        { id: 2, name: "허브티", amount: 1, price: 4000 },
      ],
    },
    { id: 19, name: "테이블 19", orders: [] },
    {
      id: 20,
      name: "테이블 20",
      orders: [
        { id: 1, name: "콜드브루", amount: 1, price: 6000 },
        { id: 2, name: "카페라떼", amount: 1, price: 5000 },
        { id: 3, name: "에스프레소", amount: 2, price: 3500 },
      ],
    },
  ]);

  /* 선택된 테이블 ID */
  const [selectedId, setSelectedId] = useState(null);

  /* 페이지 전용 모달 상태 */
  const [dialog, setDialog] = useState({
    open: false,
    title: null,
    body: null,
    onConfirm: null, // 없으면 Modal이 확인 버튼 숨김
  });

  /* 합계 계산 */
  const getTotal = useCallback(
    (orders) =>
      Array.isArray(orders)
        ? orders.reduce((s, o) => s + o.price * o.amount, 0)
        : 0,
    []
  );

  /* 선택된 테이블 */
  const selectedTable = useMemo(
    () => tables.find((t) => t.id === selectedId) ?? null,
    [tables, selectedId]
  );

  /* id → 테이블 매핑 */
  const tableMap = useMemo(() => {
    const m = new Map();
    for (const t of tables) m.set(t.id, t);
    return m;
  }, [tables]);

  /* 모달 열기/닫기 */
  const openDialog = useCallback(
    (cfg) => setDialog({ open: true, ...cfg }),
    []
  );
  const closeDialog = useCallback(
    () => setDialog((d) => ({ ...d, open: false })),
    []
  );

  /* 결제 버튼 비/활성 토글 */
  const [isPaymentActive, setIsPaymentActive] = useState(true);
  const showToggleDialog = useCallback(() => {
    const title = isPaymentActive ? (
      <div className={styles.titleLines}>
        <span>결제 버튼을 비활성화</span>
        <span>하시겠습니까?</span>
      </div>
    ) : (
      <div className={styles.titleLines}>
        <span>결제 버튼을 활성화</span>
        <span>하시겠습니까?</span>
      </div>
    );
    const body = (
      <p>
        {isPaymentActive
          ? "고객의 결제 버튼이 비활성화됩니다."
          : "고객의 결제 버튼이 활성화됩니다."}
      </p>
    );
    const onConfirm = () => {
      setIsPaymentActive((v) => !v);
      closeDialog();
    };
    openDialog({ title, body, onConfirm });
  }, [
    isPaymentActive,
    openDialog,
    closeDialog,
    styles.titleLines,
    styles.payOnOffBody,
  ]);

  const [toast, setToast] = useState(null);
  const showToast = () =>
    setToast({ message: "주문 내역이 존재하지 않습니다.", variant: "error" });

  /* 상세에서 '결제완료' 클릭 → 확인 모달 후 처리 */
  const handlePayComplete = useCallback(
    (tableId) => {
      const t = tableMap.get(tableId);
      if (!t || (t.orders?.length ?? 0) === 0) {
        showToast();
        return;
      }
      openDialog({
        title: (
          <div className={styles.titleLines}>
            <span>해당 테이블을 결제완료</span>
            <span>처리하시겠습니까?</span>
          </div>
        ),
        body: "총 주문금액과 이체금액을 확인해주세요.",
        //임시 API
        onConfirm: async () => {
          try {
            await fakeSaveBill({
              tableId,
              name: t.name,
              orders: t.orders,
              totalPrice: getTotal(t.orders),
              paidAt: new Date().toISOString(),
            });
            setTables((prev) =>
              prev.map((row) =>
                row.id === tableId ? { ...row, orders: [] } : row
              )
            );
          } finally {
            closeDialog();
          }
        },
      });
    },
    [tableMap, getTotal, openDialog, closeDialog, styles.confirmBody]
  );

  return (
    <div className={styles.wrapper}>
      {selectedTable === null ? (
        <>
          {/* 상단 타이틀 */}
          <PageTitle title="테이블 관리" Icon={FaMoneyBillWave} />

          {/* 테이블 목록 (스크롤 컨테이너 포함) */}
          <div className={styles.mainPanel}>
            <div className={styles.content}>
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
          </div>

          {/* 하단 토글 버튼 (고정) */}
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.payOnOffButton}
              onClick={showToggleDialog}
            >
              {isPaymentActive ? "결제 비활성화" : "결제 활성화"}
            </button>
          </div>
        </>
      ) : (
        /* 상세 화면 */
        <ManagerTableDetail
          table={{
            ...selectedTable,
            totalPrice: getTotal(selectedTable.orders),
          }}
          onClose={() => setSelectedId(null)}
          onPayComplete={handlePayComplete}
        />
      )}

      {/* 단일 모달 (동적으로 타이틀/본문/확인 주입) */}
      <Modal
        open={dialog.open}
        onClose={closeDialog}
        onConfirm={dialog.onConfirm}
        title={dialog.title}
        dimmed
        body={dialog.body}
      />

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
