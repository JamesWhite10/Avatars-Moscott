import { forwardRef, PropsWithChildren } from 'react';
import classNames from './IconButton.module.scss';
import cn from 'classnames';
import Spin from '@app/components/Spin/Spin';

export interface IconButtonProps {
  disabled?: boolean;
  active?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

const IconButton = forwardRef<HTMLButtonElement, PropsWithChildren<IconButtonProps>>((props, ref) => {
  const {
    disabled = false,
    active = false,
    loading = false,
    onClick = () => undefined,
    children,
  } = props;

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      className={cn(classNames.root, { [classNames.active]: active })}
      onClick={onClick}
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
