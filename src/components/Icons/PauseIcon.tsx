import { FC, memo } from 'react';
import { IconProps } from '@app/components/Icons/iconTypes';

const PauseIcon: FC<IconProps> = memo((props) => {
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
        d="M10 4C9.44772 4 9 4.44772 9 5V19C9 19.5523 9.44772 20 10 20C10.5523 20 11 19.5523 11 19V5C11 4.44772 10.5523 4 10 4ZM14.75 4C14.1977 4 13.75 4.44772 13.75 5V19C13.75 19.5523 14.1977 20 14.75 20C15.3023 20 15.75 19.5523 15.75 19V5C15.75 4.44772 15.3023 4 14.75 4Z"
        fill={fill}
      />
    </svg>
  );
});

export default PauseIcon;
