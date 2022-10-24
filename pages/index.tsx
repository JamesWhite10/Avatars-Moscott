import type { NextPage } from 'next';
import EditorProvider from '@app/containers/Editor/Provider/EditorProvider';
import dynamic from 'next/dynamic';
import OrientationStub from '@app/components/OrientationStub';
import SoundProvider from '@app/sound/Provider/SoundProvider';

const Editor = dynamic(() => import('@app/containers/Editor'), { ssr: false });

const Home: NextPage = () => {
  return (
    <>
      <OrientationStub />
      <SoundProvider>
        <EditorProvider>
          <Editor />
        </EditorProvider>
      </SoundProvider>
    </>
  );
};

export default Home;
