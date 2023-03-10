import React, { FC, MutableRefObject, useCallback, useMemo, useRef } from 'react';
import { observer } from 'mobx-react';
import { useEyeStore, usePanelsStore } from '@app/containers/Editor/hooks/useEditorStore';
import { useClickAway } from 'react-use';
import ScrollArea from '@app/components/ScrollArea';
import classNames from '@app/containers/Editor/containers/HeadPanel/HeadPanel.module.scss';
import Card from '@app/components/Card';

const EyePanel: FC = observer(() => {
  const { activePanelId } = usePanelsStore();
  const {
    eyes,
    activeEye,
    onEyeChange,
    showEyeSelection,
    controlElement,
    setShowEyeSelection,
    isLoadingEye,
    panelId,
  } = useEyeStore();

  const areaRef = useRef<HTMLDivElement>(null);
  useClickAway(areaRef as unknown as MutableRefObject<HTMLElement>, (e) => {
    if (!controlElement || !e.target || !showEyeSelection) return;
    if (!controlElement.contains(e.target as Node)) setShowEyeSelection(false);
  });

  const cardCLickHandler = useCallback((eye: string) => {
    if (!isLoadingEye) onEyeChange(eye);
  }, [isLoadingEye]);

  const eyesTexture = useMemo(() => {
    const texture: string[] = [];
    eyes.forEach((eye) => {
      if (eye.texturesMap) {
        Object.keys(eye.texturesMap).forEach((item) => {
          if (item.includes('eyes')) texture.push(eye.texturesMap[item]);
        });
      }
    });
    return texture;
  }, [eyes]);

  return (
    <ScrollArea
      active={showEyeSelection && activePanelId === panelId}
      total={eyes.length}
      columnSplitSize={9}
    >
      <div ref={areaRef}>
        {eyesTexture.map((eye) => {
          return (
            <div
              key={eye}
              className={classNames.slideItem}
            >
              <Card
                contentType="image"
                image={eye}
                active={eye === activeEye}
                onClick={() => cardCLickHandler(eye)}
                isLoading={isLoadingEye}
              />
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
});

export default EyePanel;
