import { useRef, useState, useLayoutEffect } from "react";
import { MenuBar } from "./components/MenuBar";
import styles from "./MainPage.module.scss";
import MainBanner from "./assets/banner.png";
import { UserTopBar } from "./components/UserTopBar";
import { MenuSections } from "./components/MenuSections";
import { menus } from "./data/menus";
import { CartBar } from "./components/CartBar";

export const MainPage = () => {
  const topRef = useRef(null);
  const eventRef = useRef(null);
  const mainRef = useRef(null);
  const sideRef = useRef(null);
  const drinkRef = useRef(null);

  const [active, setActive] = useState("event");
  const [cart, setCart] = useState([]);

  useLayoutEffect(() => {
    const el = topRef.current;
    if (!el) return;
    const update = () => {
      const h = Math.ceil(el.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--topbar-h", `${h}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleSelect = (key) => {
    const map = { event: eventRef, main: mainRef, side: sideRef, drink: drinkRef };
    map[key]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(key);
  };

  const handleAddToCart = (menu) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === menu.id);
      if (exists) {
        return prev.map((item) =>
          item.id === menu.id ? { ...item, qty: item.qty + menu.qty } : item
        );
      }
      return [...prev, menu];
    });
  };

return (
    <div className={styles.Wrapper}>
      <div className={styles.MainPanel}>
        <div ref={topRef} className={styles.TopBarWrapper}>
          <UserTopBar tableNumber={99} />
        </div>

        {/* ✅ 배너도 스크롤에 포함 → 스크롤 시 사라짐 */}
        <div className={styles.MenuScrollArea}>
          <div className={styles.Banner}>
            <img src={MainBanner} alt="Main Banner" />
          </div>

          {/* ✅ 메뉴바는 sticky로 TopBar 아래 딱 붙음 */}
          <div className={styles.MenuBarWrapper}>
            <MenuBar activeKey={active} onSelect={handleSelect} />
          </div>

          <div className={styles.MenuContentWrapper}>
            <MenuSections
              refs={{ eventRef, mainRef, sideRef, drinkRef }}
              data={menus}
              onAdd={handleAddToCart}
            />
          </div>
        </div>

        <CartBar cart={cart} />
      </div>
    </div>
  );
};