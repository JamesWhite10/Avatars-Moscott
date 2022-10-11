import { FC, memo } from 'react';
import { IconProps } from '@app/components/Icons/iconTypes';

const ScreenShotIcon: FC<IconProps> = memo((props) => {
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
        d="M13.2506 2.25H10.7495C10.4886 2.24997 10.3093 2.24995 10.1399 2.2653C8.88798 2.3787 7.77614 3.11184 7.17874 4.21789C7.09792 4.36753 7.0273 4.53236 6.92457 4.77213L6.92457 4.77214L6.91067 4.80457L6.72175 5.24539C6.59055 5.55152 6.28954 5.75001 5.95649 5.75001C3.35718 5.75001 1.25003 7.85716 1.25003 10.4565V13.5L1.25002 13.6618C1.24975 15.3681 1.24958 16.4093 1.53146 17.2769C2.10024 19.0274 3.47267 20.3998 5.22319 20.9686C6.09071 21.2505 7.13192 21.2503 8.8382 21.25L9.00003 21.25H15L15.1619 21.25C16.8681 21.2503 17.9094 21.2505 18.7769 20.9686C20.5274 20.3998 21.8998 19.0274 22.4686 17.2769C22.7505 16.4093 22.7503 15.3681 22.75 13.6618L22.75 13.5V10.4565C22.75 7.85716 20.6429 5.75001 18.0436 5.75001C17.7105 5.75001 17.4095 5.55152 17.2783 5.24539L17.0755 4.77215L17.0755 4.77208C16.9728 4.53233 16.9021 4.36752 16.8213 4.21789C16.2239 3.11184 15.1121 2.3787 13.8601 2.2653C13.6908 2.24995 13.5114 2.24997 13.2506 2.25ZM10.2752 3.75918C10.3684 3.75074 10.4754 3.75001 10.7848 3.75001H13.2153C13.5246 3.75001 13.6316 3.75074 13.7248 3.75918C14.476 3.82722 15.1431 4.26711 15.5015 4.93073C15.546 5.01305 15.5888 5.11111 15.7107 5.39544L15.8996 5.83627C16.2672 6.69392 17.1105 7.25001 18.0436 7.25001C19.8145 7.25001 21.25 8.68558 21.25 10.4565V13.5C21.25 15.4197 21.2408 16.2016 21.042 16.8133C20.6216 18.1072 19.6072 19.1216 18.3134 19.542C17.7016 19.7408 16.9197 19.75 15 19.75H9.00003C7.08038 19.75 6.29842 19.7408 5.68671 19.542C4.39285 19.1216 3.37844 18.1072 2.95804 16.8133C2.75929 16.2016 2.75003 15.4197 2.75003 13.5V10.4565C2.75003 8.68558 4.18561 7.25001 5.95649 7.25001C6.88958 7.25001 7.7329 6.69393 8.10047 5.83627L8.28939 5.39544C8.41125 5.11111 8.45407 5.01305 8.49853 4.93073C8.85697 4.26711 9.52408 3.82722 10.2752 3.75918ZM14.25 12.5C14.25 11.2574 13.2426 10.25 12 10.25C10.7574 10.25 9.75 11.2574 9.75 12.5C9.75 13.7426 10.7574 14.75 12 14.75C13.2426 14.75 14.25 13.7426 14.25 12.5ZM12 8.75C14.0711 8.75 15.75 10.4289 15.75 12.5C15.75 14.5711 14.0711 16.25 12 16.25C9.92893 16.25 8.25 14.5711 8.25 12.5C8.25 10.4289 9.92893 8.75 12 8.75Z"
        fill={fill}
      />
    </svg>
  );
});

export default ScreenShotIcon;
