import React, { FC } from 'react';
import Form from '@app/containers/Editor/containers/About/Form';
import classNames from '@app/containers/Editor/containers/About/About.module.scss';
import ReactModal from 'react-modal';
import BackIcon from '@app/components/Icons/BackIcon';
import Title from '@app/containers/Editor/containers/About/Title';

interface MobileModalFormProps {
  openModalForm?: boolean;
  setOpenModalForm?: (enable: boolean) => void;
}

const MobileModalForm: FC<MobileModalFormProps> = (props) => {
  const { openModalForm = false, setOpenModalForm } = props;

  const onClickMobileFormHandler = () => {
    if (setOpenModalForm) {
      setOpenModalForm(!openModalForm);
    }
  };

  return (
    <ReactModal
      isOpen={openModalForm}
      className={classNames.rootMobileForm}
      closeTimeoutMS={300}
      shouldFocusAfterRender
      shouldCloseOnEsc
      overlayClassName={{
        base: classNames.overlayMobileForm,
        afterOpen: classNames.overlay_afterOpen,
        beforeClose: classNames.overlay_beforeClose,
      }}
    >
      <div className={classNames.backContainer}>
        <button
          type="button"
          className={classNames.backButton}
          onClick={onClickMobileFormHandler}
        >
          <BackIcon className={classNames.backIcon} />
        </button>
      </div>
      <div className={classNames.content_wrapper}>
        <div className={classNames.container}>
          <Title>
            Contact us
          </Title>
          <Form />
        </div>
      </div>
    </ReactModal>
  );
};

export default MobileModalForm;
