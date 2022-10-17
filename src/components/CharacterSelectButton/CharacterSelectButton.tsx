import React, { forwardRef, ReactElement, useMemo } from 'react';
import classNames from './CharacterSelectButton.module.scss';
import cn from 'classnames';
import { ExpandIcon } from '@app/components/Icons';
import SpinIcon from '@app/components/Icons/SpinIcon';
import { IconProps } from '@app/components/Icons/iconTypes';

export interface CharacterSelectButtonProps {
  onClick?: () => void;
  loading?: boolean;
  active?: boolean;
  disabled?: boolean;
  icon: ReactElement<IconProps>;
  name: string;
  description?: string;
  size?: 'md' | 'lg';
}

const CharacterSelectButton = forwardRef<HTMLButtonElement, CharacterSelectButtonProps>((props, ref) => {
  const {
    onClick = () => undefined,
    loading = false,
    disabled = false,
    size = 'md',
    name,
    icon,
    description,
    active = false,
  } = props;

  const innerIcon = useMemo(() => {
    const elSize = loading ? 22 : 32;
    return React.cloneElement(
      icon,
      {
        width: elSize,
        height: elSize,
        className: classNames.logoIcon,
      },
    );
  }, [icon, loading]);

  return (
    <button
      ref={ref}
      className={cn(classNames.root, classNames[size])}
      onClick={onClick}
      type="button"
      disabled={disabled}
    >
      <div className={classNames.startIcon}>
        {loading && (
          <SpinIcon
            className={classNames.spin}
            width={32}
            height={32}
          />
        )}
        {innerIcon}
      </div>
      <div className={classNames.content}>
        <span className={classNames.name}>
          {name}
        </span>
        {description && (
          <span className={classNames.description}>
            {description}
          </span>
        )}
      </div>
      <div className={cn(classNames.endIcon, { [classNames.active]: active })}>
        <ExpandIcon fill="#6B6D80" />
      </div>
    </button>
  );
});

export default CharacterSelectButton;
