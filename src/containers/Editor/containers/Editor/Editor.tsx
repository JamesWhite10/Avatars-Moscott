import { FC, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react';
import classNames from './Editor.module.scss';
import SceneLoad from '@app/containers/Editor/containers/SceneLoad';
import About from '@app/containers/Editor/containers/About';
import useEditorStore from '@app/containers/Editor/hooks/useEditorStore';
import WorkArea from '@app/containers/Editor/containers/WorkArea';
import TopControls from '@app/containers/Editor/containers/TopControls';
import BottomControls from '@app/containers/Editor/containers/BottomControls';
import RightControls from '@app/containers/Editor/containers/RightControls';

const Editor: FC = observer(() => {
  const { initialize, threeScene } = useEditorStore();

  useEffect(() => {
    initialize();
  }, []);

  const editorRefCallback = useCallback((element: HTMLDivElement) => {
    if (threeScene !== null) threeScene.setContainer(element);
  }, [threeScene]);

  return (
    <>
      <SceneLoad />
      <div className={classNames.root}>
        <div
          ref={editorRefCallback}
          className={classNames.editor_container}
        />
        <WorkArea>
          <TopControls />
          <BottomControls />
          <RightControls />
        </WorkArea>
        <About />
      </div>
    </>
  );
});

export default Editor;
