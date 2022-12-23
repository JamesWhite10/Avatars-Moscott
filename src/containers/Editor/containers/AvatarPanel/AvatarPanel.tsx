import { FC, MutableRefObject, useRef } from 'react';
import { observer } from 'mobx-react';
import classNames from './AvatarPanel.module.scss';
import Card from '@app/components/Card';
import { useAvatarStore, usePanelsStore } from '@app/containers/Editor/hooks/useEditorStore';
import { useClickAway } from 'react-use';
import ScrollArea from '@app/components/ScrollArea/ScrollArea';

const AvatarPanel: FC = observer(() => {
  const { activePanelId } = usePanelsStore();
  const {
    isPrepared,
    showCharacterSelection,
    onCharacterChange,
    character,
    characters,
    setShowCharacterSelection,
    controlElement,
    panelId,
  } = useAvatarStore();

  const areaRef = useRef<HTMLDivElement>(null);
  useClickAway(areaRef as unknown as MutableRefObject<HTMLElement>, (e) => {
    if (!controlElement || !e.target || !showCharacterSelection) return;
    if (!controlElement.contains(e.target as Node)) {
      setShowCharacterSelection(false);
    }
  });

  if (!isPrepared) return null;

  return (
    <ScrollArea
      active={showCharacterSelection && activePanelId === panelId}
      total={characters.length}
      columnSplitSize={2}
      onClick={() => setShowCharacterSelection(false)}
    >
      <div ref={areaRef}>
        {characters.map((_character) => (
          <div
            key={_character.id}
            className={classNames.slideItem}
          >
            <Card
              contentType="image"
              active={_character.id === character?.id}
              image={_character.image}
              label={_character.name}
              onClick={() => onCharacterChange(_character.id)}
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
});

export default AvatarPanel;
