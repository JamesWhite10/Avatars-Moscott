import { FC, memo } from 'react';
import { IconProps } from '@app/components/Icons/iconTypes';

const PlayIcon: FC<IconProps> = memo((props) => {
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
        d="M18.4806 11.1318C19.1524 11.5157 19.1524 12.4843 18.4806 12.8682L7.49614 19.1451C6.82948 19.526 6 19.0446 6 18.2768L6 5.72318C6 4.95536 6.82948 4.47399 7.49614 4.85494L18.4806 11.1318Z"
        fill={fill}
      />
    </svg>
  );
});

export default PlayIcon;
