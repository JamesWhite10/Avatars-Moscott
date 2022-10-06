import type { NextPage } from 'next';
import EditorProvider from '@app/containers/Editor/Provider/EditorProvider';
import dynamic from 'next/dynamic';
import OrientationStub from '@app/compoents/OrientationStub';

const Editor = dynamic(() => import('@app/containers/Editor'), { ssr: false });

const Home: NextPage = () => {
  return (
    <>
      <OrientationStub />
      <EditorProvider>
        <Editor />
      </EditorProvider>
    </>
  );
};

export default Home;
