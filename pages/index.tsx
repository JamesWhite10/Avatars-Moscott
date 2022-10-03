import type { NextPage } from 'next';
import EditorProvider from '@app/containers/Editor/Provider/EditorProvider';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@app/containers/Editor'), { ssr: false });

const Home: NextPage = () => {
  return (
    <EditorProvider>
      <Editor />
    </EditorProvider>
  );
};

export default Home;
