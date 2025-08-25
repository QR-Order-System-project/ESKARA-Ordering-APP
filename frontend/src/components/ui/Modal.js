import { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.scss";

export default function Modal({
  open,
  onClose,
  children,
  backdropClosable = true,
}) {
  // ✅ 훅은 항상 호출
  useEffect(() => {
    if (!open) return; // 열려있을 때만 동작
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const onBackdrop = (e) => {
    if (!backdropClosable) return;
    if (e.target === e.currentTarget) onClose?.();
  };

  // ✅ 훅 호출 이후에 조건부 리턴
  if (!open) return null;

  return createPortal(
    <div className={styles.modalBackdrop} onMouseDown={onBackdrop}>
      <div
        className={styles.modalDialog}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
