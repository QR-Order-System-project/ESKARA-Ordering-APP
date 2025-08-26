import { useEffect } from "react";
import { Modal } from "./Modal";
import styles from "./ToastModal.module.scss";

export default function ToastModal({
  open,
  onClose,
  message,
  tone = "info", // 'success' | 'error' | 'info'
  duration = 1500, // 자동 종료 ms
  dimmed = true, // 배경 어둡게(선택)
}) {
  // 자동 종료
  useEffect(() => {
    if (!open || duration <= 0) return;
    const id = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(id);
  }, [open, duration, onClose]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      dimmed={dimmed}
      showHeader={false} // 헤더 숨김
      showFooter={false} // 버튼/푸터 숨김
      showCloseIcon={false} // X 버튼 숨김
      variant="bare" // ★ 포인트
      overlayVariant="clear" // 선택
    >
      <div className={`${styles.toast} ${styles[tone] || styles.info}`}>
        <span className={styles.icon}>
          {tone === "success" && (
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              {/* 채워진 초록 원 */}
              <circle cx="12" cy="12" r="10" fill="currentColor" />
              {/* 흰색 체크 */}
              <path
                d="M16.2 9l-5.2 5.2L7.8 11"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {tone === "error" && (
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              {/* 채워진 빨강 원 */}
              <circle cx="12" cy="12" r="10" fill="currentColor" />
              {/* 흰색 X */}
              <path
                d="M15.5 8.5L8.5 15.5M8.5 8.5l7 7"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {tone === "info" && (
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              {/* 채워진 파랑 원 */}
              <circle cx="12" cy="12" r="10" fill="currentColor" />
              {/* 흰색 i */}
              <path d="M11 10.5h2V17h-2z" fill="#ffffff" />
              <circle cx="12" cy="8" r="1" fill="#ffffff" />
            </svg>
          )}
        </span>
        <span
          className={styles.msg}
          dangerouslySetInnerHTML={{ __html: message }}
        />
      </div>
    </Modal>
  );
}
