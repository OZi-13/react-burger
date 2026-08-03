import styles from './modal-overlay.module.css';

type TModalOverlayProps = {
  onClose: () => void;
};

export const ModalOverlay = ({ onClose }: TModalOverlayProps): React.JSX.Element => {
  return (
    <button
      aria-label="Закрыть модальное окно"
      className={styles.overlay}
      type="button"
      onClick={onClose}
    />
  );
};
