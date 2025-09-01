import { useNavigate } from "react-router-dom";
import styles from "./HomeButton.module.scss";
import { HiOutlineHome } from "react-icons/hi2";

/**
 * Props
 * - to?: string            이동할 경로 (없으면 이동 안 함)
 * - onClick?: (e) => void  외부 클릭 핸들러 (e.preventDefault() 호출 시 내부 동작 중단)
 * - reload?: boolean       true면 하드 새로고침
 * - className?: string
 * - ...rest                button 속성 전달
 */
export const HomeButton = ({
  to,
  onClick,
  reload = false,
  className,
  ...rest
}) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    onClick?.(e);
    // 외부 핸들러가 '막아라'고 했으면 내부 동작 중단 -> 새로고침 구현하느라 어쩔 수 없었음. 나중에 수정하면 빼도 됨.
    if (e?.defaultPrevented) return;

    if (reload) {
      window.location.reload(); // 전체 페이지 리로드
      return;
    }
    if (to) {
      navigate(to);
    }
  };

  return (
    <button
      type="button"
      className={[styles.homeButton, className].filter(Boolean).join(" ")}
      onClick={handleClick}
      {...rest}
    >
      <HiOutlineHome size={24} />
    </button>
  );
};
