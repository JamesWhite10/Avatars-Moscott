import { FC, PropsWithChildren, useMemo } from 'react';
import { EditorContext } from '@app/containers/Editor/Context/EditorContext';
import EditorStore from '@app/containers/Editor/stores/EditorStore';

const EditorProvider: FC<PropsWithChildren> = ({ children }) => {
  const store = useMemo(() => {
    return new EditorStore();
  }, []);

  return (
    <EditorContext.Provider value={{ store }}>
      {children}
    </EditorContext.Provider>
  );
};

export default EditorProvider;
