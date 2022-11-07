import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import classNames from './SceneLoad.module.scss';
import CircularProgress from '@app/components/CircularProgress';
import RoundButton from '@app/components/RoundButton';
import Fade from '@app/components/Transition/Fade';
import { useMedia, useWindowSize } from 'react-use';
import { screenSizes } from '@app/config/media';
import { observer } from 'mobx-react';
import useEditorStore from '@app/containers/Editor/hooks/useEditorStore';
import ErrorModal from '@app/containers/Editor/containers/SceneLoad/ErrorModal';
import cn from 'classnames';
import { calculateScaleDimension } from '@app/helpers/calculateScaleDimension';

const SceneLoad: FC = observer(() => {
  const { progress, isReady, showLoadingScreen, setShowLoadingScreen } = useEditorStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const { width, height } = useWindowSize();

  const isDesktop = useMedia(screenSizes.mqDesktop, false);

  useEffect(() => {
    setShowLoadingScreen(true);
    setIsAnimating(false);
  }, []);

  const progressSize = useMemo(() => {
    return isDesktop ? 200 : 140;
  }, [isDesktop]);

  useEffect(() => {
    calculateScaleDimension(width, height, progressSize);
  }, [width, height, progressSize]);

  const loadingText = useMemo(() => {
    return !isReady && <div className={classNames.loading_text}>Loading...</div>;
  }, [isReady]);

  const startHandler = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    /**
     * need local state delay since unmounting node starts immediately
     */
    const timeOutRef = setTimeout(() => {
      setShowLoadingScreen(false);
    }, 1000);

    return () => {
      clearTimeout(timeOutRef);
    };
  }, [setShowLoadingScreen, isAnimating]);

  return (
    <Fade
      appear={false}
      enable={showLoadingScreen}
      timeout={800}
      customAnimationClassNames={{
        enter: classNames.fadeEnter,
        enterActive: classNames.fadeEnterActive,
        enterDone: classNames.fadeEnterDone,
        exit: classNames.fadeExit,
        exitActive: classNames.fadeExitActive,
        exitDone: classNames.fadeExitDone,
      }}
      unmountOnExit
      className={cn(classNames.fixedContainer, { [classNames.fade_container]: !showLoadingScreen })}
    >
      <div className={classNames.root}>
        <div className={classNames.title}>Cyberfox & Web3dev</div>
        <div className={classNames.image} />
        <CircularProgress
          size={progressSize}
          progress={progress}
          startAnimation={isAnimating}
        >
          {loadingText}
          <Fade
            enable={isReady}
            unmountOnExit
            mountOnEnter
          >
            <RoundButton
              onClick={startHandler}
              disabled={isAnimating}
            >
              <span className={classNames.button_text}>Start</span>
            </RoundButton>
          </Fade>
        </CircularProgress>
      </div>
      <ErrorModal />
    </Fade>
  );
});

export default SceneLoad;
