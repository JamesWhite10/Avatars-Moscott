import React, { FC, useMemo } from 'react';
import Modal from '@app/components/Modal/Modal';
import { observer } from 'mobx-react';
import SuccessContent from '@app/containers/Editor/containers/About/components/ModalContent/SuccessContent';
import ErrorContent from '@app/containers/Editor/containers/About/components/ModalContent/ErrorContent';
import RetryContent from '@app/containers/Editor/containers/About/components/ModalContent/RetryContent';
import { useAboutStore } from '@app/containers/Editor/hooks/useEditorStore';

interface FormResultProps {
  openPopup?: boolean;
  setOpenPopup?: (enable: boolean) => void;
  setOpenModalForm?: (enable: boolean) => void;
}

const FormResultModalsSection: FC<FormResultProps> = observer((props) => {
  const { openPopup = false, setOpenPopup, setOpenModalForm } = props;
  const { sendFormResultStatus } = useAboutStore();

  const onClickPopupHandler = () => {
    if (setOpenPopup) {
      setOpenPopup(false);
    } if (setOpenModalForm) {
      setOpenModalForm(false);
    }
  };

  const content = useMemo(() => {
    const isErrorStatus = sendFormResultStatus !== 'success';
    if (isErrorStatus) {
      return sendFormResultStatus === 'error' ? <ErrorContent onClickPopupHandler={onClickPopupHandler} />
        : <RetryContent onClickPopupHandler={onClickPopupHandler} />;
    }
    return <SuccessContent onClickPopupHandler={onClickPopupHandler} />;
  }, [sendFormResultStatus]);

  return (
    <Modal isOpen={openPopup}>
      {content}
    </Modal>
  );
});

export default FormResultModalsSection;
