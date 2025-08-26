import { useNavigate } from "react-router-dom";
import styles from "./HomeButton.module.scss";

// 홈 버튼. 기본적으로 40x40에 아이콘 설정되어있음.
// 원하는 링크를 props로 받아서 작동.
export const HomeButton = ({ to }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(to);
  };

  return (
    <button className={styles.homeButton} onClick={handleClick} type="button">
      <img src="/icons/Home_Icon.png" alt="home" className={styles.homeIcon} />
    </button>
  );
};
