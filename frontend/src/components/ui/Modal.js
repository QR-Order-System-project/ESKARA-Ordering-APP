import styles from "./Modal.module.scss";
import { IoCloseSharp } from "react-icons/io5";

/**
 * Props
 * - open: boolean
 * - title?: string
 * - children: ReactNode
 * - onClose: () => void
 * - onConfirm?: () => void
 * - confirmText?: string
 * - closeText?: string
 * - dimmed?: boolean
 * - showHeader?: boolean
 * - showFooter?: boolean
 * - showCloseIcon?: boolean
 * - variant?: "default" | "bare"  // ★ 추가: 내용만 보여줄 때 'bare'
 * - overlayVariant?: "dim" | "clear" | "none" // ★ 선택: 오버레이 스타일
 */
export function Modal({
  open,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = "확인",
  closeText = "닫기",
  dimmed = true,
  showHeader = true,
  showFooter = true,
  showCloseIcon = true,
  variant = "default", // ★ 추가
  overlayVariant = "dim", // ★ 추가
}) {
  if (!open) return null;

  const modalClass = [styles.modal, variant === "bare" ? styles.bare : ""].join(
    " "
  );

  const overlayClass =
    overlayVariant === "clear" ? styles.overlayClear : styles.overlay;

  return (
    <div className={styles.container} onClick={onClose}>
      {dimmed && overlayVariant !== "none" && <div className={overlayClass} />}

      <div className={modalClass} onClick={(e) => e.stopPropagation()}>
        {showCloseIcon && onClose && (
          <button type="button" className={styles.iconClose} onClick={onClose}>
            <IoCloseSharp size={16} />
          </button>
        )}

        {showHeader && (title || (showCloseIcon && onClose)) && (
          <div className={styles.header}>
            <div className={styles.title}>{title}</div>
          </div>
        )}

        <div className={styles.body}>{children}</div>

        {showFooter && (
          <div className={styles.footer}>
            <button type="button" className={styles.btn} onClick={onClose}>
              {closeText}
            </button>
            {onConfirm && (
              <button type="button" className={styles.btn} onClick={onConfirm}>
                {confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
