import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '@components/modal-overlay/modal-overlay';

import styles from './modal.module.css';

type TModalProps = {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
};

export const Modal = ({
  children,
  onClose,
  title,
}: TModalProps): React.JSX.Element | null => {
  const modalRoot = document.getElementById('modals');

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return (): void => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (!modalRoot) {
    return null;
  }

  return createPortal(
    <>
      <ModalOverlay onClose={onClose} />
      <section
        className={styles.modal}
        aria-modal="true"
        data-testid="modal"
        role="dialog"
      >
        <header className={styles.header}>
          {title && <h2 className="text text_type_main-large">{title}</h2>}
          <button
            aria-label="Закрыть"
            className={styles.close}
            data-testid="modal-close"
            type="button"
            onClick={onClose}
          >
            <CloseIcon type="primary" />
          </button>
        </header>
        <div>{children}</div>
      </section>
    </>,
    modalRoot
  );
};
