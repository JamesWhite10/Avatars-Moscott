import React, { forwardRef, ReactElement } from 'react';
import cn from 'classnames';
import classNames from '@app/components/NavButton/NavButton.module.scss';
import Spin from '@app/components/Spin/Spin';
import { IconProps } from '@app/components/Icons/iconTypes';

export interface NavButtonProps {
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  loading?: boolean;
  className?: string;
  icon: ReactElement<IconProps>;
}

const NavButton = forwardRef<HTMLButtonElement, NavButtonProps>((props, ref) => {
  const {
    active = false,
    disabled = false,
    onClick = () => undefined,
    onMouseEnter = () => undefined,
    loading = false,
    className,
    icon,
  } = props;

  return (
    <button
      tabIndex={1}
      ref={ref}
      type="button"
      className={cn(classNames.root, className, { [classNames.rootActive]: active }, { [classNames.rootLoading]: loading })}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      disabled={disabled}
    >
      <Spin
        isActive={loading}
        overlayBackgroundColor="inherit"
        color="#4145A7"
        borderRadius={12}
        position="stretch"
      />
      <div
        className={cn({ [classNames.iconHide]: loading })}
      >
        {icon}
      </div>
    </button>
  );
});

export default NavButton;
