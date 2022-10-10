import { FC, memo } from 'react';
import { IconProps } from '@app/components/Icons/iconTypes';

const ArrowLeftIcon: FC<IconProps> = memo((props) => {
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
        d="M13.7999 21.3008L5.02492 12.5258C4.72867 12.2295 4.72867 11.772 5.02492 11.4758L13.7999 2.70078C13.9833 2.51745 14.2166 2.42578 14.4999 2.42578C14.7833 2.42578 15.0166 2.51745 15.1999 2.70078C15.3999 2.90078 15.4999 3.13828 15.4999 3.41328C15.4999 3.68828 15.3999 3.92578 15.1999 4.12578L7.32492 12.0008L15.1999 19.8758C15.3999 20.0758 15.4958 20.3133 15.4874 20.5883C15.4791 20.8633 15.3833 21.0924 15.1999 21.2758C14.9999 21.4758 14.7624 21.5758 14.4874 21.5758C14.2124 21.5758 13.9833 21.4841 13.7999 21.3008Z"
        fill={fill}
      />
    </svg>
  );
});

export default ArrowLeftIcon;
