import styles from "./ManagerCallTab.module.scss";

/**
 * ManagerCallTab
 * - 직원 호출 큐를 시간순으로 보여주고, 항목 선택 시 완료 확인 모달을 띄움
 * - 모달 확인 시 해당 호출을 큐에서 제거
 */

// 더미 큐 데이터 (API 연동 전 임시)
const initialCalls = [
  {
    id: 1,
    tableNo: 12,
    requests: ["젓가락 2세트", "숟가락 추가", "물 리필"],
    createdAt: Date.now() - 1000 * 60 * 3,
  },
  {
    id: 2,
    tableNo: 30,
    requests: ["앞접시 3개", "키친타올"],
    createdAt: Date.now() - 1000 * 60 * 8,
  },
  {
    id: 3,
    tableNo: 9,
    requests: ["티슈", "얼음컵 2개", "물 리필"],
    createdAt: Date.now() - 1000 * 60 * 12,
  },
  {
    id: 4,
    tableNo: 15,
    requests: ["포크 1개"],
    createdAt: Date.now() - 1000 * 60 * 15,
  },
  {
    id: 5,
    tableNo: 24,
    requests: ["밑반찬 리필", "숟가락 1개"],
    createdAt: Date.now() - 1000 * 60 * 22,
  },
  {
    id: 6,
    tableNo: 24,
    requests: ["밑반찬 리필", "숟가락 1개"],
    createdAt: Date.now() - 1000 * 60 * 22,
  },
];

export const ManagerCallTab = () => {
  return (
    <div className={styles.page}>{/* TODO: 직원 호출 탭 내용 구현 */}</div>
  );
};
