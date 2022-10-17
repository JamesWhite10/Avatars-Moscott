import React, { forwardRef, PropsWithChildren, ReactElement } from 'react';
import classNames from './Button.module.scss';
import Spin from './../Spin/Spin';
import cn from 'classnames';

export type ButtonScheme = 'primary' | 'secondary' | 'ghost';

export type ButtonSize = 'lg' | 'md' | 'sm';

export interface ButtonProps {
  disabled?: boolean;
  active?: boolean;
  onClick?: () => void;
  loading?: boolean;
  className?: string;
  colorScheme?: ButtonScheme;
  size?: ButtonSize;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
}

const Button = forwardRef<HTMLButtonElement, PropsWithChildren<ButtonProps>>((props, ref) => {
  const {
    disabled = false,
    onClick = () => undefined,
    loading = false,
    active = false,
    className,
    children,
    colorScheme = 'primary',
    size = 'md',
    startIcon,
    endIcon,
  } = props;

  return (
    <button
      ref={ref}
      type="button"
      className={cn(classNames.root, className, classNames[colorScheme], classNames[size], { [classNames.active]: active })}
      onClick={onClick}
      disabled={disabled}
    >
      <Spin
        isActive={loading}
        overlayBackgroundColor="inherit"
        color="#FFFFFF"
        borderRadius={12}
        position="stretch"
      />
      <div
        className={cn({ [classNames.title]: !loading, [classNames.titleHide]: loading })}
      >
        {startIcon}
        {children}
        {endIcon}
      </div>
    </button>
  );
});

export default Button;
