import Content from '@app/components/Modal/Content';
import Reload from '@app/config/aboutIcon/reload.svg';
import Footer from '@app/components/Modal/Footer';
import classNames from '@app/containers/Editor/containers/About/About.module.scss';
import Header from '@app/components/Modal/Header';
import { FC } from 'react';

interface ErrorContentProps {
  onClickPopupHandler: () => void;
}

const ErrorContent: FC<ErrorContentProps> = ({ onClickPopupHandler }) => {
  return (
    <>
      <Header onCloseClick={onClickPopupHandler} />
      <Content>
        <img
          src={Reload.src}
          alt="Success Icon"
        />
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

export default ErrorContent;
