import React, { FC, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react';
import classNames from './Editor.module.scss';
import SceneLoad from '@app/containers/Editor/containers/SceneLoad';
import About from '@app/containers/Editor/containers/About';
import useEditorStore from '@app/containers/Editor/hooks/useEditorStore';
import WorkArea from '@app/containers/Editor/containers/WorkArea';
import TopControls from '@app/containers/Editor/containers/TopControls';
import BottomControls from '@app/containers/Editor/containers/BottomControls';
import LeftControls from '@app/containers/Editor/containers/LeftControls';
import { appConfig } from '@app/config/appConfig';
import VideoMaterials from '@app/containers/Editor/containers/VideoMaterials/index';

const Editor: FC = observer(() => {
  const { initialize, threeScene, showLoadingScreen } = useEditorStore();

  useEffect(() => {
    if (showLoadingScreen) {
      initialize(appConfig.avatars, appConfig.styles, appConfig.sceneConfig, appConfig.animations, appConfig.background);
    }
  }, [useEditorStore, showLoadingScreen]);

  const editorRefCallback = useCallback((element: HTMLDivElement) => {
    if (threeScene !== null) threeScene.setContainer(element);
  }, [threeScene]);

  return (
    <>
      <SceneLoad />
      <VideoMaterials
        items={appConfig.styles}
        videoId="portal_video"
      />
      <div className={classNames.root}>
        <div
          ref={editorRefCallback}
          className={classNames.editor_container}
        />
        <WorkArea>
          <TopControls />
          <LeftControls />
          <BottomControls />
        </WorkArea>
        <About />
      </div>
    </>
  );
});

export default Editor;
