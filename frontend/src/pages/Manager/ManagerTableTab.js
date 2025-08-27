// ManagerTableTab.jsx
import { useMemo, useState } from "react";
import styles from "./ManagerTableTab.module.scss";
import { Table } from "./Table";
import { ManagerTableDetail } from "./ManagerTableDetail";

import { Modal } from "../../components/ui/Modal";
import ToastModal from "../../components/ui/ToastModal";
import { FaMoneyBillWave } from "react-icons/fa";
import { PageTitle } from "../../components/PageTitle";

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

  const [selectedId, setSelectedId] = useState(null);
  const [confirmId, setConfirmId] = useState(null); // 결제 확인 모달용
  const [infoMessage, setInfoMessage] = useState(null); // 안내 모달용 (토스트 대체)
  const [isPaymentActive, setIsPaymentActive] = useState(true); // 결제 활성/비활성 상태
  const [toggleOpen, setToggleOpen] = useState(false); // 토글 모달 열림

  // 상태별 문구/라벨
  const toggleTexts = useMemo(
    () =>
      isPaymentActive
        ? {
            button: "결제 비활성화",
            title: "결제 버튼을 비활성화 하시겠습니까?",
            confirm: "확인",
          }
        : {
            button: "결제 활성화",
            title: (
              <>
                결제 버튼을 활성화
                <br />
                하시겠습니까?
              </>
            ),
            confirm: "확인",
          },
    [isPaymentActive]
  );

  const getTotal = (orders) =>
    orders?.reduce((sum, o) => sum + o.price * o.amount, 0) ?? 0;

  const handleToggleConfirm = () => {
    setIsPaymentActive((v) => !v);
    setToggleOpen(false);
  };

  const renderToggleBody = () =>
    isPaymentActive ? (
      <>
        <p className={styles.payOnOffBody}>
          고객의 결제 버튼이 비활성화됩니다.
        </p>
      </>
    ) : (
      <>
        <p className={styles.payOnOffBody}>고객의 결제 버튼이 활성화됩니다.</p>
      </>
    );

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
        <>
          <PageTitle title="테이블 관리" Icon={FaMoneyBillWave} />
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

          {/* 메인 패널 바깥 하단 버튼 */}
          <button
            className={styles.payOnOffButton}
            onClick={() => setToggleOpen(true)}
          >
            {toggleTexts.button}
          </button>
        </>
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

      {/* ✅ 결제 활성/비활성 토글 모달 */}
      <Modal
        open={toggleOpen}
        onClose={() => setToggleOpen(false)}
        onConfirm={handleToggleConfirm}
        title={toggleTexts.title}
        closeText="취소"
        confirmText={toggleTexts.confirm}
        dimmed
      >
        <div className={styles.toggleModalBody}>{renderToggleBody()}</div>
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
