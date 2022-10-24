import React, { useMemo } from 'react';
import classNames from './Hint.module.scss';
import Fade from '@app/components/Transition/Fade';

export type HintType = 'error' | 'info';

export interface HintProps {
  text?: string;
  type?: HintType;
}

const Hint: React.FC<HintProps> = (props) => {
  const {
    type = 'error',
    text,
  } = props;

  const hintTextColor = useMemo(() => {
    switch (type) {
      case 'info':
        return 'rgba(255, 255, 255, 0.7)';
      case 'error':
      default:
        return 'rgba(255, 118, 77, 1)';
    }
  }, [type]);

  return (
    <Fade
      enable={!!text}
      timeout={100}
    >
      <div className={classNames.root}>
        <div
          className={classNames.text}
          style={{ color: hintTextColor }}
        >
          {text}
        </div>
      </div>
    </Fade>
  );
};

export default Hint;
