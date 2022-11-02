import React, { FC } from 'react';
import classNames from './About.module.scss';
import Header from '@app/containers/Editor/containers/About/components/AboutComponents/Header';
import Title from '@app/containers/Editor/containers/About/components/AboutComponents/Title';
import Footer from '@app/containers/Editor/containers/About/components/AboutComponents/Footer';
import PreviewBlock from '@app/containers/Editor/containers/About/components/AboutComponents/PreviewBlock';
import AvatarImage from '@app/containers/Editor/containers/About/components/AboutComponents/AvatarImage';
import Form from '@app/containers/Editor/containers/About/components/AboutComponents/Form';
import { useAboutStore, useControlsStore } from '@app/containers/Editor/hooks/useEditorStore';
import { useMedia } from 'react-use';
import { screenSizes } from '@app/config/media';
import FormResultModalsSection from '@app/containers/Editor/containers/About/FormResultModalsSection';
import AboutModal from '@app/containers/Editor/containers/About/components/Modals/AboutModal';
import { observer } from 'mobx-react';
import MobileFormModal from '@app/containers/Editor/containers/About/components/Modals/MobileFormModal';

const About: FC = observer(() => {
  const {
    aboutModalIsOpen,
    mobileFormIsOpen,
    setMobileFormIsOpen,
    formResultModalIsOpen,
    setFormResultModalIsOpen,
    characterImage,
  } = useAboutStore();

  const { setAboutModalIsOpen } = useControlsStore();

  const isDesktop = useMedia(screenSizes.mqDesktop, false);

  const isMobile = useMedia(screenSizes.mqMobile, false);

  const onClickMobileFormHandler = () => {
    if (setMobileFormIsOpen) {
      setMobileFormIsOpen(!mobileFormIsOpen);
    }
  };

  return (
    <AboutModal
      isOpen={aboutModalIsOpen}
      setIsOpen={setAboutModalIsOpen}
    >
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
          <AvatarImage image={characterImage} />
          {!isMobile && <Form />}
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
      {isMobile && <MobileFormModal
        openModalForm={mobileFormIsOpen}
        setOpenModalForm={setMobileFormIsOpen}
      >
        <Title>
          Contact us
        </Title>
        <Form />
      </MobileFormModal>}
      <FormResultModalsSection
        openPopup={formResultModalIsOpen}
        setOpenPopup={setFormResultModalIsOpen}
        setOpenModalForm={setMobileFormIsOpen}
      />
    </AboutModal>
  );
});

export default About;
