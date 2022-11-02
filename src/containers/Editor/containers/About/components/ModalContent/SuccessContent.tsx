import Content from '@app/components/Modal/Content';
import Success from '@app/config/aboutIcon/success.svg';
import Footer from '@app/components/Modal/Footer';
import classNames from '@app/containers/Editor/containers/About/About.module.scss';
import Header from '@app/components/Modal/Header';
import { FC } from 'react';

interface SuccessContentProps {
  onClickPopupHandler: () => void;
}

const SuccessContent: FC<SuccessContentProps> = ({ onClickPopupHandler }) => {
  return (
    <>
      <Header onCloseClick={onClickPopupHandler} />
      <Content>
        <img
          src={Success.src}
          alt="Success Icon"
        />
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

export default SuccessContent;
