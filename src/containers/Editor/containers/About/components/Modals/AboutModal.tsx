import { FC, PropsWithChildren } from 'react';
import ReactModal from 'react-modal';
import classNames from '../../About.module.scss';
import { CloseIcon } from '@app/components/Icons';

if (typeof window !== 'undefined') {
  const rootElement = document.getElementById('__next') || document.getElementById('root');
  ReactModal.setAppElement(rootElement || document.body);
}

export interface AboutModalProps {
  isOpen?: boolean;
  setIsOpen?: (enable: boolean) => void;
}

const AboutModal: FC<PropsWithChildren<AboutModalProps>> = (props) => {
  const {
    isOpen = false,
    setIsOpen,
    children,
  } = props;

  const onClickHandler = () => {
    if (setIsOpen) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      className={classNames.root}
      closeTimeoutMS={300}
      shouldFocusAfterRender
      shouldCloseOnEsc
      overlayClassName={{
        base: classNames.overlay,
        afterOpen: classNames.overlay_afterOpen,
        beforeClose: classNames.overlay_beforeClose,
      }}
    >
      <div className={classNames.closeContainer}>
        <button
          type="button"
          className={classNames.closeButton}
          onClick={onClickHandler}
        >
          <CloseIcon className={classNames.closeIcon} />
        </button>
      </div>
      <div className={classNames.content_wrapper}>
        <div className={classNames.container}>
          {children}
        </div>
      </div>
    </ReactModal>
  );
};

export default AboutModal;
