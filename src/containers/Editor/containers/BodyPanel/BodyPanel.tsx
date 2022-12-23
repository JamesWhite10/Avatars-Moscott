import React, { FC, MutableRefObject, useCallback, useRef } from 'react';
import { observer } from 'mobx-react';
import classNames from '@app/containers/Editor/containers/HeadPanel/HeadPanel.module.scss';
import Card from '@app/components/Card';
import ScrollArea from '@app/components/ScrollArea';
import { useBodyStore, usePanelsStore } from '@app/containers/Editor/hooks/useEditorStore';
import { useClickAway } from 'react-use';
import { AvatarPart } from '@app/types';

const BodyPanel: FC = observer(() => {
  const { activePanelId } = usePanelsStore();
  const {
    bodies, activeBody, controlElement, onBodyChange, showBodySelection, setShowBodySelection, isLoadingBody, panelId,
  } = useBodyStore();

  const areaRef = useRef<HTMLDivElement>(null);
  useClickAway(areaRef as unknown as MutableRefObject<HTMLElement>, (e) => {
    if (!controlElement || !e.target || !showBodySelection) return;
    if (!controlElement.contains(e.target as Node)) setShowBodySelection(false);
  });

  const cardCLickHandler = useCallback((body: AvatarPart) => {
    if (!isLoadingBody) onBodyChange(body);
  }, [isLoadingBody]);

  return (
    <ScrollArea
      active={showBodySelection && activePanelId === panelId}
      total={bodies.length}
      columnSplitSize={9}
    >
      <div ref={areaRef}>
        {bodies.map((body) => (
          <div
            key={body.id}
            className={classNames.slideItem}
          >
            <Card
              contentType="image"
              image={body.image}
              active={body.id === activeBody}
              onClick={() => cardCLickHandler(body)}
              isLoading={isLoadingBody}
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
});

export default BodyPanel;
