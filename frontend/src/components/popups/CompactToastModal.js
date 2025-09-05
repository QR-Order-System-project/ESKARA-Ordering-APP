import { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./CompactToastModal.module.scss";
import { MdCancel } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";

// 사용 예시 - 헷갈릴 수 있어서 추가
// export default function Page() {
//   const [toast, setToast] = useState(null);
//   // toast: { message, variant } | null

//   const showSuccess = () => setToast({ message: "성공했습니다!", variant: "success" });
//   const showError   = () => setToast({ message: "실패했습니다.", variant: "error" });

//   return (
//     <>
//       <button onClick={showSuccess}>성공 토스트</button>
//       <button onClick={showError}>실패 토스트</button>

//       {toast && (
//         <CompactToastModal
//           message={toast.message}
//           variant={toast.variant}
//           duration={1800}
//           onClose={() => setToast(null)}
//         />
//       )}
//     </>
//   );
// }

/**
 * ✅ CompactToastModal
 * 짧은 시간 동안 메시지를 보여주는 토스트 알림 컴포넌트
 *
 * 특징:
 * - 성공/실패 2가지 스타일 지원 (아이콘 + 색상)
 * - 지정된 시간(duration) 뒤 자동으로 닫힘
 * - Portal을 사용해 body 최상단에 표시 → 레이아웃 간섭 없음
 */

export const CompactToastModal = ({
  message, // 출력할 메시지
  variant = "success", // 스타일 타입 ('success' | 'error')
  duration = 1800, // 자동 닫힘 시간(ms)
  onClose, // 닫힐 때 실행할 콜백
}) => {
  // duration 후 자동 닫힘
  useEffect(() => {
    if (!message || duration <= 0) return;
    const id = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(id);
  }, [message, duration, onClose]);

  // message 없으면 렌더링 안 함
  if (!message) return null;

  // variant에 따른 아이콘 선택
  const Icon = variant === "success" ? FaCheckCircle : MdCancel;

  // 토스트 UI
  const node = (
    <div className={`${styles.toast} ${styles[variant]}`}>
      <Icon size={18} className={styles.icon} />
      <span className={styles.text}>{message}</span>
    </div>
  );

  // Portal로 body에 직접 렌더링
  return createPortal(node, document.body);
};
