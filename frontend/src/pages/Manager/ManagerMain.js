import { HomeButton } from "../../components/HomeButton";
import { TotalPriceLabel } from "../../components/TotalPriceLabel";
import styles from "./ManagerMain.module.scss";

export const ManagerMain = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.mainPanel}>
        <div className={styles.topBar}>
          <HomeButton to="/manager" />
          <div className={styles.logo}></div>
        </div>
        <TotalPriceLabel />
      </div>
    </div>
  );
};
