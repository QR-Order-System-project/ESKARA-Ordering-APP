import { useState } from "react"
import { UserTopBar } from "./components/UserTopBar";
import styles from "./CallPage.module.scss";
import { PageTitle } from "../../components/PageTitle";
import { BsPerson } from "react-icons/bs";
import { CompactToastModal } from "../../components/popups/CompactToastModal";

//TODO: API로 받아올 직원 호출 목록(dummy data)
const CALL_REQUESTS = [
  { id: 1, text: "여기 사장 나와" },
  { id: 2, text: "살려주세요" },
  { id: 3, text: "벌써 12시네요" },
  { id: 4, text: "할 말도 없다" },
  { id: 5, text: "배고프당" },
  { id: 6, text: "집 가고 싶다" },
  { id: 7, text: "흠 뭐 적지" },
  { id: 8, text: "음식 내놔요" },
  { id: 9, text: "직원만 와봐" },
  { id: 10, text: "물티슈 주세요" },
  { id: 11, text: "앞치마 주세요" },
  { id: 12, text: "앞접시 주세요" },
  { id: 13, text: "수저 주세요" },
  { id: 14, text: "내일은 회식~" },
  { id: 15, text: "기본 안주 줘" },
  { id: 16, text: "휴지 줘요" },
];

export default function CallPage() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [toast, setToast] = useState(null);

  const handleItemClick = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

   const handleCallClick = () => {
    if (selectedItems.length === 0) {
      setToast({ message: "요청하실 항목을 선택해주세요.", variant: "error" });
      return;
    }

    // TODO: 선택된 항목들(selectedItems)을 서버 API로 전송하는 로직
    console.log("직원 호출:", selectedItems);

    setToast({ message: "직원호출이 성공적으로 접수되었습니다!.", variant: "success" });
    setSelectedItems([]);
  };

   return (
    <>
      <div className={styles.Wrapper}>
        <div className={styles.MainPanel}>
          <div className={styles.TopBarWrapper}>
            <UserTopBar tableNumber={99} activeMenu="call" />
          </div>

          <PageTitle title="직원 호출" Icon={BsPerson} size={31} />

          <div className={styles.ListContainer}> 
            <div className={styles.CallListArea}>
              {CALL_REQUESTS.map((item) => (
                <button
                  key={item.id}
                  className={`${styles.CallItem} ${
                    selectedItems.includes(item.id) ? styles.selected : ""
                  }`}
                  onClick={() => handleItemClick(item.id)}
                >
                  {item.text}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.CallButtonWrapper}>
            <button className={styles.CallButton} onClick={handleCallClick}>
              호출하기
            </button>
          </div>
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
