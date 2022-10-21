import { FC, useCallback, useMemo } from 'react';
import { observer } from 'mobx-react';
import classNames from './TopControls.module.scss';
import CharacterSelectButton from '@app/components/CharacterSelectButton';
import { useCharacterStore, useControlsStore } from '@app/containers/Editor/hooks/useEditorStore';
import { useMedia } from 'react-use';
import variables from '../../../../../styles/media.module.scss';
import Button from '@app/components/Button';

const LeftControls: FC = observer(() => {
  const { setActiveAvatarPropertyType, activeProperty } = useControlsStore();
  const { isPrepared, character, characterIsChanging, showCharacterSelection, setControlElement } = useCharacterStore();
  const isMobile = useMedia(`(max-width: ${variables.mqMobileMax}`);

  const characterSelectHandler = useCallback(() => {
    setActiveAvatarPropertyType('character');
  }, [activeProperty]);

  const buttonSize = useMemo(() => {
    return isMobile ? 'md' : 'lg';
  }, [isMobile]);

  const showCharacterButton = useMemo(() => {
    return isPrepared && character;
  }, [isPrepared, character]);

  if (!character) return null;

  return (
    <div className={classNames.leftGroup}>
      {showCharacterButton && <CharacterSelectButton
        ref={setControlElement}
        icon={character.icon}
        active={showCharacterSelection}
        loading={characterIsChanging}
        size={buttonSize}
        name={character.name}
        description={character.description}
        onClick={characterSelectHandler}
      />}
      <Button size={buttonSize}>
        About
      </Button>
    </div>
  );
});

export default LeftControls;
