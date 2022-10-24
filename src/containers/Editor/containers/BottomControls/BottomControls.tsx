import { FC, useCallback, useMemo } from 'react';
import { observer } from 'mobx-react';
import classNames from './BottomControls.module.scss';
import Styles from './Styles';
import { useMedia } from 'react-use';
import variables from '../../../../../styles/media.module.scss';
import Button from '@app/components/Button';
import { useControlsStore, useStyleStore } from '@app/containers/Editor/hooks/useEditorStore';
import Characters from '@app/containers/Editor/containers/BottomControls/Characters';
import useSoundSystem from '@app/hooks/useSoundSystem';

const BottomControls: FC = observer(() => {
  const { activeProperty, setActiveAvatarPropertyType } = useControlsStore();
  const { setControlElement, showStyleSelection, setShowStyleSelection } = useStyleStore();
  const isMobile = useMedia(`(max-width: ${variables.mqMobileMax})`);
  const soundSystem = useSoundSystem();

  const needShowCloseButton = useMemo(() => {
    if (!isMobile) return false;
    return activeProperty && activeProperty !== 'character';
  }, [isMobile, activeProperty]);

  const styleSelectHandler = useCallback(() => {
    soundSystem.playSound('click', true);
    if (activeProperty === 'style') {
      setShowStyleSelection(false);
      return;
    }
    setActiveAvatarPropertyType('style');
  }, [activeProperty]);

  const closeButtonHandler = useCallback(() => {
    soundSystem.playSound('click', true);
    if (activeProperty === 'style') setShowStyleSelection(false);
  }, [activeProperty, soundSystem]);

  return (
    <div className={classNames.root}>
      <Styles />
      <Characters />
      <div className={classNames.centerContainer}>
        {needShowCloseButton ? (
          <Button
            ref={setControlElement}
            onClick={closeButtonHandler}
            onMouseEnter={() => soundSystem.playSound('hover', true)}
          >
            Ok
          </Button>
        ) : (
          <Button
            ref={setControlElement}
            active={showStyleSelection}
            onClick={styleSelectHandler}
            onMouseEnter={() => soundSystem.playSound('hover', true)}
          >
            Style
          </Button>
        )}
      </div>
    </div>
  );
});

export default BottomControls;
