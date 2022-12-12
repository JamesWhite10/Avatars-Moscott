import { FC, memo } from 'react';
import { IconProps } from '@app/components/Icons/iconTypes';

const StyleIcon: FC<IconProps> = memo((props) => {
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
        d="M17.6167 3.93341C17.0189 2.49615 14.9829 2.49615 14.3851 3.93342L11.8399 10.0527C11.8039 10.1393 11.7225 10.1984 11.6291 10.2059L5.02279 10.7355C3.47114 10.8599 2.84197 12.7963 4.02416 13.809L9.05747 18.1206C9.12866 18.1815 9.15976 18.2772 9.138 18.3684L7.60025 24.8151C7.23907 26.3292 8.88626 27.5259 10.2147 26.7146L15.8706 23.2599C15.9506 23.2111 16.0512 23.2111 16.1312 23.2599L21.7871 26.7146C23.1156 27.5259 24.7628 26.3292 24.4016 24.8151L22.8638 18.3684C22.8421 18.2772 22.8732 18.1815 22.9444 18.1206L27.9777 13.809C29.1599 12.7963 28.5307 10.8599 26.979 10.7355L20.3727 10.2059C20.2793 10.1984 20.1979 10.1393 20.1619 10.0527L17.6167 3.93341ZM15.7701 4.50946C15.8555 4.30414 16.1463 4.30414 16.2317 4.50946L18.7769 10.6288C19.0289 11.2347 19.5987 11.6487 20.2529 11.7011L26.8592 12.2307C27.0808 12.2485 27.1707 12.5251 27.0018 12.6698L21.9685 16.9814C21.4701 17.4083 21.2525 18.0781 21.4048 18.7165L22.9425 25.1631C22.9941 25.3794 22.7588 25.5504 22.569 25.4344L16.9131 21.9798C16.3531 21.6378 15.6487 21.6378 15.0887 21.9798L9.4328 25.4344C9.24303 25.5504 9.00771 25.3794 9.05931 25.1631L10.5971 18.7165C10.7493 18.0781 10.5317 17.4083 10.0333 16.9814L4.99999 12.6698C4.83111 12.5251 4.92099 12.2485 5.14265 12.2307L11.749 11.7011C12.4031 11.6487 12.9729 11.2347 13.2249 10.6288L15.7701 4.50946Z"
        fill={fill}
      />
    </svg>
  );
});

export default StyleIcon;