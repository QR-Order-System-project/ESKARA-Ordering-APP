import MenuCard from "./MenuCard";
import styles from "./MenuSections.module.scss";

export default function MenuSections({ refs, data, onAdd }) {
  const sections = [
    { key: "event", title: "EVENT", items: data.event, ref: refs.eventRef },
    { key: "main", title: "MAIN", items: data.main, ref: refs.mainRef },
    { key: "side", title: "SIDE", items: data.side, ref: refs.sideRef },
    { key: "drink", title: "DRINK", items: data.drink, ref: refs.drinkRef },
  ];

  return (
    <div className={styles.Sections}>
      {sections.map(({ key, title, items, ref }) => (
        <section key={key} ref={ref} data-key={key} className={styles.Section}>
          <div className={styles.SectionHeader}>
            <span>{title}</span>
          </div>
          <div className={styles.SectionContent}>
            {items.map((menu) => (
              <MenuCard key={menu.id} {...menu} onAdd={onAdd} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export { MenuSections };
