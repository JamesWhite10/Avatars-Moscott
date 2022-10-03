import type { NextPage } from 'next';
import EditorProvider from '@app/containers/Editor/Provider/EditorProvider';
import Editor from '@app/containers/Editor';

const Home: NextPage = () => {
  return (
    <EditorProvider>
      <Editor />
    </EditorProvider>
  );
};

export default Home;
