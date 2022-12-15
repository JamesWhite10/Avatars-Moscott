import React, { FC, useCallback } from 'react';
import { observer } from 'mobx-react';
import AnimationIcon from '@app/components/Icons/AnimationIcon';
import NavButton from '@app/components/NavButton';
import { useAnimationsStore, usePanelsStore } from '@app/containers/Editor/hooks/useEditorStore';
import useSoundSystem from '@app/hooks/useSoundSystem';

const AnimationsPanelNavItem: FC = observer(() => {
  const { activePanelId, setActivePanelType } = usePanelsStore();
  const { setShowAnimationSelection, setControlElement, panelId } = useAnimationsStore();
  const soundSystem = useSoundSystem();

  const animationsSelectHandler = useCallback(() => {
    soundSystem.playSound('click', true);
    if (activePanelId === 'animations') {
      setShowAnimationSelection(false);
      return;
    }
    setActivePanelType('animations');
  }, [activePanelId]);

  return (
    <div>
      <NavButton
        icon={<AnimationIcon />}
        ref={setControlElement}
        active={activePanelId === panelId}
        onClick={animationsSelectHandler}
        onMouseEnter={() => soundSystem.playSound('hover', true)}
      />
    </div>
  );
});

export default AnimationsPanelNavItem;
