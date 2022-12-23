import React, { FC, useCallback, useMemo } from 'react';
import { observer } from 'mobx-react';
import AvatarIcon from '@app/components/Icons/AvatarIcon';
import NavButton from '@app/components/NavButton';
import { useAvatarStore, usePanelsStore, useStyleStore } from '@app/containers/Editor/hooks/useEditorStore';
import useSoundSystem from '@app/hooks/useSoundSystem';

const AvatarPanelNavItem: FC = observer(() => {
  const { setActivePanelType, activePanelId } = usePanelsStore();
  const { isLoadingStyle } = useStyleStore();
  const {
    isPrepared,
    character,
    characterIsChanging,
    showCharacterSelection,
    setControlElement,
    panelId,
  } = useAvatarStore();
  const soundSystem = useSoundSystem();

  const characterSelectHandler = useCallback(() => {
    if (!characterIsChanging) {
      soundSystem.playSound('click', true);
      setActivePanelType('avatar');
    }
  }, [activePanelId, characterIsChanging]);

  const showCharacterButton = useMemo(() => {
    return isPrepared && character;
  }, [isPrepared, character]);

  if (!character) return null;

  return (
    <NavButton
      icon={<AvatarIcon />}
      active={showCharacterSelection && activePanelId === panelId}
      onClick={characterSelectHandler}
      onMouseEnter={() => soundSystem.playSound('hover', true)}
      loading={characterIsChanging}
      ref={setControlElement}
      disabled={!showCharacterButton || isLoadingStyle}
    />
  );
});

export default AvatarPanelNavItem;
