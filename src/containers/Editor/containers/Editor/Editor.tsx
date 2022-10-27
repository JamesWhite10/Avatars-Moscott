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
import { Maskott } from '@app/types/maskott';
import MiraImage from '@app/assets/mira.png';
import { CyberfoxIcon, Web3devIcon } from '@app/components/Icons';
import YukiImage from '@app/assets/yuki.png';

const mockCharacters: Maskott[] = [
  {
    id: 'mira',
    image: MiraImage.src,
    name: 'Mira',
    description: 'Cyberfox',
    icon: <CyberfoxIcon />,
  },
  {
    id: 'Yuki',
    image: YukiImage.src,
    name: 'Yuki',
    description: 'web3dev',
    icon: <Web3devIcon />,
  },
];

const Editor: FC = observer(() => {
  const { initialize, threeScene, setUp, isReady } = useEditorStore();

  useEffect(() => {
    initialize();
  }, [useEditorStore]);

  useEffect(() => {
    if (isReady) setUp(mockCharacters); // TODO унести отсюда в редактор
  }, [isReady]);

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
          <RightControls />
          <BottomControls />
        </WorkArea>
        <About />
      </div>

    </>
  );
});

export default Editor;
