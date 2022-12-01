import { FC, memo } from 'react';
import { IconProps } from '@app/components/Icons/iconTypes';

const CostumeIcon: FC<IconProps> = memo((props) => {
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
        d="M12.8767 3.26025C13.2015 3.20612 13.5236 3.37014 13.6708 3.66463C14.0944 4.51185 14.882 5.25004 16 5.25004C17.118 5.25004 17.9056 4.51185 18.3292 3.66463C18.4764 3.37014 18.7985 3.20612 19.1233 3.26025C22.2994 3.78959 24.2788 5.14741 25.4117 7.27135C26.5067 9.32409 26.75 11.9908 26.75 14.9986V23.9986C26.75 24.9651 25.9665 25.7486 25 25.7486H23.75V26.9986C23.75 27.9651 22.9665 28.7486 22 28.7486H10C9.0335 28.7486 8.25 27.9651 8.25 26.9986V25.7486H7C6.0335 25.7486 5.25 24.9651 5.25 23.9986V14.9986C5.25 11.9908 5.49327 9.32409 6.58826 7.27135C7.72124 5.14741 9.70063 3.78959 12.8767 3.26025ZM22 27.2486C22.1381 27.2486 22.25 27.1367 22.25 26.9986V25.0046C22.2375 24.2204 22.23 23.3623 22.2222 22.4647C22.2101 21.0841 22.1973 19.6091 22.1641 18.1648C22.1094 15.7782 22.0003 13.5624 21.7602 12.1219C21.6921 11.7134 21.9681 11.3269 22.3767 11.2588C22.7853 11.1907 23.1717 11.4668 23.2398 11.8753C23.4997 13.4349 23.6092 15.751 23.6637 18.1304C23.6969 19.5781 23.7101 21.082 23.7224 22.4757C23.7278 23.0931 23.733 23.689 23.7397 24.2486H25C25.1381 24.2486 25.25 24.1367 25.25 23.9986V14.9986C25.25 12.0065 24.9933 9.6739 24.0883 7.97733C23.2746 6.45199 21.8853 5.35281 19.3834 4.8343C18.7327 5.82432 17.612 6.75004 16 6.75004C14.388 6.75004 13.2673 5.82432 12.6166 4.8343C10.1147 5.35281 8.7254 6.45199 7.91174 7.97733C7.00673 9.6739 6.75 12.0065 6.75 14.9986V23.9986C6.75 24.1367 6.86193 24.2486 7 24.2486H8.26027C8.26696 23.689 8.27219 23.0932 8.27761 22.4759C8.28985 21.0821 8.30306 19.5781 8.33626 18.1304C8.39082 15.751 8.50027 13.4349 8.7602 11.8753C8.8283 11.4668 9.21472 11.1907 9.6233 11.2588C10.0319 11.3269 10.3079 11.7134 10.2398 12.1219C9.99973 13.5624 9.89059 15.7782 9.83586 18.1648C9.80274 19.6092 9.78987 21.0837 9.77782 22.4643C9.76998 23.3621 9.76249 24.2203 9.75 25.0046V26.9986C9.75 27.1367 9.86193 27.2486 10 27.2486H22Z"
        fill={fill}
      />
    </svg>
  );
});

export default CostumeIcon;
