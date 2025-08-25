// components/ui/ConfirmDialog.jsx
import Modal from "./Modal";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  cancelText = "취소",
  confirmText = "확인",
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="confirm">
        <button className="confirm-close" onClick={onClose} aria-label="닫기">
          ×
        </button>
        {title && <div className="confirm-title">{title}</div>}
        {description && (
          <div
            className="confirm-desc"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
        <div className="confirm-actions">
          <button className="confirm-btn" onClick={onClose}>
            {cancelText}
          </button>
          <button className="confirm-btn ok" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
