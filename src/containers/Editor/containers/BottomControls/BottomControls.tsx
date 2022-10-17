import { FC, useCallback, useMemo, useRef } from 'react';
import { observer } from 'mobx-react';
import classNames from './BottomControls.module.scss';
import Styles from './Styles';
import { useMedia } from 'react-use';
import variables from '../../../../../styles/media.module.scss';
import Button from '@app/components/Button';
import useEditorStore from '@app/containers/Editor/hooks/useEditorStore';

const BottomControls: FC = observer(() => {
  const { activeProperty, setActiveAvatarPropertyType } = useEditorStore().controlsStore;
  const isMobile = useMedia(`(max-width: ${variables.mqMoblileMax})`);
  const styleButtonRef = useRef<HTMLButtonElement>(null);

  const needShowCloseButton = useMemo(() => {
    if (!isMobile) return false;
    return activeProperty && activeProperty !== 'character';
  }, [isMobile, activeProperty]);

  const closeHandler = useCallback((e: Event) => {
    if (!styleButtonRef.current || !e.target) return;
    if (!styleButtonRef.current.contains(e.target as Node)) setActiveAvatarPropertyType();
  }, [styleButtonRef]);

  const styleButtonIsActive = useMemo(() => {
    return activeProperty === 'style';
  }, [activeProperty]);

  const styleSelectHandler = useCallback(() => {
    setActiveAvatarPropertyType(activeProperty === 'style' ? undefined : 'style');
  }, [activeProperty]);

  return (
    <div className={classNames.root}>
      <Styles onClose={closeHandler} />
      <div className={classNames.centerContainer}>
        {needShowCloseButton ? (
          <Button onClick={() => setActiveAvatarPropertyType()}>
            Ok
          </Button>
        ) : (
          <Button
            ref={styleButtonRef}
            active={styleButtonIsActive}
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
