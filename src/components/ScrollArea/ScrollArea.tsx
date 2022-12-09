import React, { FC, PropsWithChildren } from 'react';
import classNames from './ScrollArea.module.scss';
import Fade from '@app/components/Transition/Fade';
import cn from 'classnames';
import { ContentSize } from '@app/components/Card/Card';

interface ScrollAreaProps {
  active?: boolean;
  content?: Array<any>;
  contentSize?: ContentSize;
}

const ScrollArea: FC<PropsWithChildren<ScrollAreaProps>> = (props) => {
  const { active, contentSize, content, children } = props;
  const largeContent = content && content.length > 9 && contentSize === 'lg';
  const smallContent = content && content.length > 5 && contentSize === 'sm';

  return (
    <Fade
      appear
      unmountOnExit
      enable={active}
      className={classNames.root}
    >
      <div
        className={cn(classNames.scrollWrapper, { [classNames.sizeContentStyles]: largeContent || smallContent })}
      >
        { children }
      </div>
    </Fade>
  );
};

export default ScrollArea;
