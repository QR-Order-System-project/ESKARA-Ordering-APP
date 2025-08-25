import styles from "./PageTitle.module.scss";

export const PageTitle = ({ title, Icon, size = 31 }) => {
  return (
    <div className={styles.wrap}>
      <span className={styles.line} />
      {Icon && <Icon size={size} />}
      <h2 className={styles.title}>{title}</h2>
      {Icon && <Icon size={size} />}
      <span className={styles.line} />
    </div>
  );
};
