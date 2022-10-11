import { FC, memo } from 'react';
import { IconProps } from '@app/components/Icons/iconTypes';

const ArrowRightIcon: FC<IconProps> = memo((props) => {
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
        d="M6.9003 21.2243C6.71697 21.0243 6.62114 20.791 6.6128 20.5243C6.60447 20.2577 6.7003 20.0243 6.9003 19.8243L14.7753 11.9493L6.9003 4.07433C6.71697 3.89099 6.62114 3.66183 6.6128 3.38683C6.60447 3.11183 6.7003 2.87433 6.9003 2.67433C7.08364 2.47433 7.3128 2.37016 7.5878 2.36183C7.8628 2.35349 8.1003 2.44933 8.3003 2.64933L17.0753 11.4243C17.1586 11.5077 17.217 11.591 17.2503 11.6743C17.2836 11.7577 17.3003 11.8493 17.3003 11.9493C17.3003 12.0493 17.2836 12.141 17.2503 12.2243C17.217 12.3077 17.1586 12.391 17.0753 12.4743L8.3003 21.2493C8.11697 21.4327 7.8878 21.5243 7.6128 21.5243C7.3378 21.5243 7.1003 21.4243 6.9003 21.2243V21.2243Z"
        fill={fill}
      />
    </svg>
  );
});

export default ArrowRightIcon;
