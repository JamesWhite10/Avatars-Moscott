import { forwardRef, PropsWithChildren } from 'react';
import classNames from './IconButton.module.scss';
import cn from 'classnames';
import Spin from '@app/components/Spin/Spin';

export interface IconButtonProps {
  disabled?: boolean;
  active?: boolean;
  loading?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  className?: string;
}

const IconButton = forwardRef<HTMLButtonElement, PropsWithChildren<IconButtonProps>>((props, ref) => {
  const {
    disabled = false,
    active = false,
    loading = false,
    onClick = () => undefined,
    onMouseEnter = () => undefined,
    className,
    children,
  } = props;

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      className={cn(className, classNames.root, { [classNames.active]: active })}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <Spin
        isActive={loading}
        position="stretch"
        overlayBackgroundColor="#848699"
        borderRadius={12}
        color="#FFFFFF"
      />
      { children }
    </button>
  );
});

export default IconButton;
