import React, { FC, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react';
import NavButton from '@app/components/NavButton';
import CostumeIcon from '@app/components/Icons/CostumeIcon';
import { useAvatarStore, useBodyStore, usePanelsStore } from '@app/containers/Editor/hooks/useEditorStore';
import useSoundSystem from '@app/hooks/useSoundSystem';
import { AvatarPart } from '@app/types';

const BodyPanelNavItem: FC = observer(() => {
  const { activePanelId, setActivePanelType } = usePanelsStore();
  const {
    setControlElement, showBodySelection, setShowBodySelection, isLoadingBody, panelId,
    setBodies,
  } = useBodyStore();

  const soundSystem = useSoundSystem();

  const { character } = useAvatarStore();

  useEffect(() => {
    const bodyPart: AvatarPart[] = [];
    character?.parts.forEach((item) => {
      if (item.slots[0] === 'costume') bodyPart.push(item);
    });
    setBodies(bodyPart);
  }, [character]);

  const headSelectHandler = useCallback(() => {
    soundSystem.playSound('click', true);
    if (activePanelId === 'body') {
      setShowBodySelection(false);
      return;
    }
    setActivePanelType('body');
  }, [activePanelId]);
  return (
    <NavButton
      icon={<CostumeIcon />}
      ref={setControlElement}
      active={showBodySelection && activePanelId === panelId}
      onClick={headSelectHandler}
      loading={isLoadingBody}
      onMouseEnter={() => soundSystem.playSound('hover', true)}
      disabled={isLoadingBody}
    />
  );
});

export default BodyPanelNavItem;
