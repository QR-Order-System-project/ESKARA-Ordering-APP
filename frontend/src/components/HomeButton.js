import { useNavigate } from "react-router-dom";
import styles from "./HomeButton.module.scss";
import { TbHome } from "react-icons/tb";

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
      <TbHome size={24} />
    </button>
  );
};
