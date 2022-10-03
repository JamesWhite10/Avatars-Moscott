import { FC, useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import classNames from './Editor.module.scss';
import SceneLoad from '@app/containers/Editor/containers/SceneLoad';
import About from '@app/containers/Editor/containers/About';
import useEditorStore from '@app/containers/Editor/hooks/useEditorStore';
import WorkArea from '@app/containers/Editor/containers/WorkArea';
import TopControls from '@app/containers/Editor/containers/TopControls';
import BottomControls from '@app/containers/Editor/containers/BottomControls';
import RightControls from '@app/containers/Editor/containers/RightControls';
import { SceneViewport } from '@app/modules/Scene/SceneViewport/SceneViewport';

const Editor: FC = observer(() => {
  const { showLoadingScreen, init, setProgress } = useEditorStore();
  const [mainScene, setMainScene] = useState<SceneViewport | null>(null);

  useEffect(() => {
    setMainScene(new SceneViewport());
  }, []);

  const sceneLoadHandler = useCallback((event: Event) => {
    setProgress((event as CustomEvent).detail.prg as number);
    init();
  }, []);

  useEffect(() => {
    if (showLoadingScreen) {
      window.addEventListener('scene_prg', sceneLoadHandler);
      return () => window.removeEventListener('scene_prg', sceneLoadHandler);
    }
  }, []);

  const editorRefCallback = useCallback((element: HTMLDivElement) => {
    if (mainScene !== null) {
      mainScene.setContainer(element);
      mainScene.runRenderCycle();
      mainScene.setEnvironment();
      mainScene.loadSceneTexture('/3d/environment/test_env.glb');
    }
  }, [mainScene]);

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
