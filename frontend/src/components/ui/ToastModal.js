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
    >
      <div className={`${styles.toast} ${styles[tone] || styles.info}`}>
        <span className={styles.icon}>
          {tone === "success" && (
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                d="M20 6L9 17l-5-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {tone === "error" && (
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                d="M18 6L6 18M6 6l12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {tone === "info" && (
            <svg viewBox="0 0 24 24" width="20" height="20">
              <circle
                cx="12"
                cy="12"
                r="9"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path d="M12 8h.01M11 11h2v5h-2z" fill="currentColor" />
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
