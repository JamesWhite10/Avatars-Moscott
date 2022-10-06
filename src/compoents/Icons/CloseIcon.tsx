import { memo } from 'react';
import { IconProps } from '@app/compoents/Icons/iconTypes';

const CloseIcon = memo<IconProps>((props) => {
  const {
    width = 24,
    height = 24,
    fill = '#FFFFFF',
    className,
  } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.03033 3.96967C4.73744 3.67678 4.26256 3.67678 3.96967 3.96967C3.67678 4.26256 3.67678 4.73744 3.96967 5.03033L10.9393 12L3.96967 18.9697C3.67678 19.2626 3.67678 19.7374 3.96967 20.0303C4.26256 20.3232 4.73744 20.3232 5.03033 20.0303L12 13.0607L18.9697 20.0303C19.2626 20.3232 19.7374 20.3232 20.0303 20.0303C20.3232 19.7374 20.3232 19.2626 20.0303 18.9697L13.0607 12L20.0303 5.03033C20.3232 4.73744 20.3232 4.26256 20.0303 3.96967C19.7374 3.67678 19.2626 3.67678 18.9697 3.96967L12 10.9393L5.03033 3.96967Z"
        fill={fill}
      />
    </svg>
  );
});

export default CloseIcon;
