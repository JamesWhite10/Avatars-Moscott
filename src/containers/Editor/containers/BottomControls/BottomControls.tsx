import { FC, useCallback, useMemo } from 'react';
import { observer } from 'mobx-react';
import classNames from './BottomControls.module.scss';
import Styles from './Styles';
import { useMedia } from 'react-use';
import variables from '../../../../../styles/media.module.scss';
import Button from '@app/components/Button';
import { useControlsStore, useStyleStore } from '@app/containers/Editor/hooks/useEditorStore';
import Characters from '@app/containers/Editor/containers/BottomControls/Characters';

const BottomControls: FC = observer(() => {
  const { activeProperty, setActiveAvatarPropertyType } = useControlsStore();
  const { setControlElement, showStyleSelection, setShowStyleSelection } = useStyleStore();
  const isMobile = useMedia(`(max-width: ${variables.mqMobileMax})`);

  const needShowCloseButton = useMemo(() => {
    if (!isMobile) return false;
    return activeProperty && activeProperty !== 'character';
  }, [isMobile, activeProperty]);

  const styleSelectHandler = useCallback(() => {
    if (activeProperty === 'style') {
      setShowStyleSelection(false);
      return;
    }
    setActiveAvatarPropertyType('style');
  }, [activeProperty]);

  const closeButtonHandler = useCallback(() => {
    if (activeProperty === 'style') setShowStyleSelection(false);
  }, [activeProperty]);

  return (
    <div className={classNames.root}>
      <Styles />
      <Characters />
      <div className={classNames.centerContainer}>
        {needShowCloseButton ? (
          <Button
            ref={setControlElement}
            onClick={closeButtonHandler}
          >
            Ok
          </Button>
        ) : (
          <Button
            ref={setControlElement}
            active={showStyleSelection}
            onClick={styleSelectHandler}
          >
            Style
          </Button>
        )}
      </div>
    </div>
  );
});

export default BottomControls;
