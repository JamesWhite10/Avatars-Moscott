import { FC, PropsWithChildren } from 'react';
import ReactModal from 'react-modal';
import classNames from '../../About.module.scss';
import Scrollbars from 'react-custom-scrollbars-2';

if (typeof window !== 'undefined') {
  const rootElement = document.getElementById('__next') || document.getElementById('root');
  ReactModal.setAppElement(rootElement || document.body);
}

export interface AboutModalProps {
  isOpen?: boolean;
}

const AboutModal: FC<PropsWithChildren<AboutModalProps>> = (props) => {
  const {
    isOpen = false,
    children,
  } = props;

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
      <Scrollbars
        autoHeight
        autoHeightMin={300}
        autoHeightMax={970}
        autoHide
      >
        {children}
      </Scrollbars>
    </ReactModal>
  );
};

export default AboutModal;
