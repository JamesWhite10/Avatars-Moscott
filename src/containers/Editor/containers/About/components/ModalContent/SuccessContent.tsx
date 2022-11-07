import Content from '@app/components/Modal/Content';
import Success from '@app/assets/about/success.svg';
import Footer from '@app/components/Modal/Footer';
import classNames from '@app/containers/Editor/containers/About/About.module.scss';
import Header from '@app/components/Modal/Header';
import { FC } from 'react';

interface SuccessContentProps {
  onHeaderClick: () => void;
  onButtonClick: () => void;
}

const SuccessContent: FC<SuccessContentProps> = ({ onHeaderClick, onButtonClick }) => {
  return (
    <>
      <Header onCloseClick={onHeaderClick} />
      <Content>
        <img
          src={Success.src}
          alt="Success Icon"
        />
      </Content>
      <Footer>
        <button
          onClick={onButtonClick}
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
