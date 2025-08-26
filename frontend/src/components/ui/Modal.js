import styles from "./Modal.module.scss";

/**
 * Props
 * - open: boolean (required) — 팝업 열림 여부
 * - title?: string — 헤더 제목 (선택)
 * - children: ReactNode — 본문 컨텐츠
 * - onClose: () => void (required) — 닫기 버튼 클릭 시
 * - onConfirm?: () => void — 확인 버튼 클릭 시 (없으면 확인 버튼 숨김)
 * - confirmText?: string — 기본 "확인"
 * - closeText?: string — 기본 "닫기"
 * - dimmed?: boolean — 배경 어둡게 (기본 true)
 */
// Modal.jsx (기존 SimpleModal.jsx)
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
}) {
  if (!open) return null;

  return (
    <div className={styles.container}>
      {dimmed && <div className={styles.overlay} />}

      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {showHeader && (title || (showCloseIcon && onClose)) && (
          <div className={styles.header}>
            <div className={styles.title}>{title}</div>
            {showCloseIcon && onClose && (
              <button
                type="button"
                className={styles.iconClose}
                onClick={onClose}
              >
                ×
              </button>
            )}
          </div>
        )}

        <div className={styles.body}>{children}</div>

        {showFooter && (
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={onClose}
            >
              {closeText}
            </button>
            {onConfirm && (
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
