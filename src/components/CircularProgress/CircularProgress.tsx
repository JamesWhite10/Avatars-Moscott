import { FC, PropsWithChildren, useMemo } from 'react';
import classNames from './CircularProgress.module.scss';
import cn from 'classnames';

export interface CircularProgressProps {
  progress?: number;
  size: number;
  startAnimation?: boolean;
}

const CircularProgress: FC<PropsWithChildren<CircularProgressProps>> = (props) => {
  const {
    size = 150,
    progress = 0,
    startAnimation = false,
    children,
  } = props;

  const center = useMemo(() => { return size / 2; }, [size]);
  const radius = useMemo(() => { return center - 10; }, [center]);
  const dashArray = useMemo(() => { return 2 * Math.PI * radius; }, [radius]);
  const dashOffset = useMemo(() => { return dashArray * ((100 - progress) / 100); }, [dashArray, progress]);

  return (
    <div
      className={cn(classNames.root, { [classNames.animated]: startAnimation })}
      style={{ width: size, height: size }}
    >
      <div className={classNames.outer_border} />
      <svg
        className={classNames.progress_container}
        style={{ width: size, height: size }}
      >
        <circle
          fill="transparent"
          className={classNames.progress_track}
          cx={center}
          cy={center}
          r={radius}
        />
        <circle
          fill="transparent"
          strokeLinecap="round"
          className={classNames.progress}
          cx={center}
          cy={center}
          r={radius}
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className={classNames.content}>
        { children }
      </div>
    </div>
  );
};

export default CircularProgress;
