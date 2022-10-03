import { FC, PropsWithChildren } from 'react';
import {
  TransitionGroup as CssTransitionGroup,
} from 'react-transition-group';

export interface TransitionGroupProps {
  enter?: boolean;
  exit?: boolean;
  appear?: boolean;
  className?: string;
}

const TransitionGroup: FC<PropsWithChildren<TransitionGroupProps>> = (props) => {
  const {
    enter = true,
    exit = true,
    appear = true,
    className,
    children,
  } = props;
  return (
    <CssTransitionGroup
      enter={enter}
      exit={exit}
      appear={appear}
      className={className}
    >
      {children}
    </CssTransitionGroup>
  );
};

export default TransitionGroup;
