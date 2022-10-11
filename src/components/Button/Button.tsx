import React, { forwardRef, PropsWithChildren } from 'react';
import SpinIcon from '@app/components/Icons/SpinIcon';
import styles from './Button.module.scss';
import { EmptyIcon } from '@app/components/Icons';
import { ButtonSize, ButtonType } from '@app/components/Button/index';

export interface ButtonProps {
  disabled?: boolean;
  onClick?: () => void;
  isLoading?: boolean;
  customClass?: string;
  type: ButtonType;
  size?: ButtonSize;
}

const Button = forwardRef<HTMLButtonElement, PropsWithChildren<ButtonProps>>((props, ref) => {
  const {
    disabled,
    onClick = () => undefined,
    isLoading = false,
    customClass,
    children,
    type,
    size = ButtonSize.MD,
  } = props;

  return (
    <button
      ref={ref}
      type="button"
      className={`${styles.root} ${customClass} ${styles[type]} ${styles[size]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {isLoading ? <SpinIcon
        className={styles.spinner}
        fill="#FFFFFF"
      /> : <div
        className={styles.title}
      >
        <EmptyIcon />
        { children }
        <EmptyIcon />
      </div>}
    </button>
  );
});

export default Button;
