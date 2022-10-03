import { FC, useMemo } from 'react';
import classNames from './SceneLoad.module.scss';
import CircularProgress from '@app/compoents/CircularProgress';
import RoundButton from '@app/compoents/RoundButton';
import Fade from '@app/compoents/Transition/Fade';
import { useMedia } from 'react-use';
import { screenSizes } from '@app/config/media';
import { observer } from 'mobx-react';
import useEditorStore from '@app/containers/Editor/hooks/useEditorStore';

const SceneLoad: FC = observer(() => {
  const { progress, isReady, showLoadingScreen, setShowLoadingScreen } = useEditorStore();

  const isDesktop = useMedia(screenSizes.mqDesktop, false);

  const progressSize = useMemo(() => {
    return isDesktop ? 180 : 120;
  }, [isDesktop]);

  const loadingText = useMemo(() => {
    return !isReady && <div className={classNames.loading_text}>Loading...</div>;
  }, [isReady]);

  return (
    <Fade
      appear
      enable={showLoadingScreen}
      unmountOnExit
    >
      <div className={classNames.root}>
        <div className={classNames.title}>Cyberfox & Web3dev</div>
        <div className={classNames.image} />
        <CircularProgress
          size={progressSize}
          progress={progress}
        >
          {loadingText}
          <Fade
            enable={isReady}
            unmountOnExit
            mountOnEnter
          >
            <RoundButton
              onClick={() => setShowLoadingScreen(false)}
            >
              <span className={classNames.button_text}>Start</span>
            </RoundButton>
          </Fade>
        </CircularProgress>
      </div>
    </Fade>

  );
});

export default SceneLoad;
