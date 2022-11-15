import React, { FC, PropsWithChildren, useCallback } from 'react';
import classNames from '@app/containers/Editor/containers/About/About.module.scss';
import ReactModal from 'react-modal';
import BackIcon from '@app/components/Icons/BackIcon';
import { useLockBodyScroll } from 'react-use';

interface MobileFormModalProps {
  openModalForm?: boolean;
  setOpenModalForm: (enable: boolean) => void;
}

const MobileFormModal: FC<PropsWithChildren<MobileFormModalProps>> = (props) => {
  const { openModalForm = false, setOpenModalForm, children } = props;

  const modalCloseHandler = useCallback(() => setOpenModalForm(false), [setOpenModalForm]);

  useLockBodyScroll(openModalForm);

  return (
    <ReactModal
      isOpen={openModalForm}
      className={classNames.rootMobileForm}
      closeTimeoutMS={300}
      shouldFocusAfterRender
      shouldCloseOnEsc
      overlayClassName={{
        base: classNames.overlay,
        afterOpen: classNames.overlay_afterOpen,
        beforeClose: classNames.overlay_beforeClose,
      }}
    >
      <div
        className={classNames.backContainer}
        onClick={modalCloseHandler}
      >
        <button
          type="button"
          className={classNames.backButton}
          onClick={modalCloseHandler}
        >
          <BackIcon className={classNames.backIcon} />
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

export default MobileFormModal;
