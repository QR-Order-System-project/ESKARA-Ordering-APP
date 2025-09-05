import { AiOutlineUser } from "react-icons/ai";
import styles from "./ButtonBar.module.scss";
import { HiOutlineClipboardList } from "react-icons/hi";
import { BsCurrencyDollar } from "react-icons/bs";

const TABS = [
  { label: "TABLE", title: "테이블 관리", Icon: BsCurrencyDollar },
  { label: "ORDER", title: "주문 관리", Icon: HiOutlineClipboardList },
  { label: "CALL", title: "직원 호출", Icon: AiOutlineUser },
];

export const ButtonBar = ({ value, onChange }) => (
  <div className={styles.mainPanel}>
    {TABS.map((tab) => {
      const { label } = tab;
      const isActive = value === label;

      return (
        <button
          key={label}
          type="button"
          className={`${styles.button} ${isActive ? styles.active : ""}`}
          onClick={() => onChange?.(tab)}
        >
          {label}
        </button>
      );
    })}
  </div>
);
