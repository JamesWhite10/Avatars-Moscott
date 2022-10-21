import { FC, memo, useRef, useState } from 'react';
import classNames from './Spin.module.scss';
import { CSSTransition } from 'react-transition-group';
import { useDebounce } from 'react-use';
import SpinIcon from '@app/components/Icons/SpinIcon';
import cn from 'classnames';

export interface SpinProps {
  isActive?: boolean;
  indicatorSize?: number;
  indicatorWidth?: number;
  overlayBackgroundColor?: string;
  color?: string;
  /**
   * - stretch: absolute, растягивается по размерам родительского не static элемента
   * - fullscreen: fixed, растягивается по размерам родительского fixed или html элемента
   * - default: static, размеры считаются относительно размера лоадера
   */
  position?: 'stretch' | 'fullscreen' | 'default';
  transitionDelay?: number;
  borderRadius?: string | number;
}

const Spin: FC<SpinProps> = memo((props) => {
  const {
    isActive = false,
    indicatorSize = 24,
    position = 'default',
    overlayBackgroundColor = '#ffffff',
    color = '#517bff',
    transitionDelay = 100,
    borderRadius,
  } = props;

  const elRef = useRef<HTMLDivElement>(null);
  const [internalIsActive, setInternalIsActive] = useState<boolean>(isActive);
  useDebounce(() => setInternalIsActive(isActive), transitionDelay, [isActive]);

  const getRootStyles = (state: string) => ({
    display: state === 'exited' ? 'none' : 'flex',
    backgroundColor: overlayBackgroundColor,
    borderRadius,
  });

  const classNameByPosition = {
    stretch: classNames.root_stretch,
    fullscreen: classNames.root_fullscreen,
    default: classNames.root_default,
  };

  return (
    <CSSTransition
      in={internalIsActive}
      timeout={400}
      appear
      nodeRef={elRef}
      classNames={{
        enter: classNames.root_enter,
        enterActive: classNames.root_enterActive,
        exit: classNames.root_exit,
        exitActive: classNames.root_exitActive,
      }}
    >
      {(state) => (
        <div
          ref={elRef}
          className={cn(classNames.root, classNameByPosition[position])}
          style={getRootStyles(state)}
        >
          <SpinIcon
            className={classNames.spinner}
            width={indicatorSize}
            height={indicatorSize}
            fill={color}
          />
        </div>
      )}
    </CSSTransition>
  );
});

export default Spin;
