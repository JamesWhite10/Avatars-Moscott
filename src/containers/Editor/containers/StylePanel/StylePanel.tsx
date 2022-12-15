import { FC, MutableRefObject, useCallback, useRef } from 'react';
import { observer } from 'mobx-react';
import { usePanelsStore, useStyleStore } from '@app/containers/Editor/hooks/useEditorStore';
import { useClickAway } from 'react-use';
import { Style } from '@app/types';
import ScrollArea from '@app/components/ScrollArea';
import classNames from './StylePanel.module.scss';
import Card from '@app/components/Card';

const StylePanel: FC = observer(() => {
  const { activePanelId } = usePanelsStore();
  const {
    activeStyle,
    styles,
    onStyleChange,
    showStyleSelection,
    controlElement,
    setShowStyleSelection,
    isLoadingStyle,
    panelId,
  } = useStyleStore();

  const areaRef = useRef<HTMLDivElement>(null);
  useClickAway(areaRef as unknown as MutableRefObject<HTMLElement>, (e) => {
    if (!controlElement || !e.target || !showStyleSelection) return;
    if (!controlElement.contains(e.target as Node)) setShowStyleSelection(false);
  });

  const cardCLickHandler = useCallback((style: Style) => {
    if (!isLoadingStyle) onStyleChange(style.id);
  }, [isLoadingStyle]);

  return (
    <ScrollArea
      active={showStyleSelection && activePanelId === panelId}
      total={styles.length}
      columnSplitSize={9}
    >
      <div ref={areaRef}>
        {styles.map((style) => (
          <div
            key={style.id}
            className={classNames.slideItem}
          >
            <Card
              contentType="video"
              active={style.id === activeStyle}
              video={style.videoUrl}
              onClick={() => cardCLickHandler(style)}
              isLoading={isLoadingStyle}
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
});

export default StylePanel;
