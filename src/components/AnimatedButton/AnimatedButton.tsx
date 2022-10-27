import { FC, PropsWithChildren, useMemo } from 'react';
import classNames from './AnimatedButton.module.scss';
import { PlayIcon, PauseIcon } from '../Icons';
import cn from 'classnames';

export interface AnimatedButtonProps {
  onClick?: () => void;
  onMouseEnter?: () => void;
  active?: boolean;
  progress: number;
}

const AnimatedButton: FC<PropsWithChildren<AnimatedButtonProps>> = (props) => {
  const {
    onClick = () => undefined,
    onMouseEnter = () => undefined,
    active = false,
    progress = 0,
    children,
  } = props;

  const icon = useMemo(() => {
    return active ? <PauseIcon className={classNames.icon} /> : <PlayIcon className={classNames.icon} />;
  }, [active]);

  return (
    <button
      className={cn(classNames.root, { [classNames.active]: active })}
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <div className={classNames.content}>
        <div className={classNames.title}>
          { children }
        </div>
        <div className={classNames.icon}>
          {icon}
        </div>
      </div>
      <span
        className={classNames.track}
        style={{ transform: `translateX(${progress}%)` }}
      />
    </button>
  );
};

export default AnimatedButton;
