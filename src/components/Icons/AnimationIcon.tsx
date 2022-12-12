import { FC, memo } from 'react';
import { IconProps } from '@app/components/Icons/iconTypes';

const AnimationIcon: FC<IconProps> = memo((props) => {
  const {
    width = 28,
    height = 28,
    fill = '#FFFFFF',
    className,
  } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
    >
      <path
        d="M14.875 11.0212C13.7083 10.3476 12.25 11.1896 12.25 12.5367V19.4649C12.25 20.8121 13.7083 21.6541 14.875 20.9805L20.875 17.5164C22.0417 16.8428 22.0417 15.1589 20.875 14.4853L14.875 11.0212ZM13.75 12.5367C13.75 12.3443 13.9583 12.224 14.125 12.3202L20.125 15.7843C20.2917 15.8806 20.2917 16.1211 20.125 16.2173L14.125 19.6814C13.9583 19.7777 13.75 19.6574 13.75 19.4649V12.5367Z"
        fill={fill}
      />
      <path
        d="M16 2.25C8.40608 2.25 2.25 8.40608 2.25 16C2.25 23.5939 8.40608 29.75 16 29.75C23.5939 29.75 29.75 23.5939 29.75 16C29.75 8.40608 23.5939 2.25 16 2.25ZM3.75 16C3.75 9.23451 9.23451 3.75 16 3.75C22.7655 3.75 28.25 9.23451 28.25 16C28.25 22.7655 22.7655 28.25 16 28.25C9.23451 28.25 3.75 22.7655 3.75 16Z"
        fill={fill}
      />
    </svg>
  );
});

export default AnimationIcon;
