import { UserTopBar } from "./components/UserTopBar";
import styles from "./CartPage.module.scss";
import { PageTitle } from "../../components/PageTitle";
import { BsCart2 } from "react-icons/bs";

export default function CallPage() {
  return (
    <div className={styles.Wrapper}>
      <div className={styles.MainPanel}>
        <div className={styles.TopBarWrapper}>
          <UserTopBar tableNumber={99} />
        </div>
        <PageTitle title="장바구니" Icon={BsCart2} size={31} />
      </div>
    </div>
  );
}
