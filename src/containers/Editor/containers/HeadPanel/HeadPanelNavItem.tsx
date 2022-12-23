import React, { FC, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react';
import NavButton from '@app/components/NavButton';
import HairstyleIcon from '@app/components/Icons/HairstyleIcon';
import { useAvatarStore, useHeadStore, usePanelsStore } from '@app/containers/Editor/hooks/useEditorStore';
import useSoundSystem from '@app/hooks/useSoundSystem';
import { AvatarPart } from '@app/types';

const HeadPanelNavItem: FC = observer(() => {
  const { activePanelId, setActivePanelType } = usePanelsStore();
  const {
    setControlElement, showHeadSelection, setShowHeadSelection, isLoadingHead, panelId,
    setHeads,
  } = useHeadStore();

  const soundSystem = useSoundSystem();

  const { character } = useAvatarStore();

  useEffect(() => {
    const headsHair: AvatarPart[] = [];
    character?.parts.forEach((item) => {
      if (item.slots[0] === 'hair') headsHair.push(item);
    });
    setHeads(headsHair);
  }, [character]);

  const headSelectHandler = useCallback(() => {
    soundSystem.playSound('click', true);
    if (activePanelId === 'head') {
      setShowHeadSelection(false);
      return;
    }
    setActivePanelType('head');
  }, [activePanelId]);

  return (
    <NavButton
      icon={<HairstyleIcon />}
      ref={setControlElement}
      active={showHeadSelection && activePanelId === panelId}
      onClick={headSelectHandler}
      loading={isLoadingHead}
      onMouseEnter={() => soundSystem.playSound('hover', true)}
      disabled={isLoadingHead}
    />
  );
});

export default HeadPanelNavItem;
