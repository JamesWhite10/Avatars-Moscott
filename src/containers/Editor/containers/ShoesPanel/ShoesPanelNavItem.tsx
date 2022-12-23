import React, { FC, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react';
import ShoesIcon from '@app/components/Icons/ShoesIcon';
import NavButton from '@app/components/NavButton';
import { useAvatarStore, usePanelsStore, useShoesStore } from '@app/containers/Editor/hooks/useEditorStore';
import useSoundSystem from '@app/hooks/useSoundSystem';
import { AvatarPart } from '@app/types';

const ShoesPanelNavItem: FC = observer(() => {
  const { activePanelId, setActivePanelType } = usePanelsStore();
  const {
    setControlElement, showShoesSelection, setShowShoesSelection, isLoadingShoes, panelId,
    setShoes,
  } = useShoesStore();

  const soundSystem = useSoundSystem();

  const { character } = useAvatarStore();

  useEffect(() => {
    const shoesPart: AvatarPart[] = [];
    character?.parts.forEach((item) => {
      if (item.slots[0] === 'shoes') shoesPart.push(item);
    });
    setShoes(shoesPart);
  }, [character]);

  const headSelectHandler = useCallback(() => {
    soundSystem.playSound('click', true);
    if (activePanelId === 'shoes') {
      setShowShoesSelection(false);
      return;
    }
    setActivePanelType('shoes');
  }, [activePanelId]);

  return (
    <NavButton
      icon={<ShoesIcon />}
      ref={setControlElement}
      active={showShoesSelection && activePanelId === panelId}
      onClick={headSelectHandler}
      loading={isLoadingShoes}
      onMouseEnter={() => soundSystem.playSound('hover', true)}
      disabled={isLoadingShoes}
    />
  );
});

export default ShoesPanelNavItem;
