import React, { forwardRef, PropsWithChildren, ReactElement, useMemo } from 'react';
import classNames from './Button.module.scss';
import Spin from './../Spin/Spin';
import cn from 'classnames';

export enum ButtonScheme {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  GHOST = 'ghost',
}

export enum ButtonSize {
  LG = 'lg',
  MD = 'md',
  SM = 'sm',
}

export interface ButtonProps {
  disabled?: boolean;
  onClick?: () => void;
  loading?: boolean;
  className?: string;
  colorScheme: ButtonScheme;
  size?: ButtonSize;
  startIcon: ReactElement;
  endIcon: ReactElement;
}

const Button = forwardRef<HTMLButtonElement, PropsWithChildren<ButtonProps>>((props, ref) => {
  const {
    disabled,
    onClick = () => undefined,
    loading = false,
    className,
    children,
    colorScheme,
    size = ButtonSize.MD,
    startIcon,
    endIcon,
  } = props;

  const colorSpin = useMemo(() => {
    return {
      white: '#FFFFFF',
    };
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      className={cn(classNames.root, className, classNames[colorScheme], classNames[size])}
      onClick={onClick}
      disabled={disabled}
    >
      <Spin
        isActive={loading}
        overlayBackgroundColor="inherit"
        color={colorSpin.white}
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
