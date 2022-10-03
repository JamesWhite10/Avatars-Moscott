import { FC, PropsWithChildren } from 'react';
import { observer } from 'mobx-react';
import className from './WorkArea.module.scss';
import useEditorStore from '@app/containers/Editor/hooks/useEditorStore';

const WorkArea: FC<PropsWithChildren> = observer(({ children }) => {
  const { isReady } = useEditorStore();

  if (!isReady) return null;

  return (
    <div className={className.root}>
      <div className={className.content}>
        { children }
      </div>
    </div>
  );
});

export default WorkArea;
