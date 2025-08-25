// components/ui/ToastProvider.jsx
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";
import styles from "./ToastProvider.module.scss";

const ToastCtx = createContext(null);

export function ToastProvider({ children, position = "top" }) {
  const [list, setList] = useState([]);

  const remove = useCallback((id) => {
    setList((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    ({ message, tone = "info", duration = 2000 }) => {
      const id = Math.random().toString(36).slice(2);
      setList((prev) => [...prev, { id, message, tone }]);
      if (duration > 0) setTimeout(() => remove(id), duration);
      return id;
    },
    [remove]
  );

  const api = useMemo(
    () => ({
      show: (opt) => push({ ...opt }),
      success: (opt) => push({ tone: "success", ...opt }),
      error: (opt) => push({ tone: "error", ...opt }),
    }),
    [push]
  );

  return (
    <ToastCtx.Provider value={api}>
      {children}

      {createPortal(
        <div
          className={`${styles.container} ${styles[position] || styles.top}`}
          role="region"
          aria-live="polite"
        >
          {list.map((t) => (
            <div
              key={t.id}
              className={`${styles.toast} ${styles[t.tone] || ""}`}
              role="status"
            >
              <span
                className={styles.msg}
                dangerouslySetInnerHTML={{ __html: t.message }}
              />
              <button
                className={styles.close}
                onClick={() => remove(t.id)}
                aria-label="닫기"
              >
                ×
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
