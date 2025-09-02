import { UserTopBar } from "./components/UserTopBar";
import styles from "./OrdersPage.module.scss";
import { PageTitle } from "../../components/PageTitle";
import { BsClipboard } from "react-icons/bs";

export default function CallPage() {
  return (
    <div className={styles.Wrapper}>
      <div className={styles.MainPanel}>
        <div className={styles.TopBarWrapper}>
          <UserTopBar tableNumber={99} />
        </div>
        <PageTitle title="주문내역" Icon={BsClipboard} size={27} />
      </div>
    </div>
  );
}
