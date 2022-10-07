import { forwardRef, PropsWithChildren } from 'react';
import classNames from './RoundButton.module.scss';

export interface RoundButtonProps {
  disabled?: boolean;
  onClick?: () => void;
}

const RoundButton = forwardRef<HTMLButtonElement, PropsWithChildren<RoundButtonProps>>((props, ref) => {
  const {
    disabled = false,
    onClick = () => undefined,
    children,
  } = props;

  return (
    <button
      ref={ref}
      className={classNames.root}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      { children }
    </button>
  );
});

export default RoundButton;
