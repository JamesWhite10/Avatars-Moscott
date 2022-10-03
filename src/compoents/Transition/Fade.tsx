import { FC, PropsWithChildren, useRef } from 'react';
import classNames from './Transition.module.scss';
import { CSSTransition } from 'react-transition-group';

export interface PageTransitionProps {
  onExited?: () => void;
  onEntered?: () => void;
  enable?: boolean;
  timeout?: number;
  appear?: boolean;
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
}

const Fade: FC<PropsWithChildren<PageTransitionProps>> = (props) => {
  const {
    onEntered = () => undefined,
    onExited = () => undefined,
    enable = true,
    timeout = 300,
    appear = true,
    mountOnEnter = false,
    unmountOnExit = false,
    children,
  } = props;
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <CSSTransition
      in={enable}
      timeout={timeout}
      onExited={onExited}
      nodeRef={nodeRef}
      onEntered={onEntered}
      mountOnEnter={mountOnEnter}
      unmountOnExit={unmountOnExit}
      appear={appear}
      classNames={{
        enter: classNames.root_FadeEnter,
        enterActive: classNames.root_FadeEnterActive,
        enterDone: classNames.root_FadeEnterDone,
        exit: classNames.root_FadeExit,
        exitActive: classNames.root_FadeExitActive,
        exitDone: classNames.root_FadeExitDone,
      }}
    >
      <div
        ref={nodeRef}
        className={classNames.fade_container}
      >
        {children}
      </div>
    </CSSTransition>
  );
};

export default Fade;
