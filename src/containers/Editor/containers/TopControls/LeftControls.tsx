import { FC, useMemo } from 'react';
import { observer } from 'mobx-react';
import classNames from './TopControls.module.scss';
import { useControlsStore } from '@app/containers/Editor/hooks/useEditorStore';
import { useMedia } from 'react-use';
import variables from '../../../../../styles/media.module.scss';
import Button from '@app/components/Button';
import useSoundSystem from '@app/hooks/useSoundSystem';

const LeftControls: FC = observer(() => {
  const { isOpen } = useControlsStore();
  const isMobile = useMedia(`(max-width: ${variables.mqMobileMax}`);
  const soundSystem = useSoundSystem();

  const buttonSize = useMemo(() => {
    return isMobile ? 'md' : 'lg';
  }, [isMobile]);

  const clickHandler = () => {
    soundSystem.playSound('click', true);
    isOpen(true);
  };

  return (
    <div className={classNames.leftGroup}>
      <Button
        size={buttonSize}
        onClick={clickHandler}
        onMouseEnter={() => soundSystem.playSound('hover', true)}
      >
        About
      </Button>
    </div>
  );
});

export default LeftControls;
