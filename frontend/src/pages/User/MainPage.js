import styles from "./MainPage.module.scss";

export const MainPage = () => {
  return (
    <div className={styles.Wrapper}>
      <div className={styles.MainPanel}>
        <div className={styles.TopBar}>
          <span className={styles.ButtonGroup}>
            <button className={styles.HomeButton}>홈</button>
            <span className={styles.TabelLabel}>테이블 N번</span>
          </span>
          <span className={styles.ButtonGroup}>
            <button className={styles.CallManagerButton}>직원호출</button>
            <button className={styles.OrderListButton}>주문내역</button>
          </span>
        </div>
        <div className={styles.Banner}> 배너 위치</div>
        <div className={styles.MenuBar}> 메뉴 바</div>
        <div className={styles.MenuPanel}>
          메뉴 관리
          <div className={styles.MenuCategory}> 종류 </div>
          <div className={styles.MenuList}>
            메뉴 세부 관리
            <div className={styles.MenuIcon}> 아이콘 </div>
            <div className={styles.MenuName}> 이름 </div>
            <div className={styles.MenuPrice}> 가격 </div>
            <div className={styles.MenuDescription}> 설명 </div>
            <div className={styles.Count}></div>
            <div className={styles.AddToCart}> 카트에 담기 버튼 </div>
          </div>
        </div>
      </div>
    </div>
  );
};
