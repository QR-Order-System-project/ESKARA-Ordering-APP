// ManagerTableTab.jsx
import { useMemo, useState, useCallback, useEffect } from "react";
import styles from "./ManagerTableTab.module.scss";
import { Table } from "./Table";
import { ManagerTableDetail } from "./ManagerTableDetail";
import axios from "axios";
import { Modal } from "../../components/popups/Modal";
import { CompactToastModal } from "../../components/popups/CompactToastModal";
import { BsCurrencyDollar } from "react-icons/bs";
import { TbMoneybag } from "react-icons/tb";

/**
 * ManagerTableTab
 * - 테이블 목록을 보여주고, 선택 시 상세 화면으로 전환
 * - 결제 활성/비활성 토글 및 결제완료 확인 모달 제공
 */

// --- Mock API (결제 데이터 저장 시뮬레이션) ---
const fakeSaveBill = (payload) =>
  new Promise((resolve) => setTimeout(() => resolve(payload), 300));

export const ManagerTableTab = ({ changeTitle, resetSignal }) => {
  /* 테이블 목록 상태 */
  const [tables, setTables] = useState([]);

  const fetchTableData = useCallback(async () => {
    try {
      const res = await axios.get("/api/payments/status");
      setTables(res.data);
      console.log("결제 상태:", res.data);
    } catch (err) {
      console.error("결제 상태 불러오기 실패:", err);
    }
  }, []);

  useEffect(() => {
    fetchTableData();
  }, [resetSignal]);

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
    () => tables.find((t) => t.tableNumber === selectedId) ?? null,
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

  const fetchPaymentStatus = useCallback(async () => {
    try {
      const res = await axios.get("/api/payments/global-payment/get");
      setIsPaymentActive(res.data.paymentAble);
      console.log("결제 활성화:", res.data.paymentAble);
    } catch (err) {
      console.error("결제 활성화 불러오기 실패:", err);
    }
  }, []);

  useEffect(() => {
    fetchPaymentStatus();
  }, []);

  const switchPaymentStatus = useCallback(async () => {
    try {
      const res = await axios.post("/api/payments/global-payment/set", {
        paymentAble: !isPaymentActive,
      });

      setIsPaymentActive(!isPaymentActive);

      console.log("결제 활성화:", !isPaymentActive);
    } catch (err) {
      console.error("결제 활성화 요청 실패:", err);
    }
  }, [isPaymentActive]);

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
    const message = isPaymentActive
      ? "결제 버튼이 비활성화 되었습니다."
      : "결제 버튼이 활성화 되었습니다.";
    const onConfirm = () => {
      switchPaymentStatus(isPaymentActive);
      showToast({ message });
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
  const showToast = ({ message, variant = "success" }) =>
    setToast({ message, variant, key: Date.now() });

  useEffect(() => {
    if (selectedTable) {
      changeTitle(`테이블 ${selectedId}`, TbMoneybag);
    } else {
      changeTitle("테이블 관리", BsCurrencyDollar);
    }
  }, [selectedTable]);

  useEffect(() => {
    if (resetSignal == null) return;
    setSelectedId(null);
    setDialog((d) => ({ ...d, open: false }));
  }, [resetSignal]);

  return (
    <div className={styles.wrapper}>
      {selectedTable ? (
        // 상세 화면
        <ManagerTableDetail
          tableNum={selectedId}
          onClose={() => setSelectedId(null)}
        />
      ) : (
        // 목록 화면
        <>
          <div className={styles.mainPanel}>
            <div className={styles.tablePanel}>
              {tables.map((t) => (
                <Table
                  key={t.id}
                  table={{ ...t, totalPrice: getTotal(t.orders) }}
                  onClick={() => setSelectedId(t.tableNumber)}
                />
              ))}
            </div>
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.payOnOffButton}
              onClick={showToggleDialog}
            >
              {`결제 ${isPaymentActive ? "비활성화" : "활성화"}`}
            </button>
          </div>
        </>
      )}

      {/* 공용 모달/토스트는 항상 마지막에 두면 깔끔 */}
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
