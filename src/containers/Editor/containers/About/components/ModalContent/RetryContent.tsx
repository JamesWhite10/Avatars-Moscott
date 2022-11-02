import Content from '@app/components/Modal/Content';
import Retry from '@app/config/aboutIcon/tryagain.svg';
import Footer from '@app/components/Modal/Footer';
import classNames from '@app/containers/Editor/containers/About/About.module.scss';
import Header from '@app/components/Modal/Header';
import { FC } from 'react';

interface RetryContentProps {
  onClickPopupHandler: () => void;
}

const RetryContent: FC<RetryContentProps> = ({ onClickPopupHandler }) => {
  return (
    <>
      <Header onCloseClick={onClickPopupHandler} />
      <Content>
        <img
          src={Retry.src}
          alt="Success Icon"
        />
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

export default RetryContent;
