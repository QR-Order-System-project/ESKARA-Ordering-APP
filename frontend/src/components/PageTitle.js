import styles from "./PageTitle.module.scss";

//각 탭 별 제목을 띄우는 컴포넌트
//탭의 제목, 양 옆 아이콘, 아이콘의 크기를 지정해서 사용한다.

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
