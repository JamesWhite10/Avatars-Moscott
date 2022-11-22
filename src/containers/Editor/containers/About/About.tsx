import React, { FC, useCallback } from 'react';
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
import { CloseIcon } from '@app/components/Icons';
import AboutImage from '@app/assets/about/AboutImage.png';

const About: FC = observer(() => {
  const {
    aboutModalIsOpen,
    mobileFormIsOpen,
    setMobileFormIsOpen,
    formResultModalIsOpen,
    setFormResultModalIsOpen,
  } = useAboutStore();

  const { isOpen } = useControlsStore();

  const isDesktop = useMedia(screenSizes.mqDesktop, false);

  const isMobile = useMedia(screenSizes.mqMobile, false);

  const onClickMobileFormHandler = useCallback(() => {
    setMobileFormIsOpen(!mobileFormIsOpen);
  }, [setMobileFormIsOpen]);

  const onClickHandler = useCallback(() => {
    isOpen(false);
  }, [isOpen]);

  return (
    <AboutModal
      isOpen={aboutModalIsOpen}
    >
      <div className={classNames.content_wrapper}>
        <div className={classNames.container}>
          <div
            onClick={onClickHandler}
            className={classNames.closeContainer}
          >
            <CloseIcon className={classNames.closeIcon} />
          </div>
          <Header>
            Cyberfox & Web3dev
          </Header>
          <div className={classNames.centralBlock}>
            <Title>
              Realistic Web3D solutions.&nbsp;
              {isDesktop && <br />}
              From idea to integration
            </Title>
            <div className={classNames.formBlock}>
              <AvatarImage image={AboutImage.src} />
              {!isMobile && <Form />}
            </div>
          </div>
          <PreviewBlock
            titleDeveloping="We are developing"
            titleCompany="Who are we"
            titleMission="Our Mission"
            subTitleMission="Provide Real Value of metaverses and make it Accessible"
            subTitleCompany="Company values are the set of guiding principles and fundamental beliefs that help a group of people function together as a team and work toward a common business goal. These values are often related to business relationships, customer relationships, and company growth."
          />
          <Footer>
            <span className={classNames.footerSymbol}>&#169; </span>
            <a
              href="https://cyber-fox.net/"
              target="_blank"
              rel="noreferrer"
            >
              Cyberfox
            </a>
            <span className={classNames.footerSymbol}> & </span>
            <a
              href="https://web3dev.group/"
              target="_blank"
              rel="noreferrer"
            >
              Web3dev
            </a>
          </Footer>
          {isMobile && <MobileFormModal
            openModalForm={mobileFormIsOpen}
            setOpenModalForm={setMobileFormIsOpen}
          >
            <div className={classNames.title_contactUs}>
              Contact us
            </div>
            <Form />
          </MobileFormModal>}
          <FormResultModalsSection
            openPopup={formResultModalIsOpen}
            setOpenPopup={setFormResultModalIsOpen}
            setOpenModalForm={setMobileFormIsOpen}
          />
          {isMobile
            && <div>
              <button
                type="button"
                className={classNames.buttonContact}
                onClick={onClickMobileFormHandler}
              >
                Contact us
              </button>
            </div>}
        </div>
      </div>

    </AboutModal>
  );
});

export default About;
