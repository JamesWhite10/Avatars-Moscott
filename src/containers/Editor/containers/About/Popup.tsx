import React, { FC } from 'react';
import Modal from '@app/components/Modal/Modal';
import Header from '@app/components/Modal/Header';
import Content from '@app/components/Modal/Content';
import Footer from '@app/components/Modal/Footer';
import { useSendingStore } from '@app/containers/Editor/hooks/useEditorStore';
import { EStatus } from '@app/containers/Editor/containers/About/config';
import classNames from './About.module.scss';

interface PopupProps {
  openPopup?: boolean;
  setOpenPopup?: (enable: boolean) => void;
  setOpenModalForm?: (enable: boolean) => void;
}

const Popup: FC<PopupProps> = (props) => {
  const { openPopup = false, setOpenPopup, setOpenModalForm } = props;
  const { isSend } = useSendingStore();
  const onClickPopupHandler = () => {
    if (setOpenPopup) {
      setOpenPopup(false);
    } if (setOpenModalForm) {
      setOpenModalForm(false);
    }
  };

  const PopupSuccess = () => {
    return (
      <>
        <Content>
          <div className={classNames.contentPopup}>
            <div className={classNames.emojiPopup}>👌🏻</div>
            <div className={classNames.textPopup}>
              Thank you!
              <div className={classNames.textTitlePopup}>
                We will contact
                <br />
                you within a
                <br />
                few hours
              </div>
            </div>
          </div>
        </Content>
        <Footer>
          <button
            onClick={onClickPopupHandler}
            type="button"
            className={classNames.buttonPopup}
          >
            Ok
          </button>
        </Footer>
      </>
    );
  };

  const PopupErrorRetry = () => {
    return (
      <>
        <Content>
          <div className={classNames.contentPopup}>
            <div className={classNames.emojiPopup}>🙅</div>
            <div className={classNames.textPopup}>
              Unfortunately,
              <br />
              something
              <br />
              went wrong.
              <div className={classNames.textTitlePopup}>To retry?</div>
            </div>
          </div>
        </Content>
        <Footer>
          <button
            onClick={onClickPopupHandler}
            type="button"
            className={classNames.buttonPopup}
          >
            Try again
          </button>
        </Footer>
      </>
    );
  };

  const PopupErrorReload = () => {
    return (
      <>
        <Content>
          <div className={classNames.contentPopup}>
            <div className={classNames.emojiPopup}>🤷‍♂</div>
            <div className={classNames.textPopup}>
              Unfortunately,
              <br />
              something
              <br />
              went wrong.
            </div>
            <div className={classNames.textTitlePopup}>Try later</div>
          </div>
        </Content>
        <Footer>
          <button
            onClick={() => document.location.reload()}
            type="button"
            className={classNames.buttonPopup}
          >
            Reload
          </button>
        </Footer>
      </>
    );
  };

  return (
    <Modal isOpen={openPopup}>
      <Header onCloseClick={onClickPopupHandler} />
      {isSend === EStatus.success && <PopupSuccess />}
      {isSend === EStatus.errorRetry && <PopupErrorRetry />}
      {isSend === EStatus.errorReload && <PopupErrorReload />}
    </Modal>
  );
};

export default Popup;
