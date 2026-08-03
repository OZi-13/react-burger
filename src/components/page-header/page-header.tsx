import styles from './page-header.module.css';

type TPageHeaderProps = {
  title: string;
};

export const PageHeader = ({ title }: TPageHeaderProps): React.JSX.Element => {
  return (
    <div className={`${styles.page_header} pl-5 pr-5`}>
      <h1 className="text text_type_main-large mt-10 mb-5">{title}</h1>
    </div>
  );
};
