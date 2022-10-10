import { FC, memo } from 'react';
import { IconProps } from '@app/components/Icons/iconTypes';

const EmptyIcon: FC<IconProps> = memo((props) => {
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
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke={fill}
        strokeWidth="2"
      />
    </svg>
  );
});

export default EmptyIcon;
