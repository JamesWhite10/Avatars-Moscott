import { FC, memo } from 'react';
import { IconProps } from '@app/components/Icons/iconTypes';

const HairstyleIcon: FC<IconProps> = memo((props) => {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.25 13C5.25 7.06294 10.0629 2.25 16 2.25C21.9371 2.25 26.75 7.06294 26.75 13C26.75 14.297 26.6206 15.5907 26.4261 16.6928C26.2512 17.6836 26.015 18.5709 25.7473 19.1729C25.6797 21.3946 24.3245 23.9824 22.5644 25.9939C21.6486 27.0405 20.5912 27.9694 19.4825 28.6414C18.3793 29.31 17.1818 29.75 16 29.75C14.8182 29.75 13.6207 29.31 12.5175 28.6414C11.4088 27.9694 10.3514 27.0405 9.43557 25.9939C7.67549 23.9824 6.32033 21.3946 6.25265 19.1729C5.98503 18.5709 5.74875 17.6836 5.57391 16.6928C5.37941 15.5907 5.25 14.297 5.25 13ZM25.25 13C25.25 14.0644 25.1556 15.1314 25.0088 16.0715C24.4289 15.6048 23.4879 14.7339 22.6 13.55C22.4584 13.3611 22.2361 13.25 22 13.25C18.5195 13.25 14.2609 12.7412 11.4801 10.4238C11.2957 10.2701 11.0488 10.214 10.8161 10.2729C10.5833 10.3318 10.3928 10.4985 10.3036 10.7215C9.49837 12.7346 7.99159 14.7761 6.97009 15.9332C6.83542 15.0274 6.75 14.0125 6.75 13C6.75 7.89137 10.8914 3.75 16 3.75C21.1086 3.75 25.25 7.89137 25.25 13ZM24.25 19.0139C24.244 20.753 23.1251 23.0752 21.4356 25.0061C20.6014 25.9595 19.6588 26.7806 18.705 27.3586C17.7457 27.94 16.8182 28.25 16 28.25C15.1818 28.25 14.2543 27.94 13.295 27.3586C12.3412 26.7806 11.3986 25.9595 10.5644 25.0061C8.87486 23.0752 7.75597 20.753 7.75002 19.0139C7.75022 19.0039 7.75021 18.9938 7.75 18.9838V17.3038C8.71273 16.2837 10.2737 14.2958 11.303 12.167C14.3549 14.2512 18.4352 14.7161 21.6292 14.7482C22.6104 15.994 23.6257 16.904 24.25 17.3828L24.25 19.0139Z"
        fill={fill}
      />
    </svg>
  );
});

export default HairstyleIcon;