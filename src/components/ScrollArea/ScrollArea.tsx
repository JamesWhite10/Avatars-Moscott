import React, { FC, PropsWithChildren, useMemo } from 'react';
import classNames from './ScrollArea.module.scss';
import Fade from '@app/components/Transition/Fade';
import cn from 'classnames';

interface ScrollAreaProps {
  active?: boolean;
  total: number;
  columnSplitSize: number;
}

const ScrollArea: FC<PropsWithChildren<ScrollAreaProps>> = (props) => {
  const { active, columnSplitSize, total, children } = props;

  const needColumnSplit = useMemo(() => {
    return total > columnSplitSize;
  }, [total, columnSplitSize]);

  return (
    <Fade
      appear
      unmountOnExit
      enable={active}
      className={classNames.root}
    >
      <div
        className={cn(classNames.scrollWrapper, { [classNames.sizeContentStyles]: needColumnSplit })}
      >
        { children }
      </div>
    </Fade>
  );
};

export default ScrollArea;
