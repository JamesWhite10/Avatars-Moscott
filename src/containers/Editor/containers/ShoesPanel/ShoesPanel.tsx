import React, { FC, MutableRefObject, useCallback, useRef } from 'react';
import { observer } from 'mobx-react';
import ScrollArea from '@app/components/ScrollArea';
import classNames from '@app/containers/Editor/containers/HeadPanel/HeadPanel.module.scss';
import Card from '@app/components/Card';
import { usePanelsStore, useShoesStore } from '@app/containers/Editor/hooks/useEditorStore';
import { useClickAway } from 'react-use';
import { AvatarPart } from '@app/types';

const ShoesPanel: FC = observer(() => {
  const { activePanelId } = usePanelsStore();
  const {
    shoes,
    activeShoes,
    onShoesChange,
    showShoesSelection,
    controlElement,
    setShowShoesSelection,
    isLoadingShoes,
    panelId,
  } = useShoesStore();

  const areaRef = useRef<HTMLDivElement>(null);
  useClickAway(areaRef as unknown as MutableRefObject<HTMLElement>, (e) => {
    if (!controlElement || !e.target || !showShoesSelection) return;
    if (!controlElement.contains(e.target as Node)) setShowShoesSelection(false);
  });

  const cardCLickHandler = useCallback((shoe: AvatarPart) => {
    if (!isLoadingShoes) onShoesChange(shoe);
  }, [isLoadingShoes]);

  return (
    <ScrollArea
      active={showShoesSelection && activePanelId === panelId}
      total={shoes.length}
      columnSplitSize={9}
    >
      <div ref={areaRef}>
        {shoes.map((shoe) => (
          <div
            key={shoe.id}
            className={classNames.slideItem}
          >
            <Card
              contentType="image"
              image={shoe.image}
              active={shoe.id === activeShoes}
              onClick={() => cardCLickHandler(shoe)}
              isLoading={isLoadingShoes}
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
});

export default ShoesPanel;
