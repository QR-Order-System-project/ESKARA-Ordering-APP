import { OrderList } from "../../components/OrderList";
import { TotalPriceLabel } from "../../components/TotalPriceLabel";
import styles from "./ManagerTableDetail.module.scss";
import { useCallback, useEffect, useMemo, useState } from "react";
import client from "../../api/client"; 
import { CompactToastModal } from "../../components/popups/CompactToastModal";
import { Modal } from "../../components/popups/Modal";
import { socket } from "../../socket";

export const ManagerTableDetail = ({ tableNum }) => {
  const [tableDetail, setTableDetail] = useState(null);
  const [toast, setToast] = useState(null);
  const [dialog, setDialog] = useState({
    open: false,
    title: null,
    body: null,
    onConfirm: null,
  });
  const [loading, setLoading] = useState(false);

  const showToast = useCallback(
    ({ message, variant = "success" }) =>
      setToast({ message, variant, key: Date.now() }),
    []
  );
  const openDialog = useCallback(
    (cfg) => setDialog({ open: true, ...cfg }),
    []
  );
  const closeDialog = useCallback(
    () => setDialog((d) => ({ ...d, open: false })),
    []
  );

  const fetchTableDetail = useCallback(async () => {
    if (tableNum == null) return;
    setTableDetail(null);
    try {
      const res = await client.get(`/api/payments/detail/${tableNum}`);
      setTableDetail(res.data);
    } catch (err) {
      console.error("테이블 상세 정보 불러오기 실패:", err);
      setTableDetail({ tableNumber: tableNum, items: [], totalAmount: 0 });
    }
  }, [tableNum]);

  useEffect(() => {
    fetchTableDetail();
    socket.connect();

    socket.on("menuQueueUpdated", (newOrder) => {
      if (newOrder.tableNumber === tableNum) {
        console.log(`[실시간] 현재 테이블(${tableNum})에 새 주문! 갱신합니다.`);
        fetchTableDetail();
     }
    });

    socket.on("orderCancellationUpdated", (canceledOrder) => {
      if (canceledOrder.tableNumber === tableNum) {
        console.log(`[실시간] 현재 테이블(${tableNum})의 주문 취소! 갱신합니다.`);
        fetchTableDetail();
      }
    });

    socket.on("refreshTableStatus", (data) => {
      if (Number(data.tableNumber) === Number(tableNum)) {
        console.log(`[실시간] 현재 테이블(${tableNum}) 결제 완료!`);
        fetchTableDetail();
      }
    });

    return () => {
      socket.off("menuQueueUpdated");
      socket.off("orderCancellationUpdated");
      socket.off("refreshTableStatus");
      socket.disconnect();
    };
  }, [fetchTableDetail, tableNum]);

  const items = Array.isArray(tableDetail?.items) ? tableDetail.items : [];
  const formattedOrders = useMemo(
    () =>
      items.map((item, idx) => ({
        name: item.menu,
        amount: item.count,
        price: item.price,
        id: `${item.menu}-${idx}`,
      })),
    [items]
  );
  const hasOrders = items.length > 0;
  const total = tableDetail?.totalAmount ?? 0;

  const handlePayComplete = useCallback(() => {
    if (!hasOrders) {
      showToast({
        message: "주문 내역이 존재하지 않습니다.",
        variant: "error",
      });
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
      onConfirm: async () => {
        setLoading(true);
        try {
          await client.post("/api/payments/finalize", {
            tableNumber: tableDetail.tableNumber,
          });
          showToast({ message: "해당 테이블의 결제가 완료되었습니다." });
          await fetchTableDetail();
        } catch (err) {
          console.error("결제 실패:", err);
          showToast({ message: "결제 처리에 실패했습니다.", variant: "error" });
        } finally {
          setLoading(false);
          closeDialog();
        }
      },
    });
  }, [
    hasOrders,
    tableDetail,
    openDialog,
    closeDialog,
    showToast,
    fetchTableDetail,
  ]);

  return (
    <div className={styles.mainPanel}>
      <div className={styles.content}>
        <OrderList orders={formattedOrders} />
      </div>

      <div className={styles.lowPanel}>
        <TotalPriceLabel label="주문" price={total} />
        <div className={styles.buttonRow}>
          <button
            type="button"
            className={styles.payCompleteButton}
            onClick={handlePayComplete}
          >
            결제완료
          </button>
        </div>
      </div>

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
