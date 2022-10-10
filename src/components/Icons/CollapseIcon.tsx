import { FC, memo } from 'react';
import { IconProps } from '@app/components/Icons/iconTypes';

const CollapseIcon: FC<IconProps> = memo((props) => {
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
        d="M17.2998 14.7285L12.7826 10.0177C12.387 9.59161 11.7126 9.59161 11.317 10.0177L6.7998 14.7285"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
});

export default CollapseIcon;
