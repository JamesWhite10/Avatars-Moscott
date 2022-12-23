import React, { FC, MutableRefObject, useCallback, useRef } from 'react';
import { observer } from 'mobx-react';
import { useHeadStore, usePanelsStore } from '@app/containers/Editor/hooks/useEditorStore';
import { useClickAway } from 'react-use';
import { AvatarPart } from '@app/types';
import ScrollArea from '@app/components/ScrollArea';
import classNames from './HeadPanel.module.scss';
import Card from '@app/components/Card';

const HeadPanel: FC = observer(() => {
  const { activePanelId } = usePanelsStore();
  const {
    heads,
    activeHead,
    onHeadChange,
    showHeadSelection,
    controlElement,
    setShowHeadSelection,
    isLoadingHead,
    panelId,
  } = useHeadStore();

  const areaRef = useRef<HTMLDivElement>(null);
  useClickAway(areaRef as unknown as MutableRefObject<HTMLElement>, (e) => {
    if (!controlElement || !e.target || !showHeadSelection) return;
    if (!controlElement.contains(e.target as Node)) setShowHeadSelection(false);
  });

  const cardCLickHandler = useCallback((head: AvatarPart) => {
    if (!isLoadingHead) onHeadChange(head);
  }, [isLoadingHead]);

  return (
    <ScrollArea
      active={showHeadSelection && activePanelId === panelId}
      total={heads.length}
      columnSplitSize={9}
    >
      <div ref={areaRef}>
        {heads.map((head) => (
          <div
            key={head.id}
            className={classNames.slideItem}
          >
            <Card
              contentType="image"
              image={head.image}
              active={head.id === activeHead}
              onClick={() => cardCLickHandler(head)}
              isLoading={isLoadingHead}
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
});

export default HeadPanel;
