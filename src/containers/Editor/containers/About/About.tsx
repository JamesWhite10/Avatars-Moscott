import { FC, useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import classNames from './About.module.scss';
import Header from '@app/containers/Editor/containers/About/Header';
import Title from '@app/containers/Editor/containers/About/Title';
import Footer from '@app/containers/Editor/containers/About/Footer';
import { CloseIcon } from '@app/components/Icons';
import PreviewBlock from '@app/containers/Editor/containers/About/PreviewBlock';
import AvatarImage from '@app/containers/Editor/containers/About/AvatarImage';
import Form from '@app/containers/Editor/containers/About/Form';
import MiraImage from '@app/assets/MiraAbout.png';
import YukiImage from '@app/assets/YukiAbout.png';
import { useCharacterStore } from '@app/containers/Editor/hooks/useEditorStore';
import { useMedia } from 'react-use';
import { screenSizes } from '@app/config/media';
import MobileModalForm from '@app/containers/Editor/containers/About/MobileModalForm';
import OrientationStub from '@app/components/OrientationStub/OrientationStub';
import Popup from '@app/containers/Editor/containers/About/Popup';

interface AboutProps {
  openModal?: boolean;
  setOpenModal?: (enable: boolean) => void;
  openModalForm?: boolean;
  setOpenModalForm?: (enable: boolean) => void;
  openPopup?: boolean;
  setOpenPopup?: (enable: boolean) => void;
}

const About: FC<AboutProps> = (props) => {
  const {
    openModal = false, setOpenModal, openModalForm = false, setOpenModalForm, openPopup = false, setOpenPopup,
  } = props;

  const { character } = useCharacterStore();

  const [avatarImage, setAvatarImage] = useState<string>('');

  const isDesktop = useMedia(screenSizes.mqDesktop, false);

  const isTablet = useMedia(screenSizes.mqTablet, false);

  const isMobile = useMedia(screenSizes.mqMobile, false);

  const onClickHandler = () => {
    if (setOpenModal) {
      setOpenModal(!openModal);
    }
  };

  const onClickMobileFormHandler = () => {
    if (setOpenModalForm) {
      setOpenModalForm(!openModalForm);
    }
  };

  useEffect(() => {
    if (character?.name === 'Mira') {
      setAvatarImage(MiraImage.src);
    }
    if (character?.name === 'Yuki') {
      setAvatarImage(YukiImage.src);
    }
  }, [character]);

  return (
    <ReactModal
      isOpen={openModal}
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
      <div className={classNames.closeContainer}>
        <button
          type="button"
          className={classNames.closeButton}
          onClick={onClickHandler}
        >
          <CloseIcon className={classNames.closeIcon} />
        </button>
      </div>
      <div className={classNames.content_wrapper}>
        <div className={classNames.container}>
          <Header>
            Cyberfox & Web3dev
          </Header>
          <div className={classNames.centralBlock}>
            <div>
              <Title>
                Realistic Web3D solutions.&nbsp;
                {isDesktop && <br />}
                From idea to integration
              </Title>
            </div>
            <div className={classNames.formBlock}>
              <AvatarImage image={avatarImage} />
              {isDesktop && <Form />}
              {isTablet && <Form />}
            </div>
          </div>
          <PreviewBlock
            titleDeveloping="We are developing"
            titleCompany="Who are we"
            titleMission="Our Mission"
            subTitleMission="The mission statement communicates the purpose of the organization. The vision statement provides insight into what the company hopes to achieve or become in the future. The values statement reflects the organization's core principles and ethics."
            subTitleCompany="Company values are the set of guiding principles and fundamental beliefs that help a group of people function together as a team and work toward a common business goal. These values are often related to business relationships, customer relationships, and company growth."
          />
          <Footer>
            <span className={classNames.footerSymbol}>&#169; </span>
            Cyberfox
            <span className={classNames.footerSymbol}> & </span>
            Web3dev
          </Footer>
          {isMobile && <button
            type="button"
            className={classNames.buttonContact}
            onClick={onClickMobileFormHandler}
          >
            Contact us
          </button>}
          <OrientationStub />
          {isMobile && <MobileModalForm
            openModalForm={openModalForm}
            setOpenModalForm={setOpenModalForm}
          />}
          <Popup
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}
            setOpenModalForm={setOpenModalForm}
          />
        </div>
      </div>
    </ReactModal>
  );
};

export default About;
