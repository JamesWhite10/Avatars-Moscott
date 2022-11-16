import { FC, useCallback, useMemo } from 'react';
import { observer } from 'mobx-react';
import Button from '@app/components/Button';
import classNames from './RightControls.module.scss';
import { useAnimationStore, useControlsStore } from '@app/containers/Editor/hooks/useEditorStore';
import useSoundSystem from '@app/hooks/useSoundSystem';
import Animations from '@app/containers/Editor/containers/RightControls/Animations';
import { useMedia } from 'react-use';
import variables from '../../../../../styles/media.module.scss';

const RightControls: FC = observer(() => {
  const { activeProperty, setActiveAvatarPropertyType } = useControlsStore();
  const { setShowAnimationSelection, setControlElement, showAnimationSelection } = useAnimationStore();
  const soundSystem = useSoundSystem();
  const isMobile = useMedia(`(max-width: ${variables.mqMobileMax})`);
  const showAnimationButton = useMemo(() => {
    return !(isMobile && showAnimationSelection);
  }, [showAnimationSelection, isMobile]);

  const animationsSelectHandler = useCallback(() => {
    soundSystem.playSound('click', true);
    if (activeProperty === 'animations') {
      setShowAnimationSelection(false);
      return;
    }
    setActiveAvatarPropertyType('animations');
  }, [activeProperty]);

  return (
    <div className={classNames.root}>
      <div className={classNames.control}>
        {showAnimationButton && (
          <Button
            className={classNames.controlButton}
            ref={setControlElement}
            active={activeProperty === 'animations'}
            onClick={animationsSelectHandler}
            onMouseEnter={() => soundSystem.playSound('hover', true)}
          >
            Animation
          </Button>
        )}
      </div>
      {!isMobile && <Animations /> }
    </div>
  );
});

export default RightControls;
