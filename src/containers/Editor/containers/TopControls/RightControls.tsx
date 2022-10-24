import { FC, useCallback, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react';
import classNames from './TopControls.module.scss';
import IconButton from '@app/components/IconButton';
import { FullScreenExitIcon, FullScreenIcon, MusicIcon, MusicOffIcon, ScreenShotIcon } from '@app/components/Icons';
import { useControlsStore } from '@app/containers/Editor/hooks/useEditorStore';
import useSoundSystem from '@app/hooks/useSoundSystem';

const RightControls: FC = observer(() => {
  const {
    soundDisabled,
    fullScreenMode,
    onFullScreenChange,
    onSoundChange,
    setFullScreenMode,
    onTakeScreenShot,
  } = useControlsStore();

  const soundSystem = useSoundSystem();

  const fullScreenIcon = useMemo(() => {
    return fullScreenMode ? <FullScreenExitIcon /> : <FullScreenIcon />;
  }, [fullScreenMode]);

  const musicIcon = useMemo(() => {
    return soundDisabled ? <MusicOffIcon /> : <MusicIcon />;
  }, [soundDisabled]);

  const fullScreenHandler = useCallback(() => {
    soundSystem.playSound('click');
    onFullScreenChange();
  }, [onFullScreenChange, soundSystem]);

  const screenShotHandler = useCallback(() => {
    soundSystem.playSound('click');
    onTakeScreenShot();
  }, [onTakeScreenShot, soundSystem]);

  useEffect(() => {
    const handler = () => {
      if (!document.fullscreenElement) { setFullScreenMode(false); }
    };
    if (!fullScreenMode) {
      document.removeEventListener('fullscreenchange', handler);
      return;
    }
    document.addEventListener('fullscreenchange', handler);

    return () => document.removeEventListener('fullscreenchange', handler);
  }, [fullScreenMode]);

  return (
    <div className={classNames.rightGroup}>
      <IconButton
        className={classNames.fullScreenButton}
        active={fullScreenMode}
        onClick={fullScreenHandler}
        onMouseEnter={() => soundSystem.playSound('hover', true)}
      >
        { fullScreenIcon }
      </IconButton>
      <IconButton
        active={soundDisabled}
        onClick={onSoundChange}
      >
        { musicIcon }
      </IconButton>
      <IconButton
        onClick={screenShotHandler}
        onMouseEnter={() => soundSystem.playSound('hover', true)}
      >
        <ScreenShotIcon />
      </IconButton>
    </div>
  );
});

export default RightControls;
