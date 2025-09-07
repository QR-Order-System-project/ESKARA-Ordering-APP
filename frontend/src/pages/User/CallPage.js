import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import { UserTopBar } from "./components/UserTopBar";
import styles from "./CallPage.module.scss";
import { PageTitle } from "../../components/PageTitle";
import { BsPerson } from "react-icons/bs";
import { CompactToastModal } from "../../components/popups/CompactToastModal";
import { callEmployee } from "../../api/call";
import { socket } from "../../socket"

const CALL_ITEMS = ["기본안주 주세용", "숟가락 주세용", "젓가락 주세용", "종이컵 주세용", "앞접시 주세용", "물티슈 주세용", "직원만\n와주세용", "이것 좀 치워주세용"];

export default function CallPage() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { tableNumber } = useParams();

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleItemClick = (itemText) => {
    setSelectedItems((prev) =>
      prev.includes(itemText)
        ? prev.filter((text) => text !== itemText)
        : [...prev, itemText]
    );
  };

   const handleCallClick = async () => {
    if (selectedItems.length === 0) {
      setToast({ message: "요청하실 항목을 선택해주세요.", variant: "error" });
      return;
    }

     setIsLoading(true);

    const callData = {
      tableNumber: parseInt(tableNumber, 10),
      items: selectedItems,
    };

    try {
      await callEmployee(callData);

      setToast({
        message: "직원호출이 성공적으로 접수되었습니다!",
        variant: "success",
      });
      setSelectedItems([]);
    } catch (error) {
      setToast({
        message: "호출에 실패했습니다. 잠시 후 다시 시도해주세요.",
        variant: "error",
      });
    } finally {
      setIsLoading(false); 
    }
  };

   return (
    <>
      <div className={styles.Wrapper}>
        <div className={styles.MainPanel}>
          <div className={styles.TopBarWrapper}>
            <UserTopBar tableNumber={tableNumber} activeMenu="call" />
          </div>

          <PageTitle title="직원호출" Icon={BsPerson} size={31} />

          <div className={styles.ListContainer}> 
            <div className={styles.ListInner}>
              <div className={styles.CallListArea}>
              {CALL_ITEMS.map((itemText) => (
                <button
                  key={itemText}
                  className={`${styles.CallItem} ${
                    selectedItems.includes(itemText) ? styles.selected : ""
                  }`}
                  onClick={() => handleItemClick(itemText)}
                >
                  {itemText}
                </button>
              ))}
            </div>
            </div>
          </div>

          <button className={styles.CallButton} onClick={handleCallClick} disabled={isLoading}>
              {isLoading ? "호출하는 중..." : "호출하기"}
          </button>
        </div>
      </div>
      
      {toast && (
        <CompactToastModal
          message={toast.message}
          variant={toast.variant}
          duration={2000}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
