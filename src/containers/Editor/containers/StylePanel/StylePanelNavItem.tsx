import React, { FC, useCallback } from 'react';
import { observer } from 'mobx-react';
import StyleIcon from '@app/components/Icons/StyleIcon';
import NavButton from '@app/components/NavButton';
import { useAvatarStore, usePanelsStore, useStyleStore } from '@app/containers/Editor/hooks/useEditorStore';

import useSoundSystem from '@app/hooks/useSoundSystem';

const StylePanelNavItem: FC = observer(() => {
  const { activePanelId, setActivePanelType } = usePanelsStore();
  const { characterIsChanging } = useAvatarStore();
  const {
    setControlElement, showStyleSelection, setShowStyleSelection, isLoadingStyle, styles, panelId,
  } = useStyleStore();

  const soundSystem = useSoundSystem();

  const styleSelectHandler = useCallback(() => {
    soundSystem.playSound('click', true);
    if (activePanelId === 'style') {
      setShowStyleSelection(false);
      return;
    }
    setActivePanelType('style');
  }, [activePanelId]);

  return (
    <NavButton
      icon={<StyleIcon />}
      ref={setControlElement}
      active={showStyleSelection && activePanelId === panelId}
      onClick={styleSelectHandler}
      loading={isLoadingStyle}
      onMouseEnter={() => soundSystem.playSound('hover', true)}
      disabled={!styles || characterIsChanging}
    />
  );
});

export default StylePanelNavItem;
