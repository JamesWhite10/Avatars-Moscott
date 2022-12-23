import React, { FC, useCallback } from 'react';
import { observer } from 'mobx-react';
import NavButton from '@app/components/NavButton';
import BackgroundIcon from '@app/components/Icons/BackgroundIcon';
import {
  useBackgroundStore,
  usePanelsStore,
} from '@app/containers/Editor/hooks/useEditorStore';
import useSoundSystem from '@app/hooks/useSoundSystem';

const BackgroundPanelNavItem: FC = observer(() => {
  const { activePanelId, setActivePanelType } = usePanelsStore();
  const {
    setControlElement, showBackgroundSelection, setShowBackgroundSelection, isLoadingBackground, panelId,
  } = useBackgroundStore();

  const soundSystem = useSoundSystem();

  const headSelectHandler = useCallback(() => {
    soundSystem.playSound('click', true);
    if (activePanelId === 'background') {
      setShowBackgroundSelection(false);
      return;
    }
    setActivePanelType('background');
  }, [activePanelId]);

  return (
    <NavButton
      icon={<BackgroundIcon />}
      ref={setControlElement}
      active={showBackgroundSelection && activePanelId === panelId}
      onClick={headSelectHandler}
      loading={isLoadingBackground}
      onMouseEnter={() => soundSystem.playSound('hover', true)}
      disabled={isLoadingBackground}
    />
  );
});

export default BackgroundPanelNavItem;
