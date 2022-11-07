import Content from '@app/components/Modal/Content';
import Retry from '@app/assets/about/tryagain.svg';
import Footer from '@app/components/Modal/Footer';
import classNames from '@app/containers/Editor/containers/About/About.module.scss';
import Header from '@app/components/Modal/Header';
import { FC } from 'react';

interface RetryContentProps {
  onHeaderClick: () => void;
  onButtonClick: () => void;
}

const RetryContent: FC<RetryContentProps> = ({ onHeaderClick, onButtonClick }) => {
  return (
    <>
      <Header onCloseClick={onHeaderClick} />
      <Content>
        <img
          src={Retry.src}
          alt="Success Icon"
        />
      </Content>
      <Footer>
        <button
          onClick={onButtonClick}
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
