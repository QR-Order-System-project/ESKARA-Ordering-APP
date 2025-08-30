// components/ui/ConfirmModal.jsx
import { useEffect, useId } from "react";
import { IoCloseSharp } from "react-icons/io5";
import styles from "./Modal.module.scss";

/**
 * 최소 확인 모달
 * - open: 열림 여부
 * - title: 제목
 * - children: 내용
 * - onClose: 닫기
 * - onConfirm: 확인 (없으면 확인 버튼 숨김)
 * - lockScroll: body 스크롤 잠금 (기본 true)
 * - dimmed: 배경 흐림 (기본 true)
 */
export const Modal = ({
  open,
  title,
  children,
  onClose,
  onConfirm,
  lockScroll = true,
  dimmed = true,
}) => {
  const titleId = useId();

  // 스크롤 막기
  useEffect(() => {
    if (!lockScroll) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [lockScroll]);

  if (!open) return null;

  return (
    <div className={styles.container}>
      {dimmed && <div className={styles.overlay} />}

      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        {/* X 버튼 */}
        <button type="button" className={styles.iconClose} onClick={onClose}>
          <IoCloseSharp size={16} />
        </button>

        {/* 제목 */}
        {title && (
          <div className={styles.header}>
            <div id={titleId} className={styles.title}>
              {title}
            </div>
          </div>
        )}

        {/* 내용 */}
        <div className={styles.body}>{children}</div>

        {/* 하단 버튼 */}
        <div className={styles.footer}>
          <button type="button" className={styles.btn} onClick={onClose}>
            닫기
          </button>
          {onConfirm && (
            <button type="button" className={styles.btn} onClick={onConfirm}>
              확인
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
