import React, { FC, MutableRefObject, useCallback, useRef } from 'react';
import { observer } from 'mobx-react';
import ScrollArea from '@app/components/ScrollArea';
import classNames from '@app/containers/Editor/containers/HeadPanel/HeadPanel.module.scss';
import Card from '@app/components/Card';
import { useBackgroundStore, usePanelsStore } from '@app/containers/Editor/hooks/useEditorStore';
import { useClickAway } from 'react-use';
import { BackgroundPart } from '@app/types';

const BackgroundPanel: FC = observer(() => {
  const { activePanelId } = usePanelsStore();
  const {
    backgrounds,
    activeBackground,
    onBackgroundChange,
    showBackgroundSelection,
    controlElement,
    setShowBackgroundSelection,
    isLoadingBackground,
    panelId,
  } = useBackgroundStore();

  const areaRef = useRef<HTMLDivElement>(null);
  useClickAway(areaRef as unknown as MutableRefObject<HTMLElement>, (e) => {
    if (!controlElement || !e.target || !showBackgroundSelection) return;
    if (!controlElement.contains(e.target as Node)) setShowBackgroundSelection(false);
  });

  const cardCLickHandler = useCallback((background: BackgroundPart) => {
    if (!isLoadingBackground) onBackgroundChange(background);
  }, [isLoadingBackground]);

  return (
    <ScrollArea
      active={showBackgroundSelection && activePanelId === panelId}
      total={backgrounds.length}
      columnSplitSize={9}
    >
      <div ref={areaRef}>
        {backgrounds.map((background) => (
          <div
            key={background.id}
            className={classNames.slideItem}
          >
            <Card
              contentType="image"
              image={background.image}
              active={background.id === activeBackground}
              onClick={() => cardCLickHandler(background)}
              isLoading={isLoadingBackground}
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
});

export default BackgroundPanel;
