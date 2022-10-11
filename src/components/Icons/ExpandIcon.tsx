import { FC, memo } from 'react';
import { IconProps } from '@app/components/Icons/iconTypes';

const ExpandIcon: FC<IconProps> = memo((props) => {
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
        d="M6.7998 10.6973L11.317 15.4081C11.7126 15.8342 12.387 15.8342 12.7826 15.4081L17.2998 10.6973"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
});

export default ExpandIcon;
