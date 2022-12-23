import React, { FC, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react';
import EyesIcon from '@app/components/Icons/EyesIcon';
import NavButton from '@app/components/NavButton';
import { useAvatarStore, useEyeStore, usePanelsStore } from '@app/containers/Editor/hooks/useEditorStore';
import useSoundSystem from '@app/hooks/useSoundSystem';
import { AvatarPart } from '@app/types';

const EyePanelNavItem: FC = observer(() => {
  const { activePanelId, setActivePanelType } = usePanelsStore();
  const {
    setControlElement, showEyeSelection, setShowEyeSelection, isLoadingEye, panelId,
    setEyes,
  } = useEyeStore();

  const soundSystem = useSoundSystem();

  const { character } = useAvatarStore();

  useEffect(() => {
    const eyePart: AvatarPart[] = [];
    character?.parts.forEach((item) => {
      if (item.slots[1] === 'eye') {
        eyePart.push(item);
      }
    });
    setEyes(eyePart);
  }, [character]);

  const headSelectHandler = useCallback(() => {
    soundSystem.playSound('click', true);
    if (activePanelId === 'eye') {
      setShowEyeSelection(false);
      return;
    }
    setActivePanelType('eye');
  }, [activePanelId]);

  return (
    <NavButton
      icon={<EyesIcon />}
      ref={setControlElement}
      active={showEyeSelection && activePanelId === panelId}
      onClick={headSelectHandler}
      loading={isLoadingEye}
      onMouseEnter={() => soundSystem.playSound('hover', true)}
      disabled={isLoadingEye}
    />
  );
});

export default EyePanelNavItem;
