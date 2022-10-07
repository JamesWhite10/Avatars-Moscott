import { FC, PropsWithChildren } from 'react';
import ReactModal from 'react-modal';
import classNames from './Modal.module.scss';
import Header from './Header';
import Footer from './Footer';
import Content from './Content';
import cn from 'classnames';

if (typeof window !== 'undefined') {
  const rootElement = document.getElementById('__next') || document.getElementById('root');
  ReactModal.setAppElement(rootElement || document.body);
}

export interface ModalProps {
  isOpen?: boolean;
  closeOnOverlayClick?: boolean;
  showOverlay?: boolean;
  onChangeIsOpen?: (isOpen: boolean) => void;
}

type ModalComponentsType = {
  Header: typeof Header;
  Content: typeof Content;
  Footer: typeof Footer;
};

const Modal: FC<PropsWithChildren<ModalProps>> & ModalComponentsType = (props) => {
  const {
    isOpen = false,
    closeOnOverlayClick = true,
    showOverlay = true,
    onChangeIsOpen = () => undefined,
    children,
  } = props;

  return (
    <ReactModal
      isOpen={isOpen}
      onAfterOpen={() => onChangeIsOpen(true)}
      onAfterClose={() => onChangeIsOpen(false)}
      onRequestClose={() => onChangeIsOpen(false)}
      className={classNames.root}
      closeTimeoutMS={300}
      shouldFocusAfterRender
      shouldCloseOnOverlayClick={closeOnOverlayClick}
      shouldCloseOnEsc
      overlayClassName={{
        base: cn(classNames.overlay, showOverlay ? undefined : classNames.overlay_hidden),
        afterOpen: classNames.overlay_afterOpen,
        beforeClose: classNames.overlay_beforeClose,
      }}
    >
      <div className={classNames.content_wrapper}>
        <div className={classNames.container}>
          {children}
        </div>
      </div>
    </ReactModal>
  );
};

Modal.Header = Header;
Modal.Content = Content;
Modal.Footer = Footer;

export default Modal;
