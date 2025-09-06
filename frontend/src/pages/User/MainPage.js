import { useRef, useState, useLayoutEffect, useEffect } from "react";
import { useParams } from "react-router";
import { MenuBar } from "./components/MenuBar";
import styles from "./MainPage.module.scss";
import MainBanner from "./assets/banner.png";
import { UserTopBar } from "./components/UserTopBar";
import { MenuSections } from "./components/MenuSections";
import { menus } from "./data/menus";
import { CartBar } from "./components/CartBar";

export const MainPage = () => {
  const { tableNumber } = useParams();
  const topRef = useRef(null);
  const eventRef = useRef(null);
  const mainRef = useRef(null);
  const sideRef = useRef(null);
  const drinkRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const bottomSentinelRef = useRef(null);

  const intersectionStatusRef = useRef(new Map());

  const [active, setActive] = useState("event");
  const [cart, setCart] = useState([]);
  const [topBarHeight, setTopBarHeight] = useState(0);
  const [isManualScroll, setIsManualScroll] = useState(false);

  useLayoutEffect(() => {
    const el = topRef.current;
    if (!el) return;
    const update = () => {
      const h = Math.ceil(el.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--topbar-h", `${h}px`);
      setTopBarHeight(h);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const scrollRoot = scrollAreaRef.current;
    if (!scrollRoot || topBarHeight === 0) return;

    const sections = [eventRef, mainRef, sideRef, drinkRef];

    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScroll) return;

        entries.forEach((entry) => {
          intersectionStatusRef.current.set(entry.target, entry);
        });

        const statuses = Array.from(intersectionStatusRef.current.values());

        const bottomSentinelEntry = statuses.find(
          (s) => s.target === bottomSentinelRef.current
        );
        if (bottomSentinelEntry?.isIntersecting) {
          setActive("drink");
          return;
        }

        const visibleEntries = statuses.filter(
          (status) =>
            status.isIntersecting && status.target !== bottomSentinelRef.current
        );

        if (visibleEntries.length > 0) {
          const topMostVisibleEntry = visibleEntries.reduce((prev, current) => {
            return prev.boundingClientRect.top < current.boundingClientRect.top
              ? prev
              : current;
          });

          const key = topMostVisibleEntry.target.getAttribute("data-key");
          if (key) setActive(key);
        }
      },
      {
        root: scrollRoot,
        rootMargin: `-${topBarHeight}px 0px 0px 0px`,
        threshold: Array.from({ length: 101 }, (_, i) => i / 100),
      }
    );

    sections.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });
    if (bottomSentinelRef.current) {
      observer.observe(bottomSentinelRef.current);
    }

    return () => observer.disconnect();
  }, [topBarHeight, isManualScroll]);

  const handleSelect = (key) => {
    const map = { event: eventRef, main: mainRef, side: sideRef, drink: drinkRef };
    const sectionEl = map[key]?.current;
    const scrollRoot = scrollAreaRef.current;
    if (!sectionEl || !scrollRoot) return;

    setIsManualScroll(true);
    const targetScrollTop =
      sectionEl.offsetTop - scrollRoot.offsetTop - topBarHeight;
    scrollRoot.scrollTo({ top: targetScrollTop, behavior: "smooth" });
    setActive(key);

    setTimeout(() => setIsManualScroll(false), 800);
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
          <UserTopBar tableNumber={tableNumber} />
        </div>
        <div ref={scrollAreaRef} className={styles.MenuScrollArea}>
          <div className={styles.Banner}>
            <img src={MainBanner} alt="Main Banner" />
          </div>
          <div className={styles.MenuBarWrapper}>
            <MenuBar activeKey={active} onSelect={handleSelect} />
          </div>
          <div className={styles.MenuContentWrapper}>
            <MenuSections
              refs={{ eventRef, mainRef, sideRef, drinkRef }}
              data={menus}
              onAdd={handleAddToCart}
            />
            <div ref={bottomSentinelRef} style={{ height: "1px" }} />
          </div>
        </div>
        <CartBar cart={cart} />
      </div>
    </div>
  );
};
